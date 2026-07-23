/**
 * Build lightweight WebP delivery assets for the standalone LUNEA concept.
 * Source PNG files stay untouched and are excluded from the deployment repo.
 *
 * Run from portfolio-v3:
 *   node scripts/optimize-lunea-assets.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(here, '../../новый сайи/assets');
const maxEdge = 2000;
const quality = 80;

const files = (await fs.readdir(sourceDir))
  .filter((name) => /\.png$/i.test(name))
  .sort();

let before = 0;
let after = 0;

for (const name of files) {
  const input = path.join(sourceDir, name);
  const output = path.join(sourceDir, name.replace(/\.png$/i, '.webp'));
  const source = await fs.readFile(input);
  const metadata = await sharp(source).metadata();

  let pipeline = sharp(source, { failOn: 'none' });
  if (Math.max(metadata.width ?? 0, metadata.height ?? 0) > maxEdge) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const optimized = await pipeline
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer();

  await fs.writeFile(output, optimized);
  before += source.length;
  after += optimized.length;
  console.log(`${name.padEnd(28)} ${metadata.width}×${metadata.height}  ${(source.length / 1048576).toFixed(2)} → ${(optimized.length / 1048576).toFixed(2)} MB`);
}

console.log(`\nLUNEA: ${(before / 1048576).toFixed(1)} → ${(after / 1048576).toFixed(1)} MB (-${Math.round((1 - after / before) * 100)}%)`);
