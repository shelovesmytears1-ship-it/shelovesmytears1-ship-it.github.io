/**
 * Apply a RU->PL translation map to a site, longest strings first so a short
 * phrase can never eat part of a longer one it appears inside.
 *
 * Run: node scripts/translate-apply.mjs <siteDir> <mapFile.json> [--dry]
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const [siteArg, mapArg] = process.argv.slice(2);
const DRY = process.argv.includes('--dry');
if (!siteArg || !mapArg) {
  console.error('usage: node scripts/translate-apply.mjs <siteDir> <map.json> [--dry]');
  process.exit(1);
}

const map = JSON.parse(await fs.readFile(mapArg, 'utf8'));
const pairs = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

const files = [];
const walk = async (d) => {
  for (const e of await fs.readdir(d, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (/\.(html?|js|astro|ts|json|webmanifest)$/i.test(e.name)) files.push(p);
  }
};
await walk(siteArg);

const hits = new Map(pairs.map(([ru]) => [ru, 0]));
let touched = 0;

for (const f of files) {
  const raw = await fs.readFile(f, 'utf8');
  let next = raw;
  for (const [ru, pl] of pairs) {
    if (!next.includes(ru)) continue;
    hits.set(ru, hits.get(ru) + next.split(ru).length - 1);
    next = next.split(ru).join(pl);
  }
  // the document language must move with the copy — and so must og:locale,
  // which is easy to miss because nothing renders it
  next = next.replace(/(<html[^>]*\blang=")(ru|uk)(")/i, '$1pl$3');
  next = next.replace(/(property=["']og:locale["'][^>]*content=["'])(ru_RU|uk_UA)(["'])/gi, '$1pl_PL$3');
  if (next !== raw) { if (!DRY) await fs.writeFile(f, next); touched++; }
}

const unused = [...hits].filter(([, n]) => n === 0).map(([ru]) => ru);
const applied = [...hits].filter(([, n]) => n > 0).length;

console.log(`${siteArg}: ${applied}/${pairs.length} strings applied across ${touched} files${DRY ? ' [DRY]' : ''}`);
if (unused.length) {
  console.log(`\n  never matched (${unused.length}) — check for entity/spacing differences:`);
  unused.forEach((u) => console.log(`    · ${u.slice(0, 90)}`));
}

// anything Cyrillic still left behind?
let leftover = 0;
for (const f of files) {
  const raw = await fs.readFile(f, 'utf8');
  const m = raw.match(/[а-яёА-ЯЁ]{3,}/g);
  if (m) leftover += m.length;
}
console.log(`\n  Cyrillic runs still present: ${leftover}`);
