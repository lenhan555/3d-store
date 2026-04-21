// ─────────────────────────────────────────────────────
// File:    server/routes/admin/auth.js
// Agent:   @Backend_Engineer | Sprint: 4
// Mounted: app.use('/api/admin', require('./routes/admin/auth'))
// ─────────────────────────────────────────────────────
'use strict';

const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../../config/db');
const env     = require('../../config/env');

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const [[admin]] = await db.execute(
      'SELECT * FROM admin_users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    // Same error message for unknown email or wrong password — prevent enumeration
    if (!admin) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid)  return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    await db.execute(
      'UPDATE admin_users SET last_login_at = NOW() WHERE id = ?',
      [admin.id]
    );

    return res.json({ token, email: admin.email });

  } catch (err) {
    console.error('[POST /api/admin/login]', err.message);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
