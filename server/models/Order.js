// ─────────────────────────────────────────────────────
// File:    server/models/Order.js
// Agent:   @Backend_Engineer | Sprint: 3
// Purpose: Order creation (transaction) and status lookup.
//          NEVER trusts prices from the client — always re-fetches from DB.
// ─────────────────────────────────────────────────────
'use strict';

const db       = require('../config/db');
const Settings = require('./Settings');

/**
 * Create an order inside a transaction.
 * Validates stock, fetches server-side prices, decrements stock atomically.
 */
async function createOrder({
  customer_name,
  customer_email,
  customer_phone,
  shipping_address,
  payment_method,
  notes,
  items,  // [{ productId, quantity, color }]
}) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // ── 1. Fetch products from DB (never trust client prices) ──
    const productIds   = [...new Set(items.map((i) => i.productId))];
    const placeholders = productIds.map(() => '?').join(',');
    const [products]   = await conn.execute(
      `SELECT id, name, slug, price, stock_qty
       FROM products
       WHERE id IN (${placeholders}) AND is_active = 1`,
      productIds
    );

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    // ── 2. Validate stock ──────────────────────────────────────
    for (const item of items) {
      const p = productMap[item.productId];
      if (!p) throw new Error(`Product ${item.productId} not found.`);
      if (p.stock_qty < item.quantity) {
        throw new Error(`"${p.name}" only has ${p.stock_qty} in stock.`);
      }
    }

    // ── 3. Fetch shipping settings ────────────────────────────
    const settings = await Settings.get(['shipping_fee_vnd', 'free_shipping_min']);
    const SHIPPING_FEE      = parseInt(settings.shipping_fee_vnd  || '35000', 10);
    const FREE_SHIPPING_MIN = parseInt(settings.free_shipping_min || '500000', 10);

    // ── 4. Calculate totals ───────────────────────────────────
    let subtotal = 0;
    const lineItems = items.map((item) => {
      const p         = productMap[item.productId];
      const lineTotal = p.price * item.quantity;
      subtotal       += lineTotal;
      return {
        product_id:   p.id,
        product_name: p.name,
        product_slug: p.slug,
        color:        item.color || null,
        quantity:     item.quantity,
        unit_price:   p.price,
        line_total:   lineTotal,
      };
    });

    const shipping_fee  = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
    const total_amount  = subtotal + shipping_fee;

    // ── 5. Insert order (order_number set after we have the ID) ─
    const [result] = await conn.execute(
      `INSERT INTO orders
         (order_number, customer_name, customer_email, customer_phone,
          shipping_address, subtotal, shipping_fee, total_amount,
          payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'PENDING', customer_name, customer_email, customer_phone,
        shipping_address, subtotal, shipping_fee, total_amount,
        payment_method, notes,
      ]
    );

    const orderId     = result.insertId;
    const date        = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `ORD-${date}-${String(orderId).padStart(4, '0')}`;

    await conn.execute(
      'UPDATE orders SET order_number = ? WHERE id = ?',
      [orderNumber, orderId]
    );

    // ── 6. Insert order items ─────────────────────────────────
    for (const item of lineItems) {
      await conn.execute(
        `INSERT INTO order_items
           (order_id, product_id, product_name, product_slug,
            color, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, item.product_id, item.product_name, item.product_slug,
          item.color, item.quantity, item.unit_price, item.line_total,
        ]
      );
    }

    // ── 7. Decrement stock ────────────────────────────────────
    for (const item of items) {
      await conn.execute(
        'UPDATE products SET stock_qty = stock_qty - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    await conn.commit();

    return { orderId, orderNumber, subtotal, shipping_fee, total_amount };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/** Fetch a single order with its items by order number. */
async function findByNumber(orderNumber) {
  const [[order]] = await db.execute(
    'SELECT * FROM orders WHERE order_number = ?',
    [orderNumber]
  );
  if (!order) return null;

  const [items] = await db.execute(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
    [order.id]
  );

  return { ...order, items };
}

module.exports = { createOrder, findByNumber };
