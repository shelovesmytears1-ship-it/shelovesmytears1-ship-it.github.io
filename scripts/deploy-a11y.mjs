/**
 * Copy the accessibility floor script into every site and reference it.
 * DISPERSIA is an Astro project, so it goes in public/ and into the layout.
 *
 * Run: node scripts/deploy-a11y.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITES = path.join(ROOT, '../sites');
const SRC = path.join(ROOT, 'scripts/assets/a11y-floor.js');
const js = await fs.readFile(SRC, 'utf8');

const FOLDERS = ['ARCHLINE', 'Denty', 'Draft', 'Dzherelo', 'Essence', 'FreshClean',
  'INTERSPACE', 'ModulArt', 'Orlov', 'Prawnik', 'Prezfull', 'Touche', 'Vanguard', 'Wavemetrics'];

for (const f of FOLDERS) {
  const dir = path.join(SITES, f);
  const idx = path.join(dir, 'index.html');
  let html;
  try { html = await fs.readFile(idx, 'utf8'); } catch { console.log(`${f}: no index.html`); continue; }

  await fs.writeFile(path.join(dir, 'a11y-floor.js'), js);

  if (!/a11y-floor\.js/.test(html)) {
    html = html.replace(/([ \t]*)<\/body>/i, `  <script src="a11y-floor.js" defer></script>\n$1</body>`);
    await fs.writeFile(idx, html);
    console.log(`${f.padEnd(12)} linked`);
  } else {
    console.log(`${f.padEnd(12)} refreshed`);
  }
}

// DISPERSIA — Astro: public asset + layout reference, then it needs a rebuild
const dsp = path.join(SITES, 'DISPERSIA');
await fs.writeFile(path.join(dsp, 'public/a11y-floor.js'), js);
const layout = path.join(dsp, 'src/layouts/BaseLayout.astro');
let l = await fs.readFile(layout, 'utf8');
if (!/a11y-floor\.js/.test(l)) {
  l = l.replace(/([ \t]*)<\/body>/i, `  <script is:inline src={assetPath('/a11y-floor.js')} defer></script>\n$1</body>`);
  await fs.writeFile(layout, l);
  console.log('DISPERSIA    layout updated — rebuild required');
} else {
  console.log('DISPERSIA    already referenced — rebuild required');
}
