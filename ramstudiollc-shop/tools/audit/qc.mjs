#!/usr/bin/env node
// QC: score how closely our site matches the reference site's layout, type, spacing,
// motion and responsive behaviour. Content (words, photos, logo) is ours by design and is not scored.
//
//   npm run qc -- --ref audit/www.asylab.com/report.json --ours audit/localhost-4321/report.json
//   npm run qc -- --ref ... --ours ... --map tools/audit/qc-map.json --out audit/qc-report.md
//
// PASS = 95% or more.

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
const map = arg('map') ? JSON.parse(await readFile(arg('map'), 'utf8')) : { pages: {}, fonts: {} };
const outFile = arg('out', path.join(path.dirname(oursPath), 'qc-report.md'));
const PASS = 95;

const WEIGHTS = { pages: 10, sections: 25, responsive: 15, type: 20, spacing: 15, motion: 15 };
const gaps = []; // human-readable things to fix, with a severity used for sorting
const gap = (sev, area, msg) => gaps.push({ sev, area, msg });

// ---------- helpers ----------
const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 1);
// The home page carries the design, so it counts three times in page-level averages.
const wavg = (xs) => (xs.length ? xs.reduce((s, [v, w]) => s + v * w, 0) / xs.reduce((s, [, w]) => s + w, 0) : 1);
const weightOf = (rp) => (new URL(rp.url).pathname.replace(/\/+$/, '') === '' ? 3 : 1);
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
const nearSet = (A, B, tol) => {
  // share of A values that have a B value within tol (and vice versa), averaged
  const hit = (X, Y) => (X.length ? X.filter((x) => Y.some((y) => Math.abs(x - y) <= tol)).length / X.length : 1);
  return (hit(A, B) + hit(B, A)) / 2;
};
const lightBucket = (l) => (l == null ? 'page' : l < 0.35 ? 'dark' : l > 0.75 ? 'light' : 'mid');
const templateKey = (t) => t.replace(/\/+$/, '') || '/';

function mappedPath(refPathname) {
  const pages = map.pages || {};
  if (pages[refPathname]) return pages[refPathname];
  for (const [k, v] of Object.entries(pages)) if (k.endsWith('/*') && refPathname.startsWith(k.slice(0, -1))) return v;
  return refPathname;
}

// Section alignment (sequence DP that maximises total similarity; unmatched sections score 0).
function align(A, B, sim) {
  const n = A.length, m = B.length;
  const S = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) S[i][j] = Math.max(S[i - 1][j], S[i][j - 1], S[i - 1][j - 1] + sim(A[i - 1], B[j - 1]));
  const pairs = [];
  for (let i = n, j = m; i > 0 && j > 0; ) {
    const s = sim(A[i - 1], B[j - 1]);
    if (Math.abs(S[i][j] - (S[i - 1][j - 1] + s)) < 1e-9) {
      pairs.unshift([i - 1, j - 1, s]);
      i--;
      j--;
    } else if (S[i - 1][j] >= S[i][j - 1]) i--;
    else j--;
  }
  return {
    score: n || m ? S[n][m] / Math.max(n, m) : 1,
    pairs,
    unmatchedRef: A.map((_, i) => i).filter((i) => !pairs.some((p) => p[0] === i)),
    unmatchedOurs: B.map((_, j) => j).filter((j) => !pairs.some((p) => p[1] === j)),
  };
}

const cols = (s) => s.repeated?.columns ?? 0;
function sectionSim(a, b) {
  const h = closeness(a.heightVH, b.heightVH, 0.08);
  const c = cols(a) === cols(b) ? 1 : Math.abs(cols(a) - cols(b)) === 1 ? 0.5 : 0;
  const bg = lightBucket(a.bgLightness) === lightBucket(b.bgLightness) ? 1 : 0;
  const t = closeness(a.largestText?.size, b.largestText?.size, 2);
  const media = (x) => (x.counts ? x.counts.img + x.counts.svg + x.counts.video + x.counts.canvas > 0 : null);
  const md = media(a) == null || media(b) == null ? 1 : media(a) === media(b) ? 1 : 0.5;
  return (h + c + bg + t + md) / 5;
}

// ---------- page pairing ----------
const ourByPath = new Map(ours.pages.map((p) => [new URL(p.url).pathname.replace(/\/+$/, '') || '/', p]));
const pairs = [];
for (const rp of ref.pages) {
  const rPath = new URL(rp.url).pathname.replace(/\/+$/, '') || '/';
  const target = (mappedPath(rPath).replace(/\/+$/, '') || '/');
  let op = ourByPath.get(target);
  if (!op && target.includes('*')) op = ours.pages.find((p) => new URL(p.url).pathname.startsWith(target.replace('*', '')));
  if (op) pairs.push([rp, op]);
  else gap(3, 'pages', `No page on our site matches ${rPath} (expected ${target}). Add it or map it in qc-map.json.`);
}

// ---------- A. page coverage ----------
const refTemplates = [...new Set(ref.inventory.map((u) => templateKey(u.template)))];
const ourTemplates = new Set(ours.inventory.map((u) => templateKey(u.template)));
const covered = refTemplates.filter((t) => {
  const m = templateKey(mappedPath(t));
  return ourTemplates.has(m) || [...ourTemplates].some((o) => o.startsWith(m.replace('/*', '')));
});
const scorePages = refTemplates.length ? covered.length / refTemplates.length : 1;
for (const t of refTemplates.filter((t) => !covered.includes(t))) gap(2, 'pages', `Reference page type ${t} has no equivalent on our site.`);

// ---------- B. sections (desktop) ----------
const secScores = [];
for (const [rp, op] of pairs) {
  const A = rp.viewports.desktop.sections, B = op.viewports.desktop.sections;
  const al = align(A, B, sectionSim);
  secScores.push([al.score, weightOf(rp)]);
  if (A.length !== B.length) gap(3, 'sections', `${rp.name}: reference has ${A.length} sections, ours has ${B.length}.`);
  for (const i of al.unmatchedRef) gap(3, 'sections', `${rp.name}: reference section #${i} (${A[i].heightVH}vh, "${A[i].headings[0]?.text?.slice(0, 40) ?? A[i].el}") has no counterpart.`);
  for (const j of al.unmatchedOurs) gap(1, 'sections', `${rp.name}: our section #${j} ("${B[j].headings[0]?.text?.slice(0, 40) ?? B[j].el}") has no counterpart in the reference.`);
  for (const [i, j, s] of al.pairs) {
    if (s >= 0.95 && cols(A[i]) === cols(B[j])) continue;
    const a = A[i], b = B[j];
    const d = [];
    if (cols(a) !== cols(b)) d.push(`columns ${cols(a)} vs ${cols(b)}`);
    if (Math.abs(a.heightVH - b.heightVH) > 0.08) d.push(`height ${a.heightVH}vh vs ${b.heightVH}vh`);
    if (lightBucket(a.bgLightness) !== lightBucket(b.bgLightness)) d.push(`background ${lightBucket(a.bgLightness)} vs ${lightBucket(b.bgLightness)}`);
    if (Math.abs((a.largestText?.size ?? 0) - (b.largestText?.size ?? 0)) > 2) d.push(`biggest text ${a.largestText?.size}px vs ${b.largestText?.size}px`);
    gap(2, 'sections', `${rp.name} section ref#${i} ↔ ours#${j} (${Math.round(s * 100)}%): ${d.join(', ') || 'media mismatch'}.`);
  }
}
const scoreSections = wavg(secScores);

// ---------- C. responsive ----------
const respScores = [];
for (const [rp, op] of pairs) {
  for (const [vp, rv] of Object.entries(rp.viewports)) {
    const ov = op.viewports[vp];
    if (!ov || vp === 'desktop') continue;
    const parts = [];
    parts.push(ov.horizontalOverflow ? 0 : 1);
    if (ov.horizontalOverflow) gap(3, 'responsive', `${op.name} @${vp}: our page scrolls sideways.`);
    const rh = Boolean(rv.nav?.hamburger), oh = Boolean(ov.nav?.hamburger);
    parts.push(rh === oh ? 1 : 0);
    if (rh !== oh) gap(2, 'responsive', `${rp.name} @${vp}: reference ${rh ? 'uses a menu button' : 'shows inline links'}, ours ${oh ? 'uses a menu button' : 'shows inline links'}.`);
    const al = align(rv.sections, ov.sections, (a, b) => (closeness(a.heightVH, b.heightVH, 0.12) + (cols(a) === cols(b) ? 1 : 0)) / 2);
    parts.push(al.score);
    for (const [i, j] of al.pairs) if (cols(rv.sections[i]) !== cols(ov.sections[j])) gap(2, 'responsive', `${rp.name} @${vp} section ref#${i}: ${cols(rv.sections[i])} columns, ours ${cols(ov.sections[j])}.`);
    const rTop = rv.typeScale?.[0]?.size, oTop = ov.typeScale?.[0]?.size;
    parts.push(closeness(rTop, oTop, 2));
    if (Math.abs((rTop ?? 0) - (oTop ?? 0)) > 2) gap(2, 'responsive', `${rp.name} @${vp}: largest text ${rTop}px, ours ${oTop}px.`);
    respScores.push([avg(parts), weightOf(rp)]);
  }
}
const scoreResponsive = wavg(respScores);

// ---------- D. typography ----------
const typeScores = [];
for (const [rp, op] of pairs.slice(0, 4)) {
  const R = rp.viewports.desktop.typography, O = op.viewports.desktop.typography;
  const topSizes = (T) => [...T.typeScale].sort((a, b) => b.area - a.area).slice(0, 8).map((t) => t.size);
  const rs = topSizes(R), os = O.typeScale.map((t) => t.size);
  const sizeScore = avg(rs.map((s) => {
    const near = os.reduce((best, o) => (Math.abs(o - s) < Math.abs(best - s) ? o : best), Infinity);
    const d = Math.abs(near - s);
    if (d > 1) gap(d > 3 ? 2 : 1, 'type', `${rp.name}: reference uses ${s}px text; our nearest is ${near}px.`);
    return d <= 1 ? 1 : d <= 3 ? 0.6 : d <= 6 ? 0.3 : 0;
  }));
  const fam = (T) => (T.families[0]?.value || '').split(' ')[0];
  const rf = fam(R), of = fam(O);
  const famScore = (map.fonts?.[rf] || rf) === of ? 1 : 0;
  if (!famScore) gap(2, 'type', `Main font: reference ${rf}, ours ${of}. Use the same family or map an approved substitute in qc-map.json.`);
  const big = (T) => T.textStyles.map((s) => s.value.split(' | ')).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))[0] || [];
  const [, rSize, rW, rLh, rLs] = big(R), [, oSize, oW, oLh, oLs] = big(O);
  const detail = avg([rW === oW ? 1 : 0, closeness(parseFloat(rLh?.slice(3)), parseFloat(oLh?.slice(3)), 0.05), closeness(parseFloat(rLs?.slice(3)), parseFloat(oLs?.slice(3)), 0.01)]);
  if (detail < 0.9) gap(2, 'type', `${rp.name} headline: reference ${rSize} w${rW} ${rLh} ${rLs}; ours ${oSize} w${oW} ${oLh} ${oLs}.`);
  const rm = rp.viewports.mobile?.typeScale?.slice(0, 5).map((t) => t.size) || [];
  const om = op.viewports.mobile?.typeScale?.slice(0, 5).map((t) => t.size) || [];
  const mobileScore = rm.length && om.length ? nearSet(rm, om, 1.5) : 1;
  if (mobileScore < 0.9) gap(2, 'type', `${rp.name} on phones: reference top sizes ${rm.join('/')}px, ours ${om.join('/')}px.`);
  typeScores.push([sizeScore * 0.5 + famScore * 0.2 + detail * 0.1 + mobileScore * 0.2, weightOf(rp)]);
}
const scoreType = wavg(typeScores);

// ---------- E. spacing, shape, effects ----------
const R = ref.pages[0].viewports.desktop, O = ours.pages[0].viewports.desktop;
const nums = (arr, n = 8) => arr.slice(0, n).map((x) => parseFloat(x.value)).filter((x) => !Number.isNaN(x));
const container = closeness(nums(R.spacing.centeredWidths, 1)[0], nums(O.spacing.centeredWidths, 1)[0], 8);
if (container < 1) gap(2, 'spacing', `Content width: reference ${nums(R.spacing.centeredWidths, 1)[0]}px, ours ${nums(O.spacing.centeredWidths, 1)[0]}px.`);
const padScore = nearSet(nums(R.spacing.paddings), nums(O.spacing.paddings), 2);
const gapScore = nearSet(nums(R.spacing.gaps), nums(O.spacing.gaps), 2);
if (padScore < 0.8) gap(1, 'spacing', `Padding scale differs: reference ${nums(R.spacing.paddings).join('/')}, ours ${nums(O.spacing.paddings).join('/')}.`);
if (gapScore < 0.8) gap(1, 'spacing', `Gap scale differs: reference ${nums(R.spacing.gaps).join('/')}, ours ${nums(O.spacing.gaps).join('/')}.`);
const radius = (arr) => arr.slice(0, 6).map((x) => (/999|50%|9999/.test(x.value) ? 'pill' : `${Math.round(parseFloat(x.value) / 2) * 2}`));
const radiusScore = jaccard(radius(R.shape.radii), radius(O.shape.radii));
if (radiusScore < 0.7) gap(1, 'spacing', `Corner radii: reference ${radius(R.shape.radii).join(', ')}; ours ${radius(O.shape.radii).join(', ')}.`);
const flags = (x) => ({ shadows: x.shape.shadows.length > 0, glass: x.shape.glass.length > 0, gradients: x.colors.gradients.length > 0, blur: x.shape.filters.some((f) => f.value.includes('blur')) });
const rf = flags(R), of = flags(O);
const effectScore = avg(Object.keys(rf).map((k) => (rf[k] === of[k] ? 1 : 0)));
for (const k of Object.keys(rf)) if (rf[k] !== of[k]) gap(2, 'spacing', `Effect "${k}": reference ${rf[k] ? 'uses it' : 'does not'}, ours ${of[k] ? 'does' : 'does not'}.`);
const scoreSpacing = container * 0.3 + padScore * 0.2 + gapScore * 0.2 + radiusScore * 0.1 + effectScore * 0.2;

// ---------- F. motion ----------
const mr = R.motionRuntime, mo = O.motionRuntime;
const kinds = (rv) => [...new Set(rv.reveals.flatMap((x) => Object.keys(x.from)))];
const hoverKinds = (h) => [...new Set(h.flatMap((x) => x.changes.map((c) => c.split(':')[0])))];
const durations = (x) => x.motionStatic.transitions.flatMap((t) => (t.value.split(' | ')[1] || '').split(',').map((d) => parseFloat(d) * (d.includes('ms') ? 1 : 1000))).filter((d) => d > 0);
const median = (xs) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0);
const infinite = (x) => x.motionStatic.cssAnimations.some((a) => a.value.includes('infinite')) || mrInf(x);
const mrInf = (x) => x.motionRuntime.runtimeAnimations.some((a) => /iter Infinity/.test(a.value));
const motionParts = {
  revealCount: ratio(mr.revealCount, mo.revealCount),
  revealKinds: jaccard(kinds(mr), kinds(mo)),
  transitionTiming: closeness(median(durations(R)), median(durations(O)), 100),
  hover: jaccard(hoverKinds(R.hover), hoverKinds(O.hover)),
  loops: infinite(R) === infinite(O) ? 1 : 0,
  smoothScroll: (R.stack.lenis || R.stack.locomotive) === (O.stack.lenis || O.stack.locomotive) ? 1 : 0,
  sticky: (R.positioned.length > 0) === (O.positioned.length > 0) ? 1 : 0,
  parallax: (mr.scrollLinkedElements > 0) === (mo.scrollLinkedElements > 0) ? 1 : 0,
  cursor: Boolean(R.customCursor) === Boolean(O.customCursor) ? 1 : 0,
};
if (motionParts.revealCount < 0.8) gap(3, 'motion', `Scroll reveals: reference ${mr.revealCount}, ours ${mo.revealCount}.`);
if (motionParts.revealKinds < 1) gap(2, 'motion', `Reveal style: reference animates ${kinds(mr).join(' + ') || 'nothing'}, ours ${kinds(mo).join(' + ') || 'nothing'}.`);
if (motionParts.transitionTiming < 0.9) gap(1, 'motion', `Typical transition: reference ${median(durations(R))}ms, ours ${median(durations(O))}ms.`);
if (motionParts.hover < 0.8) gap(2, 'motion', `Hover effects: reference changes ${hoverKinds(R.hover).join(', ') || 'nothing'}; ours ${hoverKinds(O.hover).join(', ') || 'nothing'}.`);
if (!motionParts.loops) gap(2, 'motion', `Looping animation (e.g. marquee): reference ${infinite(R) ? 'has one' : 'none'}, ours ${infinite(O) ? 'has one' : 'none'}.`);
if (!motionParts.smoothScroll) gap(2, 'motion', 'Smooth-scroll library differs (Lenis/Locomotive).');
if (!motionParts.sticky) gap(2, 'motion', 'Sticky/fixed header behaviour differs.');
if (!motionParts.parallax) gap(2, 'motion', `Scroll-linked motion: reference ${mr.scrollLinkedElements}, ours ${mo.scrollLinkedElements}.`);
if (!motionParts.cursor) gap(1, 'motion', 'Custom cursor differs.');
const scoreMotion = avg(Object.values(motionParts));

// ---------- total ----------
const scores = { pages: scorePages, sections: scoreSections, responsive: scoreResponsive, type: scoreType, spacing: scoreSpacing, motion: scoreMotion };
const total = Object.entries(WEIGHTS).reduce((s, [k, w]) => s + scores[k] * w, 0);
const pct = Math.round(total * 10) / 10;
const pass = pct >= PASS;

const md = [];
md.push(`# QC — ${ours.site} vs ${ref.site}`);
md.push('');
md.push(`## ${pass ? '✅ PASS' : '❌ FAIL'} — ${pct}% (pass mark ${PASS}%)`);
md.push('');
md.push('Scores layout, type, spacing, motion and responsiveness. Words, photos and logo are ours by design and are not compared.');
md.push('');
md.push('| Area | Weight | Score |');
md.push('|---|---|---|');
for (const [k, w] of Object.entries(WEIGHTS)) md.push(`| ${k} | ${w} | ${Math.round(scores[k] * 1000) / 10}% |`);
md.push('');
md.push(`Pages compared: ${pairs.map(([r, o]) => `${new URL(r.url).pathname} ↔ ${new URL(o.url).pathname}`).join(' · ') || 'none'}`);
md.push('');
md.push('Motion detail: ' + Object.entries(motionParts).map(([k, v]) => `${k} ${Math.round(v * 100)}%`).join(' · '));
md.push('');
md.push(`## What to fix (${gaps.length})`);
md.push('');
for (const g of gaps.sort((a, b) => b.sev - a.sev)) md.push(`- **[${g.area}]** ${g.msg}`);
await writeFile(outFile, md.join('\n') + '\n');

console.log(`${pass ? 'PASS' : 'FAIL'} ${pct}%  →  ${outFile}`);
for (const [k, v] of Object.entries(scores)) console.log(`  ${k.padEnd(11)} ${(Math.round(v * 1000) / 10).toString().padStart(5)}%`);
process.exitCode = pass ? 0 : 2;
