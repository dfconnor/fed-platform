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
