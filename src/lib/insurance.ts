import { InsuranceQuote, InsuranceTier } from '@/types';

// Insurance provider configurations
const PROVIDERS = [
  {
    id: 'covergenius',
    name: 'Cover Genius',
    baseRatePerDay: { BASIC: 1500, ESSENTIAL: 2500, PREMIUM: 4000 }, // cents
  },
  {
    id: 'roamly',
    name: 'Roamly',
    baseRatePerDay: { BASIC: 1800, ESSENTIAL: 2800, PREMIUM: 4200 },
  },
  {
    id: 'mbp',
    name: 'MBP Insurance',
    baseRatePerDay: { BASIC: 1400, ESSENTIAL: 2400, PREMIUM: 3800 },
  },
];

const TIER_CONFIGS: Record<InsuranceTier, {
  name: string;
  liability: number;
  collision: number;
  comprehensive: number;
  interior: boolean;
  roadside: boolean;
  tripCancellation: boolean;
  deductible: number;
  description: string;
}> = {
  BASIC: {
    name: 'Basic Protection',
    liability: 500000,
    collision: 50000,
    comprehensive: 50000,
    interior: false,
    roadside: false,
    tripCancellation: false,
    deductible: 250000, // $2,500 in cents
    description: 'Liability coverage and basic collision/comprehensive. Good for experienced RVers on a budget.',
  },
  ESSENTIAL: {
    name: 'Essential Protection',
    liability: 1000000,
    collision: 150000,
    comprehensive: 150000,
    interior: true,
    roadside: true,
    tripCancellation: false,
    deductible: 100000, // $1,000
    description: 'Full liability, collision, comprehensive, interior damage, and 24/7 roadside assistance. Our most popular option.',
  },
  PREMIUM: {
    name: 'Premium Protection',
    liability: 1000000,
    collision: 300000,
    comprehensive: 300000,
    interior: true,
    roadside: true,
    tripCancellation: true,
    deductible: 50000, // $500
    description: 'Maximum coverage including trip cancellation, zero-hassle claims, and the lowest deductible. Total peace of mind.',
  },
};

// Get quotes from all providers for comparison
export async function getInsuranceQuotes(params: {
  rvValue: number; // cents
  nights: number;
  rvType: string;
  rvYear: number;
}): Promise<InsuranceQuote[]> {
  const quotes: InsuranceQuote[] = [];

  for (const provider of PROVIDERS) {
    for (const tier of ['BASIC', 'ESSENTIAL', 'PREMIUM'] as InsuranceTier[]) {
      const config = TIER_CONFIGS[tier];
      const baseRate = provider.baseRatePerDay[tier];

      // Adjust rate based on RV characteristics
      let rateMultiplier = 1.0;

      // Older RVs cost more to insure
      const currentYear = new Date().getFullYear();
      const age = currentYear - params.rvYear;
      if (age > 10) rateMultiplier *= 1.15;
      else if (age > 5) rateMultiplier *= 1.05;

      // Higher value RVs cost more
      if (params.rvValue > 10000000) rateMultiplier *= 1.2; // > $100K
      else if (params.rvValue > 5000000) rateMultiplier *= 1.1; // > $50K

      // Class A motorhomes cost more than trailers
      if (params.rvType === 'CLASS_A') rateMultiplier *= 1.15;
      else if (params.rvType === 'FIFTH_WHEEL') rateMultiplier *= 1.05;

      const dailyRate = Math.round(baseRate * rateMultiplier);
      const totalPrice = dailyRate * params.nights;

      quotes.push({
        provider: provider.name,
        tier,
        name: config.name,
        price: totalPrice,
        coverage: {
          liability: config.liability,
          collision: Math.min(config.collision, params.rvValue),
          comprehensive: Math.min(config.comprehensive, params.rvValue),
          interior: config.interior,
          roadside: config.roadside,
          tripCancellation: config.tripCancellation,
        },
        deductible: config.deductible,
        description: config.description,
      });
    }
  }

  // Sort by price within each tier, return best rate per tier
  return quotes;
}

// Get the best quote for each tier
export async function getBestInsuranceQuotes(params: {
  rvValue: number;
  nights: number;
  rvType: string;
  rvYear: number;
}): Promise<InsuranceQuote[]> {
  const allQuotes = await getInsuranceQuotes(params);

  const bestByTier: Record<string, InsuranceQuote> = {};
  for (const quote of allQuotes) {
    if (!bestByTier[quote.tier] || quote.price < bestByTier[quote.tier].price) {
      bestByTier[quote.tier] = quote;
    }
  }

  return Object.values(bestByTier).sort((a, b) => a.price - b.price);
}
