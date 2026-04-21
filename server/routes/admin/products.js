// ─────────────────────────────────────────────────────
// File:    server/routes/admin/products.js
// Agent:   @Backend_Engineer | Sprint: 4
// Mounted: app.use('/api/admin/products', requireAuth, require('./routes/admin/products'))
// ─────────────────────────────────────────────────────
'use strict';

const express         = require('express');
const db              = require('../../config/db');
const upload          = require('../../middleware/upload');
const { processAndSave, deleteFile } = require('../../utils/imageProcessor');

const router = express.Router();

// Helper: generate slug from name
function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── GET /api/admin/products — all products incl. inactive ──────
router.get('/', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const [products] = await db.execute(
      `SELECT p.*,
         (SELECT pi.image_path FROM product_images pi
          WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image,
         (SELECT COUNT(*) FROM product_images pi WHERE pi.product_id = p.id) AS image_count
       FROM products p
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) AS total FROM products'
    );

    res.json({ products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/admin/products]', err.message);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// ── GET /api/admin/products/:id ────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [[product]] = await db.execute(
      'SELECT * FROM products WHERE id = ?', [req.params.id]
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const [images] = await db.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
      [product.id]
    );

    res.json({ product: { ...product, images } });
  } catch (err) {
    console.error('[GET /api/admin/products/:id]', err.message);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// ── POST /api/admin/products — create ─────────────────────────
router.post('/', async (req, res) => {
  const {
    name, description, material, color_options,
    price, stock_qty, print_time_hours,
    width_mm, height_mm, depth_mm, weight_grams,
    sort_order, is_active,
  } = req.body;

  if (!name?.trim())  return res.status(400).json({ error: 'Name is required.' });
  if (!price)         return res.status(400).json({ error: 'Price is required.' });

  const slug = toSlug(name);

  try {
    // Check slug uniqueness
    const [[existing]] = await db.execute(
      'SELECT id FROM products WHERE slug = ?', [slug]
    );
    if (existing) return res.status(400).json({ error: 'A product with this name already exists.' });

    const [result] = await db.execute(
      `INSERT INTO products
         (slug, name, description, material, color_options, price, stock_qty,
          print_time_hours, width_mm, height_mm, depth_mm, weight_grams,
          sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        name.trim(),
        description?.trim() || null,
        material?.trim() || 'PLA Matte',
        color_options ? JSON.stringify(color_options) : null,
        parseInt(price, 10),
        parseInt(stock_qty, 10) || 0,
        print_time_hours ? parseFloat(print_time_hours) : null,
        width_mm  ? parseInt(width_mm,  10) : null,
        height_mm ? parseInt(height_mm, 10) : null,
        depth_mm  ? parseInt(depth_mm,  10) : null,
        weight_grams ? parseInt(weight_grams, 10) : null,
        parseInt(sort_order, 10) || 0,
        is_active === false ? 0 : 1,
      ]
    );

    res.status(201).json({ success: true, productId: result.insertId, slug });
  } catch (err) {
    console.error('[POST /api/admin/products]', err.message);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// ── PUT /api/admin/products/:id — update ──────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, description, material, color_options,
    price, stock_qty, print_time_hours,
    width_mm, height_mm, depth_mm, weight_grams,
    sort_order, is_active,
  } = req.body;

  try {
    await db.execute(
      `UPDATE products SET
         name = ?, description = ?, material = ?, color_options = ?,
         price = ?, stock_qty = ?, print_time_hours = ?,
         width_mm = ?, height_mm = ?, depth_mm = ?, weight_grams = ?,
         sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        name?.trim(),
        description?.trim() || null,
        material?.trim() || 'PLA Matte',
        color_options ? JSON.stringify(color_options) : null,
        parseInt(price, 10),
        parseInt(stock_qty, 10) || 0,
        print_time_hours ? parseFloat(print_time_hours) : null,
        width_mm  ? parseInt(width_mm,  10) : null,
        height_mm ? parseInt(height_mm, 10) : null,
        depth_mm  ? parseInt(depth_mm,  10) : null,
        weight_grams ? parseInt(weight_grams, 10) : null,
        parseInt(sort_order, 10) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/admin/products/:id]', err.message);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// ── DELETE /api/admin/products/:id — deactivate (soft delete) ─
router.delete('/:id', async (req, res) => {
  try {
    await db.execute(
      'UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/products/:id]', err.message);
    res.status(500).json({ error: 'Failed to deactivate product.' });
  }
});

// ── POST /api/admin/products/:id/images — upload image ────────
router.post('/:id/images', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided.' });

  try {
    const [[product]] = await db.execute(
      'SELECT id, slug FROM products WHERE id = ?', [req.params.id]
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const imagePath = await processAndSave(req.file.buffer, product.slug);

    // First image is primary automatically
    const [[{ count }]] = await db.execute(
      'SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?', [product.id]
    );
    const isPrimary = count === 0 ? 1 : 0;

    const [result] = await db.execute(
      'INSERT INTO product_images (product_id, image_path, is_primary) VALUES (?, ?, ?)',
      [product.id, imagePath, isPrimary]
    );

    res.status(201).json({
      success: true,
      image: { id: result.insertId, image_path: imagePath, is_primary: isPrimary === 1 },
    });
  } catch (err) {
    console.error('[POST /api/admin/products/:id/images]', err.message);
    res.status(500).json({ error: 'Image upload failed.' });
  }
});

// ── DELETE /api/admin/products/:id/images/:imageId ─────────────
router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    const [[img]] = await db.execute(
      'SELECT * FROM product_images WHERE id = ? AND product_id = ?',
      [req.params.imageId, req.params.id]
    );
    if (!img) return res.status(404).json({ error: 'Image not found.' });

    deleteFile(img.image_path);
    await db.execute('DELETE FROM product_images WHERE id = ?', [img.id]);

    // If deleted was primary, promote the next image
    if (img.is_primary) {
      await db.execute(
        `UPDATE product_images SET is_primary = 1
         WHERE product_id = ? ORDER BY id ASC LIMIT 1`,
        [req.params.id]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/products/:id/images/:imageId]', err.message);
    res.status(500).json({ error: 'Failed to delete image.' });
  }
});

// ── PUT /api/admin/products/:id/images/:imageId/primary ────────
router.put('/:id/images/:imageId/primary', async (req, res) => {
  const { id, imageId } = req.params;
  try {
    await db.execute(
      'UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [id]
    );
    await db.execute(
      'UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?',
      [imageId, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('[PUT primary]', err.message);
    res.status(500).json({ error: 'Failed to update primary image.' });
  }
});

module.exports = router;
