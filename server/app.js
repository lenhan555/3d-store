// ─────────────────────────────────────────────────────
// File:    server/app.js
// Agent:   @Backend_Engineer
// Sprint:  1
// Purpose: Express app — middleware stack + API routes.
//          Next.js handler is attached in server/index.js, not here.
// ─────────────────────────────────────────────────────
'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Body parsers ─────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Security headers ─────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── Rate limiting on API ──────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Stricter limiter for checkout (prevent order flooding)
const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: 'Too many order attempts. Please wait a moment.' },
});
app.use('/api/orders', checkoutLimiter);

// ── Health check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: process.env.NEXT_PUBLIC_STORE_NAME || 'Jun 3D Studio',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes (uncommented sprint by sprint) ─────────
// Sprint 2 — Products (public)
app.use('/api/products', require('./routes/products'));

// Sprint 3 — Orders + Settings
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));

// Sprint 4 — Admin
// app.use('/api/admin',  require('./routes/admin/auth'));
// app.use('/api/admin/products', require('./routes/admin/products'));
// app.use('/api/admin/orders',   require('./routes/admin/orders'));
// app.use('/api/admin/upload',   require('./routes/admin/upload'));

// ── 404 for unknown API routes ────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

module.exports = app;
