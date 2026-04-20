-- ============================================================
-- Rollback: 20260421_001_initial_schema_rollback
-- Agent:    @Backend_Engineer | Sprint: 1
-- WARNING:  This drops all tables and all data. Only run to fully reset.
-- ============================================================

USE `nhjunp4m_jun3d_store`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;

SET FOREIGN_KEY_CHECKS = 1;
