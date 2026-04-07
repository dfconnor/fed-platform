# Fed Platform — Handoff for Code Review

**Date:** 2026-04-03
**Branch:** `main` (all work merged via PR #14)
**Live:** https://fed-platform.vercel.app

---

## Current State

All Phases 1–7 plus test suite, password reset flow, and Vercel build fix are merged to `main` and deployed to production (PR #14 merged 2026-04-03).

### What's deployed (Phases 1–7, 21 commits):

| Phase | Agent | Summary |
|-------|-------|---------|
| 1 | Claude | Initial scaffold — Next.js 16, Prisma, NextAuth, all pages |
| 2 | Gemini | SWR hooks, Zod validation, API routes, Zustand cart |
| 3 | Gemini + Claude | Auth hardening, API protection, edge-safe auth split |
| 4 | Claude | SQLite → Neon Postgres migration, Vercel deployment |
| 5 | Claude Code CLI | Cart pricing from DB, promo validation, dine_in fix |
| 6 | Claude Code Desktop | Design overhaul (warm palette, food photos, DM Serif, new pages), 7 security fixes, shared Navbar/Footer |
| 7 | Antigravity (Deepmind) | SSR homepage, Open Now badge, Stripe Checkout integration, search fix, support form wiring, accessibility, SEO metadata |
| 8 | Claude Code (Opus 4.6) | Password reset flow, test suite (33 tests), Suspense boundary fix, Vercel build fix, type safety improvements |

---

## Architecture Overview

```
Next.js 16 App Router
├── Public pages: /, /about, /support, /privacy, /terms, /pricing
├── Restaurant: /r/[slug] (menu), /r/[slug]/cart, /r/[slug]/order/[orderId]
├── Auth: /auth/login, /auth/register
├── Dashboard: /dashboard/* (owner role)
├── Admin: /admin/* (admin role)
└── API: 20 routes under /api/*

Database: Neon Postgres (Prisma 7 + PrismaPg adapter)
Auth: NextAuth v5 beta (JWT, credentials + Google OAuth)
State: Zustand (cart), SWR (server data)
Payments: Stripe Checkout (demo fallback when no keys)
```

### Critical Patterns (DO NOT CHANGE)

1. **Prisma 7 adapter** — `schema.prisma` has `provider = "postgresql"` with NO `url`/`directUrl`. Connection via `PrismaPg({ connectionString })` in `db.ts` and `seed.ts`. `prisma.config.ts` handles `DIRECT_URL` for migrations.

2. **Auth edge split** — `auth.config.ts` (edge-safe, used by middleware) vs `auth.ts` (full with Prisma, used by API routes). Never import `auth.ts` in `middleware.ts`.

3. **Guest checkout** — Order creation via `createOrder` server action in `actions.ts`. Middleware allows `POST /api/orders` and `POST /api/checkout_sessions` without auth.

---

## What Works (verified on production)

- Homepage with SSR restaurant listing + search
- Restaurant menu browsing with cuisine-specific food photos
- Cart with server-validated tax/fees/promos, customer info validation
- Guest checkout → Stripe Checkout (or demo redirect if no keys)
- Order confirmation with real-time status polling
- Cross-restaurant cart switching with confirmation dialog
- Open Now / Closed badge using businessHours
- Login/register with NextAuth credentials
- Owner dashboard: orders, menu CRUD, analytics, promotions, settings
- Admin panel: users, restaurants, platform settings, analytics
- All API routes auth-protected (middleware + route-level guards)
- Real pages for About, Support (with form), Privacy, Terms
- Page-level metadata for SEO
- Accessibility: aria-labels on interactive elements
- Health check at `/api/health` for uptime monitors

---

## Health Check

`GET /api/health` is a public, rate-limited (60/min) endpoint that
verifies the database is reachable.

**200 — healthy**
```json
{
  "status": "ok",
  "db": "connected",
  "version": "1.0.0",
  "timestamp": "2026-04-07T12:34:56.789Z"
}
```

**503 — DB unreachable**
```json
{
  "status": "error",
  "db": "disconnected",
  "error": "ECONNREFUSED",
  "version": "1.0.0",
  "timestamp": "2026-04-07T12:34:56.789Z"
}
```

Configure your uptime monitor (Better Uptime, UptimeRobot, Pingdom, etc.)
to hit `https://fed-platform.vercel.app/api/health` and alert on non-200.

---

## Remaining Work (Priority Order)

### High Priority
1. ~~**Password reset**~~ — ✅ Done (Phase 8). Forgot-password + reset-password pages with token flow.
2. **Stripe webhook verification** — `api/webhooks/stripe/route.ts` exists but needs `STRIPE_WEBHOOK_SECRET` configured in Vercel for production use.
3. **Google OAuth** — Button shows, needs `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` in Vercel env vars.
4. **Stripe demo key fallback** — `checkout_sessions/route.ts` falls back to `"sk_test_demo"` if env var missing. Should throw explicitly.

### Medium Priority
5. **Float prices** — Stored as `Float` dollars, should be `Int` cents. Requires Prisma migration + formatting changes across all components.
6. ~~**Order number collision**~~ — ✅ Fixed (Phase 8). Now uses timestamp + random chars (`FED-XXXX-XXXX`).
7. **Support form email delivery** — Wired to server action with Resend SDK, but needs `RESEND_API_KEY` in Vercel env.
8. **Analytics aggregation** — Loads all orders into memory. Needs DB-level GROUP BY.
9. **Rate limiting** — Added to auth + checkout routes (uncommitted). Needs to be committed and extended to other routes.

### Low Priority
10. ~~**Tests**~~ — ✅ Added (Phase 8). 33 tests via vitest (cart store + utilities). Need API route + integration tests.
11. **Image upload** — Menu items accept URL only, no file upload (S3/Cloudinary)
12. **Email notifications** — Resend SDK wired, falls back to console.log without API key
13. **Dead code** — `src/lib/demo-charts.ts`, unused imports
14. **next-auth beta** — `5.0.0-beta.30` in production

---

## Key Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Route protection — explicit public route allowlist |
| `src/lib/auth.config.ts` | Edge-safe NextAuth config (middleware) |
| `src/lib/auth.ts` | Full NextAuth with Prisma (API routes) |
| `src/lib/api-auth.ts` | `requireAuth`, `requireAdmin`, `requireRestaurantOwner` |
| `src/lib/db.ts` | Prisma client with PrismaPg adapter |
| `src/lib/actions.ts` | Server actions (~800 lines, order creation, support ticket) |
| `src/lib/validations.ts` | Zod schemas for all inputs |
| `src/lib/store.ts` | Zustand cart (persisted, cross-restaurant switching) |
| `src/lib/utils.ts` | `generateOrderNumber`, `getOpenStatus`, `formatCurrency` |
| `src/app/api/checkout_sessions/route.ts` | Stripe Checkout session creation |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `src/app/home-search.tsx` | Client-side search component (used by SSR homepage) |
| `src/components/navbar.tsx` | Session-aware navbar with mobile menu |
| `src/components/footer.tsx` | 4-column footer with real links |
| `src/types/next-auth.d.ts` | NextAuth type augmentation (role on session/JWT) |
| `prisma/schema.prisma` | 16 models, PostgreSQL, NO url in datasource |
| `prisma.config.ts` | Migration config (DIRECT_URL) |
| `AGENTS.md` | Full development history + remaining work |

---

## Demo Accounts (seeded in Neon)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@getfed.com | admin123 |
| Owner | owner@getfed.com | owner123 |
| Customer | customer@getfed.com | customer123 |

**Restaurants:** The Golden Fork (`/r/the-golden-fork`), Sakura Sushi (`/r/sakura-sushi`)

---

## Commands

```bash
cd /Users/dan/Projects/fed-platform/
npm run dev              # Dev server
npm run build            # Full build (prisma generate + next build)
npx tsx src/lib/seed.ts  # Re-seed database
npx prisma studio        # DB browser
```
