// Render demo images from data/*.yaml with image.html -> 1440x1800 PNG.
// Usage: node tools/demo/render_images.mjs <outDir> D01-I1 D06-I2 ...
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [outDir, ...ids] = process.argv.slice(2);
let pw;
try { pw = await import('playwright'); } catch {
  pw = await import(pathToFileURL(path.join(execSync('npm root -g').toString().trim(), 'playwright', 'index.mjs')).href);
}
const dump = `
import json, sys, yaml, glob
want, out = set(sys.argv[1:]), {}
for f in sorted(glob.glob('${path.join(here, '..', '..', 'data')}/posts-w*.yaml')):
    d = yaml.safe_load(open(f))
    for p in (d['posts'] if isinstance(d, dict) else d):
        if p['id'] in want: out[p['id']] = p
print(json.dumps(out, ensure_ascii=False, default=str))`;
const posts = JSON.parse(execFileSync('python3', ['-c', dump, ...ids]).toString());

fs.mkdirSync(outDir, { recursive: true });
const browser = await pw.chromium.launch();
for (const id of ids) {
  if (!posts[id]) throw new Error(`${id} not found`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 }, deviceScaleFactor: 1 });
  await page.addInitScript(`window.__POST = ${JSON.stringify(posts[id])};`);
  await page.goto(pathToFileURL(path.join(here, 'image.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.build());
  // nothing may spill past the 90 px margin
  const spill = await page.evaluate(() => [...document.querySelectorAll('#c *')].filter(n => {
    const r = n.getBoundingClientRect(); return r.width && (r.left < 89 || r.right > 1351 || r.top < 89 || r.bottom > 1711);
  }).map(n => n.className || n.tagName));
  if (spill.length) console.warn(`  ${id}: outside margins: ${[...new Set(spill)].join(', ')}`);
  const file = path.join(outDir, `${id}.png`);
  await page.screenshot({ path: file });
  console.log(`  wrote ${file}`);
  await page.close();
}
await browser.close();
