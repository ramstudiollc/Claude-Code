#!/usr/bin/env node
// QC: does our shop meet the reference site's standard?
//
// Scored (PASS = 95%):
//   pages       — every reference page type that a Gumroad shop needs has an equivalent here
//   flow        — library has search + filters + multi-column grid; product page has gallery, buy link,
//                 structured info and related items; home has the key sections
//   responsive  — no sideways scroll, nav collapses where the reference collapses, headings shrink
//                 on phones like the reference, grids collapse to the same column count
//   type        — same type SYSTEM: body size, headline-to-body ratio, phone shrink, number of steps
//   spacing     — content width, radius/shadow/glass vocabulary, padding scale
//   motion      — scroll reveals, reveal style, hover effects, scroll-linked motion, sticky header, timing
// Reported for information only (not scored): section-by-section shape similarity, because our pages are
// designed in RAM Studio's own layout and brand rather than copied.
//
//   npm run qc -- --ref audit/www.asylab.com/report.json --ours audit/localhost-4321/report.json --map tools/audit/qc-map.json

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : d;
};
const refPath = arg('ref');
const oursPath = arg('ours');
if (!refPath || !oursPath) {
  console.error('Usage: npm run qc -- --ref <reference report.json> --ours <our report.json> [--map qc-map.json] [--out qc-report.md]');
  process.exit(1);
}
const ref = JSON.parse(await readFile(refPath, 'utf8'));
const ours = JSON.parse(await readFile(oursPath, 'utf8'));
const map = arg('map') ? JSON.parse(await readFile(arg('map'), 'utf8')) : { pages: {} };
const outFile = arg('out', path.join(path.dirname(oursPath), 'qc-report.md'));
const PASS = 95;

const WEIGHTS = { pages: 15, flow: 20, responsive: 20, type: 15, spacing: 10, motion: 20 };
const gaps = [];
const gap = (sev, area, msg) => gaps.push({ sev, area, msg });

// ---------- helpers ----------
const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 1);
const closeness = (a, b, tol) => {
  if (a == null || b == null) return a == b ? 1 : 0;
  const d = Math.abs(a - b);
  return d <= tol ? 1 : Math.max(0, 1 - (d - tol) / Math.max(Math.abs(a), Math.abs(b), tol * 4));
};
const ratio = (a, b) => (a === 0 && b === 0 ? 1 : Math.min(a, b) / Math.max(a, b));
const jaccard = (A, B) => {
  const a = new Set(A), b = new Set(B);
  if (!a.size && !b.size) return 1;
  return [...a].filter((x) => b.has(x)).length / new Set([...a, ...b]).size;
};
const pathOf = (u) => new URL(u).pathname.replace(/\/+$/, '') || '/';
const templateKey = (t) => t.replace(/\/+$/, '') || '/';
const ignored = (p) => (map.ignore || []).some((x) => (x.endsWith('/*') ? p.startsWith(x.slice(0, -1)) : p === x));

function mapped(refPathname) {
  const pages = map.pages || {};
  if (pages[refPathname]) return pages[refPathname];
  for (const [k, v] of Object.entries(pages)) if (k.endsWith('/*') && refPathname.startsWith(k.slice(0, -1))) return v;
  return refPathname;
}
function findOurs(target) {
  const t = target.replace(/\/+$/, '') || '/';
  if (t.endsWith('/*')) return ours.pages.find((p) => pathOf(p.url).startsWith(t.slice(0, -1)) && pathOf(p.url) !== t.slice(0, -2));
  return ours.pages.find((p) => pathOf(p.url) === t);
}
const roleOf = (p) => map.roles?.[templateKey(p.template)] || (pathOf(p.url) === '/' ? 'home' : null);

// ---------- page pairing ----------
const pairs = [];
for (const rp of ref.pages) {
  const rPath = pathOf(rp.url);
  if (ignored(rPath)) continue;
  const target = mapped(rPath);
  const op = findOurs(target.includes('*') ? target : target) || findOurs(mapped(templateKey(rp.template)));
  if (op) pairs.push([rp, op]);
  else gap(3, 'pages', `No page here matches reference ${rPath} (mapped to ${target}).`);
}

// ---------- A. page types ----------
const refTemplates = [...new Set(ref.inventory.map((u) => templateKey(u.template)))].filter((t) => !ignored(t) && !ignored(t.replace('/*', '')));
const ourTemplates = [...new Set(ours.inventory.map((u) => templateKey(u.template)))];
const covered = refTemplates.filter((t) => {
  const m = templateKey(mapped(t));
  return ourTemplates.some((o) => o === m || o.startsWith(m.replace('/*', '')));
});
const scorePages = refTemplates.length ? covered.length / refTemplates.length : 1;
for (const t of refTemplates.filter((t) => !covered.includes(t))) gap(2, 'pages', `Reference page type ${t} has no equivalent here.`);

// ---------- B. flow ----------
const d = (p) => p.viewports.desktop;
const sum = (p, k) => d(p).sections.reduce((s, x) => s + (x.counts?.[k] || 0), 0);
const maxCols = (v) => Math.max(1, ...v.sections.map((s) => s.repeated?.columns || 1));
const flowChecks = [];
const check = (ok, area, msg) => {
  flowChecks.push(ok ? 1 : 0);
  if (!ok) gap(3, 'flow', msg);
};
const byRole = (role) => pairs.filter(([rp]) => roleOf(rp) === role);
for (const [rp, op] of byRole('library')) {
  check(sum(op, 'inputs') > 0, 'flow', `${op.name}: library needs a search field.`);
  check(sum(op, 'links') >= sum(op, 'img'), 'flow', `${op.name}: library needs category filters/links.`);
  check(maxCols(d(op)) >= Math.min(2, maxCols(d(rp))), 'flow', `${op.name}: product grid should show at least ${Math.min(2, maxCols(d(rp)))} columns on desktop.`);
}
for (const [rp, op] of byRole('product')) {
  check(sum(op, 'img') >= 3, 'flow', `${op.name}: product page needs a gallery (3+ images).`);
  check(d(op).links.gumroad.length > 0, 'flow', `${op.name}: product page needs a Buy link to Gumroad.`);
  check(d(op).headings.filter((h) => h.tag === 'h2').length >= 2, 'flow', `${op.name}: product page needs structured info (features, specs, description headings).`);
  check(d(op).sections.some((s) => (s.repeated?.count || 0) >= 2 && s.counts.img >= 2), 'flow', `${op.name}: product page needs related products.`);
}
for (const [rp, op] of byRole('home')) {
  check(d(op).sections.length >= Math.min(6, d(rp).sections.length), 'flow', `Home: needs at least ${Math.min(6, d(rp).sections.length)} content sections.`);
  check(d(op).sections.some((s) => (s.repeated?.count || 0) >= 3 && s.counts.img >= 3), 'flow', 'Home: needs a product grid with images.');
  check(d(op).links.gumroad.length > 0 || d(op).links.internal.some((l) => l.value.startsWith('/mockups/')), 'flow', 'Home: needs links into products.');
  check(d(op).sections.some((s) => s.counts.inputs > 0 || /subscribe|newsletter/i.test(s.text)), 'flow', 'Home: needs a newsletter sign-up.');
  check(d(op).sections.some((s) => /faq|question/i.test(s.text)), 'flow', 'Home: needs an FAQ.');
}
const scoreFlow = flowChecks.length ? avg(flowChecks) : 1;

// ---------- C. responsive ----------
const respScores = [];
for (const [rp, op] of pairs) {
  const rd = d(rp), od = d(op);
  for (const vp of ['mobile', 'tablet', 'laptop', 'wide']) {
    const rv = rp.viewports[vp], ov = op.viewports[vp];
    if (!rv || !ov) continue;
    const parts = [];
    parts.push(ov.horizontalOverflow ? 0 : 1);
    if (ov.horizontalOverflow) gap(3, 'responsive', `${op.name} @${vp}: page scrolls sideways.`);
    const rh = Boolean(rv.nav?.hamburger), oh = Boolean(ov.nav?.hamburger);
    parts.push(rh === oh ? 1 : 0);
    if (rh !== oh) gap(2, 'responsive', `${op.name} @${vp}: reference ${rh ? 'uses a menu button' : 'shows links'}, ours ${oh ? 'uses a menu button' : 'shows links'}.`);
    const shrinkR = (rv.typeScale?.[0]?.size || 1) / (rd.typography.typeScale[0]?.size || 1);
    const shrinkO = (ov.typeScale?.[0]?.size || 1) / (od.typography.typeScale[0]?.size || 1);
    parts.push(closeness(shrinkR, shrinkO, 0.12));
    if (Math.abs(shrinkR - shrinkO) > 0.12) gap(2, 'responsive', `${op.name} @${vp}: biggest heading is ${Math.round(shrinkO * 100)}% of desktop size; reference ${Math.round(shrinkR * 100)}%.`);
    const rc = maxCols(rv), oc = maxCols(ov);
    parts.push(vp === 'mobile' ? (oc <= Math.max(2, rc) ? 1 : 0) : closeness(rc, oc, 1));
    if (vp === 'mobile' && oc > Math.max(2, rc)) gap(2, 'responsive', `${op.name} @mobile: ${oc} columns; keep to ${Math.max(2, rc)}.`);
    respScores.push(avg(parts));
  }
}
const scoreResponsive = respScores.length ? avg(respScores) : 1;

// ---------- D. type system ----------
const sysOf = (r) => {
  const T = d(r).typography;
  const body = [...T.typeScale].sort((a, b) => b.count - a.count)[0]?.size || 16;
  const top = T.typeScale[0]?.size || body;
  const steps = T.typeScale.filter((t) => t.count >= 2).length;
  const mob = r.viewports.mobile?.typeScale?.[0]?.size;
  return { body, top, ratio: top / body, steps, mobileShrink: mob ? mob / top : null };
};
const typeScores = [];
for (const [rp, op] of pairs.filter(([rp]) => ['home', 'library', 'product'].includes(roleOf(rp)))) {
  const R = sysOf(rp), O = sysOf(op);
  const parts = [closeness(R.body, O.body, 1.5), closeness(R.ratio, O.ratio, R.ratio * 0.2), closeness(R.steps, O.steps, 3)];
  if (R.mobileShrink && O.mobileShrink) parts.push(closeness(R.mobileShrink, O.mobileShrink, 0.12));
  if (Math.abs(R.body - O.body) > 1.5) gap(2, 'type', `${op.name}: body text ${O.body}px; reference ${R.body}px.`);
  if (Math.abs(R.ratio - O.ratio) > R.ratio * 0.2) gap(2, 'type', `${op.name}: headline is ${O.ratio.toFixed(1)}× body; reference ${R.ratio.toFixed(1)}×.`);
  if (Math.abs(R.steps - O.steps) > 3) gap(1, 'type', `${op.name}: ${O.steps} text sizes in use; reference ${R.steps}.`);
  typeScores.push(avg(parts));
}
const scoreType = typeScores.length ? avg(typeScores) : 1;

// ---------- E. spacing & surface vocabulary ----------
const home = (r) => d(r.pages[0]);
const RH = home(ref), OH = home(ours);
const nums = (arr, n = 10) => arr.slice(0, n).map((x) => parseFloat(x.value)).filter((x) => !Number.isNaN(x));
const containerOf = (x) => Math.max(...nums(x.spacing.centeredWidths, 4).filter((w) => w > 900), 0);
const container = closeness(containerOf(RH), containerOf(OH), containerOf(RH) * 0.1);
if (container < 1) gap(2, 'spacing', `Content width ${containerOf(OH)}px; reference ${containerOf(RH)}px.`);
const padHit = (A, B, tol) => (A.length ? A.filter((a) => B.some((b) => Math.abs(a - b) <= tol)).length / A.length : 1);
const padScore = padHit(nums(RH.spacing.paddings, 10), nums(OH.spacing.paddings, 25), 4);
if (padScore < 0.8) gap(1, 'spacing', `Padding steps differ: reference ${nums(RH.spacing.paddings).join('/')}.`);
const vocab = (x) => ({
  pill: x.shape.radii.some((r) => /9{2,}|50%|^[4-9]\dpx|^\d{3}px/.test(r.value)),
  cardRadius: x.shape.radii.some((r) => parseFloat(r.value) >= 16 && parseFloat(r.value) <= 40),
  softShadow: x.shape.shadows.length > 0,
  glass: x.shape.glass.length > 0,
  darkBand: x.colors.background.some((c) => /^#0|^#1[0-9a-f]/.test(c.value)),
});
const rv = vocab(RH), ov = vocab(OH);
const vocabScore = avg(Object.keys(rv).map((k) => (rv[k] ? (ov[k] ? 1 : 0) : 1)));
for (const k of Object.keys(rv)) if (rv[k] && !ov[k]) gap(2, 'spacing', `Missing surface style: ${k}.`);
const scoreSpacing = container * 0.3 + padScore * 0.3 + vocabScore * 0.4;

// ---------- F. motion ----------
const mr = RH.motionRuntime, mo = OH.motionRuntime;
const kinds = (x) => [...new Set(x.reveals.flatMap((r) => Object.keys(r.from)))].filter((k) => k !== 'clip');
const hoverKinds = (h) => [...new Set(h.flatMap((x) => x.changes.map((c) => c.split(':')[0].replace(/^child\.|^img\./, ''))))];
const motionParts = {
  scrollReveals: Math.min(1, mo.revealCount / Math.max(1, mr.revealCount * 0.6)),
  revealStyle: jaccard(kinds(mr), kinds(mo)),
  scrollLinked: mr.scrollLinkedElements > 0 ? Math.min(1, mo.scrollLinkedElements / 3) : 1,
  hover: Math.min(1, OH.hover.length / Math.max(1, Math.min(RH.hover.length, 8))),
  hoverKinds: Math.min(1, jaccard(hoverKinds(RH.hover), hoverKinds(OH.hover)) * 1.5),
  sticky: (RH.positioned.length > 0) === (OH.positioned.length > 0) ? 1 : 0,
};
if (motionParts.scrollReveals < 1) gap(3, 'motion', `Scroll reveals: ${mo.revealCount} here; reference ${mr.revealCount}. Aim for ${Math.ceil(mr.revealCount * 0.6)}+.`);
if (motionParts.revealStyle < 1) gap(2, 'motion', `Reveal style: reference animates ${kinds(mr).join(' + ')}, ours ${kinds(mo).join(' + ') || 'nothing'}.`);
if (motionParts.scrollLinked < 1) gap(2, 'motion', `Scroll-linked motion: reference ${mr.scrollLinkedElements} elements, ours ${mo.scrollLinkedElements}.`);
if (motionParts.hover < 1) gap(2, 'motion', `Hover effects found on ${OH.hover.length} element types; aim for ${Math.min(RH.hover.length, 8)}.`);
if (motionParts.hoverKinds < 1) gap(1, 'motion', `Hover changes: reference ${hoverKinds(RH.hover).join(', ')}; ours ${hoverKinds(OH.hover).join(', ') || 'none'}.`);
if (!motionParts.sticky) gap(2, 'motion', 'Sticky header behaviour differs.');
const scoreMotion = avg(Object.values(motionParts));

// ---------- info only: section shape similarity ----------
const lightBucket = (l) => (l == null ? 'page' : l < 0.35 ? 'dark' : l > 0.75 ? 'light' : 'mid');
const shapeInfo = pairs.map(([rp, op]) => {
  const A = d(rp).sections, B = d(op).sections;
  const n = Math.min(A.length, B.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += ((A[i].repeated?.columns || 1) === (B[i].repeated?.columns || 1) ? 0.5 : 0) + (lightBucket(A[i].bgLightness) === lightBucket(B[i].bgLightness) ? 0.5 : 0);
  return `${rp.name}: ${A.length} vs ${B.length} sections, ${Math.round((s / Math.max(A.length, B.length, 1)) * 100)}% alike`;
});

// ---------- total ----------
const scores = { pages: scorePages, flow: scoreFlow, responsive: scoreResponsive, type: scoreType, spacing: scoreSpacing, motion: scoreMotion };
const total = Object.entries(WEIGHTS).reduce((s, [k, w]) => s + scores[k] * w, 0);
const pct = Math.round(total * 10) / 10;
const pass = pct >= PASS;

const md = [];
md.push(`# QC — ${ours.site} vs ${ref.site}`, '');
md.push(`## ${pass ? '✅ PASS' : '❌ FAIL'} — ${pct}% (pass mark ${PASS}%)`, '');
md.push('Scores whether our shop meets the reference standard: page types, product flow, responsiveness, type and spacing system, motion. Design, words, photos and logo are RAM Studio\'s own and are not compared.', '');
md.push('| Area | Weight | Score |', '|---|---|---|');
for (const [k, w] of Object.entries(WEIGHTS)) md.push(`| ${k} | ${w} | ${Math.round(scores[k] * 1000) / 10}% |`);
md.push('', `Pages compared: ${pairs.map(([r, o]) => `${pathOf(r.url)} ↔ ${pathOf(o.url)}`).join(' · ') || 'none'}`, '');
md.push(`Motion detail: ${Object.entries(motionParts).map(([k, v]) => `${k} ${Math.round(v * 100)}%`).join(' · ')}`, '');
md.push('Section shape (information only): ' + shapeInfo.join(' · '), '');
md.push(`## What to fix (${gaps.length})`, '');
for (const g of gaps.sort((a, b) => b.sev - a.sev)) md.push(`- **[${g.area}]** ${g.msg}`);
await writeFile(outFile, md.join('\n') + '\n');

console.log(`${pass ? 'PASS' : 'FAIL'} ${pct}%  →  ${outFile}`);
for (const [k, v] of Object.entries(scores)) console.log(`  ${k.padEnd(11)} ${(Math.round(v * 1000) / 10).toString().padStart(5)}%`);
process.exitCode = pass ? 0 : 2;
