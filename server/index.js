// ─────────────────────────────────────────────────────
// File:    server/index.js
// Agent:   @Backend_Engineer
// Sprint:  1
// Purpose: Entry point. Boots Express + Next.js together.
//          Passenger (cPanel) runs this file directly.
//          Express handles /api/*, Next.js handles everything else.
// ─────────────────────────────────────────────────────
'use strict';

// Load env vars first — will exit if required vars are missing
require('dotenv').config({ path: '.env.local' });
const env = require('./config/env');

const path   = require('path');
const next   = require('next');
const app    = require('./app');

// Connect to DB — exits on failure
require('./config/db');

const dev     = env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(__dirname, '..') });
const handle  = nextApp.getRequestHandler();

nextApp.prepare()
  .then(() => {
    // All non-API routes handled by Next.js
    app.all('*', (req, res) => handle(req, res));

    // Passenger (cPanel) injects PORT as a socket path or port number.
    // Do not bind to 127.0.0.1 — Passenger manages the listener address.
    const port = process.env.PORT || env.PORT;
    app.listen(port, () => {
      console.log(`[${new Date().toISOString()}] Jun 3D Studio ready`);
      console.log(`[server] ENV: ${env.NODE_ENV} | Port: ${port}`);
      console.log(`[server] DB:  ${env.DB_HOST}/${env.DB_NAME}`);
    });
  })
  .catch((err) => {
    console.error('[server] FATAL: Failed to start Next.js:', err);
    process.exit(1);
  });
