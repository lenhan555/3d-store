# CLAUDE.md — 3D Printed Home Decor E-Commerce Team

## Project Overview

This workspace powers the **3D Printed Home Decor Store** — an AI multi-agent development team that architects, builds, deploys, and maintains a lightweight e-commerce website for selling custom 3D-printed home decor products (PLA Matte vases and decorative objects).

**Primary LLM Backend:** Anthropic Claude  
**Stack:** Next.js + Node.js/Express + MariaDB  
**Hosting:** Shared/VPS (strict resource constraints — see below)

---

## Hosting Constraints (Non-Negotiable)

| Resource | Limit |
|---|---|
| Storage | 3GB NVMe |
| Bandwidth | 40GB/month |
| CPU | 2 cores |
| RAM | 2GB |
| Databases | Max 2 MySQL/MariaDB |
| Disk I/O | 100MB/s |

Every agent on this team must validate decisions against these limits before proposing or implementing anything.

---

## Agent Roster

| Agent | Role | Claude Code Definition |
|---|---|---|
| **@Project_Manager** | Orchestrator — breaks down tasks, coordinates agents, primary user contact | `.claude/agents/project-manager.md` |
| **@Frontend_Engineer** | Responsive UI, product pages, cart, checkout, admin panel frontend | `.claude/agents/frontend-engineer.md` |
| **@Backend_Engineer** | Database schema, Express API, cart logic, order management | `.claude/agents/backend-engineer.md` |
| **@DevOps_Specialist** | Deployment pipeline, Nginx, PM2, CI/CD, server tuning | `.claude/agents/devops-specialist.md` |
| **@Maintenance_Agent** | Upgrade protocol, security patches, scaling decisions, rollback plans | `.claude/agents/maintenance-agent.md` |

---

## Sub-Agent Routing Rules

### When to use each agent

```
User request received
│
├── "Plan this", "what's the tech stack", "coordinate the team", status questions
│   └── → @Project_Manager (project-manager)
│
├── UI components, pages, CSS, React, product gallery, cart UI, checkout form
│   └── → @Frontend_Engineer (frontend-engineer)
│
├── Database schema, API routes, server logic, SQL queries, cart/order backend
│   └── → @Backend_Engineer (backend-engineer)
│
├── Deployment steps, Nginx config, CI/CD, server setup, performance tuning
│   └── → @DevOps_Specialist (devops-specialist)
│
└── Upgrade request, security patch, new feature planning, rollback, scaling
    └── → @Maintenance_Agent (maintenance-agent)
```

### Multi-Agent Sequences

| Request | Agent Sequence |
|---|---|
| "Build the product catalog" | @Backend_Engineer (schema + API) → @Frontend_Engineer (UI) |
| "Deploy the site" | @Backend_Engineer (build check) → @DevOps_Specialist (deploy) |
| "Add a new feature" | @Maintenance_Agent (classify + plan) → relevant agents |
| "Set up the full project" | @Project_Manager (tech stack) → @Backend_Engineer (schema) → @Frontend_Engineer (pages) → @DevOps_Specialist (deploy) |
| "The site is slow" | @DevOps_Specialist (perf audit) → @Backend_Engineer (query optimization) |

**Parallelism rule:** Run agents in parallel when their inputs are independent (e.g., @Frontend_Engineer building UI while @Backend_Engineer writes API routes). Run sequentially when output from one feeds the next.

---

## Approved Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (Static Export) | Near-zero server cost; pre-rendered HTML |
| Backend | Node.js 20 + Express | < 100MB RAM under load |
| Database | MariaDB 10.11 | MySQL-compatible; 20% lower RAM than MySQL 8 |
| Process mgr | PM2 | `--max-memory-restart 450M` safety net |
| Web server | Nginx 1.24 | Static file serving + reverse proxy + caching |
| Image pipeline | Sharp | WebP conversion on upload; target < 80KB/image |
| CSS | Tailwind CSS (purged) | < 30KB gzipped |
| State (cart) | Zustand | 3KB — no heavy Redux |
| Auth (admin) | JWT + bcrypt | Stateless; no session storage overhead |

---

## Project Phases

### Phase 1 — Core (Current)
- [x] Tech stack decision
- [ ] Database schema
- [ ] Product catalog (backend API + frontend)
- [ ] Product detail pages
- [ ] Shopping cart + checkout
- [ ] Admin panel (product CRUD, order management)
- [ ] Deployment to VPS

### Phase 2+ — On Request
- Product search
- Customer accounts
- Discount codes
- Email notifications
- 3D model viewer
- Product reviews

---

## Workspace Folder Structure

```
d:\AI Agents\3d-store-team\
├── CLAUDE.md                          # This file
├── .claude/
│   └── agents/                        # Claude Code sub-agent definitions
│       ├── project-manager.md
│       ├── frontend-engineer.md
│       ├── backend-engineer.md
│       ├── devops-specialist.md
│       └── maintenance-agent.md
├── agents/                            # Extended per-agent context (prompts, memory)
│   ├── project-manager/
│   ├── frontend-engineer/
│   ├── backend-engineer/
│   ├── devops-specialist/
│   └── maintenance-agent/
├── outputs/
│   ├── code/                          # Generated source code files
│   ├── docs/                          # Architecture docs, API docs
│   └── configs/                       # Server configs, CI/CD files
├── memory/                            # Shared team memory (decisions, learnings)
├── workflows/                         # Repeatable process definitions
├── templates/
│   ├── schemas/                       # SQL schema templates
│   └── components/                    # Reusable UI component templates
└── tools/
    ├── scripts/                       # Deployment and utility scripts
    └── prompts/                       # Reusable agent prompts
```

---

## How to Request an Upgrade (Future Feature)

Use this prompt template to safely request a new feature:

```
@Maintenance_Agent upgrade request:
- Feature: [what you want to add]
- Priority: [high / medium / low]
- Deadline: [date or "no rush"]
- Context: [why you need this]
```

@Maintenance_Agent will classify it, assess resource impact, and coordinate the team.

---

## Working Conventions

- All tech decisions must be validated against the hosting constraints before implementation
- @Project_Manager must coordinate any task that touches more than one agent's domain
- Database migrations must always include a rollback script
- Image uploads must pass through the Sharp WebP compression pipeline — never store raw uploads
- Admin routes require JWT authentication on every request
- All agent outputs must include a timestamp and the generating agent's name in metadata

---

*Initialized: April 2026 | Project: 3D Printed Home Decor E-Commerce Store*
