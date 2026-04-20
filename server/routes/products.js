// ─────────────────────────────────────────────────────
// File:    server/routes/products.js
// Agent:   @Backend_Engineer | Sprint: 2
// Mounted: app.use('/api/products', require('./routes/products'))
// Note:    /featured MUST be registered before /:slug
// ─────────────────────────────────────────────────────
'use strict';

const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products?page=1&limit=12
router.get('/', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit) || 12));
    const result = await Product.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    console.error('[GET /api/products]', err.message);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/featured  ← must be before /:slug
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findFeatured(4);
    res.json({ products });
  } catch (err) {
    console.error('[GET /api/products/featured]', err.message);
    res.status(500).json({ error: 'Failed to fetch featured products.' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    // Basic slug validation — only alphanumeric and hyphens
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Invalid product slug.' });
    }
    const product = await Product.findBySlug(slug);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    console.error('[GET /api/products/:slug]', err.message);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

module.exports = router;
