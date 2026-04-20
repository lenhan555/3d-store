-- ============================================================
-- Migration: 20260421_001_initial_schema
-- Agent:     @Backend_Engineer | Sprint: 1
-- DB:        MySQL 8.0.32 on cPanel (nhjunp4m host)
-- Rollback:  20260421_001_initial_schema_rollback.sql
-- Run via:   cPanel → phpMyAdmin → select DB → SQL tab → paste & run
-- ============================================================

USE `nhjunp4m_jun3d_store`;   -- ← replace prefix if different

-- ── Products ──────────────────────────────────────────────────
CREATE TABLE products (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  slug             VARCHAR(255)    NOT NULL,
  name             VARCHAR(255)    NOT NULL,
  description      TEXT,
  material         VARCHAR(100)    NOT NULL DEFAULT 'PLA Matte',
  color_options    JSON,
  price            DECIMAL(12,0)   NOT NULL,           -- VND (no decimals needed)
  stock_qty        SMALLINT        NOT NULL DEFAULT 0,
  print_time_hours DECIMAL(4,1),
  width_mm         SMALLINT UNSIGNED,
  height_mm        SMALLINT UNSIGNED,
  depth_mm         SMALLINT UNSIGNED,
  weight_grams     SMALLINT UNSIGNED,
  is_active        TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order       SMALLINT        NOT NULL DEFAULT 0,
  created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_slug (slug),
  KEY idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Product Images ────────────────────────────────────────────
CREATE TABLE product_images (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  product_id   INT UNSIGNED   NOT NULL,
  image_path   VARCHAR(500)   NOT NULL,
  alt_text     VARCHAR(255),
  is_primary   TINYINT(1)     NOT NULL DEFAULT 0,
  sort_order   TINYINT        NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_primary (product_id, is_primary),
  CONSTRAINT fk_img_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE orders (
  id               INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_number     VARCHAR(50)    NOT NULL,
  customer_name    VARCHAR(255)   NOT NULL,
  customer_email   VARCHAR(255)   NOT NULL,
  customer_phone   VARCHAR(30),
  shipping_address TEXT           NOT NULL,
  subtotal         DECIMAL(12,0)  NOT NULL,
  shipping_fee     DECIMAL(12,0)  NOT NULL DEFAULT 0,
  total_amount     DECIMAL(12,0)  NOT NULL,
  payment_method   ENUM('bank_transfer','vnpay','momo')
                                  NOT NULL DEFAULT 'bank_transfer',
  payment_status   ENUM('pending','paid','failed','refunded')
                                  NOT NULL DEFAULT 'pending',
  order_status     ENUM('pending','confirmed','printing','shipped','delivered','cancelled')
                                  NOT NULL DEFAULT 'pending',
  notes            TEXT,
  paid_at          TIMESTAMP      NULL,
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_number (order_number),
  KEY idx_status (order_status),
  KEY idx_email  (customer_email),
  KEY idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Order Items ───────────────────────────────────────────────
CREATE TABLE order_items (
  id            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_id      INT UNSIGNED   NOT NULL,
  product_id    INT UNSIGNED   NOT NULL,
  product_name  VARCHAR(255)   NOT NULL,
  product_slug  VARCHAR(255)   NOT NULL,
  color         VARCHAR(100),
  quantity      TINYINT UNSIGNED NOT NULL,
  unit_price    DECIMAL(12,0)  NOT NULL,
  line_total    DECIMAL(12,0)  NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order (order_id),
  CONSTRAINT fk_item_order
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_item_product
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Admin Users ───────────────────────────────────────────────
CREATE TABLE admin_users (
  id            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)   NOT NULL,
  password_hash VARCHAR(255)   NOT NULL,
  last_login_at TIMESTAMP      NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed admin — CHANGE PASSWORD immediately after first login
-- This is bcrypt hash of 'Admin@123' (cost 12) — replace with your own
INSERT INTO admin_users (email, password_hash) VALUES
  ('admin@jun3d-studio.store',
   '$2b$12$PLACEHOLDER.ReplaceThisWithARealHashGeneratedByTheApp');

-- ── Site Settings ─────────────────────────────────────────────
CREATE TABLE settings (
  `key`       VARCHAR(100)   NOT NULL,
  `value`     TEXT,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO settings (`key`, `value`) VALUES
  ('store_name',        'Jun 3D Studio'),
  ('store_email',       'admin@jun3d-studio.store'),
  ('bank_account_name', 'REPLACE WITH YOUR NAME'),
  ('bank_account_no',   'REPLACE WITH ACCOUNT NUMBER'),
  ('bank_name',         'REPLACE WITH BANK NAME'),
  ('shipping_fee_vnd',  '35000'),
  ('free_shipping_min', '500000');
