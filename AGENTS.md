# Agents — Fed Restaurant Platform

This document tracks which AI agents contributed to each phase of development,
what they did, and what remains for the next agent/human to pick up.

**Last updated:** 2026-03-17

---

## Project Overview

- **Repo:** [dfconnor/fed-platform](https://github.com/dfconnor/fed-platform) on GitHub
- **Production URL:** https://fed-platform.vercel.app
- **Branch:** `main` (production) — development was on `claude/sweet-sutherland`, now merged
- **Stack:** Next.js 16.1.6, TypeScript, Prisma 7.5.0, Neon Postgres, NextAuth v5 beta, Tailwind v4, shadcn/ui, Zustand, SWR, Recharts
- **Database:** Neon serverless Postgres — project `fed-platform` (aws-us-east-2)
- **Hosting:** Vercel — auto-deploys from `main` on push
- **Local path:** `/Users/dan/Projects/Restaurant_Payment/`
- **Worktree:** `.claude/worktrees/sweet-sutherland/` (on branch `claude/sweet-sutherland`)

---

## Development History

### Phase 1: Initial Scaffold (Claude)
**Commit:** `72e93ae` — Initial release
- Generated full Next.js 16 project with App Router, Prisma, NextAuth
- Created all UI pages (customer, dashboard, admin)
- Set up Prisma schema with SQLite adapter
- Created seed data with 2 demo restaurants

### Phase 2: SWR + Database Wiring (Gemini)
**Commit:** `8e4ac44` — Wire dashboard and admin pages to database persistence with SWR
- Replaced 1,277 lines of static mock data with live SWR-based data fetching
- Created SWR hooks for all data fetching
- Added Zod validation schemas for all API inputs
- Created API routes: promotions, admin restaurants/users/settings
- Wrapped order creation in Prisma `$transaction`
- Consolidated cart into Zustand store

### Phase 3: Security Hardening (Gemini + Claude)
**Commit:** `d275d59` — Harden auth, add API protection, refine validation schemas
- Created NextAuth route handler (`/api/auth/[...nextauth]`)
- Created shared auth helpers (`requireAuth`, `requireAdmin`, `requireRestaurantOwner`)
- Added auth guards to ALL mutable API routes
- Hardcoded registration to `role: "customer"`
- Replaced all `.passthrough()` Zod schemas with explicit fields
- Rewrote order confirmation page to fetch real data
- Split auth config: `auth.config.ts` (edge-safe) + `auth.ts` (full with Prisma)
- Added SessionProvider wrapper in root layout

### Phase 4: Postgres Migration + Deployment (Claude)
**Commit:** `3c1a2b3` — Migrate from SQLite/libSQL to Neon Postgres
- Switched from SQLite to PostgreSQL (Neon serverless)
- Uses `@prisma/adapter-pg` with `PrismaPg({ connectionString })` pattern
- Created Neon project via `neonctl` CLI, seeded with demo data
- Deployed to Vercel with auto-deploy from `main`

### Phase 5: Cart + Registration Polish (Claude)
**Commit:** `430f27c` — Fix cart pricing, promo validation, dine_in enum, and registration UX
- Cart now reads tax rate and service fee from restaurant API (was hardcoded)
- Promo codes validated against server (was hardcoded "FED10")
- Fixed `dine_in` enum mismatch (cart used "dinein", API expected "dine_in")
- Removed misleading role selector from registration page

---

## Infrastructure

### Neon Database
- **Project:** `fed-platform` (ID: `lucky-violet-65323493`)
- **Region:** aws-us-east-2
- **Endpoint:** `ep-wispy-hall-ajr57q8x`
- **Pooler host:** `ep-wispy-hall-ajr57q8x-pooler.c-3.us-east-2.aws.neon.tech`
- **Direct host:** `ep-wispy-hall-ajr57q8x.c-3.us-east-2.aws.neon.tech`
- **Database:** `neondb`, **Role:** `neondb_owner`
- **Free tier:** 0.5 GB storage, 100 CU-hours/month
- **CLI:** `neonctl` installed, authenticated

### Vercel
- **Project:** `fed-platform` (ID: `prj_oX3idKvCd2lSb9ILcUxxEnYaACqB`)
- **Production URL:** https://fed-platform.vercel.app
- **Framework:** Next.js
- **Build command:** `prisma generate && prisma migrate deploy && next build`
- **Deploy trigger:** Push to `main` → auto-deploy
- **Env vars configured:** `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_PLATFORM_NAME`

### Demo Accounts (seeded in Neon)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@getfed.com | admin123 |
| Owner | owner@getfed.com | owner123 |
| Customer | customer@getfed.com | customer123 |

### Demo Restaurants
- **The Golden Fork** — `/r/the-golden-fork` (American, tax: 8.75%, service fee: $1.50)
- **Sakura Sushi** — `/r/sakura-sushi` (Japanese, tax: 8.75%, service fee: $0)

---

## CRITICAL: Prisma 7 Adapter Pattern

**Do NOT change this pattern.** Prisma 7.5.0 does not support `url` or `directUrl` in `schema.prisma`. Multiple agents have tried and it breaks the build.

The correct pattern is:

1. **`prisma/schema.prisma`** — `provider = "postgresql"` with NO `url` or `directUrl`
2. **`prisma.config.ts`** — handles `DIRECT_URL` for migrations
3. **`src/lib/db.ts`** — uses `PrismaPg({ connectionString: process.env.DATABASE_URL })`
4. **`src/lib/seed.ts`** — same `PrismaPg` adapter pattern

## CRITICAL: Auth Split for Edge Runtime

NextAuth middleware runs on Vercel's Edge Runtime, which cannot import Prisma or bcrypt.

- **`src/lib/auth.config.ts`** — Edge-safe config (JWT callbacks, pages, no providers). Used by `src/middleware.ts`.
- **`src/lib/auth.ts`** — Full config with PrismaAdapter + CredentialsProvider + GoogleProvider. Used by API routes and server actions.

If you put Prisma imports in `auth.config.ts` or `middleware.ts`, the Edge build will fail.

---

## Remaining Work

### High Priority
- [ ] **Order number collision** — `generateOrderNumber()` uses `Math.random()` with no retry on unique constraint violation
- [ ] **Stripe integration** — replace demo `pi_demo_` stub with real PaymentIntent flow
- [ ] **Google OAuth** — hide the button when `GOOGLE_CLIENT_ID` is not configured, or add real credentials

### Medium Priority
- [ ] **`actions.ts` cleanup** — ~800 lines, partially duplicates API routes. Decide: server actions or API routes
- [ ] **Password reset flow** — "Forgot password?" link goes to `#`
- [ ] **"Open Now" logic** — always shows green; should parse `businessHours` JSON
- [ ] **Delivery fee display** — server applies $4.99 for delivery but cart never shows it
- [ ] **N+1 in order creation** — menu items/modifiers fetched individually in loop

### Low Priority
- [ ] **Analytics aggregation** — loads all orders into memory; should use DB-level aggregation
- [ ] **Float to Int migration** — prices stored as Float (dollars), consider migrating to Int (cents)
- [ ] **Dead code cleanup** — `src/lib/demo-charts.ts`, various unused imports
- [ ] **Image upload** — currently URL-only, no file upload
- [ ] **Email notifications** — currently console.log only
- [ ] **Tests** — no test suite exists

### Completed (for reference)
- [x] Analytics route auth (requireAuth added)
- [x] `dine_in` vs `dinein` mismatch (unified to `dine_in`)
- [x] Cart hardcoded tax/fee (now reads from restaurant API)
- [x] Cart hardcoded promo code (now validates against server)
- [x] Registration role selector (removed — backend always sets customer)
- [x] Login broken (fixed to use NextAuth signIn)
- [x] Cart checkout fake setTimeout (now calls createOrder server action)
- [x] Order confirmation hardcoded mock data (now fetches real order)
- [x] All API routes unprotected (all now have auth guards)
- [x] Vercel deployment (live at fed-platform.vercel.app)
- [x] SQLite to Postgres migration (Neon)

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/auth.config.ts` | Edge-safe NextAuth config (used by middleware) |
| `src/lib/auth.ts` | Full NextAuth config with Prisma adapter (used by API routes) |
| `src/lib/api-auth.ts` | Shared auth helpers: `requireAuth`, `requireAdmin`, `requireRestaurantOwner` |
| `src/lib/db.ts` | Prisma client with `@prisma/adapter-pg` (PrismaPg) |
| `src/lib/actions.ts` | Server actions with auth for mutations |
| `src/lib/validations.ts` | Zod schemas for all API inputs |
| `src/lib/store.ts` | Zustand cart store (persisted) |
| `src/lib/seed.ts` | Database seeder (run with `npx tsx src/lib/seed.ts`) |
| `src/middleware.ts` | NextAuth middleware — imports from `auth.config.ts` NOT `auth.ts` |
| `src/components/providers.tsx` | SessionProvider wrapper |
| `prisma/schema.prisma` | Database schema (16 models, PostgreSQL, NO url in datasource) |
| `prisma.config.ts` | Prisma config (migration URL from DIRECT_URL env var) |
| `.env.example` | Environment variable template |
| `CHANGELOG.md` | Full project changelog |
