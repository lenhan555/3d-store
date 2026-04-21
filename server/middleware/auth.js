// ─────────────────────────────────────────────────────
// File:    server/middleware/auth.js
// Agent:   @Backend_Engineer | Sprint: 4
// Purpose: JWT auth guard for all /api/admin/* routes.
// ─────────────────────────────────────────────────────
'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const token = header.slice(7);
  try {
    req.admin = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

module.exports = { requireAuth };
