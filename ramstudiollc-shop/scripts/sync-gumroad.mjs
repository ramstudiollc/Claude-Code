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
import { slugify, sanitise, plain, firstSentence, guessCategory, formatsFrom } from './lib/gumroad-helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'src/data/products.json');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fromFileIdx = args.indexOf('--from-file');
const fromFile = fromFileIdx >= 0 ? args[fromFileIdx + 1] : null;


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
