# Fed Platform — Handoff for Code Review

**Date:** 2026-03-24
**Branch:** `claude/sweet-sutherland` (1 commit ahead of `main`)
**PR #2:** Merged. New PR needed for remaining doc commit.
**Live:** https://fed-platform.vercel.app

---

## Current State

The branch has **1 uncommitted-to-main commit** (`b216caa`) — documentation updates to AGENTS.md and HANDOFF.md reflecting Phase 7 work. All code changes from Phases 1–7 are already merged to `main` and deployed to production.

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

---

## Remaining Work (Priority Order)

### High Priority
1. **Password reset** — "Forgot password?" links to /support. Needs email token flow (Resend or similar).
2. **Stripe webhook verification** — `api/webhooks/stripe/route.ts` exists but needs `STRIPE_WEBHOOK_SECRET` configured in Vercel for production use.
3. **Google OAuth** — Button shows, needs `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` in Vercel env vars.

### Medium Priority
4. **Float prices** — Stored as `Float` dollars, should be `Int` cents. Requires Prisma migration + formatting changes across all components.
5. **Order number collision** — `Math.random()` 6-char. Add retry on unique constraint or switch to `cuid2`.
6. **Support form email delivery** — Wired to server action with logging, but doesn't actually send email. Wire to Resend/SendGrid.
7. **Analytics aggregation** — Loads all orders into memory. Needs DB-level GROUP BY.

### Low Priority
8. **Tests** — No test suite (0% coverage)
9. **Image upload** — Menu items accept URL only, no file upload (S3/Cloudinary)
10. **Email notifications** — `console.log` only
11. **Dead code** — `src/lib/demo-charts.ts`, unused imports
12. **next-auth beta** — `5.0.0-beta.30` in production

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
cd /Users/dan/Projects/Restaurant_Payment/.claude/worktrees/sweet-sutherland/
npm run dev              # Dev server
npm run build            # Full build (prisma generate + migrate deploy + next build)
npx tsx src/lib/seed.ts  # Re-seed database
npx prisma studio        # DB browser
```
