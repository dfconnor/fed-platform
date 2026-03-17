# Changelog

All notable changes to the Fed platform are documented here.

## [0.3.0] — 2026-03-17 — Cart Polish + Registration Fix

### Fixed
- **Cart tax/fee** now reads from restaurant API instead of hardcoded values ($0.49 fee, 8.75% tax)
- **Cart promo codes** validated against server (`/api/promotions`) instead of hardcoded "FED10"
- **`dine_in` enum** — unified to `dine_in` everywhere (cart previously used `dinein`)
- **Registration page** — removed misleading role selector (backend always sets `customer`)
- **Service fee display** — conditionally hidden when $0

---

## [0.2.0] — 2026-03-17 — Security Hardening + Postgres Migration

### Infrastructure
- **Migrated from SQLite/libSQL to PostgreSQL** (Neon serverless Postgres)
- **Deployed to Vercel** — auto-deploys from `main` at https://fed-platform.vercel.app
- Uses `@prisma/adapter-pg` with `PrismaPg({ connectionString })` pattern (Prisma 7)
- Auth split: `auth.config.ts` (edge-safe for middleware) + `auth.ts` (full with Prisma)
- Added `SessionProvider` wrapper via `src/components/providers.tsx`

### Added
- **NextAuth route handler** (`/api/auth/[...nextauth]`) — login, logout, OAuth
- **API auth guards** on all mutable routes via `src/lib/api-auth.ts`
- **Database indexes** on Order, MenuItem, Restaurant, Promotion
- **SWR hooks** for all data fetching
- **Zod validation schemas** for all API inputs (no `.passthrough()`)
- **Admin API routes** (restaurants, users, settings)
- **Promotions API** with full CRUD

### Fixed
- **Login** uses NextAuth `signIn("credentials")` (was calling non-existent endpoint)
- **Cart checkout** calls `createOrder` server action (was fake `setTimeout`)
- **Order confirmation** fetches real order data + polls for status updates
- **Sign-out** buttons wired to `signOut()`
- **Registration** hardcoded to `role: "customer"`
- **Analytics** protected with `requireAuth()`

### Removed
- `mock-data.ts` (1,277 lines)
- `proxy.ts` (superseded by NextAuth middleware)
- `@libsql/client` and `@prisma/adapter-libsql` dependencies

---

## [0.1.0] — 2026-03-12 — Initial Release

### Added
- Complete restaurant ordering platform with Next.js 16 App Router
- Customer-facing restaurant pages with menu browsing and cart
- Restaurant owner dashboard with analytics, menu management, order tracking
- Admin panel for platform-wide management
- Prisma schema with SQLite/LibSQL support
- Seed data with 2 demo restaurants (The Golden Fork, Sakura Sushi)
- Stripe payment stub (demo mode)
- Google OAuth configuration (requires credentials)
- Tailwind CSS v4 with shadcn/ui components
