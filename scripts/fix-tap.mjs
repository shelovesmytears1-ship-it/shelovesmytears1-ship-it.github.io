/**
 * Add a scoped mobile accessibility layer to each site: 44px tap targets and a
 * 12px type floor, applied only below the mobile breakpoint so desktop layouts
 * are untouched.
 *
 * Selectors come from scripts/audit-tap.mjs. Range-slider tracks are excluded
 * on purpose — a 4px track is correct, the thumb is the target.
 *
 * Run: node scripts/fix-tap.mjs [--dry]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY = process.argv.includes('--dry');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITES = path.join(ROOT, '../sites');

const FOLDER = {
  archline: 'ARCHLINE', denty: 'Denty', dispersia: 'DISPERSIA', draft: 'Draft',
  dzherelo: 'Dzherelo', essence: 'Essence', freshclean: 'FreshClean',
  interspace: 'INTERSPACE', modulart: 'ModulArt', orlov: 'Orlov',
  prawnik: 'Prawnik', prezfull: 'Prezfull', smm: 'Vanguard',
  touche: 'Touche', wavemetrics: 'Wavemetrics',
};

/** tap: selectors needing a 44px box. type: selectors needing the 12px floor. */
const PLAN = {
  archline:   { tap: ['header a', 'footer a', 'nav a'], type: [] },
  denty:      { tap: ['footer a', 'header a'], type: ['.text-\\[10px\\]'] },
  dispersia:  { tap: ['header a', 'footer a', 'nav a', '.cd-close'], type: ['.label', '.f-col-title', '.f-concept', '.cd-title'] },
  draft:      { tap: ['header a', 'footer a', 'nav a', '.lang-btn'], type: ['.label', '.mono', '.lang-btn'] },
  dzherelo:   { tap: ['header a', 'footer a', 'nav a', '.mobile-nav-link', '.btn-secondary', '.cart-trigger', '.cart-drawer-close'], type: ['.cart-count', '.btn-secondary', '.footer-concept'] },
  essence:    { tap: ['.nav-link', '.footer-link', '.nav-logo', 'footer a'], type: ['.persona-label'] },
  freshclean: { tap: ['header a', 'footer a', 'nav a', '.nav-logo', '.nav-burger', '.footer-logo'], type: [] },
  interspace: { tap: ['.artist-social-link', '.testimonial-dot', '.testimonial-btn', '.lang-switch', '.hamburger', '.hero-cta', 'footer a'], type: ['.countdown-label', '.hero-subtitle', '.parallax-quote-author', '.timeline-year', '.exhibit-card-number', '.footer-copy', '.lang-switch', '.hero-date', '.section-label', '.nav-logo'] },
  modulart:   { tap: ['header a', 'footer a', 'nav a', '.nav-logo', '.nav-cta'], type: ['.problem-number', '.eyebrow', '.story-column-label', '.step-duration', '.marquee-item', 'h4'] },
  orlov:      { tap: ['header a', 'footer a', 'nav a', '.nav__logo'], type: ['.footer__concept', '.compare__tag', '.stack__label', '.plan__tag'] },
  prawnik:    { tap: ['header a', 'footer a', 'nav a', '.mobile-link'], type: [] },
  prezfull:   { tap: ['header a', 'footer a', 'nav a', '.filter-btn'], type: ['.filter-btn'] },
  smm:        { tap: ['header a', 'footer a', 'nav a'], type: [] },
  touche:     { tap: ['header a', 'footer a', 'nav a'], type: [] },
  wavemetrics:{ tap: ['header a', 'footer a', 'nav a'], type: ['.text-\\[10px\\]', '.text-\\[11px\\]', '.font-mono'] },
};

const block = (slug, p) => {
  const parts = [`/* ---------------------------------------------------------------
   Mobile accessibility layer — generated, safe to regenerate.
   WCAG 2.2 asks 24px minimum for tap targets; Apple and Material both
   settle on 44-48px, which is what this uses. Scoped to the mobile
   breakpoint so desktop typography and layout are untouched.
   Range-slider tracks are deliberately excluded: a thin track is correct.
   --------------------------------------------------------------- */
@media (max-width: 767px) {`];

  if (p.tap.length) {
    parts.push(`  ${p.tap.join(',\n  ')} {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }`);
  }
  if (p.type.length) {
    parts.push(`  ${p.type.map((s) => s + ', ' + s + ' *').join(',\n  ')} {
    font-size: 12px;
  }`);
  }
  parts.push(`}`);
  return parts.join('\n\n');
};

for (const [slug, plan] of Object.entries(PLAN)) {
  const dir = path.join(SITES, FOLDER[slug]);
  const css = block(slug, plan);
  const file = path.join(dir, 'mobile-a11y.css');

  const idx = path.join(dir, 'index.html');
  let html;
  try { html = await fs.readFile(idx, 'utf8'); } catch { console.log(`${slug}: no index.html`); continue; }

  if (!DRY) await fs.writeFile(file, css + '\n');

  if (!/mobile-a11y\.css/.test(html)) {
    const link = `  <link rel="stylesheet" href="mobile-a11y.css" />`;
    html = html.replace(/([ \t]*)<\/head>/i, `${link}\n$1</head>`);
    if (!DRY) await fs.writeFile(idx, html);
    console.log(`${slug.padEnd(12)} css written + linked  (tap ${plan.tap.length}, type ${plan.type.length})`);
  } else {
    console.log(`${slug.padEnd(12)} css refreshed        (tap ${plan.tap.length}, type ${plan.type.length})`);
  }
}
console.log(DRY ? '\n[DRY RUN]' : '\ndone');
