export type RVType =
  | 'CLASS_A'
  | 'CLASS_B'
  | 'CLASS_C'
  | 'TRAVEL_TRAILER'
  | 'FIFTH_WHEEL'
  | 'POP_UP'
  | 'TRUCK_CAMPER'
  | 'TOY_HAULER'
  | 'CAMPERVAN'
  | 'TEARDROP'
  | 'AIRSTREAM'
  | 'OTHER';

export type InsuranceTier = 'BASIC' | 'ESSENTIAL' | 'PREMIUM';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type PaymentMethod = 'CARD' | 'AFFIRM' | 'KLARNA';
export type CancellationPolicy = 'FLEXIBLE' | 'MODERATE' | 'STRICT';
export type VerificationStatus = 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
export type AgreementStatus = 'DRAFT' | 'PENDING_GUEST' | 'PENDING_HOST' | 'SIGNED' | 'VOIDED';
export type ClaimStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED' | 'APPEALED' | 'RESOLVED';
export type DisputeOutcome = 'PENDING' | 'HOST_FAVORED' | 'GUEST_FAVORED' | 'SPLIT' | 'DISMISSED';
export type VerificationLevel = 'none' | 'id_verified' | 'background_checked' | 'fully_verified';
export type DamageType = 'exterior' | 'interior' | 'mechanical' | 'cleaning' | 'other';

export const RV_TYPE_LABELS: Record<RVType, string> = {
  CLASS_A: 'Class A Motorhome',
  CLASS_B: 'Class B Campervan',
  CLASS_C: 'Class C Motorhome',
  TRAVEL_TRAILER: 'Travel Trailer',
  FIFTH_WHEEL: 'Fifth Wheel',
  POP_UP: 'Pop-Up Camper',
  TRUCK_CAMPER: 'Truck Camper',
  TOY_HAULER: 'Toy Hauler',
  CAMPERVAN: 'Campervan',
  TEARDROP: 'Teardrop Trailer',
  AIRSTREAM: 'Airstream',
  OTHER: 'Other',
};

export const AMENITY_LABELS: Record<string, string> = {
  kitchen: 'Kitchen',
  ac: 'Air Conditioning',
  heating: 'Heating',
  generator: 'Generator',
  solar: 'Solar Panels',
  shower: 'Shower',
  toilet: 'Toilet',
  tv: 'TV/Entertainment',
  wifi: 'WiFi',
  awning: 'Awning',
  outdoor_kitchen: 'Outdoor Kitchen',
  leveling_jacks: 'Leveling Jacks',
  backup_camera: 'Backup Camera',
  bike_rack: 'Bike Rack',
  grill: 'Grill/BBQ',
  washer_dryer: 'Washer/Dryer',
  fireplace: 'Fireplace',
  satellite: 'Satellite TV',
  inverter: 'Inverter',
  water_heater: 'Water Heater',
};

export const FEATURE_LABELS: Record<string, string> = {
  pet_friendly: 'Pet Friendly',
  festival_ready: 'Festival Ready',
  off_grid: 'Off-Grid Capable',
  tow_hitch: 'Tow Hitch',
  smoking_allowed: 'Smoking Allowed',
  tailgate_ready: 'Tailgate Ready',
  handicap_accessible: 'Handicap Accessible',
  child_seats: 'Child Seat Anchors',
};

export interface SearchFilters {
  location: string;
  startDate: string;
  endDate: string;
  rvType?: RVType;
  minPrice?: number;
  maxPrice?: number;
  sleeps?: number;
  amenities?: string[];
  features?: string[];
  instantBook?: boolean;
  deliveryAvailable?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
  bounds?: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };
}

export interface PricingBreakdown {
  nightlyRate: number;
  nights: number;
  nightlyTotal: number;
  cleaningFee: number;
  deliveryFee: number;
  addOnsTotal: number;
  insuranceFee: number;
  platformFeeGuest: number;
  discount: number;
  subtotal: number;
  total: number;
  securityDeposit: number;
  platformFeeHost: number;
  hostPayout: number;
}

export interface InsuranceQuote {
  provider: string;
  tier: InsuranceTier;
  name: string;
  price: number; // cents
  coverage: {
    liability: number;
    collision: number;
    comprehensive: number;
    interior: boolean;
    roadside: boolean;
    tripCancellation: boolean;
  };
  deductible: number;
  description: string;
}

export const PLATFORM_FEE_RATE = 0.05; // 5% each side
export const SECURITY_DEPOSIT_HOLD_DAYS = 3;
export const CLAIM_FILING_DEADLINE_DAYS = 7;
export const DEPOSIT_AUTO_RELEASE_DAYS = 3;
export const AGREEMENT_VERSION = '1.0';

export interface RentalAgreementTerms {
  mileageLimit: number | null;
  generatorHoursLimit: number | null;
  geographicRestrictions: string | null;
  petPolicy: string;
  smokingPolicy: string;
  towingAllowed: boolean;
}

export interface DamageClaimSummary {
  id: string;
  bookingRef: string;
  rvTitle: string;
  damageType: DamageType;
  requestedAmount: number;
  approvedAmount: number | null;
  status: ClaimStatus;
  filedAt: string;
  guestName: string;
  hostName: string;
}

export const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  exterior: 'Exterior Damage',
  interior: 'Interior Damage',
  mechanical: 'Mechanical Issue',
  cleaning: 'Excessive Cleaning',
  other: 'Other',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  VERIFIED: 'Verified',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
};

export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatCentsDecimal(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
