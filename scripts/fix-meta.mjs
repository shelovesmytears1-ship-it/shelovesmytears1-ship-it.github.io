/**
 * Add the missing head metadata: canonical, a generated SVG favicon, and an
 * OG image for the two sites that have no imagery at all.
 *
 * Favicons and OG cards are generated from each case's own accent/bg colours
 * so they match the site rather than looking bolted on.
 *
 * Run: node scripts/fix-meta.mjs [--dry]
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY = process.argv.includes('--dry');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITES = path.join(ROOT, '../sites');
const CASES = path.join(ROOT, 'src/content/cases');

const FOLDER = {
  archline: 'ARCHLINE', denty: 'Denty', dispersia: 'DISPERSIA', draft: 'Draft',
  dzherelo: 'Dzherelo', essence: 'Essence', freshclean: 'FreshClean',
  interspace: 'INTERSPACE', modulart: 'ModulArt', orlov: 'Orlov',
  prawnik: 'Prawnik', prezfull: 'Prezfull', smm: 'Vanguard',
  touche: 'Touche', wavemetrics: 'Wavemetrics',
};

const meta = new Map();
for (const f of (await fs.readdir(CASES)).filter((x) => x.endsWith('.md'))) {
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const g = (k) => raw.match(new RegExp(`^${k}:\\s*'?"?([^'"\n]+)'?"?\\s*$`, 'm'))?.[1]?.trim();
  meta.set(f.replace(/\.md$/, ''), {
    url: g('siteUrl'), title: g('title'), tagline: g('tagline'),
    accent: g('accent') || '#2b34ff', bg: g('bg') || '#0e0f13',
  });
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Wrap text to a character budget so long taglines don't overflow the card. */
const wrap = (s, n) => {
  const out = []; let line = '';
  for (const w of String(s).split(/\s+/)) {
    if ((line + ' ' + w).trim().length > n) { out.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) out.push(line.trim());
  return out;
};

let added = { canonical: 0, favicon: 0, og: 0 };

for (const [slug, m] of meta) {
  const dir = path.join(SITES, FOLDER[slug] || slug);
  const entry = path.join(dir, 'index.html');
  try { await fs.access(entry); } catch { continue; }

  let html = await fs.readFile(entry, 'utf8');
  const before = html;
  const inject = [];

  if (!/rel=["']canonical["']/i.test(html) && m.url) {
    inject.push(`  <link rel="canonical" href="${m.url}" />`);
    added.canonical++;
  }

  if (!/rel=["'][^"']*icon[^"']*["']/i.test(html)) {
    const letter = (m.title || slug)[0].toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${m.accent}"/>
  <text x="32" y="44" font-family="Helvetica,Arial,sans-serif" font-size="38"
        font-weight="700" text-anchor="middle" fill="#fff">${esc(letter)}</text>
</svg>`;
    if (!DRY) await fs.writeFile(path.join(dir, 'favicon.svg'), svg);
    inject.push(`  <link rel="icon" href="favicon.svg" type="image/svg+xml" />`);
    added.favicon++;
  }

  if (!/property=["']og:image["']/i.test(html) && m.url) {
    const title = esc(m.title || slug);
    const lines = wrap(m.tagline || '', 46).slice(0, 3);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${m.bg}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${m.accent}"/>
  <text x="80" y="250" font-family="Helvetica,Arial,sans-serif" font-size="86"
        font-weight="700" fill="#ffffff">${title}</text>
  ${lines.map((l, i) => `<text x="80" y="${330 + i * 46}" font-family="Helvetica,Arial,sans-serif"
        font-size="34" fill="#ffffff" opacity="0.72">${esc(l)}</text>`).join('\n  ')}
  <text x="80" y="560" font-family="Helvetica,Arial,sans-serif" font-size="26"
        fill="${m.accent}" letter-spacing="3">CONCEPT PROJECT</text>
</svg>`;
    if (!DRY) {
      await sharp(Buffer.from(svg)).png().toFile(path.join(dir, 'og-image.png'));
    }
    const abs = m.url.replace(/\/?$/, '/') + 'og-image.png';
    inject.push(`  <meta property="og:image" content="${abs}" />`);
    inject.push(`  <meta name="twitter:card" content="summary_large_image" />`);
    added.og++;
  }

  if (inject.length) {
    html = html.replace(/([ \t]*)<\/head>/i, `${inject.join('\n')}\n$1</head>`);
    if (html !== before && !DRY) await fs.writeFile(entry, html);
    console.log(`${slug.padEnd(12)} +${inject.length} tag(s)`);
  }
}

console.log(`\ncanonical +${added.canonical}, favicon +${added.favicon}, og:image +${added.og}${DRY ? '  [DRY]' : ''}`);
