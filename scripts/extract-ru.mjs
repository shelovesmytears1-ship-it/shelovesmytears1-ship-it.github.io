/**
 * Pull every Cyrillic-bearing string out of a site so nothing gets missed in
 * translation: visible text nodes, plus the attributes that surface to users
 * or crawlers (alt, title, placeholder, aria-label, meta content, og tags).
 *
 * Run: node scripts/extract-ru.mjs <siteDir>
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const site = process.argv[2];
if (!site) { console.error('usage: node scripts/extract-ru.mjs <siteDir>'); process.exit(1); }

const CYR = /[а-яёіїєґА-ЯЁІЇЄҐ]/;
const files = [];
const walk = async (d) => {
  for (const e of await fs.readdir(d, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (/\.(html?|js|astro|ts)$/i.test(e.name)) files.push(p);
  }
};
await walk(site);

const found = new Map(); // string -> {file, kind, count}
const add = (s, file, kind) => {
  const t = s.replace(/\s+/g, ' ').trim();
  if (!t || !CYR.test(t)) return;
  const k = t;
  if (!found.has(k)) found.set(k, { file: path.relative(site, file), kind, count: 0 });
  found.get(k).count++;
};

for (const f of files) {
  const raw = await fs.readFile(f, 'utf8');

  // strip script/style bodies before harvesting text nodes
  const stripped = raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (m) => m.replace(/[^\n]/g, ' '));

  // text nodes
  for (const m of stripped.matchAll(/>([^<>]+)</g)) add(m[1], f, 'text');
  // user-facing / crawler-facing attributes
  for (const m of raw.matchAll(/\b(alt|title|placeholder|aria-label|content|value|data-[\w-]+)\s*=\s*"([^"]*)"/gi)) add(m[2], f, m[1]);
  for (const m of raw.matchAll(/\b(alt|title|placeholder|aria-label|content|value)\s*=\s*'([^']*)'/gi)) add(m[2], f, m[1]);
  // string literals inside scripts (labels, messages)
  for (const m of raw.matchAll(/(['"`])((?:(?!\1)[^\\]|\\.)*)\1/g)) {
    if (CYR.test(m[2]) && m[2].length < 300) add(m[2], f, 'js-string');
  }
}

const rows = [...found.entries()].sort((a, b) => b[0].length - a[0].length);
console.log(`# ${site} — ${rows.length} unique strings\n`);
for (const [s, meta] of rows) {
  console.log(`[${meta.kind}${meta.count > 1 ? ' ×' + meta.count : ''}] ${s}`);
}
