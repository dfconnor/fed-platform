# Fed Platform — Handoff Script

**Date:** 2026-03-17
**Branch:** `claude/sweet-sutherland` (ahead of `main`)
**PR:** https://github.com/dfconnor/fed-platform/pull/2
**Live:** https://fed-platform.vercel.app

---

## What Was Done This Session

### 1. Design Overhaul (visual identity)
Replaced the generic AI-template aesthetic with a warm, food-forward design:

- **Color palette:** Cream backgrounds (`hsl(40 33% 98%)`), tomato-red primary, golden amber accent — no more pure white + gray
- **Typography:** DM Serif Display for headings (personality), Inter for body (readability)
- **Food photography:** Unsplash images on hero, restaurant cards, auth pages, pricing, about page, restaurant banners (cuisine-specific: sushi for Japanese, burgers for American, etc.)
- **Shared components:** Extracted `<Navbar>` (session-aware — shows Dashboard for owners/admins, Sign out when logged in) and `<Footer>` (4-column layout) into reusable components
- **Auth pages:** Split layout — food photo with testimonial on left, form on right
- **NextAuth types:** Added `src/types/next-auth.d.ts` for `role` on session/JWT

### 2. New Pages (no more dead links)
Created 4 production-ready pages replacing all `#` placeholder links:

| Route | Content |
|-------|---------|
| `/about` | Company story, values (3 cards), CTA |
| `/support` | FAQ accordion (6 items), contact form, email |
| `/privacy` | Privacy policy — what we collect, don't collect, data rights |
| `/terms` | Terms of service — customer, restaurant, payments, liability |

### 3. Security Fixes (7 issues from code review)

| # | Issue | Fix | File |
|---|-------|-----|------|
| 1 | Order IDOR — anyone could read any order | Added ownership check (customer, owner, admin). Guest orders remain viewable by ID. | `api/orders/[id]/route.ts` |
| 2 | Promo double-increment | Removed outer `usedCount` increment; only transactional one remains | `lib/actions.ts` |
| 3 | Middleware allowed unauth POST to ALL APIs | Moved guest checkout into `isPublicApiRoute`, simplified to explicit allowlist | `middleware.ts` |
| 4 | Anyone could create restaurants | Added `requireAdmin()` to `POST /api/restaurants` | `api/restaurants/route.ts` |
| 5 | Dual order creation paths | Removed duplicate POST handler from `/api/orders`. Cart uses `createOrder` server action exclusively. | `api/orders/route.ts` |
| 6 | Password validation mismatch | Login now requires >= 8 chars (was 6, server required 8) | `auth/login/page.tsx` |
| 7 | Promos leaked without ownership | GET with `?code=` is public (cart validation). Full list requires `requireRestaurantOwner`. | `api/promotions/route.ts` |

### 4. Bug Fixes
- **Cart API response:** Fixed `data.restaurant ?? data` fallback in cart page
- **Cart discount:** Now uses real `discountType`/`discountValue` from server (was hardcoded 10%)
- **Guest promo validation:** New `GET /api/promotions/validate` public endpoint
- **Customer info validation:** Cart requires name + (email or phone) before placing order

---

## Verification Results

All pages manually verified in dev server with zero console errors and zero failed network requests:

| Page | Status | Notes |
|------|--------|-------|
| `/` (Homepage) | Working | Hero photo, restaurant cards with images, search, cuisine tags, how-it-works, stats, CTA |
| `/about` | Working | Hero photo, story, values grid, CTA |
| `/support` | Working | FAQ accordion, contact form |
| `/privacy` | Working | Full privacy policy |
| `/terms` | Working | Full terms of service |
| `/pricing` | Working | Hero, $30 math comparison, plans, competitor table, CTA |
| `/auth/login` | Working | Split layout, food photo, form, Google OAuth, "Forgot password?" links to /support |
| `/auth/register` | Working | Split layout, food photo, form, Terms/Privacy links to real pages |
| `/r/the-golden-fork` | Working | American banner photo, categories, menu items, cart bar |
| `/r/sakura-sushi` | Working | Japanese banner photo, categories, Popular badges, prices |
| `/r/the-golden-fork/cart` | Working | Order type, items, customer details, promo, tip, real tax/fees |
| Dead `#` links | **0 found** | Every link resolves to a real route |

**Build:** `npm run build` passes clean. `tsc --noEmit` zero errors.

---

## What's Left (Priority Order)

### Critical (blocks real usage)
1. **No real payment** — Cart calls `createOrder` but never collects card details. `paymentStatus` is set to `"pending"`. Need Stripe integration or clearly mark demo.
2. **Homepage is client-rendered** — `"use client"` + `useEffect` fetch. Bad for SEO. Should be a server component with `fetch()` in the component body.

### High Priority
3. **"Open Now" always green** — Never checks `businessHours` JSON field
4. **Order number collision** — `Math.random()` 6-char, birthday paradox at ~47K orders. Add retry loop or use `cuid2`.
5. **Support contact form no-op** — Shows success but doesn't send. Wire to Resend, SendGrid, or a simple webhook.
6. **Password reset** — "Forgot password?" links to /support. Need actual reset flow (email token).

### Medium Priority
7. **Float prices** — Stored as `Float` dollars. Should be `Int` cents for financial precision. Requires migration + all display formatting.
8. **Cart cross-restaurant** — Navigating to different restaurant's cart shows wrong items
9. **Negative tip** — Custom tip accepts negative despite `min="0"`
10. **Analytics aggregation** — Loads all orders into memory. Needs DB-level aggregation.
11. **Accessibility** — Missing aria-labels on hamburger, FAQ, quantity buttons

### Low Priority
12. **Tests** — No test suite (0% coverage)
13. **Google OAuth** — Button shows but needs `GOOGLE_CLIENT_ID`/`SECRET` in Vercel env
14. **Image upload** — Menu items only accept URL, no file upload
15. **Email notifications** — `console.log` only
16. **Dead code** — `src/lib/demo-charts.ts`, unused imports

---

## Uncommitted Changes

```
M src/app/api/orders/route.ts        — Removed duplicate POST handler
M src/app/api/promotions/route.ts    — Split GET: public code validation vs owner-only list
M src/app/api/restaurants/route.ts   — Added requireAdmin() to POST
M src/app/auth/login/page.tsx        — Password validation >= 8 (was 6)
M src/app/pricing/page.tsx           — Unicode fix for en-dashes
M src/middleware.ts                   — Tightened public API route allowlist
```

These 6 files contain the security fixes from this session and need to be committed.

---

## Quick Start for Next Agent

```bash
cd /Users/dan/Projects/Restaurant_Payment/.claude/worktrees/sweet-sutherland/
npm run dev          # Dev server on port 3001
npm run build        # Full build (includes prisma generate + migrate deploy)
npm run db:seed      # Re-seed demo data in Neon

# Demo accounts
# Admin:    admin@getfed.com / admin123
# Owner:    owner@getfed.com / owner123
# Customer: customer@getfed.com / customer123
```

### Key files to know
- `AGENTS.md` — Full development history + remaining work + critical warnings
- `src/middleware.ts` — Route protection (Edge-safe, imports auth.config.ts NOT auth.ts)
- `src/lib/actions.ts` — Server actions (~800 lines, the canonical order creation path)
- `src/lib/auth.config.ts` — Edge-safe auth (middleware) vs `src/lib/auth.ts` (full, API routes)
- `prisma/schema.prisma` — 16 models, NO `url` in datasource (uses PrismaPg adapter)

### Don't break these
1. **Prisma 7 adapter** — No `url`/`directUrl` in schema.prisma. Connection via `PrismaPg`.
2. **Auth edge split** — Never import `auth.ts` in middleware.
3. **Guest checkout** — `POST /api/orders` used to be public; now order creation goes through server action. Middleware still allows it for safety.
