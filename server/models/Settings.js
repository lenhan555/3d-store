// ─────────────────────────────────────────────────────
// File:    server/models/Settings.js
// Agent:   @Backend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
'use strict';

const db = require('../config/db');

/** Fetch multiple settings keys in one query. Returns { key: value } map. */
async function get(keys) {
  if (!keys.length) return {};
  const placeholders = keys.map(() => '?').join(',');
  const [rows] = await db.execute(
    `SELECT \`key\`, \`value\` FROM settings WHERE \`key\` IN (${placeholders})`,
    keys
  );
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

module.exports = { get };
