#!/usr/bin/env node
// Import every product from a PUBLIC Gumroad store page — no access token needed.
//
//   npm run import:store                                  (uses site.ts gumroadStore, else shop.ramstudiollc.com)
//   npm run import:store -- https://shop.ramstudiollc.com
//   npm run import:store -- https://shop.ramstudiollc.com --no-images   (keep Gumroad image links, download nothing)
//
// Writes src/data/products.json. Preview images are saved as resized WebP files in
// public/images/products/<slug>/ so the shop loads fast (originals stay on Gumroad).
// Store section headings (Packaging, Branding, Apparel, Device…) become shop categories.

import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { slugify, sanitise, plain, firstSentence, guessCategory, formatsFrom } from './lib/gumroad-helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'src/data/products.json');
const argv = process.argv.slice(2);
const storeUrl = (argv.find((a) => /^https?:\/\//.test(a)) || 'https://shop.ramstudiollc.com').replace(/\/+$/, '');
const downloadImages = !argv.includes('--no-images');
const MAX_IMAGES = 8;

// Store section heading → shop category slug. Unknown headings fall back to a guess from the product name.
const SECTION_TO_CATEGORY = {
  packaging: 'packaging',
  branding: 'branding',
  apparel: 'apparel',
  device: 'devices',
  devices: 'devices',
  print: 'print',
  bottles: 'bottles-jars',
  cans: 'cans-drinks',
  signage: 'outdoor',
  outdoor: 'outdoor',
  lifestyle: 'lifestyle',
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });

async function readStore() {
  const page = await ctx.newPage();
  await page.goto(`${storeUrl}/`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  for (let y = 0; y < 30000; y += 800) {
    const more = await page.evaluate((y) => {
      window.scrollTo(0, y);
      return y < document.documentElement.scrollHeight;
    }, y);
    await page.waitForTimeout(200);
    if (!more) break;
  }
  const cards = await page.evaluate(() => {
    const out = [];
    let section = '';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    for (let n = walker.currentNode; n; n = walker.nextNode()) {
      if (/^H[1-3]$/.test(n.tagName)) section = n.innerText.trim();
      if (n.tagName === 'A' && /\/l\//.test(n.getAttribute('href') || '')) {
        const card = n.closest('article, li') || n;
        out.push({ href: n.href.split('?')[0].replace(/^http:/, 'https:'), section, text: card.innerText.replace(/\s+/g, ' ').trim() });
      }
    }
    return out;
  });
  await page.close();
  const seen = new Map();
  for (const c of cards) if (!seen.has(c.href)) seen.set(c.href, c);
  return [...seen.values()];
}

async function readProduct(url) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const d = await page.evaluate(() => {
    let ld = null;
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const j = JSON.parse(s.textContent);
        if (j['@type'] === 'Product') ld = j;
      } catch {}
    }
    const priceEl = document.querySelector('[itemprop=price]');
    const source = document.querySelector('.rich-text .ProseMirror') || document.querySelector('.rich-text');
    const rich = source ? source.cloneNode(true) : null;
    const sections = [];
    const paragraphs = [];
    if (rich) {
      // Store-wide header and embedded widgets (buttons, upsell cards) are not part of the product text.
      const junk = /^(follow us on behance|download full project|get a quote\b.*|top downloaded product|buy full bundle\b.*|hello@ramstudiollc\.com)$/i;
      rich.querySelectorAll('.react-renderer, hr, button, img, figure').forEach((e) => e.remove());
      [...rich.children].forEach((e) => {
        if (junk.test(e.innerText.trim()) || !e.innerText.trim()) e.remove();
      });
      let current = null;
      for (const el of rich.children) {
        const raw = el.innerText.trim();
        const t = raw.replace(/\s+/g, ' ');
        if (/^H[1-4]$/.test(el.tagName)) {
          current = { heading: t, items: [] };
          sections.push(current);
        } else if (/^[✦•✓✔\-–]/.test(t) || /\n\s*[✦•✓✔]/.test(raw) || el.tagName === 'UL' || el.tagName === 'OL') {
          // One paragraph can hold several "✦ item" lines separated by <br>.
          const items = el.tagName === 'P' ? raw.split(/\n|(?=[✦•✓✔])/) : [...el.querySelectorAll('li')].map((li) => li.innerText);
          for (const it of items) {
            const clean = it.replace(/^\s*[✦•✓✔\-–]\s*/, '').replace(/\s+/g, ' ').trim();
            if (clean) current?.items.push(clean);
          }
        } else if (t.length > 40) paragraphs.push(t);
      }
    }
    const imgs = [...document.querySelectorAll('figure img, [aria-label="Product preview"] img, img')]
      .filter((i) => /public-files\.gumroad\.com/.test(i.currentSrc || i.src) && i.naturalWidth >= 800)
      .map((i) => i.currentSrc || i.src);
    return {
      name: ld?.name || document.title,
      price: ld?.offers?.price ?? Number(priceEl?.getAttribute('content') || 0),
      currency: ld?.offers?.priceCurrency || 'USD',
      sku: ld?.sku || null,
      cover: document.querySelector('meta[property="og:image"]')?.content || ld?.image || null,
      priceText: priceEl?.innerText || '',
      html: rich ? rich.innerHTML : '',
      sections,
      paragraphs,
      images: [...new Set(imgs)],
    };
  });
  await page.close();
  return d;
}

function cleanDescription(html, title) {
  // The page already shows the title, so drop a leading heading that repeats it.
  let clean = sanitise(html).replace(/<p>\s*<\/p>/g, '');
  const first = clean.match(/^<h[1-4]>(.*?)<\/h[1-4]>/i);
  if (first && plain(first[1]).toLowerCase().replace(/\s+/g, ' ').trim() === title.toLowerCase().trim()) clean = clean.slice(first[0].length);
  return clean.trim();
}

function summaryFrom(paragraphs, title, fallback) {
  // First real sentence of the product's own text — not the "files only" note, not the title again.
  const strip = (t) => (t.toLowerCase().startsWith(title.toLowerCase().trim()) ? t.slice(title.trim().length).replace(/^[\s.:—-]+/, '') : t);
  const usable = [...paragraphs, fallback]
    .filter((t) => t && !/^this download includes|^important|^note:/i.test(t))
    .map(strip)
    .filter((t) => t.length >= 20);
  return firstSentence(usable[0] || title, 160);
}

const listUnder = (sections, re) => sections.filter((s) => re.test(s.heading)).flatMap((s) => s.items).filter((x) => x.length > 1 && x.length < 100);

function specsFrom(text) {
  const specs = [];
  const psd = text.match(/(\d{1,3})\s*(?:premium\s+|high[- ]quality\s+)?psd/i);
  if (psd) specs.push({ label: 'PSD files', value: String(Number(psd[1])) });
  const dpi = text.match(/(\d{3})\s*dpi/i);
  if (dpi) specs.push({ label: 'Resolution', value: `${dpi[1]} DPI` });
  const px = text.match(/(\d{4})\s*[x×]\s*(\d{4})\s*(?:px)?/i);
  if (px) specs.push({ label: 'Image size', value: `${px[1]} × ${px[2]} px` });
  if (/smart object/i.test(text)) specs.push({ label: 'Smart objects', value: 'Yes' });
  return specs;
}

async function saveImages(slug, urls) {
  const dir = path.join(root, 'public/images/products', slug);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const saved = [];
  // Open each image as a browser page: same network path as a real visit (proxies, redirects).
  const page = await ctx.newPage();
  for (const [i, url] of urls.slice(0, MAX_IMAGES).entries()) {
    try {
      const res = await page.goto(url, { timeout: 60000 });
      if (!res || !res.ok()) continue;
      const buf = await res.body();
      const name = `${String(i + 1).padStart(2, '0')}.webp`;
      await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(dir, name));
      saved.push(`/images/products/${slug}/${name}`);
    } catch (e) {
      console.warn(`  image failed: ${url} (${e.message.split('\n')[0]})`);
    }
  }
  await page.close();
  return saved;
}

// ---------------------------------------------------------------------------

console.log(`Reading ${storeUrl} …`);
const cards = await readStore();
console.log(`Found ${cards.length} products.`);

let previous = [];
if (existsSync(outFile)) previous = JSON.parse(await readFile(outFile, 'utf8'));
const prevByUrl = new Map(previous.map((p) => [p.gumroadUrl, p]));
const today = new Date().toISOString().slice(0, 10);

const products = [];
for (const [i, card] of cards.entries()) {
  const d = await readProduct(card.href);
  const description = cleanDescription(d.html, d.name);
  const text = plain(description);
  const features = listUnder(d.sections, /feature|you will get|what.?s included|includ|inside|specification/i);
  const useCases = listUnder(d.sections, /perfect for|ideal for|great for|use (it )?for|who is it for/i);
  const rating = card.text.match(/(\d\.\d)\s*\((\d+)\)/);
  const sectionKey = card.section.toLowerCase().replace(/[^a-z]/g, '');
  const category = SECTION_TO_CATEGORY[sectionKey] || guessCategory(d.name, []);
  const slug = slugify(d.name);
  const coverFirst = [d.cover, ...d.images].filter(Boolean);
  const imageUrls = [...new Set(coverFirst)];
  const images = downloadImages ? await saveImages(slug, imageUrls) : imageUrls.slice(0, MAX_IMAGES);
  const prev = prevByUrl.get(card.href);
  products.push({
    slug,
    title: d.name,
    summary: summaryFrom(d.paragraphs, d.name, text),
    description,
    category,
    tags: [card.section].filter(Boolean),
    price: Number(d.price) || 0,
    currency: d.currency,
    payWhatYouWant: /\+$/.test(d.priceText.trim()),
    formats: formatsFrom([], d.name, description),
    specs: specsFrom(text),
    features: features.slice(0, 8),
    useCases: useCases.slice(0, 8),
    images,
    gumroadUrl: card.href,
    type: 'single',
    allAccess: true,
    featured: false,
    rating: rating ? { value: Number(rating[1]), count: Number(rating[2]) } : null,
    releasedAt: prev?.releasedAt ?? today,
    gumroadId: d.sku,
  });
  console.log(`[${i + 1}/${cards.length}] ${d.name} — ${category}, ${d.price ? `$${d.price}` : 'free'}, ${images.length} images`);
}

await browser.close();
await writeFile(outFile, JSON.stringify(products, null, 2) + '\n');
console.log(`Wrote ${products.length} products to src/data/products.json`);
