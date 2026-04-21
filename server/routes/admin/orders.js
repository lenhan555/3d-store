// ─────────────────────────────────────────────────────
// File:    server/routes/admin/orders.js
// Agent:   @Backend_Engineer | Sprint: 4
// Mounted: app.use('/api/admin/orders', requireAuth, require('./routes/admin/orders'))
// ─────────────────────────────────────────────────────
'use strict';

const express = require('express');
const db      = require('../../config/db');

const router = express.Router();

const VALID_ORDER_STATUSES   = ['pending','confirmed','printing','shipped','delivered','cancelled'];
const VALID_PAYMENT_STATUSES = ['pending','paid','failed','refunded'];

// ── GET /api/admin/orders ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const status = req.query.status; // optional filter

    const where  = status ? 'WHERE order_status = ?' : '';
    const params = status ? [status, limit, offset] : [limit, offset];

    const [orders] = await db.execute(
      `SELECT id, order_number, customer_name, customer_email,
              total_amount, payment_method, payment_status, order_status,
              created_at
       FROM orders
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = status ? [status] : [];
    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders ${where}`,
      countParams
    );

    res.json({ orders, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/admin/orders]', err.message);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// ── GET /api/admin/orders/:id — order detail with items ────────
router.get('/:id', async (req, res) => {
  try {
    const [[order]] = await db.execute(
      'SELECT * FROM orders WHERE id = ?', [req.params.id]
    );
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const [items] = await db.execute(
      'SELECT * FROM order_items WHERE order_id = ?', [order.id]
    );

    res.json({ order: { ...order, items } });
  } catch (err) {
    console.error('[GET /api/admin/orders/:id]', err.message);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

// ── PUT /api/admin/orders/:id/status — update order or payment status ─
router.put('/:id/status', async (req, res) => {
  const { order_status, payment_status } = req.body;

  if (order_status && !VALID_ORDER_STATUSES.includes(order_status))
    return res.status(400).json({ error: 'Invalid order status.' });

  if (payment_status && !VALID_PAYMENT_STATUSES.includes(payment_status))
    return res.status(400).json({ error: 'Invalid payment status.' });

  if (!order_status && !payment_status)
    return res.status(400).json({ error: 'No status provided.' });

  try {
    const updates = [];
    const values  = [];

    if (order_status)   { updates.push('order_status = ?');   values.push(order_status); }
    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
      if (payment_status === 'paid') updates.push('paid_at = NOW()');
    }

    values.push(req.params.id);

    await db.execute(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/admin/orders/:id/status]', err.message);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// ── GET /api/admin/stats — dashboard quick stats ───────────────
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [[{ total_orders }]]   = await db.execute('SELECT COUNT(*) AS total_orders FROM orders');
    const [[{ pending_orders }]] = await db.execute(
      "SELECT COUNT(*) AS pending_orders FROM orders WHERE order_status = 'pending'"
    );
    const [[{ total_products }]] = await db.execute(
      'SELECT COUNT(*) AS total_products FROM products WHERE is_active = 1'
    );
    const [[{ low_stock }]]      = await db.execute(
      'SELECT COUNT(*) AS low_stock FROM products WHERE is_active = 1 AND stock_qty <= 3'
    );
    const [[{ revenue_total }]]  = await db.execute(
      "SELECT COALESCE(SUM(total_amount),0) AS revenue_total FROM orders WHERE payment_status = 'paid'"
    );

    res.json({ total_orders, pending_orders, total_products, low_stock, revenue_total });
  } catch (err) {
    console.error('[GET /api/admin/stats]', err.message);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
