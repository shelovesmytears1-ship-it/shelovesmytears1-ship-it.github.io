/**
 * Find mobile menu toggles that stay visible on desktop, and desktop nav links
 * that got hidden by an unguarded mobile rule. Both come from patch blocks
 * appended without a media query.
 *
 * Run: node scripts/audit-burger.mjs [--local]
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCAL = process.argv.includes('--local');
const CASES = path.join(ROOT, 'src/content/cases');

const targets = [];
for (const f of (await fs.readdir(CASES)).filter((x) => x.endsWith('.md'))) {
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const url = raw.match(/^siteUrl:\s*(\S+)\s*$/m)?.[1];
  if (url) targets.push({ slug: f.replace(/\.md$/, ''), url });
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  try {
    await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 700));

    const r = await page.evaluate(() => {
      const isShown = (el) => {
        const s = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' &&
               +s.opacity > 0.05 && b.width > 4 && b.height > 4;
      };
      const TOGGLE = /burger|hamburger|menu-toggle|nav-toggle|mobile-menu-btn|btn-menu/i;
      const toggles = [...document.querySelectorAll('button,a,div,span')]
        .filter((e) => TOGGLE.test((e.className || '').toString() + ' ' + e.id))
        .filter(isShown)
        .map((e) => (e.tagName + '.' + (e.className || '').toString().split(' ')[0]).slice(0, 34));

      const navSel = '.nav-links a, nav a, .nav a, header a';
      const navVisible = [...document.querySelectorAll(navSel)].filter(isShown).length;

      return { toggles: [...new Set(toggles)], navVisible };
    });

    const bad = r.toggles.length > 0;
    console.log(`${bad ? 'BURGER' : 'ok    '} ${t.slug.padEnd(12)} nav-links=${String(r.navVisible).padEnd(3)} ${r.toggles.join(', ')}`);
  } catch (e) {
    console.log(`ERR    ${t.slug.padEnd(12)} ${String(e).slice(0, 60)}`);
  }
  await page.close();
}

await browser.close();
