import { PLATFORM_FEE_RATE, PricingBreakdown } from '@/types';

export function calculatePricing({
  nightlyRate,
  nights,
  cleaningFee = 0,
  deliveryFee = 0,
  addOnsTotal = 0,
  insuranceFee = 0,
  securityDeposit = 0,
  weeklyDiscount = 0,
  monthlyDiscount = 0,
}: {
  nightlyRate: number;
  nights: number;
  cleaningFee?: number;
  deliveryFee?: number;
  addOnsTotal?: number;
  insuranceFee?: number;
  securityDeposit?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
}): PricingBreakdown {
  const nightlyTotal = nightlyRate * nights;

  // Calculate discount
  let discountRate = 0;
  if (nights >= 28 && monthlyDiscount > 0) {
    discountRate = monthlyDiscount / 100;
  } else if (nights >= 7 && weeklyDiscount > 0) {
    discountRate = weeklyDiscount / 100;
  }
  const discount = Math.round(nightlyTotal * discountRate);

  const subtotal = nightlyTotal - discount + cleaningFee + deliveryFee + addOnsTotal + insuranceFee;

  // 5% guest fee, 5% host fee — total 10% platform take
  const platformFeeGuest = Math.round(subtotal * PLATFORM_FEE_RATE);
  const platformFeeHost = Math.round(subtotal * PLATFORM_FEE_RATE);

  const total = subtotal + platformFeeGuest;

  const hostPayout = subtotal - platformFeeHost - insuranceFee;

  return {
    nightlyRate,
    nights,
    nightlyTotal,
    cleaningFee,
    deliveryFee,
    addOnsTotal,
    insuranceFee,
    platformFeeGuest,
    discount,
    subtotal,
    total,
    securityDeposit,
    platformFeeHost,
    hostPayout,
  };
}

export function formatNightlyDisplay(nightlyRate: number, nights: number): string {
  const perNight = nightlyRate / 100;
  if (nights === 1) return `$${perNight}/night`;
  return `$${perNight}/night × ${nights} nights`;
}
