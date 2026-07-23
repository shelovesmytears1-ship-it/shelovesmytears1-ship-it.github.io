/**
 * Collect comparative signals for each portfolio direction so they can be
 * scored on an objective checklist (Awwwards weights + Lighthouse categories).
 *
 * Run: node scripts/compare-directions.mjs
 */
import puppeteer from 'puppeteer';

const BASE = 'http://127.0.0.1:4321';
const DIRS = { studio: '', editorial: '/editorial', dark: '/dark', new: '/new' };

const collect = () => {
  const vis = (el) => {
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };
  // motion / creativity signals
  const animated = [...document.querySelectorAll('*')].filter((e) => {
    const s = getComputedStyle(e);
    return (s.animationName !== 'none' && s.animationName) || s.transitionDuration !== '0s';
  }).length;
  const canvas = document.querySelectorAll('canvas').length;
  const video = document.querySelectorAll('video').length;

  // accessibility
  const tapSmall = [...document.querySelectorAll('a,button,[role=button],input,select')]
    .filter((el) => { if (!vis(el)) return false; const r = el.getBoundingClientRect(); return (r.height < 44 || r.width < 24) && !(r.height >= 44 && r.width > 120); }).length;
  let tinyText = 0;
  document.querySelectorAll('*').forEach((el) => {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
    if (!vis(el)) return;
    if (parseFloat(getComputedStyle(el).fontSize) < 12) tinyText++;
  });
  const imgs = [...document.querySelectorAll('img')];
  const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).length;
  const noDims = imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length;
  const focusable = document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').length;

  // SEO / best-practices
  const meta = {
    title: (document.title || '').length,
    desc: (document.querySelector('meta[name=description]')?.content || '').length,
    canonical: !!document.querySelector('link[rel=canonical]'),
    ogImage: !!document.querySelector('meta[property="og:image"]'),
    ogTitle: !!document.querySelector('meta[property="og:title"]'),
    lang: document.documentElement.lang || '',
    h1: document.querySelectorAll('h1').length,
    viewport: !!document.querySelector('meta[name=viewport]'),
    jsonld: !!document.querySelector('script[type="application/ld+json"]'),
  };

  // content depth
  const bodyText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
  const words = bodyText ? bodyText.split(' ').length : 0;

  // type system
  const fonts = new Set();
  document.querySelectorAll('h1,h2,p,.eye,[class*=mono]').forEach((e) => {
    fonts.add(getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, ''));
  });

  // perf
  const res = performance.getEntriesByType('resource');
  const kb = Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024);
  const paints = performance.getEntriesByType('paint');
  const fcp = Math.round(paints.find((p) => p.name === 'first-contentful-paint')?.startTime || 0);

  return {
    animated, canvas, video,
    tapSmall, tinyText, noAlt, noDims, imgCount: imgs.length, focusable,
    meta, words, fonts: [...fonts].slice(0, 5),
    kb, requests: res.length, fcp, domNodes: document.querySelectorAll('*').length,
    accent: getComputedStyle(document.body).getPropertyValue('--accent').trim() || getComputedStyle(document.querySelector('.accent,em')||document.body).color,
    bg: getComputedStyle(document.body).backgroundColor,
    fg: getComputedStyle(document.body).color,
  };
};

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });
const out = {};
for (const [dir, base] of Object.entries(DIRS)) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 80)); });
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 80)));
  await page.setViewport({ width: 1440, height: 900 });
  try {
    await page.goto(`${BASE}${base}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(() => document.fonts?.ready);
    await new Promise((r) => setTimeout(r, 1200));
    out[dir] = await page.evaluate(collect);
    out[dir].errors = [...new Set(errors)].length;
  } catch (e) { out[dir] = { err: String(e).slice(0, 60) }; }
  await page.close();
}
await browser.close();

console.log(JSON.stringify(out, null, 1));
