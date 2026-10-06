// Render a demo Reel: reel.html + timeline.json + vo.wav -> 1080x1920 30 fps MP4.
// Usage: node tools/demo/render_reel.mjs <build/demo/ID> <out.mp4> [--frames 0,45,90 --stills dir]
import { spawn, execSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [dir, out, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.join(' ').split('--').filter(Boolean).map(s => s.trim().split(/\s+/)));

let pw;
try { pw = await import('playwright'); } catch {
  pw = await import(pathToFileURL(path.join(execSync('npm root -g').toString().trim(), 'playwright', 'index.mjs')).href);
}
const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
const FPS = 30, N = Math.round(tl.runtime * FPS);

const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.addInitScript(`window.__TL = ${JSON.stringify(tl)};`);
await page.goto(pathToFileURL(path.join(here, 'reel.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => window.setup());

if (opt.frames) {  // stills for review only
  fs.mkdirSync(opt.stills, { recursive: true });
  for (const f of opt.frames.split(',').map(Number)) {
    await page.evaluate(t => window.renderAt(t), f / FPS);
    await page.screenshot({ path: path.join(opt.stills, `${tl.id}-${String(f).padStart(4, '0')}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-i', path.join(dir, 'vo.wav'),
  '-map', '0:v', '-map', '1:a',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS),
  '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-t', String(tl.runtime), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });

const t0 = Date.now();
for (let f = 0; f < N; f++) {
  await page.evaluate(t => window.renderAt(t), f / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
  if (!ff.stdin.write(buf)) await once(ff.stdin, 'drain');
  if (f % 150 === 0) process.stdout.write(`  ${tl.id} frame ${f}/${N} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
}
ff.stdin.end();
const [code] = await once(ff, 'close');
await browser.close();
if (code !== 0) { console.error('ffmpeg failed'); process.exit(1); }
console.log(`  wrote ${out} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
