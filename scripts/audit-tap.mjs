/**
 * Report undersized tap targets and sub-12px text at mobile width, grouped by
 * the selector that would fix them, so the CSS can be targeted instead of a
 * blanket rule that fights each site's layout.
 *
 * Run: node scripts/audit-tap.mjs [slug]
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES = path.join(ROOT, 'src/content/cases');
const only = process.argv[2];

const targets = [];
for (const f of (await fs.readdir(CASES)).filter((x) => x.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  if (only && slug !== only) continue;
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const url = raw.match(/^siteUrl:\s*(\S+)\s*$/m)?.[1];
  if (url) targets.push({ slug, url });
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  try {
    await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.evaluate(() => document.fonts?.ready);
    await new Promise((r) => setTimeout(r, 900));

    const r = await page.evaluate(() => {
      const sel = (el) => {
        const cls = (el.className || '').toString().trim().split(/\s+/)
          .filter((c) => c && !/^(is-|js-)/.test(c)).slice(0, 2);
        return el.tagName.toLowerCase() + (cls.length ? '.' + cls.join('.') : '');
      };
      const vis = (el) => {
        const s = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0;
      };

      const tap = {};
      document.querySelectorAll('a,button,input,select,textarea,[role="button"]').forEach((el) => {
        if (!vis(el)) return;
        const b = el.getBoundingClientRect();
        if (b.height >= 44 && b.width >= 44) return;
        const k = sel(el);
        (tap[k] ||= { n: 0, min: [999, 999] }).n++;
        tap[k].min = [Math.min(tap[k].min[0], Math.round(b.width)), Math.min(tap[k].min[1], Math.round(b.height))];
      });

      const type = {};
      document.querySelectorAll('*').forEach((el) => {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
        if (!vis(el)) return;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs >= 12) return;
        const k = sel(el);
        (type[k] ||= { n: 0, px: 99 }).n++;
        type[k].px = Math.min(type[k].px, +fs.toFixed(1));
      });

      return { tap, type };
    });

    const tapRows = Object.entries(r.tap).sort((a, b) => b[1].n - a[1].n);
    const typeRows = Object.entries(r.type).sort((a, b) => a[1].px - b[1].px);
    console.log(`\n### ${t.slug}  (tap ${tapRows.reduce((s, x) => s + x[1].n, 0)}, type ${typeRows.reduce((s, x) => s + x[1].n, 0)})`);
    tapRows.slice(0, 8).forEach(([k, v]) => console.log(`  TAP  ${String(v.n).padStart(3)}x  ${v.min[0]}x${v.min[1]}  ${k}`));
    typeRows.slice(0, 8).forEach(([k, v]) => console.log(`  TYPE ${String(v.n).padStart(3)}x  ${v.px}px    ${k}`));
  } catch (e) {
    console.log(`\n### ${t.slug}  ERR ${String(e).slice(0, 70)}`);
  }
  await page.close();
}

await browser.close();
