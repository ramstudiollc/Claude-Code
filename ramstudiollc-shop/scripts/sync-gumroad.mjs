#!/usr/bin/env node
// Pull every product from your Gumroad account into src/data/products.json.
//
//   npm run sync:gumroad          → writes src/data/products.json
//   npm run sync:gumroad:dry      → prints what it would write, changes nothing
//   node scripts/sync-gumroad.mjs --from-file export.json
//                                 → same mapping, but from a saved API response
//
// Needs GUMROAD_ACCESS_TOKEN in .env (see .env.example). Gumroad stays the
// source of truth for name, price, link and images. Site-only fields
// (featured, specs, features, category fixes) go in src/data/overrides.json.
//
// Tag conventions on Gumroad (Product → Edit → Tags) that this script reads:
//   cat:packaging      → shop category (slugs in src/data/categories.ts)
//   format:psd         → file format badge; repeat for several formats
//   bundle             → listed under Bundles
//   featured           → shown first on the home page
//   no-all-access      → NOT included in the All-Access Pass
//   hidden             → kept on Gumroad but not shown on the site

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'src/data/products.json');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fromFileIdx = args.indexOf('--from-file');
const fromFile = fromFileIdx >= 0 ? args[fromFileIdx + 1] : null;

const CATEGORY_SLUGS = [
  'packaging',
  'bottles-jars',
  'cans-drinks',
  'branding',
  'print',
  'apparel',
  'lifestyle',
  'devices',
  'outdoor',
];

// Words in a product name that place it in a category when no cat: tag is set.
const CATEGORY_HINTS = [
  ['bottles-jars', /\b(bottle|jar|dropper|serum|cosmetic|pump|spray|vial|tube)\b/i],
  ['cans-drinks', /\b(can|soda|beer|cup|carton|juice|coffee cup|tumbler)\b/i],
  ['apparel', /\b(t-?shirt|hoodie|cap|hat|tote|apparel|sweatshirt|jersey|sock)\b/i],
  ['lifestyle', /\b(mug|pillow|cushion|towel|candle|notebook)\b/i],
  ['devices', /\b(iphone|phone|laptop|macbook|ipad|tablet|usb|flash drive|software box|screen)\b/i],
  ['outdoor', /\b(billboard|signage|sign|banner|storefront|bus stop|poster wall)\b/i],
  ['print', /\b(flyer|poster|book|magazine|brochure|leaflet|menu|catalog)\b/i],
  ['branding', /\b(business card|stationery|letterhead|logo|branding|envelope|identity)\b/i],
  ['packaging', /\b(box|pouch|sachet|tin|bag|packaging|label|wrapper|carton)\b/i],
];

// ---------------------------------------------------------------------------

async function loadEnv() {
  const envPath = path.join(root, '.env');
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

async function fetchProducts() {
  if (fromFile) {
    const raw = JSON.parse(await readFile(path.resolve(fromFile), 'utf8'));
    return raw.products ?? raw;
  }
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) {
    console.error('Missing GUMROAD_ACCESS_TOKEN. Copy .env.example to .env and paste your token.');
    process.exit(1);
  }
  const res = await fetch('https://api.gumroad.com/v2/products', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(`Gumroad API answered ${res.status} ${res.statusText}.`);
    process.exit(1);
  }
  const body = await res.json();
  if (!body.success) {
    console.error('Gumroad API returned success=false:', body.message ?? body);
    process.exit(1);
  }
  return body.products ?? [];
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

// Keep only simple formatting from the Gumroad description editor.
const ALLOWED = new Set(['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'h2', 'h3', 'h4', 'a', 'blockquote']);
function sanitise(html) {
  if (!html) return '';
  return String(html)
    .replace(/<(script|style|iframe|object|embed|noscript|template)[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name, attrs) => {
      const n = name.toLowerCase();
      if (!ALLOWED.has(n)) return '';
      if (tag.startsWith('</')) return `</${n}>`;
      if (n === 'a') {
        const href = attrs.match(/href\s*=\s*"(https?:\/\/[^"]*)"/i) ?? attrs.match(/href\s*=\s*'(https?:\/\/[^']*)'/i);
        return href ? `<a href="${href[1].replace(/"/g, '&quot;')}" rel="noopener nofollow">` : '<a>';
      }
      return `<${n}>`;
    })
    .trim();
}

const plain = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

function firstSentence(text, max = 140) {
  const s = text.split(/(?<=[.!?])\s/)[0] ?? '';
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

function guessCategory(name, tags) {
  const tagged = tags.find((t) => t.startsWith('cat:'))?.slice(4);
  if (tagged && CATEGORY_SLUGS.includes(tagged)) return tagged;
  for (const [slug, re] of CATEGORY_HINTS) if (re.test(name)) return slug;
  return 'packaging';
}

function formatsFrom(tags, name, description) {
  const tagged = tags.filter((t) => t.startsWith('format:')).map((t) => t.slice(7).toUpperCase());
  if (tagged.length) return [...new Set(tagged)];
  const text = `${name} ${plain(description)}`;
  const found = ['PSD', 'PSB', 'AI', 'EPS', 'FIG', 'PNG', 'BLEND', 'OBJ'].filter((f) => new RegExp(`\\b${f}\\b`, 'i').test(text));
  return found.length ? found : ['PSD'];
}

function mapProduct(g) {
  const tags = (g.tags ?? []).map((t) => String(t).toLowerCase().trim());
  const name = g.name ?? 'Untitled';
  const cents = Number(g.price ?? 0);
  const isMembership = Boolean(g.is_tiered_membership || g.subscription_duration);
  const images = [g.preview_url, g.thumbnail_url].filter((u) => typeof u === 'string' && /^https?:\/\//.test(u));
  const description = sanitise(g.description);

  return {
    slug: slugify(g.custom_permalink || name) || String(g.id),
    title: name,
    summary: g.custom_summary ? String(g.custom_summary) : firstSentence(plain(description)),
    description,
    category: guessCategory(name, tags),
    tags: tags.filter((t) => !t.includes(':')),
    price: Math.round(cents) / 100,
    currency: String(g.currency ?? 'usd').toUpperCase(),
    payWhatYouWant: Boolean(g.customizable_price),
    formats: formatsFrom(tags, name, g.description),
    images: [...new Set(images)],
    gumroadUrl: g.short_url || g.url || '',
    type: isMembership ? 'membership' : tags.includes('bundle') ? 'bundle' : 'single',
    allAccess: !tags.includes('no-all-access'),
    featured: tags.includes('featured'),
    gumroadId: g.id,
    _published: g.published !== false && g.deleted !== true,
    _hidden: tags.includes('hidden'),
  };
}

// ---------------------------------------------------------------------------

await loadEnv();
const raw = await fetchProducts();
const mapped = raw.map(mapProduct);

// Keep previous release dates so "Newest" order is stable between syncs.
let previous = [];
if (existsSync(outFile)) {
  try {
    previous = JSON.parse(await readFile(outFile, 'utf8'));
  } catch {
    previous = [];
  }
}
const prevDate = new Map(previous.map((p) => [p.gumroadId ?? p.slug, p.releasedAt]));
const today = new Date().toISOString().slice(0, 10);

const seen = new Set();
const products = [];
for (const p of mapped) {
  if (!p._published || p._hidden) continue;
  let slug = p.slug;
  for (let i = 2; seen.has(slug); i++) slug = `${p.slug}-${i}`;
  seen.add(slug);
  const { _published, _hidden, ...rest } = p;
  products.push({ ...rest, slug, releasedAt: prevDate.get(p.gumroadId) ?? today });
}

const memberships = products.filter((p) => p.type === 'membership');
const summary = {
  fromGumroad: raw.length,
  written: products.length,
  skipped: raw.length - products.length,
  bundles: products.filter((p) => p.type === 'bundle').length,
  free: products.filter((p) => p.price === 0).length,
  memberships: memberships.map((m) => `${m.title} → ${m.gumroadUrl}`),
};

if (dryRun) {
  console.log(JSON.stringify(products.slice(0, 3), null, 2));
  console.log('\nDry run — nothing written.', summary);
} else {
  await writeFile(outFile, JSON.stringify(products, null, 2) + '\n');
  console.log(`Wrote ${products.length} products to src/data/products.json`, summary);
  if (memberships.length) {
    console.log('Membership found. Paste its URL into allAccess.url in src/config/site.ts.');
  }
}
