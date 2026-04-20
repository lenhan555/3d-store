// ─────────────────────────────────────────────────────
// File:    server/models/Product.js
// Agent:   @Backend_Engineer | Sprint: 2
// Purpose: All product DB queries. No raw SQL outside this file.
// ─────────────────────────────────────────────────────
'use strict';

const db = require('../config/db');

/**
 * Paginated product list for the catalog.
 * Returns each product with its primary image path.
 */
async function findAll({ page = 1, limit = 12, activeOnly = true } = {}) {
  const offset = (page - 1) * limit;
  const where  = activeOnly ? 'WHERE p.is_active = 1' : '';

  const [products] = await db.execute(
    `SELECT
       p.id, p.slug, p.name, p.material, p.color_options,
       p.price, p.stock_qty, p.is_active, p.sort_order, p.created_at,
       (SELECT pi.image_path
        FROM product_images pi
        WHERE pi.product_id = p.id AND pi.is_primary = 1
        LIMIT 1) AS primary_image
     FROM products p
     ${where}
     ORDER BY p.sort_order ASC, p.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) AS total FROM products p ${where}`
  );

  // Parse JSON color_options (stored as JSON column)
  const parsed = products.map((p) => ({
    ...p,
    color_options: p.color_options
      ? (typeof p.color_options === 'string'
          ? JSON.parse(p.color_options)
          : p.color_options)
      : null,
  }));

  return {
    products: parsed,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Single product by slug, with all images.
 * Returns null if not found or inactive.
 */
async function findBySlug(slug) {
  const [[product]] = await db.execute(
    'SELECT * FROM products WHERE slug = ? AND is_active = 1',
    [slug]
  );

  if (!product) return null;

  const [images] = await db.execute(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [product.id]
  );

  return {
    ...product,
    color_options: product.color_options
      ? (typeof product.color_options === 'string'
          ? JSON.parse(product.color_options)
          : product.color_options)
      : null,
    images,
  };
}

/**
 * Featured products for the homepage (top N by sort_order).
 */
async function findFeatured(limit = 4) {
  const [products] = await db.execute(
    `SELECT
       p.id, p.slug, p.name, p.material, p.price, p.stock_qty,
       p.color_options, p.sort_order,
       (SELECT pi.image_path
        FROM product_images pi
        WHERE pi.product_id = p.id AND pi.is_primary = 1
        LIMIT 1) AS primary_image
     FROM products p
     WHERE p.is_active = 1
     ORDER BY p.sort_order ASC, p.created_at DESC
     LIMIT ?`,
    [limit]
  );

  return products.map((p) => ({
    ...p,
    color_options: p.color_options
      ? (typeof p.color_options === 'string'
          ? JSON.parse(p.color_options)
          : p.color_options)
      : null,
  }));
}

module.exports = { findAll, findBySlug, findFeatured };
