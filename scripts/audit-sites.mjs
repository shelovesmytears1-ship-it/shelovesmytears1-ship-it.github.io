/**
 * Audit every concept site listed in the case frontmatter.
 * Collects language, hero treatment, SEO, a11y and mobile-breakage signals
 * so the portfolio report is based on measurements, not impressions.
 *
 * Run:  node scripts/audit-sites.mjs
 * Out:  scripts/_audit.json
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES = path.join(ROOT, 'src/content/cases');

const files = (await fs.readdir(CASES)).filter((f) => f.endsWith('.md'));
const targets = [];
for (const f of files) {
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const url = raw.match(/^siteUrl:\s*(\S+)\s*$/m)?.[1];
  const title = raw.match(/^title:\s*(.+)$/m)?.[1]?.trim();
  const niche = raw.match(/^niche:\s*(.+)$/m)?.[1]?.trim();
  if (url) targets.push({ slug: f.replace(/\.md$/, ''), url, title, niche });
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });
const results = [];

for (const t of targets) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)));

  const rec = { ...t };
  try {
    /* ---------- desktop pass ---------- */
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.evaluate(() => document.fonts?.ready);
    await new Promise((r) => setTimeout(r, 900));

    Object.assign(rec, await page.evaluate(() => {
      const txt = document.body.innerText || '';
      const cyr = (txt.match(/[а-яёА-ЯЁ]/g) || []).length;
      const lat = (txt.match(/[a-zA-Z]/g) || []).length;
      const plDiacritics = (txt.match(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g) || []).length;
      const uaOnly = (txt.match(/[іїєґІЇЄҐ]/g) || []).length;

      // hero = first section-ish block occupying the top of the page
      const cands = [...document.querySelectorAll('header,section,div')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.top < 120 && r.height > innerHeight * 0.45 && r.width > innerWidth * 0.8;
        });
      const hero = cands[0] || document.body;
      const hs = getComputedStyle(hero);
      const heroHasMedia = !!hero.querySelector('canvas,video,svg,img,picture');
      const bgImg = hs.backgroundImage;
      // walk up/down for any painted background
      let paintedBg = bgImg;
      if (paintedBg === 'none') {
        const inner = [...hero.querySelectorAll('*')].slice(0, 60)
          .map((e) => getComputedStyle(e).backgroundImage).find((v) => v !== 'none');
        if (inner) paintedBg = inner;
      }

      const h1 = document.querySelector('h1');
      const imgs = [...document.querySelectorAll('img')];

      return {
        htmlLang: document.documentElement.lang || '(none)',
        cyr, lat, plDiacritics, uaOnly,
        langGuess: cyr > lat * 0.3 ? (uaOnly > 3 ? 'ua' : 'ru') : (plDiacritics > 3 ? 'pl' : 'en/other'),
        title: (document.title || '').slice(0, 70),
        titleLen: (document.title || '').length,
        desc: (document.querySelector('meta[name=description]')?.content || '').slice(0, 60),
        descLen: (document.querySelector('meta[name=description]')?.content || '').length,
        ogImage: !!document.querySelector('meta[property="og:image"]'),
        ogTitle: !!document.querySelector('meta[property="og:title"]'),
        viewportMeta: !!document.querySelector('meta[name=viewport]'),
        favicon: !!document.querySelector('link[rel*=icon]'),
        canonical: !!document.querySelector('link[rel=canonical]'),
        h1Count: document.querySelectorAll('h1').length,
        h1Text: (h1?.textContent || '').trim().slice(0, 60),
        h1Px: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : null,
        sections: document.querySelectorAll('section').length,
        hero: {
          tag: hero.tagName + '.' + (hero.className || '').toString().split(' ')[0].slice(0, 22),
          h: Math.round(hero.getBoundingClientRect().height),
          bgColor: hs.backgroundColor,
          bgImage: paintedBg === 'none' ? 'none' : paintedBg.slice(0, 60),
          hasMedia: heroHasMedia,
          flat: paintedBg === 'none' && !heroHasMedia,
        },
        imgs: {
          total: imgs.length,
          noAlt: imgs.filter((i) => !i.hasAttribute('alt') || !i.alt.trim()).length,
          lazy: imgs.filter((i) => i.loading === 'lazy').length,
          noDims: imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
        },
        domNodes: document.querySelectorAll('*').length,
        transferKB: Math.round(
          performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) / 1024
        ),
        requests: performance.getEntriesByType('resource').length,
      };
    }));

    /* ---------- mobile pass ---------- */
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 900));

    rec.mobile = await page.evaluate(() => {
      const vw = innerWidth;
      const small = [];
      document.querySelectorAll('a,button,input,select,textarea').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        if (getComputedStyle(el).visibility === 'hidden') return;
        if (r.height < 44 || r.width < 44) {
          small.push(((el.textContent || '').trim().slice(0, 16) || el.tagName) +
            ` ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      });
      const tiny = new Set();
      document.querySelectorAll('p,li,span,a,div,h1,h2,h3,h4,label').forEach((el) => {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 12) tiny.add(`${(el.className || el.tagName).toString().split(' ')[0].slice(0, 18)}:${fs.toFixed(1)}`);
      });
      // elements poking past the right edge
      const bleed = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (getComputedStyle(el).position === 'fixed') return;
        if (r.right > vw + 2 && r.width > 40) {
          bleed.push((el.tagName + '.' + (el.className || '').toString().split(' ')[0]).slice(0, 26));
        }
      });
      return {
        docScrollW: document.documentElement.scrollWidth,
        overflowX: document.documentElement.scrollWidth > vw + 1,
        smallTargets: small.length,
        smallSample: small.slice(0, 5),
        tinyText: [...tiny].slice(0, 6),
        bleed: [...new Set(bleed)].slice(0, 5),
        pageH: document.body.scrollHeight,
      };
    });

    rec.consoleErrors = errors.slice(0, 4);
    rec.ok = true;
    console.log(`OK  ${t.slug.padEnd(12)} lang=${rec.htmlLang.padEnd(6)} guess=${rec.langGuess.padEnd(9)} heroFlat=${rec.hero.flat} small=${rec.mobile.smallTargets} overflowX=${rec.mobile.overflowX}`);
  } catch (e) {
    rec.ok = false;
    rec.err = String(e).slice(0, 140);
    console.log(`ERR ${t.slug}  ${rec.err}`);
  }
  results.push(rec);
  await page.close();
}

await browser.close();
await fs.writeFile(path.join(ROOT, 'scripts/_audit.json'), JSON.stringify(results, null, 2));
console.log(`\ndone: ${results.filter((r) => r.ok).length}/${results.length}`);
