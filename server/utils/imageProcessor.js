// ─────────────────────────────────────────────────────
// File:    server/utils/imageProcessor.js
// Agent:   @Backend_Engineer | Sprint: 4
// Purpose: Sharp WebP pipeline. Raw buffer → compressed WebP on disk.
//          Target: < 80KB per image. Resize to max 800×800 (aspect preserved).
// ─────────────────────────────────────────────────────
'use strict';

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const IMAGES_ROOT = path.join(__dirname, '../../public/images/products');

/**
 * Process a raw image buffer and save as WebP.
 * Returns the relative path: 'images/products/[slug]/[timestamp].webp'
 */
async function processAndSave(buffer, slug) {
  const productDir = path.join(IMAGES_ROOT, slug);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  const filename   = `${Date.now()}.webp`;
  const outputPath = path.join(productDir, filename);

  await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(outputPath);

  return `images/products/${slug}/${filename}`;
}

/**
 * Delete an image file from disk. Silent if file doesn't exist.
 */
function deleteFile(relativePath) {
  const fullPath = path.join(__dirname, '../../public', relativePath);
  try {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.warn('[imageProcessor] Could not delete file:', fullPath, err.message);
  }
}

module.exports = { processAndSave, deleteFile };
