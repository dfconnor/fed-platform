# Agents — Fed Restaurant Platform

This document tracks which AI agents contributed to each phase of development,
what they did, and what remains for the next agent/human to pick up.

---

## Project Overview

- **Repo:** `dfconnor/fed-platform` on GitHub
- **Branch:** `claude/sweet-sutherland` (all development)
- **PR:** #2 (open, targets `main`)
- **Stack:** Next.js 16, TypeScript, Prisma 7, Neon Postgres, NextAuth v5, Tailwind v4, shadcn/ui
- **Database:** Neon serverless Postgres — project `fed-platform` (aws-us-east-2)
- **Hosting:** Vercel (setup in progress)
- **Local worktree:** `/Users/dan/Projects/Restaurant_Payment/.claude/worktrees/sweet-sutherland`

---

## Phase 1: Initial Scaffold (Claude)
**Commit:** `72e93ae` — Initial release

- Generated full Next.js 16 project with App Router, Prisma, NextAuth
- Created all UI pages (customer, dashboard, admin)
- Set up Prisma schema with SQLite adapter
- Created seed data with 2 demo restaurants
- Known issues at this stage: mock data everywhere, no real API integration

---

## Phase 2: SWR + Database Wiring (Gemini)
**Commit:** `8e4ac44` — Wire dashboard and admin pages to database persistence with SWR

- Replaced 1,277 lines of static mock data with live SWR-based data fetching
- Created SWR hooks: `use-menu`, `use-orders`, `use-analytics`, `use-promotions`, `use-restaurant`, `use-admin`
- Added Zod validation schemas for all API inputs
- Created 4 new API routes: promotions, admin restaurants/users/settings
- Wrapped order creation in Prisma `$transaction`
- Consolidated cart into Zustand store
- Added `.env.example` and `DashboardProvider`/`AdminProvider` React contexts

---

## Phase 3: Security Hardening (Gemini + Claude)
**Commit:** `d275d59` — Harden auth, add API protection, refine validation schemas

### Gemini contributions:
- Fixed login to use NextAuth `signIn("credentials")`
- Wired cart checkout to `createOrder` server action
- Replaced `.passthrough()` on `menuPatchSchema`, `updatePromotionSchema`, `updateRestaurantSchema`
- Added database indexes (`@@index`) on Order, MenuItem, Restaurant, Promotion
- Wired sign-out buttons, made DashboardProvider session-aware
- Added server-side promo code validation in `$transaction`
- Created `src/middleware.ts` for page-level route protection

### Claude contributions:
- Created `src/app/api/auth/[...nextauth]/route.ts` (NextAuth route handler)
- Created `src/lib/api-auth.ts` (shared `requireAuth`, `requireAdmin`, `requireRestaurantOwner`)
- Added auth guards to ALL mutable API routes (menu, orders, promotions, admin/*)
- Hardcoded registration to `role: "customer"` (was accepting any role from client)
- Rewrote order confirmation page to fetch real data from API + poll for status
- Created `CHANGELOG.md` and `AGENTS.md`

---

## Phase 4: Postgres Migration + Vercel Setup (Claude)
**Commit:** `3c1a2b3` — Migrate from SQLite/libSQL to Neon Postgres for Vercel deployment

- Switched Prisma datasource from `sqlite` to `postgresql`
- Replaced `@libsql/client` + `@prisma/adapter-libsql` with `@prisma/adapter-pg`
- Uses `PrismaPg({ connectionString })` pattern (Prisma 7 convention)
- Updated `prisma.config.ts` to use `DIRECT_URL` for migrations
- Created fresh Postgres init migration
- Updated seed script — tested and working against Neon
- Created Neon project `fed-platform` via `neonctl` CLI
- Database seeded with demo data (3 users, 2 restaurants, 17 orders)
- Added `prisma migrate deploy` to build command for Vercel CI
- **Vercel deployment in progress** — needs `vercel login` + project link + env vars

---

## Infrastructure

### Neon Database
- **Project:** `fed-platform` (ID: `lucky-violet-65323493`)
- **Region:** aws-us-east-2
- **Endpoint:** `ep-wispy-hall-ajr57q8x`
- **Pooler host:** `ep-wispy-hall-ajr57q8x-pooler.c-3.us-east-2.aws.neon.tech`
- **Direct host:** `ep-wispy-hall-ajr57q8x.c-3.us-east-2.aws.neon.tech`
- **Database:** `neondb`
- **Role:** `neondb_owner`
- **Free tier:** 0.5 GB storage, 100 CU-hours/month

### Vercel (pending setup)
- **Project:** `fed-platform` (to be created)
- **Framework:** Next.js
- **Build command:** `prisma generate && prisma migrate deploy && next build`
- **Branch mapping:** `claude/sweet-sutherland` → Preview, `main` → Production
- **Required env vars:**
  - `DATABASE_URL` — Neon pooled connection string
  - `DIRECT_URL` — Neon direct connection string (for migrations)
  - `AUTH_SECRET` — Generate with `openssl rand -base64 32`
  - `NEXTAUTH_URL` — `https://your-vercel-url.vercel.app`

### Demo Accounts (seeded)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@getfed.com | admin123 |
| Owner | owner@getfed.com | owner123 |
| Customer | customer@getfed.com | customer123 |

### Demo Restaurants
- **The Golden Fork** — `/r/the-golden-fork` (American)
- **Sakura Sushi** — `/r/sakura-sushi` (Japanese)

---

## Remaining Work (for next agent/human)

### High Priority
- [ ] **Complete Vercel deployment** — `vercel login`, link project, set env vars, deploy
- [ ] **Analytics route auth** — `GET /api/analytics` still lacks auth check
- [ ] **`dine_in` vs `dinein` mismatch** — Cart uses `"dinein"`, API expects `"dine_in"`. Unify across `src/app/r/[slug]/cart/page.tsx`, `src/lib/validations.ts`, `src/lib/constants.ts`
- [ ] **Cart tax/fee from restaurant** — Cart hardcodes `TAX_RATE = 0.0875` and `SERVICE_FEE = 0.49` instead of using the restaurant's actual values
- [ ] **Cart promo validation** — Cart still validates promo codes client-side (`"FED10"` hardcoded). Should call API to validate

### Medium Priority
- [ ] **`actions.ts` cleanup** — decide: keep server actions (which have auth) as the canonical mutation path, or remove them and use API routes exclusively
- [ ] **Order number collision** — `generateOrderNumber()` uses `Math.random()` with no retry on unique constraint violation
- [ ] **Stripe integration** — replace demo `pi_demo_` stub with real PaymentIntent flow
- [ ] **Google OAuth** — hide the button when `GOOGLE_CLIENT_ID` is not configured
- [ ] **Password reset flow** — "Forgot password?" link goes to `#`
- [ ] **"Open Now" logic** — always shows green; should parse `businessHours` JSON

### Low Priority
- [ ] **N+1 in order creation** — menu items and modifiers fetched individually in loop; batch with `findMany`
- [ ] **Analytics aggregation** — loads all orders into memory; should use DB-level aggregation
- [ ] **Delivery fee display** — server applies $4.99 for delivery but cart never shows it
- [ ] **Dead code** — `src/lib/demo-charts.ts` (hardcoded chart data), various unused imports
- [ ] **Tests** — no test suite exists

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth v5 config (credentials + Google OAuth) |
| `src/lib/api-auth.ts` | Shared auth helpers for API routes |
| `src/lib/db.ts` | Prisma client with PrismaPg adapter |
| `src/lib/actions.ts` | Server actions (with auth) for mutations |
| `src/lib/validations.ts` | Zod schemas for all API inputs |
| `src/lib/store.ts` | Zustand cart store |
| `src/lib/seed.ts` | Database seeder |
| `src/middleware.ts` | NextAuth middleware (page route protection) |
| `prisma/schema.prisma` | Database schema (16 models, PostgreSQL) |
| `prisma.config.ts` | Prisma config (migration URL) |
| `.env.example` | Environment variable template |
