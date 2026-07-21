/**
 * Add the captured phone shots to each case's frontmatter (idempotent).
 * Run after scripts/capture-mobile.mjs.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES = path.join(ROOT, 'src/content/cases');
const SHOTS = path.join(ROOT, 'public/screens');

const shots = new Set(await fs.readdir(SHOTS));
let patched = 0, skipped = 0;

for (const f of (await fs.readdir(CASES)).filter((x) => x.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  const file = path.join(CASES, f);
  let raw = await fs.readFile(file, 'utf8');

  if (/^screens:/m.test(raw)) { skipped++; continue; }

  const mine = [1, 2, 3]
    .map((n) => `${slug}-m${n}.webp`)
    .filter((n) => shots.has(n));
  if (!mine.length) { skipped++; continue; }

  const block =
    'screens:\n' +
    mine.map((n) => `  - src: /screens/${n}\n    kind: phone`).join('\n') + '\n';

  // insert right after the cover line so the media fields stay together
  const next = raw.replace(/^(cover:.*\n)/m, `$1${block}`);
  if (next === raw) { skipped++; continue; }

  await fs.writeFile(file, next);
  patched++;
  console.log(`patched ${slug} (${mine.length} shots)`);
}

console.log(`\npatched: ${patched}, skipped: ${skipped}`);
