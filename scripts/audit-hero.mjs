/**
 * Focused hero re-check. The broad audit picked up menu overlays and loaders
 * (they sit at top:0 with full height), so this one skips anything that looks
 * like chrome and reports the real first content section.
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const audit = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/_audit.json'), 'utf8'));

const browser = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'] });
const out = [];

for (const t of audit) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  try {
    await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.evaluate(() => document.fonts?.ready);
    await new Promise((r) => setTimeout(r, 1000));

    out.push({ slug: t.slug, ...(await page.evaluate(() => {
      const SKIP = /menu|loader|overlay|drawer|modal|cursor|nav|preload|cookie|toast/i;
      const el = [...document.querySelectorAll('body section, body header, main section, main header, body > div')]
        .find((e) => {
          if (SKIP.test((e.className || '').toString() + e.id)) return false;
          const s = getComputedStyle(e);
          if (s.position === 'fixed' || s.display === 'none' || s.visibility === 'hidden') return false;
          const r = e.getBoundingClientRect();
          return r.top < 200 && r.height > 400 && r.width > innerWidth * 0.7;
        });
      if (!el) return { found: false };

      // any painted layer anywhere inside the hero
      const layers = [el, ...el.querySelectorAll('*')].slice(0, 200).map((e) => {
        const s = getComputedStyle(e);
        return { img: s.backgroundImage, col: s.backgroundColor, op: s.opacity };
      });
      const gradients = layers.filter((l) => /gradient/.test(l.img)).length;
      const urls = layers.filter((l) => /url\(/.test(l.img)).length;

      return {
        found: true,
        tag: el.tagName + '.' + (el.className || '').toString().split(' ').slice(0, 2).join('.').slice(0, 30),
        h: Math.round(el.getBoundingClientRect().height),
        bgColor: getComputedStyle(el).backgroundColor,
        ownBgImage: getComputedStyle(el).backgroundImage.slice(0, 50),
        gradientLayers: gradients,
        imageLayers: urls,
        media: {
          canvas: el.querySelectorAll('canvas').length,
          video: el.querySelectorAll('video').length,
          svg: el.querySelectorAll('svg').length,
          img: el.querySelectorAll('img,picture').length,
        },
        animatedEls: [...el.querySelectorAll('*')].slice(0, 200)
          .filter((e) => getComputedStyle(e).animationName !== 'none').length,
        // flat = one solid colour, nothing painted, nothing moving
        flat: gradients === 0 && urls === 0 &&
              el.querySelectorAll('canvas,video,svg,img,picture').length === 0,
      };
    })) });
  } catch (e) {
    out.push({ slug: t.slug, err: String(e).slice(0, 100) });
  }
  await page.close();
}

await browser.close();
await fs.writeFile(path.join(ROOT, 'scripts/_audit-hero.json'), JSON.stringify(out, null, 2));
for (const o of out) {
  console.log(`${o.slug.padEnd(12)} ${String(o.tag || o.err).padEnd(32)} h=${String(o.h).padEnd(5)} grad=${o.gradientLayers} img=${o.imageLayers} media=${JSON.stringify(o.media)} anim=${o.animatedEls} FLAT=${o.flat}`);
}
