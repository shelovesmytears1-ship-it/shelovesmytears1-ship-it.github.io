/**
 * Convert every raster image in the concept sites to WebP, cap the long edge,
 * and rewrite the references in html/css/js so nothing 404s.
 *
 * Photos were saved as PNG (and in places PNG data under a .jpg name), which is
 * why some sites shipped 20MB+. Originals are recoverable from each repo's
 * baseline commit.
 *
 * Run:  node scripts/optimize-site-images.mjs [--dry]
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY = process.argv.includes('--dry');
const SITES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../sites');
const MAX_EDGE = 2000;
const QUALITY = 80;
const RASTER = /\.(png|jpe?g)$/i;
const TEXTUAL = /\.(html?|css|js|mjs|json|md|xml|txt|webmanifest)$/i;

const walk = async (dir, out = []) => {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
};

const sites = (await fs.readdir(SITES, { withFileTypes: true }))
  .filter((d) => d.isDirectory()).map((d) => d.name);

let grandBefore = 0, grandAfter = 0;
const report = [];

for (const site of sites) {
  const root = path.join(SITES, site);
  const files = await walk(root);
  const images = files.filter((f) => RASTER.test(f));
  if (!images.length) { report.push({ site, images: 0 }); continue; }

  let before = 0, after = 0, converted = 0, failed = 0;
  const renames = new Map(); // old basename -> new basename

  for (const img of images) {
    try {
      const stat = await fs.stat(img);
      const target = img.replace(RASTER, '.webp');
      const meta = await sharp(img).metadata();

      let pipe = sharp(img, { failOn: 'none' });
      if (Math.max(meta.width || 0, meta.height || 0) > MAX_EDGE) {
        pipe = pipe.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
      }
      const buf = await pipe.webp({ quality: QUALITY, effort: 5 }).toBuffer();

      // only take the swap if it actually helps
      if (buf.length >= stat.size * 0.95) { before += stat.size; after += stat.size; continue; }

      if (!DRY) {
        await fs.writeFile(target, buf);
        if (target !== img) await fs.rm(img);
      }
      renames.set(path.basename(img), path.basename(target));
      before += stat.size; after += buf.length; converted++;
    } catch {
      failed++;
    }
  }

  // rewrite references
  let touched = 0;
  if (!DRY && renames.size) {
    for (const f of files.filter((x) => TEXTUAL.test(x))) {
      let raw;
      try { raw = await fs.readFile(f, 'utf8'); } catch { continue; }
      let next = raw;
      for (const [oldName, newName] of renames) {
        if (oldName === newName) continue;
        // basename match keeps any directory prefix intact
        next = next.split(oldName).join(newName);
      }
      if (next !== raw) { await fs.writeFile(f, next); touched++; }
    }
  }

  grandBefore += before; grandAfter += after;
  report.push({ site, images: images.length, converted, failed, touched,
    beforeMB: +(before / 1048576).toFixed(1), afterMB: +(after / 1048576).toFixed(1),
    saved: before ? Math.round((1 - after / before) * 100) : 0 });

  console.log(`${site.padEnd(12)} ${String(converted).padStart(3)}/${String(images.length).padEnd(3)} imgs  ` +
    `${(before / 1048576).toFixed(1).padStart(7)} -> ${(after / 1048576).toFixed(1).padStart(6)} MB  ` +
    `(-${report.at(-1).saved}%)  refs in ${touched} files`);
}

console.log(`\nTOTAL  ${(grandBefore / 1048576).toFixed(1)} MB -> ${(grandAfter / 1048576).toFixed(1)} MB  ` +
  `(-${Math.round((1 - grandAfter / grandBefore) * 100)}%)${DRY ? '  [DRY RUN]' : ''}`);
