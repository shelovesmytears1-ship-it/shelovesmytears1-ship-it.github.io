/**
 * Turn the browser QA captures into portfolio delivery assets.
 *
 * Run from portfolio-v3:
 *   node scripts/build-lunea-case-assets.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '..');
const shots = path.resolve(project, '../.analysis-shots');
const coverInput = path.join(shots, 'lunea-desktop.png');
const phonesInput = path.join(shots, 'lunea-phone-triptych.png');
const covers = path.join(project, 'public/covers');
const covers4k = path.join(covers, '4k');
const screens = path.join(project, 'public/screens');

await Promise.all([covers, covers4k, screens].map((dir) => fs.mkdir(dir, { recursive: true })));

await Promise.all([
  sharp(coverInput).resize(1920, 1200, { fit: 'contain', background: '#171412' }).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(covers, 'lunea.jpg')),
  sharp(coverInput).resize(1920, 1200, { fit: 'contain', background: '#171412' }).webp({ quality: 84, effort: 6 }).toFile(path.join(covers, 'lunea.webp')),
  sharp(coverInput).resize(3840, 2400, { fit: 'contain', background: '#171412' }).webp({ quality: 82, effort: 6 }).toFile(path.join(covers4k, 'lunea.webp')),
]);

const phoneLefts = [24, 438, 852];
await Promise.all(phoneLefts.map((left, index) =>
  sharp(phonesInput)
    .extract({ left, top: 0, width: 390, height: 844 })
    .webp({ quality: 86, effort: 6 })
    .toFile(path.join(screens, `lunea-m${index + 1}.webp`)),
));

console.log('Generated LUNEA cover (JPG/WebP/4K) and three 390×844 phone screens.');
