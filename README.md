# Rival RV

**The fair marketplace for RV rentals.** Lower fees, transparent pricing, better insurance.

## Why Rival RV?

| | Outdoorsy | RVshare | **Rival RV** |
|---|---|---|---|
| Host Fee | 20-25% | 25% | **5%** |
| Guest Fee | 10% + $10-15/day | ~15% | **5%** |
| Insurance | Proprietary (Roamly) | Single carrier | **Multi-carrier comparison** |
| Pricing | Hidden fees | Hidden fees | **All-in upfront** |
| Host Payout | 5-7 days | 3-5 days | **48 hours** |

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL
- **Payments**: Stripe Connect + Affirm BNPL
- **Maps**: Mapbox GL JS
- **Auth**: NextAuth.js (Google, Apple, Email)
- **Insurance**: Multi-carrier API integration
- **Infrastructure**: Docker + Docker Compose

## Getting Started

```bash
# Clone
git clone https://github.com/dfconnor/Rival-RV.git
cd Rival-RV

# Install
npm install

# Set up environment
cp .env.example .env.local
# Fill in your API keys

# Start database
docker compose up -d postgres

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
rival-rv/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth pages (login, register)
│   │   ├── (dashboard)/     # Host & guest dashboards
│   │   ├── api/             # API routes
│   │   ├── listing/         # RV listing pages
│   │   ├── search/          # Search & map view
│   │   ├── booking/         # Booking flow
│   │   ├── checkout/        # Checkout & payment
│   │   └── page.tsx         # Homepage
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities, API clients, helpers
│   └── types/               # TypeScript type definitions
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
├── docker/                  # Docker configs
└── docker-compose.yml
```

## License

Proprietary - All rights reserved.
