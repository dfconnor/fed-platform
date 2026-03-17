// Change this to rebrand
export const PLATFORM_NAME = "Fed";

export const PLATFORM_TAGLINE = "Order from the best local restaurants";

// --- Pricing / Fee Model ---
// Fed charges restaurants a flat 2.9% + $0.30 per transaction (Stripe pass-through only).
// No monthly fees. No commissions. No hidden charges. No markups.
// Compare: DoorDash 15-30%, Grubhub 15-30%, Uber Eats 15-30%, Toast 2.49-3.69%+$0.15.
export const PLATFORM_FEES = {
  /** Stripe processing pass-through — we don't mark this up */
  paymentProcessingRate: 0.029,
  paymentProcessingFlat: 0.30,
  /** Tiny per-order platform fee to cover hosting ($0.49 vs competitors' $1.99-$3.99) */
  customerServiceFee: 0.49,
  /** No restaurant commission — ever. This is the Fed promise. */
  restaurantCommission: 0,
  /** Optional premium tier for advanced analytics, marketing tools, etc. */
  premiumMonthly: 29, // vs Toast $69-$165/mo, Square $60/mo
} as const;

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "#F59E0B" },
  confirmed: { label: "Confirmed", color: "#3B82F6" },
  preparing: { label: "Preparing", color: "#8B5CF6" },
  ready: { label: "Ready", color: "#10B981" },
  out_for_delivery: { label: "Out for Delivery", color: "#06B6D4" },
  delivered: { label: "Delivered", color: "#22C55E" },
  completed: { label: "Completed", color: "#16A34A" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
  refunded: { label: "Refunded", color: "#6B7280" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

export const PAYMENT_METHODS = {
  card: { label: "Credit / Debit Card", icon: "CreditCard" },
  apple_pay: { label: "Apple Pay", icon: "Apple" },
  google_pay: { label: "Google Pay", icon: "Smartphone" },
  cash: { label: "Cash", icon: "Banknote" },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export const DIETARY_FLAGS = [
  { key: "isVegetarian", label: "Vegetarian", emoji: "V", color: "#22C55E" },
  { key: "isVegan", label: "Vegan", emoji: "VG", color: "#16A34A" },
  { key: "isGlutenFree", label: "Gluten Free", emoji: "GF", color: "#F59E0B" },
  { key: "isSpicy", label: "Spicy", emoji: "S", color: "#EF4444" },
] as const;

export const DEFAULT_BRAND_COLORS = {
  primary: "#E63946",
  secondary: "#1D3557",
  accent: "#F4A261",
  background: "#FFFFFF",
  foreground: "#0F172A",
  muted: "#F1F5F9",
  mutedForeground: "#64748B",
} as const;

export const ORDER_TYPES = {
  pickup: { label: "Pickup", icon: "ShoppingBag" },
  delivery: { label: "Delivery", icon: "Truck" },
  dine_in: { label: "Dine In", icon: "UtensilsCrossed" },
} as const;

export type OrderType = keyof typeof ORDER_TYPES;

// ============================================
// DASHBOARD UI CONFIG
// ============================================
// Display-only config for order workflow badges, status transitions, etc.
// Moved from mock-data.ts — these are UI constants, not database state.

/**
 * Order status workflow for the dashboard orders page.
 * Defines badge variants and the "next" status transition.
 */
export const ORDER_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "warning" | "default" | "success" | "secondary";
    next?: string;
    nextLabel?: string;
  }
> = {
  pending: { label: "Pending", variant: "warning", next: "preparing", nextLabel: "Confirm" },
  preparing: { label: "Preparing", variant: "default", next: "ready", nextLabel: "Mark Ready" },
  ready: { label: "Ready", variant: "success", next: "completed", nextLabel: "Complete" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

/** Human-readable labels for order types. */
export const ORDER_TYPE_LABELS: Record<string, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
  dine_in: "Dine In",
};

/** Days of the week, ordered Monday-Sunday. */
export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

/** CSS classes for user role badges in the admin panel. */
export const ROLE_BADGE_STYLES: Record<string, string> = {
  customer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  owner: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  admin: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

/** Default empty menu item form state. */
export const EMPTY_MENU_ITEM = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  imageUrl: "",
  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isSpicy: false,
  isActive: true,
  isPopular: false,
  calories: null as number | null,
};

/** Default empty promotion form state. */
export const EMPTY_PROMOTION = {
  code: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0,
  minOrder: 0,
  maxUses: null as number | null,
  usedCount: 0,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};
