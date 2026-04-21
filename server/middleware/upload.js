// ─────────────────────────────────────────────────────
// File:    server/middleware/upload.js
// Agent:   @Backend_Engineer | Sprint: 4
// Purpose: Multer memory storage — raw buffer passed to Sharp.
//          Raw files never touch disk. Sharp handles all writes.
// ─────────────────────────────────────────────────────
'use strict';

const multer = require('multer');

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB raw max
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are accepted.'));
    }
  },
});

module.exports = upload;
