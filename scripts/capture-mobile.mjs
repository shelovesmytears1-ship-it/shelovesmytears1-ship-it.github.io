/**
 * Capture real mobile screenshots of the concept sites listed in the case
 * frontmatter (siteUrl), three scroll depths each, so a case can show a phone
 * row with genuinely different screens rather than one shot repeated.
 *
 * Run:  node scripts/capture-mobile.mjs
 * Out:  public/screens/<slug>-m{1,2,3}.webp
 */
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES = path.join(ROOT, 'src/content/cases');
const OUT = path.join(ROOT, 'public/screens');

const VW = 390, VH = 844, DPR = 2; // iPhone 14 class, ratio 2.164

await fs.mkdir(OUT, { recursive: true });

const files = (await fs.readdir(CASES)).filter((f) => f.endsWith('.md'));
const targets = [];
for (const f of files) {
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const m = raw.match(/^siteUrl:\s*(\S+)\s*$/m);
  if (m) targets.push({ slug: f.replace(/\.md$/, ''), url: m[1] });
}
console.log(`sites: ${targets.length}`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });
const report = [];

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: VW, height: VH, deviceScaleFactor: DPR, isMobile: true, hasTouch: true });
  // freeze entrance animations so nothing is captured mid-fade
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  try {
    await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.evaluate(() => document.fonts?.ready);
    await new Promise((r) => setTimeout(r, 1200));

    const docH = await page.evaluate(() => document.body.scrollHeight);
    const stops = [0, VH * 1.6, VH * 3.4]
      .map((v) => Math.max(0, Math.round(Math.min(v, Math.max(0, docH - VH)))));

    const made = [];
    for (let i = 0; i < stops.length; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), stops[i]);
      await new Promise((r) => setTimeout(r, 700));
      const buf = await page.screenshot({ type: 'png' });
      const file = path.join(OUT, `${t.slug}-m${i + 1}.webp`);
      await sharp(buf).webp({ quality: 82 }).toFile(file);
      made.push(path.basename(file));
    }
    report.push({ slug: t.slug, ok: true, docH, stops, made });
    console.log(`OK  ${t.slug}  h=${docH}  ${made.join(' ')}`);
  } catch (e) {
    report.push({ slug: t.slug, ok: false, err: String(e).slice(0, 120) });
    console.log(`ERR ${t.slug}  ${String(e).slice(0, 120)}`);
  }
  await page.close();
}

await browser.close();
await fs.writeFile(path.join(OUT, '_capture-report.json'), JSON.stringify(report, null, 2));
console.log(`\ndone: ${report.filter((r) => r.ok).length}/${report.length}`);
