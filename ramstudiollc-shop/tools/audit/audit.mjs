#!/usr/bin/env node
// Website audit: measures a live site so it can be rebuilt with our own code and assets.
//
//   npm run audit -- https://www.asylab.com
//   npm run audit -- https://www.asylab.com --pages 40 --per-template 3 --out audit
//   npm run audit -- http://localhost:4321 --pages 10         (audit our own build for QC)
//
// Output (default ./audit/<host>/):
//   report.json   every measurement
//   report.md     the same, readable section by section
//   shots/        full-page screenshots per page and screen size, section crops, intro frames
//   video/        scroll recordings of the home page (desktop + phone)
//
// It records URLs of fonts/images/scripts but does NOT download the site's files.

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { extractPage } from './extract.js';
import { writeMarkdown } from './report.mjs';

// ---------- arguments ----------
const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  if (i < 0) return def;
  const v = argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
};
const start = argv.find((a) => /^https?:\/\//.test(a));
if (!start) {
  console.error('Usage: npm run audit -- <url> [--pages 30] [--per-template 3] [--deep 6] [--out audit] [--no-video]');
  process.exit(1);
}
const origin = new URL(start).origin;
const host = new URL(start).host.replace(/[:]/g, '-');
const MAX_PAGES = Number(flag('pages', 30));
const PER_TEMPLATE = Number(flag('per-template', 3));
const DEEP = Number(flag('deep', 6));
const OUT = path.resolve(flag('out', 'audit'), host);
const VIDEO = !argv.includes('--no-video');
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
];
const DESKTOP = VIEWPORTS.find((v) => v.name === 'desktop');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (u) => (new URL(u).pathname.replace(/\/+$/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home').slice(0, 80);
const templateOf = (u) => {
  const parts = new URL(u).pathname.split('/').filter(Boolean);
  return parts.length <= 1 ? new URL(u).pathname : `/${parts[0]}/*`;
};

await mkdir(path.join(OUT, 'shots'), { recursive: true });
const browser = await chromium.launch();
const report = { site: origin, startedAt: new Date().toISOString(), tool: 'ramstudiollc-shop/tools/audit', pages: [], inventory: [], robots: null, sitemapUrls: 0, intro: null };

// ---------- helpers ----------
async function open(context, url) {
  const page = await context.newPage();
  const network = [];
  page.on('response', async (res) => {
    try {
      const req = res.request();
      const sizes = await req.sizes().catch(() => ({ responseBodySize: 0 }));
      network.push({ url: res.url().slice(0, 300), type: req.resourceType(), status: res.status(), bytes: sizes.responseBodySize, mime: res.headers()['content-type'] || '' });
    } catch {}
  });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  }
  await sleep(1500);
  return { page, network };
}

async function scrollThrough(page, { sampleAnimations = false } = {}) {
  const seen = new Map();
  const scrollLinked = new Map();
  const { steps, step } = await page.evaluate(() => ({ step: innerHeight * 0.5, steps: Math.ceil(document.documentElement.scrollHeight / (innerHeight * 0.5)) }));
  for (let i = 0; i <= Math.min(steps, 120); i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * step);
    await sleep(220);
    if (!sampleAnimations) continue;
    const snap = await page.evaluate(() => {
      const out = { anims: [], linked: [] };
      for (const a of document.getAnimations()) {
        const t = a.effect?.getTiming?.() || {};
        const target = a.effect?.target;
        const name = a.animationName || a.transitionProperty || a.id || '(waapi)';
        out.anims.push(`${a.constructor.name} | ${name} | ${t.duration}ms | ${t.easing} | delay ${t.delay} | iter ${t.iterations}${target ? ` | ${target.tagName.toLowerCase()}` : ''}`);
      }
      // scroll-linked transforms: inline transform styles on elements currently in view
      for (const el of document.querySelectorAll('[style*="transform"]')) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || r.width < 10) continue;
        if (!el.dataset.audLink) el.dataset.audLink = String(Math.random()).slice(2, 9);
        out.linked.push([el.dataset.audLink, el.style.transform]);
      }
      return out;
    });
    for (const a of snap.anims) seen.set(a, (seen.get(a) || 0) + 1);
    for (const [id, t] of snap.linked) {
      if (!scrollLinked.has(id)) scrollLinked.set(id, new Set());
      scrollLinked.get(id).add(t);
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  return {
    runtimeAnimations: [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60).map(([value, count]) => ({ value, count })),
    scrollLinkedElements: [...scrollLinked.values()].filter((s) => s.size >= 3).length,
  };
}

async function markReveals(page) {
  return page.evaluate(() => {
    let i = 0;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight || r.width < 4 || r.height < 4) continue;
      const cs = getComputedStyle(el);
      if (+cs.opacity < 0.99 || cs.transform !== 'none' || (cs.filter && cs.filter !== 'none') || (cs.clipPath && cs.clipPath !== 'none')) {
        el.setAttribute('data-aud', String(i++));
      }
    }
    return i;
  });
}
const readReveals = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-aud]')].map((el) => {
      const cs = getComputedStyle(el);
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] || '' : '';
      return { id: el.getAttribute('data-aud'), el: `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`, opacity: cs.opacity, transform: cs.transform, filter: cs.filter, clip: cs.clipPath, transition: `${cs.transitionDuration} ${cs.transitionTimingFunction} delay ${cs.transitionDelay}`, animation: cs.animationName !== 'none' ? `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} delay ${cs.animationDelay}` : null, parent: el.parentElement ? `${el.parentElement.tagName.toLowerCase()}` : '' };
    }),
  );

async function hoverAudit(page, limit = 24) {
  const n = await page.evaluate((limit) => {
    const sig = new Set();
    const picks = [];
    const add = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      const s = `${el.tagName}.${typeof el.className === 'string' ? el.className : ''}`;
      if (sig.has(s)) return;
      sig.add(s);
      picks.push(el);
    };
    document.querySelectorAll('button, [role=button], a[class*=btn], a[class*=button]').forEach(add);
    document.querySelectorAll('header a, nav a').forEach(add);
    [...document.querySelectorAll('a, div, article, li')].filter((el) => el.querySelector('img') && getComputedStyle(el).cursor === 'pointer').forEach(add);
    document.querySelectorAll('a[href]').forEach(add);
    picks.slice(0, limit).forEach((el, i) => el.setAttribute('data-hov', String(i)));
    return Math.min(picks.length, limit);
  }, limit);
  const read = (i) =>
    page.evaluate((i) => {
      const el = document.querySelector(`[data-hov="${i}"]`);
      if (!el) return null;
      const pick = (e) => {
        if (!e) return null;
        const c = getComputedStyle(e);
        return { transform: c.transform, bg: c.backgroundColor, color: c.color, shadow: c.boxShadow, border: c.borderTopColor, opacity: c.opacity, filter: c.filter, scale: c.scale, translate: c.translate, deco: c.textDecorationLine, width: Math.round(e.getBoundingClientRect().width) };
      };
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      const c = getComputedStyle(el);
      return { el: `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`, text: (el.innerText || '').trim().slice(0, 40), transition: `${c.transitionProperty.slice(0, 50)} ${c.transitionDuration} ${c.transitionTimingFunction}`, self: pick(el), img: pick(el.querySelector('img')), child: pick(el.firstElementChild) };
    }, i);
  const results = [];
  for (let i = 0; i < n; i++) {
    const loc = page.locator(`[data-hov="${i}"]`).first();
    try {
      await loc.scrollIntoViewIfNeeded({ timeout: 2000 });
      const before = await read(i);
      await loc.hover({ timeout: 2000, force: true });
      await sleep(650);
      const after = await read(i);
      await page.mouse.move(2, 2);
      await sleep(200);
      if (!before || !after) continue;
      const changes = [];
      for (const part of ['self', 'img', 'child']) {
        if (!before[part] || !after[part]) continue;
        for (const k of Object.keys(before[part])) if (before[part][k] !== after[part][k]) changes.push(`${part}.${k}: ${before[part][k]} → ${after[part][k]}`);
      }
      results.push({ el: before.el, text: before.text, transition: before.transition, changes });
    } catch {}
  }
  return results.filter((r) => r.changes.length);
}

async function customCursor(page) {
  const before = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && getComputedStyle(e).pointerEvents === 'none').map((e) => { const r = e.getBoundingClientRect(); return `${r.left},${r.top}`; }));
  await page.mouse.move(700, 450);
  await sleep(400);
  await page.mouse.move(300, 200);
  await sleep(400);
  const after = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && getComputedStyle(e).pointerEvents === 'none').map((e) => { const r = e.getBoundingClientRect(); return `${r.left},${r.top}`; }));
  return before.some((p, i) => after[i] && after[i] !== p);
}

async function crawl() {
  const ctx = await browser.newContext({ viewport: DESKTOP });
  const seen = new Set([start]);
  const queue = [start];
  const templates = new Map();
  const picked = [];
  const all = new Set([start]);

  // robots + sitemap give the full URL inventory even for pages we don't render
  try {
    const robots = await ctx.request.get(`${origin}/robots.txt`, { timeout: 15000 });
    if (robots.ok()) report.robots = (await robots.text()).slice(0, 3000);
    const sm = await ctx.request.get(`${origin}/sitemap.xml`, { timeout: 15000 });
    if (sm.ok()) {
      let xml = await sm.text();
      const nested = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.endsWith('.xml'));
      for (const n of nested.slice(0, 10)) {
        const r = await ctx.request.get(n, { timeout: 15000 }).catch(() => null);
        if (r?.ok()) xml += await r.text();
      }
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) if (!m[1].endsWith('.xml') && m[1].startsWith(origin)) all.add(m[1]);
      report.sitemapUrls = [...all].length;
    }
  } catch {}

  while (queue.length && picked.length < MAX_PAGES) {
    const url = queue.shift();
    const t = templateOf(url);
    if ((templates.get(t) || 0) >= PER_TEMPLATE) continue;
    templates.set(t, (templates.get(t) || 0) + 1);
    picked.push(url);
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await sleep(1200);
      const links = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
      for (const l of links) {
        let u;
        try {
          u = new URL(l);
        } catch {
          continue;
        }
        if (u.origin !== origin || /\.(jpg|jpeg|png|webp|gif|svg|pdf|zip|mp4)$/i.test(u.pathname)) continue;
        u.hash = '';
        u.search = '';
        const clean = u.href;
        all.add(clean);
        if (!seen.has(clean)) {
          seen.add(clean);
          queue.push(clean);
        }
      }
    } catch {}
    await page.close();
  }
  // sitemap pages of unseen templates
  for (const u of all) {
    if (picked.length >= MAX_PAGES) break;
    const t = templateOf(u);
    if (!picked.includes(u) && (templates.get(t) || 0) < PER_TEMPLATE) {
      templates.set(t, (templates.get(t) || 0) + 1);
      picked.push(u);
    }
  }
  report.inventory = [...all].sort().map((u) => ({ url: u, template: templateOf(u), audited: picked.includes(u) }));
  await ctx.close();
  return picked;
}

async function crossOriginCss(ctx, hrefs) {
  const out = { keyframes: [], media: new Map(), fontFaces: [], transitionDecls: 0 };
  for (const href of hrefs.slice(0, 15)) {
    const r = await ctx.request.get(href, { timeout: 20000 }).catch(() => null);
    if (!r?.ok()) continue;
    const css = await r.text();
    for (const m of css.matchAll(/@(?:-webkit-)?keyframes\s+([\w-]+)/g)) out.keyframes.push(m[1]);
    for (const m of css.matchAll(/@media([^{]+)\{/g)) out.media.set(m[1].trim(), (out.media.get(m[1].trim()) || 0) + 1);
    for (const m of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) out.fontFaces.push(m[1].replace(/\s+/g, ' ').slice(0, 300));
    out.transitionDecls += (css.match(/transition\s*:/g) || []).length;
  }
  return { keyframes: [...new Set(out.keyframes)], media: [...out.media.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([value, count]) => ({ value, count })), fontFaces: out.fontFaces.slice(0, 40), transitionDecls: out.transitionDecls };
}

// ---------- run ----------
console.log(`Auditing ${origin} → ${OUT}`);
const pages = await crawl();
console.log(`Inventory: ${report.inventory.length} URLs. Auditing ${pages.length} pages (${PER_TEMPLATE} per template).`);

// Intro / load animation frames + scroll videos of the home page
{
  const ctx = await browser.newContext({ viewport: DESKTOP });
  const page = await ctx.newPage();
  const frames = [];
  const t0 = Date.now();
  await page.goto(start, { waitUntil: 'commit' }).catch(() => {});
  for (const ms of [300, 800, 1500, 2500, 4000]) {
    await sleep(Math.max(0, ms - (Date.now() - t0)));
    const f = `shots/intro-${ms}ms.jpg`;
    await page.screenshot({ path: path.join(OUT, f), type: 'jpeg', quality: 70 }).catch(() => {});
    frames.push(f);
  }
  report.intro = { frames, note: 'First viewport at 0.3s, 0.8s, 1.5s, 2.5s, 4s after navigation — compare frames to see load animations.' };
  await ctx.close();
}
if (VIDEO) {
  await mkdir(path.join(OUT, 'video'), { recursive: true });
  for (const vp of [DESKTOP, VIEWPORTS[0]]) {
    const ctx = await browser.newContext({ viewport: vp, recordVideo: { dir: path.join(OUT, 'video'), size: { width: vp.width, height: vp.height } } });
    const page = await ctx.newPage();
    await page.goto(start, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    await sleep(2500);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 120) {
      await page.mouse.wheel(0, 120);
      await sleep(90);
    }
    await sleep(1000);
    const v = page.video();
    await ctx.close();
    if (v) {
      const p = await v.path();
      const dest = path.join(OUT, 'video', `home-scroll-${vp.name}.webm`);
      await import('node:fs/promises').then((fs) => fs.rename(p, dest)).catch(() => {});
    }
  }
}

for (const [i, url] of pages.entries()) {
  const deep = i < DEEP;
  const name = slug(url);
  console.log(`[${i + 1}/${pages.length}] ${url}${deep ? ' (all screen sizes)' : ''}`);
  const entry = { url, name, template: templateOf(url), viewports: {} };

  // desktop: full measurement
  {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    const { page, network } = await open(ctx, url);
    const marked = await markReveals(page);
    const before = await readReveals(page);
    const motion = await scrollThrough(page, { sampleAnimations: true });
    const after = await readReveals(page);
    const reveals = [];
    for (const b of before) {
      const a = after.find((x) => x.id === b.id);
      if (!a) continue;
      const changed = ['opacity', 'transform', 'filter', 'clip'].filter((k) => a[k] !== b[k]);
      if (changed.length) reveals.push({ el: b.el, parent: b.parent, from: Object.fromEntries(changed.map((k) => [k, b[k]])), to: Object.fromEntries(changed.map((k) => [k, a[k]])), transition: a.transition, animation: a.animation });
    }
    const data = await page.evaluate(extractPage, { sectionMinHeight: 80 });
    data.motionRuntime = { ...motion, revealCandidates: marked, reveals: reveals.slice(0, 80), revealCount: reveals.length };
    data.hover = await hoverAudit(page);
    data.customCursor = i === 0 ? await customCursor(page) : undefined;
    if (data.crossOriginSheets.length) data.crossOriginCss = await crossOriginCss(ctx, data.crossOriginSheets);
    const byType = {};
    for (const n of network) {
      byType[n.type] ??= { count: 0, bytes: 0 };
      byType[n.type].count++;
      byType[n.type].bytes += n.bytes || 0;
    }
    data.network = {
      requests: network.length,
      bytes: network.reduce((s, n) => s + (n.bytes || 0), 0),
      byType,
      thirdPartyDomains: [...new Set(network.map((n) => new URL(n.url).hostname).filter((h) => !h.endsWith(new URL(origin).hostname)))],
      fonts: network.filter((n) => n.type === 'font').map((n) => n.url),
      scripts: network.filter((n) => n.type === 'script').map((n) => n.url).slice(0, 60),
    };
    const shot = `shots/${name}--desktop.jpg`;
    await page.screenshot({ path: path.join(OUT, shot), fullPage: true, type: 'jpeg', quality: 70 }).catch(() => {});
    data.screenshot = shot;
    if (deep) {
      for (const s of data.sections) {
        const crop = `shots/${name}--desktop--section-${String(s.index).padStart(2, '0')}.jpg`;
        const clip = { x: 0, y: Math.max(0, s.top), width: DESKTOP.width, height: Math.max(1, Math.min(s.height, 4000)) };
        await page.screenshot({ path: path.join(OUT, crop), fullPage: true, clip, type: 'jpeg', quality: 70 }).catch(() => {});
        s.screenshot = crop;
      }
    }
    entry.viewports.desktop = data;
    await ctx.close();
  }

  // other screen sizes: layout + type + responsiveness
  for (const vp of deep ? VIEWPORTS.filter((v) => v !== DESKTOP) : [VIEWPORTS[0]]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.width < 800, hasTouch: vp.width < 800 });
    const { page } = await open(ctx, url);
    await scrollThrough(page);
    const data = await page.evaluate(extractPage, { sectionMinHeight: 60 });
    const shot = `shots/${name}--${vp.name}.jpg`;
    await page.screenshot({ path: path.join(OUT, shot), fullPage: true, type: 'jpeg', quality: 70 }).catch(() => {});
    entry.viewports[vp.name] = {
      viewport: data.viewport,
      pageHeight: data.pageHeight,
      horizontalOverflow: data.horizontalOverflow,
      nav: data.nav,
      typeScale: data.typography.typeScale.slice(0, 14),
      headings: data.headings,
      sections: data.sections.map((s) => ({ index: s.index, height: s.height, heightVH: s.heightVH, bg: s.bg, bgLightness: s.bgLightness, headings: s.headings.slice(0, 1), largestText: s.largestText, repeated: s.repeated, paddingY: s.paddingY })),
      centeredWidths: data.spacing.centeredWidths.slice(0, 5),
      screenshot: shot,
    };
    await ctx.close();
  }
  report.pages.push(entry);
}

report.finishedAt = new Date().toISOString();
await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
await writeFile(path.join(OUT, 'report.md'), writeMarkdown(report));
await browser.close();
console.log(`Done. Open ${path.join(OUT, 'report.md')}`);
