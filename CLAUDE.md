# Rival RV

## Project Overview
RV rental marketplace disrupting Outdoorsy (20-25% host fee) and RVshare (25% host fee) with only 5% fees per side.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom brand colors (brand-*, forest-*, sunset-*, sky-*)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Google, Apple, Email magic link via Resend)
- **Payments**: Stripe Connect (marketplace split payments) + Affirm/Klarna BNPL
- **Maps**: Mapbox GL JS
- **State**: Zustand (client), SWR (data fetching)
- **Infrastructure**: Docker Compose (postgres + app)

## Key Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
docker compose up -d postgres  # Start database
npx prisma migrate dev         # Run migrations
npx prisma db seed             # Seed demo data
npx prisma studio              # Database GUI
```

## Architecture
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities (prisma, auth, stripe, insurance, pricing)
- `src/types/` - TypeScript types and constants
- `prisma/` - Database schema, migrations, seed

## Business Rules
- Platform fee: 5% guest + 5% host (10% total) — key differentiator
- Insurance: Multi-carrier comparison (Cover Genius, Roamly, MBP) with 3 tiers
- Host payouts: 48 hours after trip completion via Stripe Connect
- Security deposits: Authorized (not captured) via Stripe, released 3 days post-trip
- All prices stored in cents (integer)

## Git Rules
- Stage specific files, never `git add .`
- Don't commit .env files
- Don't push unless asked
