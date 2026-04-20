# cPanel One-Time Setup Checklist
# Domain: jun3d-studio.store
# Host:   gir01 | IP: 103.124.95.168
# Agent:  @DevOps_Specialist

## Step 1 — SSL Certificate
- [ ] cPanel → Security → SSL/TLS → Let's Encrypt SSL
- [ ] Issue cert for: jun3d-studio.store AND www.jun3d-studio.store
- [ ] Verify: https://jun3d-studio.store loads without cert warning

## Step 2 — MySQL Databases
- [ ] cPanel → Databases → MySQL Databases
- [ ] Create DB:   [cpanelusername]_jun3d_store
- [ ] Create DB:   [cpanelusername]_jun3d_staging
- [ ] Create User: [cpanelusername]_jun3d_app  (strong password — save it)
- [ ] Grant ALL PRIVILEGES on both DBs to the app user
- [ ] Import schema: run store_db_schema.sql via phpMyAdmin

## Step 3 — Node.js App
- [ ] cPanel → Software → Setup Node.js App → Create Application
      Node.js version:       20.x
      Application mode:      Production
      Application root:      3d-store
      Application URL:       jun3d-studio.store
      Startup file:          server/index.js
- [ ] Add environment variables (see env-template.txt)
- [ ] Do NOT click "npm install" yet — wait for first git push

## Step 4 — Git Version Control
- [ ] cPanel → Files → Git™ Version Control → Create
      Clone URL:      https://github.com/YOUR_USERNAME/3d-store.git
      Repository path: /home/[cpanelusername]/3d-store
      Repository name: 3d-store
- [ ] Note the cPanel remote SSH URL shown after creation
- [ ] On local machine: git remote add cpanel [cPanel SSH URL]
- [ ] Test: git push cpanel main

## Step 5 — Domain DNS
- [ ] Point jun3d-studio.store A record → 103.124.95.168
- [ ] Point www.jun3d-studio.store → same IP or CNAME
- [ ] Wait for DNS propagation (~15 min to 24h)

## Step 6 — Verify Deployment
- [ ] https://jun3d-studio.store loads the homepage
- [ ] https://jun3d-studio.store/api/products returns JSON
- [ ] https://jun3d-studio.store/admin/login loads admin page
- [ ] Upload a test product image — confirm WebP < 80KB in public_html/images/

## Credentials to Save (fill in after setup)
DB_NAME:     [cpanelusername]_jun3d_store
DB_USER:     [cpanelusername]_jun3d_app
DB_PASS:     ___________________________
JWT_SECRET:  ___________________________  (run: openssl rand -base64 48)
cPanel SSH remote: ___________________________
