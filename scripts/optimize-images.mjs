#!/usr/bin/env node
/**
 * Generates resized WebP assets for public/img (quality/size aligned with typical Squoosh WebP presets).
 * Run: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const imgRoot = path.join(publicDir, 'img');

function maxWidthFor(absPath) {
  const rel = absPath.split(path.sep).join('/');
  if (rel.includes('/food/')) return 720;
  if (/\/menu\.jpe?g$/i.test(rel)) return 1000;
  if (/\/project\d+-\d+\.jpe?g$/i.test(rel)) return 1280;
  return 1200;
}

async function toWebp(srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;
  const destPath = srcPath.replace(/\.(png|jpe?g)$/i, '.webp');
  const maxW = maxWidthFor(srcPath);
  const meta = await sharp(srcPath).metadata();
  let pipeline = sharp(srcPath).rotate();
  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true, fit: 'inside' });
  }
  await pipeline.webp({ quality: 82, effort: 5, smartSubsample: true }).toFile(destPath);
  console.log('webp:', path.relative(publicDir, destPath));
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else await toWebp(full);
  }
}

await walk(imgRoot);
console.log('Done.');
