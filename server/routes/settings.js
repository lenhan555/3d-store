// ─────────────────────────────────────────────────────
// File:    server/routes/settings.js
// Agent:   @Backend_Engineer | Sprint: 3
// Mounted: app.use('/api/settings', require('./routes/settings'))
// Purpose: Exposes only non-sensitive public settings (payment info).
// ─────────────────────────────────────────────────────
'use strict';

const express  = require('express');
const Settings = require('../models/Settings');

const router = express.Router();

// GET /api/settings/payment — bank transfer details for the checkout page
router.get('/payment', async (req, res) => {
  try {
    const s = await Settings.get([
      'bank_name', 'bank_account_no', 'bank_account_name',
      'shipping_fee_vnd', 'free_shipping_min',
    ]);
    res.json({
      bank_name:        s.bank_name         || '',
      account_no:       s.bank_account_no   || '',
      account_name:     s.bank_account_name || '',
      shipping_fee:     parseInt(s.shipping_fee_vnd   || '35000',  10),
      free_shipping_min: parseInt(s.free_shipping_min || '500000', 10),
    });
  } catch (err) {
    console.error('[GET /api/settings/payment]', err.message);
    res.status(500).json({ error: 'Failed to load settings.' });
  }
});

module.exports = router;
