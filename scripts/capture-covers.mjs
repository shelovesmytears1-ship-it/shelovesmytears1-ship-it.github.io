/**
 * Re-shoot desktop covers for every case from its live site (siteUrl), at the
 * top of the page. Writes both the standard 1280x800 jpg/webp used in the
 * carousel + laptop mockup, and a 3840x2400 retina webp in covers/4k/.
 *
 * Sites are shot at 1600x1000 @2.4 DPR then downscaled — sharp text, real 16:10.
 * Pass a slug to reshoot just one; --local <base> to shoot from a local server.
 *
 * Run: node scripts/capture-covers.mjs [slug] [--local http://localhost:8090]
 */
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES = path.join(ROOT, 'src/content/cases');
const OUT = path.join(ROOT, 'public/covers');
const OUT4K = path.join(OUT, '4k');

const args = process.argv.slice(2);
const only = args.find((a) => !a.startsWith('--') && !a.startsWith('http'));
const localBase = args.includes('--local') ? args[args.indexOf('--local') + 1] : null;

// overrides: slug -> a URL to shoot instead of the frontmatter siteUrl
// (used for sites not yet deployed, served locally)
const OVERRIDE = {};
if (localBase) {
  // e.g. lunea served from a local static server
}

const VW = 1600, VH = 1000, DPR = 2; // 16:10, retina

await fs.mkdir(OUT4K, { recursive: true });

const targets = [];
for (const f of (await fs.readdir(CASES)).filter((x) => x.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  if (only && slug !== only) continue;
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const url = OVERRIDE[slug] || raw.match(/^siteUrl:\s*(\S+)\s*$/m)?.[1];
  const cover = raw.match(/^cover:\s*(\S+)\s*$/m)?.[1] || `/covers/${slug}.jpg`;
  if (url) targets.push({ slug, url, base: path.basename(cover).replace(/\.\w+$/, '') });
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });
const report = [];

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: VW, height: VH, deviceScaleFactor: DPR });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  try {
    const resp = await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 45000 });
    if (resp && resp.status() >= 400) throw new Error('HTTP ' + resp.status());
    await page.evaluate(() => document.fonts?.ready);
    // let any loader dismiss and the entrance settle
    await page.waitForFunction(() => {
      const l = document.querySelector('.loader, #loader, .preloader');
      return !l || getComputedStyle(l).opacity === '0' || getComputedStyle(l).visibility === 'hidden' || l.classList.contains('hidden');
    }, { timeout: 8000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 2200));
    await page.evaluate(() => window.scrollTo(0, 0));

    // full viewport — NO clip. Puppeteer clip is in CSS px, so passing
    // VW*DPR captured twice the viewport and left the rest black/white.
    // The DPR already doubles the output; the plain shot is 3200x2000.
    const shot = await page.screenshot({ type: 'png' });

    // retina master 3840x2400, then the 1280x800 delivery pair
    await sharp(shot).resize(3840, 2400, { fit: 'cover' }).webp({ quality: 82 }).toFile(path.join(OUT4K, `${t.base}.webp`));
    await sharp(shot).resize(1280, 800, { fit: 'cover' }).webp({ quality: 84 }).toFile(path.join(OUT, `${t.base}.webp`));
    await sharp(shot).resize(1280, 800, { fit: 'cover' }).jpeg({ quality: 86 }).toFile(path.join(OUT, `${t.base}.jpg`));

    report.push({ slug: t.slug, ok: true });
    console.log(`OK  ${t.slug.padEnd(12)} ${t.url}`);
  } catch (e) {
    report.push({ slug: t.slug, ok: false, err: String(e).slice(0, 80) });
    console.log(`ERR ${t.slug.padEnd(12)} ${String(e).slice(0, 80)}`);
  }
  await page.close();
}

await browser.close();
console.log(`\ndone: ${report.filter((r) => r.ok).length}/${report.length}`);
const failed = report.filter((r) => !r.ok);
if (failed.length) console.log('failed: ' + failed.map((f) => f.slug).join(', '));
