# 3D Store — Implementation Progress Log

> Maintained by @Project_Manager | Updated each session | This is a long-running project.
> Compare every session's work against the Execution Directives in `AI_Agent_Prompt_3D_Store.md`.

---

## Execution Directives (from brief)

| Step | Directive | Status |
|---|---|---|
| 1 | Tech Stack Proposal | ✅ COMPLETE |
| 2 | Architecture & Database Schema | ✅ COMPLETE |
| 3 | Code Generation Strategy | ✅ COMPLETE |
| 4 | Deployment & Optimization Plan | ✅ COMPLETE |
| 5 | Upgrade Protocol | ✅ COMPLETE |
| — | Phase 1 Code: Sprint 1 — Foundation | ✅ COMPLETE |
| — | Phase 1 Code: Sprint 2 — Product Catalog (API + UI) | ✅ COMPLETE |
| — | Phase 1 Code: Sprint 3 — Cart + Checkout | ✅ COMPLETE |
| — | Phase 1 Code: Sprint 4 — Admin Panel | ✅ COMPLETE |
| — | Deployment to cPanel | ⬜ PENDING (push after Sprint 2) |

---

## Session Log

### Session 4 — 2026-04-21

**Completed:**

#### Sprint 4 — Admin Panel ✅

**Backend (completed prior session):**
- `server/middleware/auth.js` — `requireAuth`: JWT Bearer verify, sets `req.admin`
- `server/middleware/upload.js` — Multer memory storage, 5MB, JPEG/PNG/WebP only
- `server/utils/imageProcessor.js` — Sharp 800×800 WebP q78, saves to `public/images/products/{slug}/`, `deleteFile()` helper
- `server/routes/admin/auth.js` — POST /api/admin/login: bcrypt.compare, jwt.sign 7d, updates last_login_at
- `server/routes/admin/products.js` — full CRUD + image upload/delete/set-primary
- `server/routes/admin/orders.js` — list, detail, status update, dashboard stats
- `server/app.js` — Sprint 4 admin routes enabled with `requireAuth`

**Frontend (completed this session):**
- `src/lib/adminApi.ts` — TOKEN_KEY, isTokenValid (JWT base64 decode), auto-redirect on 401, adminUploadImage via FormData
- `src/app/admin/layout.tsx` — auth guard useEffect, dark sidebar nav (Orders + Products), logout
- `src/app/admin/login/page.tsx` — dark stone-900 form, redirects if already valid token
- `src/app/admin/orders/page.tsx` — stats bar, status filter chips, table with inline order/payment status dropdowns, expandable row for address/summary, pagination
- `src/app/admin/products/page.tsx` — product table with thumbnail, toggle switch (active/inactive), edit link, pagination
- `src/app/admin/products/[id]/page.tsx` — create/edit form (all fields), image gallery with upload/delete/set-primary; route works for both `/new` and `/:id`
- `src/app/globals.css` — added `.input-field` utility class

**Key decisions Sprint 4:**
- `dashboard/stats` route registered after `/:id` — static segment `/dashboard/stats` evaluated before parameterized `/:id` in Express (critical ordering)
- Image upload uses FormData with no `Content-Type` header — browser sets correct multipart boundary automatically
- Admin JWT stored in `localStorage`; `isTokenValid()` decodes base64 payload client-side (no server round-trip)
- Order expanded-detail row uses `key={id}-detail` to avoid React key collision with main row

---

### Session 3 — 2026-04-21

**Completed:**

#### Sprint 1 — Foundation ✅
All foundation files generated. Ready to `npm install` and first push.

**Files created:**
- `package.json` — Next.js 14 + Express 4 + MySQL2 + Sharp + all deps
- `next.config.js` — custom server mode (no static export); `images.unoptimized: true`
- `tailwind.config.js` — brand palette (brand-500 = `#d9892a`), purged
- `postcss.config.js`, `tsconfig.json`
- `.gitignore` — excludes `.env*`, `node_modules/`, `.next/`, planning files
- `.cpanel.yml` — deploy hook: `npm ci` → `next build` → `touch tmp/restart.txt`
- `server/index.js` — Passenger entry point; boots Express + Next.js together
- `server/app.js` — Express middleware, rate limiter, health endpoint, stubbed routes
- `server/config/env.js` — validates required env vars at startup, exits if missing
- `server/config/db.js` — MySQL2 connection pool (max 10), keepAlive, UTC timezone
- `src/app/layout.tsx` — root layout with metadata for SEO
- `src/app/page.tsx` — homepage placeholder (replaced Sprint 2)
- `src/app/globals.css` — Tailwind base + `.btn-primary`, `.product-card`, `.form-input` utility classes
- `db/migrations/20260421_001_initial_schema.sql` — 6 tables (VND pricing, MySQL 8)
- `db/migrations/20260421_001_initial_schema_rollback.sql`
- `public/images/products/.gitkeep`

**Key decisions Sprint 1:**
- Custom Express+Next.js server (not static export) — handles dynamic routes without build-time DB
- `dotenv` loads `.env.local` — cPanel env vars override at runtime via Node.js App panel
- Price stored as `DECIMAL(12,0)` — VND has no fractional units

---

### Session 2 — 2026-04-21

**Completed:**

#### Hosting confirmed + Step 4 Revised ✅
- Hosting: cPanel STARTUP 2 on gir01 | IP: 103.124.95.168
- Domain: jun3d-studio.store | Admin email: admin@jun3d-studio.store
- Confirmed: Node.js App (Passenger) ✅, Git Version Control ✅, MySQL 8.0.32 ✅
- Disk quota: 3GB files + 3GB MySQL (separate — better than original plan)
- Stack deviation: Apache replaces Nginx; Passenger replaces PM2; MySQL 8 replaces MariaDB
- **Revised Step 4 artifacts:**
  - `deploy/.cpanel.yml` — Git deployment hook (runs npm ci, next build, copies static, restarts Passenger)
  - `deploy/htaccess.txt` — Apache routing (HTTPS redirect, cache headers, security, SPA fallback)
  - `deploy/cpanel-setup-checklist.md` — one-time 6-step setup guide with checkboxes
  - `deploy/env-template.txt` — all environment variables with cPanel-specific DB naming

---

### Session 1 — 2026-04-20

**Completed:**

#### Step 1 — Tech Stack Proposal ✅
- **Frontend:** Next.js 14 Static Export
- **Backend:** Node.js 20 + Express 4
- **Database:** MariaDB 10.11 (chosen over MySQL 8 — saves ~40MB RAM, ~150MB disk)
- **Process mgr:** PM2 (`--max-memory-restart 450M`)
- **Web server:** Nginx 1.24 (static files + reverse proxy)
- **Image pipeline:** Sharp → WebP, target < 80KB/image
- **CSS:** Tailwind CSS (purged, ~8–12KB gzipped)
- **Cart state:** Zustand (~3KB)
- **Auth:** JWT + bcrypt (cost 12), stateless — no Redis needed in Phase 1
- **Payments:** Bank transfer default; VNPay/Momo webhook-ready for Phase 2
- **RAM budget at launch:** ~638MB of 2GB used
- **Disk budget at launch:** ~971MB of 3GB used

#### Step 2 — Architecture & Database Schema ✅
- **DB schema (store_db):** 6 tables — `products`, `product_images`, `orders`, `order_items`, `admin_users`, `settings`
  - Key decisions: JSON `color_options` on products (avoids a variants table in Phase 1), price snapshot in `order_items`, `settings` key-value table for store config
- **Server folder structure:** `server/` with config, middleware, routes, models, utils
- **Next.js folder structure:** `src/app/` App Router, full page map (8 public pages + 4 admin pages), component tree, Zustand store, typed API lib
- **Unified architecture diagram:** Browser → Nginx → Express → MariaDB
- **Order flow documented:** 8-step data flow from product browse to order confirmation

#### Step 3 — Code Generation Strategy ✅
- Modular vertical slice delivery (Sprint 1–5 defined)
- Branch strategy: `main` (prod) / `dev` (staging) / `sprint/N-name`
- File header contract: path, agent, sprint, dependencies
- CI/CD: GitHub Actions → rsync → `pm2 reload`
- Upgrade request template documented

#### Step 4 — Deployment & Optimization Plan ✅
- `deploy/setup.sh` — one-time Ubuntu 22.04 VPS bootstrap (8 steps)
- `deploy/nginx.conf` — SSL, Gzip, static cache, API proxy, security headers
- `deploy/99-store-tuning.cnf` — MariaDB tuned to 128MB InnoDB buffer (fits 120MB budget)
- `ecosystem.config.js` — PM2 with `--max-memory-restart 450M`, backoff config
- `.github/workflows/deploy.yml` — full CI/CD with health check post-deploy
- `deploy/cron-disk-monitor.sh` — alerts at 2.5GB (before 3GB limit hit)
- Bandwidth math: ~72,000 page views/day within 40GB/month budget

#### Step 5 — Upgrade Protocol ✅
- Classification system: Patch / Minor / Major with deploy paths defined
- Upgrade request template: `@Maintenance_Agent upgrade request: Feature / Priority / Deadline / Context`
- Pre-deploy checklist: mysqldump → code backup → disk check → RAM check → npm audit
- Migration file convention: `YYYYMMDD_NNN_name.sql` + rollback pair, stored in `db/migrations/`
- Rollback procedure: pm2 stop → restore code → restore DB → pm2 start → health check
- Phase 2 feature queue logged: 6 features, Sprint 6–10+ assigned

---

## Decisions Log (Architectural)

| Decision | Rationale | Date |
|---|---|---|
| MySQL 8.0.32 (host-managed) | cPanel shared hosting — no MariaDB option, no custom tuning. Schema is fully compatible. | 2026-04-21 |
| Apache + Passenger instead of Nginx + PM2 | Hosting is cPanel shared (STARTUP 2), not VPS. cPanel Node.js App uses Passenger. | 2026-04-21 |
| cPanel Git Version Control for deploy | No raw SSH rsync available; cPanel Git + .cpanel.yml is the native deploy method. | 2026-04-21 |
| Step 4 rewritten for cPanel | Original Nginx/PM2/setup.sh plan invalidated by hosting type. See Session 2 Step 4 revision. | 2026-04-21 |
| Static Export for Next.js | Zero Node RAM for page rendering; Nginx serves HTML directly | 2026-04-20 |
| 1 Express instance (fork mode) | 2 CPU split: 1 for Node, 0.5 for MariaDB, 0.5 for OS | 2026-04-20 |
| JWT stateless auth | No Redis/session storage needed in Phase 1 | 2026-04-20 |
| Bank transfer as Phase 1 payment | Zero SDK weight, zero PCI scope; gateway hook-ready for Phase 2 | 2026-04-20 |
| Sharp WebP pipeline on upload only | No per-request image processing; keeps CPU budget free | 2026-04-20 |
| JSON color_options column | Avoids a product_variants table in Phase 1; can migrate to table in Phase 2 | 2026-04-20 |
| store_db_staging as 2nd DB | Reserved for safe migration testing AND Phase 2 growth | 2026-04-20 |

---

## Open Questions / Blockers

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | VPS hostname / IP for deployment config | User | ✅ Shared IP: 103.124.95.168 |
| 2 | Domain name | User | ✅ jun3d-studio.store |
| 3 | Initial admin email | User | ✅ admin@jun3d-studio.store |
| 4 | Currency: VND only, or multi-currency? | User | ⬜ Awaiting user input (VND assumed) |
| 5 | Shipping fee: flat rate or zone-based? | User | ⬜ Awaiting user input (flat rate assumed) |

---

## Phase 2 Feature Queue (logged, not started)

| Feature | Logged | Priority |
|---|---|---|
| VNPay / Momo payment gateway | 2026-04-20 | Medium |
| Customer accounts + order history | — | Low |
| Product search (full-text MySQL) | — | Medium |
| Discount codes | — | Low |
| Email notifications (order confirm) | — | High |
| 3D model viewer (Three.js) | — | Low |

---

---

## What's Next

All 5 Execution Directives from the brief are now complete. The project is ready to move into **Phase 1 code generation**.

**Next action:** Start Sprint 1 — Foundation (package.json, next.config.js, server bootstrap, .env template).

---

*Last updated: 2026-04-21 | @Project_Manager*
