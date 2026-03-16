# Fed — Zero-Commission Restaurant Ordering

A modern, mobile-first restaurant ordering platform that lets restaurants keep 100% of their food revenue. Built as a low-cost alternative to Toast, DoorDash, Grubhub, and other platforms that charge 15-30% commission.

## Why Fed?

| Platform | Commission | Monthly Fee | On a $30 order |
|----------|-----------|-------------|-----------------|
| **Fed** | **0%** | **$0 (Free) / $29 (Pro)** | **You keep $28.83** |
| DoorDash | 15-30% | $0-$69/mo | You keep $22.50 |
| Grubhub | 15-30% | $0 | You keep $22.50 |
| Toast | 0% | $69-$165/mo | You keep $28.88 |

## Features

**For Customers:**
- No account required — guest checkout with name/phone/email
- Apple Pay, Google Pay, credit card support
- No app download needed — works in any browser
- QR code scanning for dine-in ordering
- Real-time order tracking

**For Restaurant Owners:**
- 5-minute setup — upload menu, set brand colors, get a link
- Custom branding (colors, logo) per restaurant
- Real-time order dashboard with notifications
- Menu management with categories, modifiers, dietary flags
- Analytics suite (revenue, orders, popular items)
- Promotion and discount management

**For Platform Admins:**
- Multi-restaurant management
- Platform-wide analytics
- User management with role-based access
- Platform settings and fee configuration

## Current Status & Security Note

**⚠️ SECURITY WARNING:** This platform is currently in a security-hardening phase. While many core security issues (unauthenticated API routes, broken login, insecure schemas) have been addressed, it is not yet production-ready.

### What's Real:
- **Authentication:** Full NextAuth v5 implementation with Credentials and Google OAuth.
- **Route Protection:** Global middleware guarding `/dashboard` and `/admin`.
- **Order Flow:** Orders are server-validated and saved to the database via secure Server Actions.
- **Promo System:** Atomic server-side promo validation and usage tracking.
- **Multi-tenancy:** Dashboard and analytics are keyed to the authenticated user's session.

### What's Mocked/Pending:
- **Payments:** Stripe is currently in demo mode (`pi_demo_` secrets). Real SDK integration is pending webhook implementation.
- **Analytics:** Data is aggregated in real-time from the database. For large-scale production, a pre-aggregated analytics table/view is recommended.
- **Emails:** Order confirmation emails are stubbed with console logs.
- **Images:** S3/Cloudinary integration is mocked; using placeholder URLs.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes, Prisma 7 with SQLite (LibSQL adapter)
- **Auth:** NextAuth v5 (credentials + OAuth ready)
- **Payments:** Stripe (demo mode, ready for live keys)
- **UI:** Radix UI primitives, Recharts for analytics
- **State:** Zustand (cart), React hooks

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create and seed the database
npx prisma db push
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@getfed.com | admin123 |
| Owner | owner@getfed.com | owner123 |
| Customer | customer@getfed.com | customer123 |

### Demo Restaurants
- **The Golden Fork** — `/r/the-golden-fork` (American)
- **Sakura Sushi** — `/r/sakura-sushi` (Japanese)

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    pricing/              # Pricing comparison page
    r/[slug]/             # Restaurant storefront (menu, cart, order tracking)
    dashboard/            # Restaurant owner dashboard
    admin/                # Platform admin panel
    auth/                 # Login / Register
    api/                  # API routes (restaurants, orders, menu, analytics, stripe)
  components/ui/          # Radix-based UI components
  lib/
    db.ts                 # Prisma client (LibSQL adapter)
    auth.ts               # NextAuth configuration
    constants.ts          # Platform name, fees, config
    seed.ts               # Database seeder
    store.ts              # Zustand cart store
    utils.ts              # Utilities
prisma/
  schema.prisma           # Database schema (16 models)
```

## Fee Model

Fed's pricing is designed to be radically transparent:

- **Free tier:** $0/month — only Stripe processing (2.9% + $0.30)
- **Pro tier:** $29/month — advanced analytics, promotions, multi-location
- **Zero commission** — restaurants keep 100% of food revenue
- **$0.49 customer service fee** — vs $1.99-$3.99 on competitor platforms

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_PLATFORM_NAME="Fed"
```

## License

MIT
