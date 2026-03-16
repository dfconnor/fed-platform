# Agents — Fed Restaurant Platform

This document tracks which AI agents contributed to each phase of development,
what they did, and what remains for the next agent/human to pick up.

---

## Phase 1: Initial Scaffold (Claude)
**Branch:** `claude/sweet-sutherland`
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
- Added route protection proxy (`proxy.ts`)
- Created 4 new API routes: promotions, admin restaurants/users/settings
- Wrapped order creation in Prisma `$transaction`
- Consolidated cart into Zustand store
- Added `.env.example`
- Added `DashboardProvider`/`AdminProvider` React contexts

---

## Phase 3: Security Hardening (Gemini — unstaged)
In-progress changes by Gemini:

- Fixed login to use NextAuth `signIn("credentials")`
- Wired cart checkout to `createOrder` server action
- Replaced `.passthrough()` on `menuPatchSchema`, `updatePromotionSchema`, `updateRestaurantSchema`
- Added database indexes (`@@index`) on Order, MenuItem, Restaurant, Promotion
- Wired sign-out buttons
- Made DashboardProvider session-aware
- Added server-side promo code validation in `$transaction`
- Added auth + ownership check on restaurant PATCH
- Created `src/middleware.ts` for page-level route protection
- Updated README with security status section

---

## Phase 4: API Auth Guards + Critical Fixes (Claude)
Changes by Claude (this phase):

### New files:
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler (login/logout/OAuth)
- `src/lib/api-auth.ts` — Shared auth helpers (`requireAuth`, `requireAdmin`, `requireRestaurantOwner`)
- `CHANGELOG.md` — Full project changelog
- `AGENTS.md` — This file

### Auth added to API routes:
- `src/app/api/menu/route.ts` — POST/PATCH/DELETE require restaurant owner
- `src/app/api/orders/route.ts` — GET requires auth
- `src/app/api/orders/[id]/route.ts` — PATCH requires restaurant owner
- `src/app/api/promotions/route.ts` — All operations require auth/ownership
- `src/app/api/admin/restaurants/route.ts` — All operations require admin
- `src/app/api/admin/users/route.ts` — All operations require admin
- `src/app/api/admin/settings/route.ts` — All operations require admin

### Bug fixes:
- Registration hardcoded to `role: "customer"` (was accepting any role from client)
- Admin restaurant PATCH schema: replaced `.passthrough()` with explicit fields
- Order confirmation page: fetches real order data from API + polls for status updates
- Removed broken `parseFloat`/`parseInt` coercion in menu PATCH (Zod already types these)

---

## Remaining Work (for next agent/human)

### High Priority
- [ ] **Analytics route auth** — `GET /api/analytics` still lacks auth check (Gemini has unstaged changes on this file — add auth after merge)
- [ ] **`dine_in` vs `dinein` mismatch** — Cart uses `"dinein"`, API expects `"dine_in"`. Unify across `src/app/r/[slug]/cart/page.tsx`, `src/lib/validations.ts`, `src/lib/constants.ts`
- [ ] **Cart tax/fee from restaurant** — Cart hardcodes `TAX_RATE = 0.0875` and `SERVICE_FEE = 0.49` instead of using the restaurant's actual values
- [ ] **Cart promo validation** — Cart still validates promo codes client-side (`"FED10"` hardcoded). Should call API to validate

### Medium Priority
- [ ] **Order confirmation page** — needs proper loading skeleton (currently just a spinner)
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
