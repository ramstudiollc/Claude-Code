#!/usr/bin/env node
// Make a copy of the built site (dist/) that works from any folder or preview host:
// every root link ("/mockups/", "/images/x.webp") becomes relative ("../mockups/index.html").
//
//   npm run build && npm run portable          → preview-portable/
//   npm run portable -- --fragment             → also turn the home page into a body fragment
//                                                (for hosts that wrap the main page in their own <html>)

import { readdir, readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dist');
const out = path.join(root, 'preview-portable');
const fragment = process.argv.includes('--fragment');
const SKIP = new Set(['robots.txt', 'sitemap.xml']);
// Some preview hosts reserve names starting with "_": publish Astro's "_astro/" as "astro/".
const RENAME = [['_astro/', 'astro/']];
const renamePath = (rel) => RENAME.reduce((r, [a, b]) => (r.startsWith(a) ? b + r.slice(a.length) : r), rel);
const renameRefs = (text) => RENAME.reduce((t, [a, b]) => t.split(a).join(b), text);

async function walk(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}

function relativise(html, fileRel) {
  const depth = fileRel.split('/').length - 1;
  const up = depth ? '../'.repeat(depth) : '';
  // href / src / data-thumb values that start with a single "/"
  return html.replace(/\b(href|src|data-thumb|poster)="\/(?!\/)([^"#?]*)([?#][^"]*)?"/g, (m, attr, p, tail = '') => {
    let target = p;
    if (target === '' || target.endsWith('/')) target += 'index.html';
    return `${attr}="${up}${target}${tail}"`;
  });
}

function toFragment(html, title) {
  const head = (html.match(/<head>([\s\S]*?)<\/head>/) || [, ''])[1]
    .replace(/<meta charset="[^"]*"\s*\/?>/i, '')
    .replace(/<meta name="viewport"[^>]*>/i, '')
    .replace(/<title>[\s\S]*?<\/title>/i, '');
  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [, html])[1];
  return `<title>${title}</title>\n${head}\n${body}`;
}

await rm(out, { recursive: true, force: true });
const files = (await walk(src)).filter((f) => !SKIP.has(path.basename(f)));
for (const f of files) {
  const rel = renamePath(path.relative(src, f).split(path.sep).join('/'));
  const dest = path.join(out, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  if (rel.endsWith('.html')) {
    let html = renameRefs(relativise(await readFile(f, 'utf8'), rel));
    if (fragment && rel === 'index.html') html = toFragment(html, 'ramstudiollc.shop');
    await writeFile(dest, html);
  } else if (/\.(css|js|mjs)$/.test(rel)) {
    await writeFile(dest, renameRefs(await readFile(f, 'utf8')));
  } else {
    await copyFile(f, dest);
  }
}
console.log(`Portable copy: ${files.length} files → ${path.relative(root, out)}/`);
