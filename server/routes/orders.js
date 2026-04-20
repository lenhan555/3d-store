// ─────────────────────────────────────────────────────
// File:    server/routes/orders.js
// Agent:   @Backend_Engineer | Sprint: 3
// Mounted: app.use('/api/orders', require('./routes/orders'))
// ─────────────────────────────────────────────────────
'use strict';

const express  = require('express');
const Order    = require('../models/Order');
const Settings = require('../models/Settings');

const router = express.Router();

// POST /api/orders — create a new order
router.post('/', async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    payment_method,
    notes,
    items,
  } = req.body;

  // ── Validate ──────────────────────────────────────
  if (!customer_name?.trim())
    return res.status(400).json({ error: 'Full name is required.' });

  if (!customer_email?.trim())
    return res.status(400).json({ error: 'Email is required.' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email))
    return res.status(400).json({ error: 'Please enter a valid email.' });

  if (!shipping_address?.trim())
    return res.status(400).json({ error: 'Shipping address is required.' });

  if (!['bank_transfer', 'vnpay', 'momo'].includes(payment_method))
    return res.status(400).json({ error: 'Invalid payment method.' });

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Your cart is empty.' });

  for (const item of items) {
    if (!Number.isInteger(item.productId) || item.productId < 1)
      return res.status(400).json({ error: 'Invalid product in cart.' });
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)
      return res.status(400).json({ error: 'Invalid quantity.' });
  }

  try {
    const result = await Order.createOrder({
      customer_name:    customer_name.trim(),
      customer_email:   customer_email.trim().toLowerCase(),
      customer_phone:   customer_phone?.trim() || null,
      shipping_address: shipping_address.trim(),
      payment_method,
      notes:            notes?.trim() || null,
      items,
    });

    // Include bank details in response when payment is bank transfer
    let bankDetails = null;
    if (payment_method === 'bank_transfer') {
      const s = await Settings.get([
        'bank_name', 'bank_account_no', 'bank_account_name',
      ]);
      bankDetails = {
        bank_name:    s.bank_name    || '',
        account_no:   s.bank_account_no  || '',
        account_name: s.bank_account_name || '',
        amount:       result.total_amount,
        reference:    result.orderNumber,
      };
    }

    return res.status(201).json({
      success:      true,
      orderNumber:  result.orderNumber,
      subtotal:     result.subtotal,
      shipping_fee: result.shipping_fee,
      total_amount: result.total_amount,
      bankDetails,
    });

  } catch (err) {
    console.error('[POST /api/orders]', err.message);

    // Known user errors — return 400
    if (
      err.message.includes('not found') ||
      err.message.includes('stock') ||
      err.message.includes('only has')
    ) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
});

// GET /api/orders/:orderNumber — public order status lookup
router.get('/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;

  if (!/^ORD-\d{8}-\d{4,}$/.test(orderNumber))
    return res.status(400).json({ error: 'Invalid order number.' });

  try {
    const order = await Order.findByNumber(orderNumber);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Expose only non-sensitive fields on the public endpoint
    return res.json({
      order: {
        order_number:   order.order_number,
        order_status:   order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal:       order.subtotal,
        shipping_fee:   order.shipping_fee,
        total_amount:   order.total_amount,
        created_at:     order.created_at,
        items:          order.items,
      },
    });
  } catch (err) {
    console.error('[GET /api/orders/:orderNumber]', err.message);
    return res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

module.exports = router;
