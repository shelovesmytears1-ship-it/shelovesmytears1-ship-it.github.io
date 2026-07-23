/**
 * Deep bug audit of the portfolio directions against the dev server.
 * Per direction (studio / editorial / dark), checks home + work index + a case
 * page, at desktop (1440) and mobile (390), for:
 *   console errors, horizontal overflow, sub-44px tap targets, sub-12px text,
 *   broken/oversized images, multiple h1, and elements bleeding past the viewport.
 *
 * Run: node scripts/audit-directions.mjs [base=http://127.0.0.1:4321]
 */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://127.0.0.1:4321';

const DIRS = {
  studio:    '',
  editorial: '/editorial',
  dark:      '/dark',
};
const PAGES = (b) => ({
  home: `${BASE}${b}/`,
  work: `${BASE}${b}/work/`,
  case: `${BASE}${b}/work/denty/`,
});

const probe = () => {
  const vw = innerWidth;
  const vis = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // horizontal overflow offenders (ignore fixed cursor / decorative)
  const bleed = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (getComputedStyle(el).position === 'fixed') return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 2 && r.width > 40 && r.width < vw * 3) {
      bleed.push((el.tagName + '.' + (el.className || '').toString().trim().split(/\s+/)[0]).slice(0, 30));
    }
  });
  // tap targets
  const smallTaps = {};
  document.querySelectorAll('a,button,[role="button"],input,select').forEach((el) => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    if (r.height >= 44 && r.width > 120) return;
    if (r.height < 44 || r.width < 24) {
      const k = (el.tagName + '.' + (el.className || '').toString().trim().split(/\s+/)[0]).slice(0, 28);
      (smallTaps[k] = smallTaps[k] || { n: 0, min: [999, 999] }).n++;
      smallTaps[k].min = [Math.min(smallTaps[k].min[0], Math.round(r.width)), Math.min(smallTaps[k].min[1], Math.round(r.height))];
    }
  });
  // tiny text
  const tiny = {};
  document.querySelectorAll('*').forEach((el) => {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
    if (!vis(el)) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs && fs < 12) {
      const k = (el.className || el.tagName).toString().trim().split(/\s+/)[0].slice(0, 24);
      tiny[k] = Math.min(tiny[k] || 99, +fs.toFixed(1));
    }
  });
  // images
  const imgs = [...document.querySelectorAll('img')];
  const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).split('/').pop());
  const noDims = imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length;
  const oversized = imgs.filter((i) => {
    const r = i.getBoundingClientRect();
    return i.naturalWidth > r.width * devicePixelRatio * 2.2 && r.width > 40;
  }).map((i) => (i.currentSrc || i.src).split('/').pop() + ` ${i.naturalWidth}→${Math.round(i.getBoundingClientRect().width)}`);

  return {
    scrollW: document.documentElement.scrollWidth,
    overflowX: document.documentElement.scrollWidth > vw + 1,
    bleed: [...new Set(bleed)].slice(0, 5),
    h1: document.querySelectorAll('h1').length,
    smallTaps: Object.entries(smallTaps).sort((a, b) => b[1].n - a[1].n).slice(0, 4).map(([k, v]) => `${k} ${v.min[0]}x${v.min[1]}×${v.n}`),
    tinyText: Object.entries(tiny).sort((a, b) => a[1] - b[1]).slice(0, 4).map(([k, v]) => `${k}:${v}`),
    brokenImgs: broken.slice(0, 4),
    noDims,
    imgCount: imgs.length,
    oversized: oversized.slice(0, 3),
  };
};

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });
const report = {};

for (const [dir, base] of Object.entries(DIRS)) {
  report[dir] = {};
  for (const [name, url] of Object.entries(PAGES(base))) {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 100)); });
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 100)));
    const row = {};
    for (const [label, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      await page.setViewport({ width: w, height: h, deviceScaleFactor: label === 'mobile' ? 2 : 1, isMobile: label === 'mobile' });
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.evaluate(() => document.fonts?.ready);
        await new Promise((r) => setTimeout(r, 900));
        row[label] = await page.evaluate(probe);
      } catch (e) {
        row[label] = { err: String(e).slice(0, 60) };
      }
    }
    row.errors = [...new Set(errors)].slice(0, 3);
    report[dir][name] = row;
    await page.close();
  }
}
await browser.close();

// print
for (const [dir, pages] of Object.entries(report)) {
  console.log(`\n############ ${dir.toUpperCase()} ############`);
  for (const [name, row] of Object.entries(pages)) {
    console.log(`\n== ${name} ==`);
    if (row.errors?.length) console.log(`  CONSOLE ERR: ${row.errors.join(' | ')}`);
    for (const vp of ['desktop', 'mobile']) {
      const d = row[vp]; if (!d) continue;
      if (d.err) { console.log(`  ${vp}: LOAD ERR ${d.err}`); continue; }
      const flags = [];
      if (d.overflowX) flags.push(`OVERFLOW-X scrollW=${d.scrollW} [${d.bleed.join(',')}]`);
      if (d.h1 !== 1) flags.push(`h1=${d.h1}`);
      if (d.brokenImgs.length) flags.push(`BROKEN-IMG ${d.brokenImgs.join(',')}`);
      if (vp === 'mobile' && d.smallTaps.length) flags.push(`taps<44: ${d.smallTaps.join('; ')}`);
      if (vp === 'mobile' && d.tinyText.length) flags.push(`text<12: ${d.tinyText.join(',')}`);
      if (d.oversized.length) flags.push(`OVERSIZED ${d.oversized.join('; ')}`);
      console.log(`  ${vp}: ${flags.length ? flags.join('  |  ') : 'clean'} ${vp === 'desktop' && d.noDims ? `(imgNoDims=${d.noDims}/${d.imgCount})` : ''}`);
    }
  }
}
