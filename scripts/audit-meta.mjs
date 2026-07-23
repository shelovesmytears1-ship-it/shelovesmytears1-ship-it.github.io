/**
 * What's missing from each site's head: canonical, favicon, og:image, plus
 * images without alt. Reads local sources so it can be re-run after fixes.
 *
 * Run: node scripts/audit-meta.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITES = path.join(ROOT, '../sites');
const CASES = path.join(ROOT, 'src/content/cases');

// map folder -> live url from the case frontmatter
const urls = new Map();
for (const f of (await fs.readdir(CASES)).filter((x) => x.endsWith('.md'))) {
  const raw = await fs.readFile(path.join(CASES, f), 'utf8');
  const u = raw.match(/^siteUrl:\s*(\S+)\s*$/m)?.[1];
  if (u) urls.set(f.replace(/\.md$/, ''), u);
}

// folder names differ in case/spelling from the case slugs
const FOLDER = {
  archline: 'ARCHLINE', denty: 'Denty', dispersia: 'DISPERSIA', draft: 'Draft',
  dzherelo: 'Dzherelo', essence: 'Essence', freshclean: 'FreshClean',
  interspace: 'INTERSPACE', modulart: 'ModulArt', orlov: 'Orlov',
  prawnik: 'Prawnik', prezfull: 'Prezfull', smm: 'Vanguard',
  touche: 'Touche', wavemetrics: 'Wavemetrics',
};

const entryFor = async (dir) => {
  for (const c of ['index.html', 'dist/index.html', 'src/layouts/BaseLayout.astro']) {
    const p = path.join(dir, c);
    try { await fs.access(p); return p; } catch { /* next */ }
  }
  return null;
};

const rows = [];
for (const [slug, url] of urls) {
  const dir = path.join(SITES, FOLDER[slug] || slug);
  const entry = await entryFor(dir);
  if (!entry) { rows.push({ slug, err: 'no entry file' }); continue; }
  const html = await fs.readFile(entry, 'utf8');

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  rows.push({
    slug,
    entry: path.relative(SITES, entry),
    url,
    canonical: /rel=["']canonical["']/i.test(html),
    favicon: /rel=["'][^"']*icon[^"']*["']/i.test(html),
    ogImage: /property=["']og:image["']/i.test(html),
    ogTitle: /property=["']og:title["']/i.test(html),
    noAlt: imgs.filter((m) => !/\balt\s*=/i.test(m[0])).length,
    imgs: imgs.length,
  });
}

const miss = (b) => (b ? '  ok ' : ' MISS');
console.log('slug         canonical favicon og:img  imgs(noAlt)  entry');
for (const r of rows) {
  if (r.err) { console.log(`${r.slug.padEnd(12)} ${r.err}`); continue; }
  console.log(
    `${r.slug.padEnd(12)} ${miss(r.canonical)}     ${miss(r.favicon)}   ${miss(r.ogImage)}   ` +
    `${String(r.imgs).padStart(2)}(${r.noAlt})       ${r.entry}`
  );
}
const need = (k) => rows.filter((r) => !r.err && !r[k]).map((r) => r.slug);
console.log(`\ncanonical missing (${need('canonical').length}): ${need('canonical').join(', ')}`);
console.log(`favicon missing   (${need('favicon').length}): ${need('favicon').join(', ')}`);
console.log(`og:image missing  (${need('ogImage').length}): ${need('ogImage').join(', ')}`);
console.log(`images w/o alt    : ${rows.filter((r) => r.noAlt).map((r) => r.slug + ':' + r.noAlt).join(', ') || 'none'}`);
