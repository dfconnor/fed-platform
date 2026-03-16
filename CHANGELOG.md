# Changelog

All notable changes to the Fed platform are documented here.

## [Unreleased] — Security & Architecture Hardening

### Added
- **NextAuth route handler** (`/api/auth/[...nextauth]`) — login, logout, and OAuth callbacks now functional
- **API auth guards** — all mutable API routes now require authentication via `src/lib/api-auth.ts`
  - Menu CRUD: requires restaurant owner (or admin)
  - Orders GET: requires authenticated user
  - Order status PATCH: requires restaurant owner
  - Promotions CRUD: requires restaurant owner
  - Admin routes (restaurants, users, settings): requires admin role
- **Shared auth helpers** (`requireAuth`, `requireAdmin`, `requireRestaurantOwner`) in `src/lib/api-auth.ts`
- **NextAuth middleware** (`src/middleware.ts`) for page-level route protection (dashboard, admin)
- **Database indexes** on Order, MenuItem, Restaurant, Promotion for query performance
- **`.env.example`** documenting all required environment variables
- **README security status section** — clear "What's Real" vs "What's Mocked" documentation
- **SWR hooks** for all data fetching (menu, orders, analytics, promotions, admin)
- **Zod validation schemas** for all API inputs (replacing dangerous `.passthrough()`)
- **Prisma `$transaction`** for atomic order creation with server-side promo validation
- **Zustand cart store** consolidation — single source of truth for cart state
- **Admin API routes** (`/api/admin/restaurants`, `/api/admin/users`, `/api/admin/settings`)
- **Promotions API route** (`/api/promotions`) with full CRUD

### Fixed
- **Login page** now uses NextAuth `signIn("credentials")` instead of non-existent `/api/auth/login` endpoint
- **Cart checkout** now calls `createOrder` server action instead of fake `setTimeout` simulation
- **Order confirmation page** fetches real order data from API instead of showing hardcoded mock items
- **Sign-out** buttons in dashboard and admin layouts now call `signOut()`
- **Registration** hardcoded to `role: "customer"` — users can no longer self-assign `owner`/`admin`
- **Dashboard context** is session-aware — fetches the authenticated user's restaurants instead of hardcoded slug
- **Analytics field name mismatch** — API now returns both `avgOrderValue` and `averageOrderValue`
- **Admin restaurant PATCH schema** — replaced `.passthrough()` with explicit allowed fields
- **Menu PATCH** — removed broken `parseFloat`/`parseInt` on already-typed Zod output

### Removed
- `mock-data.ts` (1,277 lines of static mock data)
- `proxy.ts` route protection (superseded by `middleware.ts`)

### Security
- All API routes now enforce authentication and authorization
- Registration no longer accepts `role` from client input
- Admin endpoints require `admin` role at both middleware and API route level
- Restaurant mutations verify ownership before allowing changes
- Validation schemas use explicit fields instead of `.passthrough()`

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
