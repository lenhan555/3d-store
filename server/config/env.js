// ─────────────────────────────────────────────────────
// File:    server/config/env.js
// Agent:   @Backend_Engineer
// Sprint:  1
// Purpose: Validate required env vars at startup.
//          Server refuses to start if any required var is missing.
// ─────────────────────────────────────────────────────
'use strict';

const required = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'JWT_SECRET',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`[env] FATAL: Missing required environment variables:\n  ${missing.join('\n  ')}`);
  console.error('[env] Copy deploy/env-template.txt to .env.local and fill in all values.');
  process.exit(1);
}

module.exports = {
  NODE_ENV:   process.env.NODE_ENV || 'development',
  PORT:       parseInt(process.env.PORT || '3000', 10),

  DB_HOST:    process.env.DB_HOST,
  DB_PORT:    parseInt(process.env.DB_PORT || '3306', 10),
  DB_NAME:    process.env.DB_NAME,
  DB_USER:    process.env.DB_USER,
  DB_PASS:    process.env.DB_PASS,

  JWT_SECRET:     process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@jun3d-studio.store',
  STORE_NAME:  process.env.NEXT_PUBLIC_STORE_NAME || 'Jun 3D Studio',
};
