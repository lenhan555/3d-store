// ─────────────────────────────────────────────────────
// File:    server/config/db.js
// Agent:   @Backend_Engineer
// Sprint:  1
// Purpose: MySQL2 connection pool.
//          Pool keeps connections alive — no reconnect overhead per request.
//          Max 10 connections — safe for cPanel shared hosting MySQL limits.
// ─────────────────────────────────────────────────────
'use strict';

const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host:               env.DB_HOST,
  port:               env.DB_PORT,
  database:           env.DB_NAME,
  user:               env.DB_USER,
  password:           env.DB_PASS,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  // Keep connections alive — cPanel MySQL kills idle connections after ~8h
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
  // Timezone: store all timestamps as UTC
  timezone:           '+00:00',
});

// Test the connection on startup
pool.getConnection()
  .then((conn) => {
    console.log(`[db] Connected to MySQL: ${env.DB_HOST}/${env.DB_NAME}`);
    conn.release();
  })
  .catch((err) => {
    console.error('[db] FATAL: Cannot connect to MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;
