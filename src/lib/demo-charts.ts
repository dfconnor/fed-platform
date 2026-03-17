/**
 * =========================================================================
 * CURATED DEMO CHART DATA
 * =========================================================================
 *
 * This file contains chart/visualization data that CANNOT be meaningfully
 * derived from the seed database (which has ~17 orders over a few days).
 *
 * These datasets create rich, realistic-looking charts for demo purposes.
 * When the platform has real historical data, these should be replaced
 * with API-computed aggregations.
 *
 * DATA THAT IS *NOT* HERE (fetched from DB via API instead):
 * - Menu items, categories, modifiers → /api/restaurants/[slug]
 * - Orders, order status → /api/orders
 * - Promotions → /api/promotions
 * - Restaurant settings → /api/restaurants/[slug]
 * - Platform settings → /api/admin/settings
 * - Basic analytics (top items, order types) → /api/analytics
 *
 * HOW TO CUSTOMIZE:
 * Edit the arrays below. Each section is self-contained and labeled
 * with the page that consumes it.
 * =========================================================================
 */

// ============================================
// SHARED TYPES
// ============================================

/** Stat card displayed at the top of overview pages. */
export interface StatCard {
  label: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  iconName: string;
  color: string;
  period?: string;
}

/** Activity feed entry for the admin overview. */
export interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
  iconName: string;
  iconColor: string;
}

// ============================================
// DASHBOARD ANALYTICS — Curated Charts
// ============================================
// Used by: src/app/dashboard/analytics/page.tsx
// These supplement the real analytics API with richer demo data.

/** Customer satisfaction rating breakdown (needs many reviews to compute). */
export const analyticsRatingDistribution = [
  { stars: 5, count: 186, percent: 62 },
  { stars: 4, count: 72, percent: 24 },
  { stars: 3, count: 24, percent: 8 },
  { stars: 2, count: 12, percent: 4 },
  { stars: 1, count: 6, percent: 2 },
];

/** Overall average rating. */
export const analyticsAverageRating = 4.7;

/** Total number of reviews. */
export const analyticsTotalReviews = 300;

// ============================================
// ADMIN OVERVIEW — Curated Charts
// ============================================
// Used by: src/app/admin/page.tsx

/** Weekly signups chart data (restaurants + users over 8 weeks). */
export const adminSignupData = [
  { week: "W1", restaurants: 2, users: 145 },
  { week: "W2", restaurants: 1, users: 178 },
  { week: "W3", restaurants: 3, users: 210 },
  { week: "W4", restaurants: 2, users: 192 },
  { week: "W5", restaurants: 4, users: 268 },
  { week: "W6", restaurants: 1, users: 234 },
  { week: "W7", restaurants: 3, users: 310 },
  { week: "W8", restaurants: 2, users: 287 },
];

/** Monthly platform fee revenue trend (6 months). */
export const adminFeeRevenueData = [
  { month: "Oct", fees: 11200 },
  { month: "Nov", fees: 12800 },
  { month: "Dec", fees: 14500 },
  { month: "Jan", fees: 13200 },
  { month: "Feb", fees: 15100 },
  { month: "Mar", fees: 17106 },
];

/** Recent platform activity feed (curated for demo). */
export const adminRecentActivity: ActivityItem[] = [
  {
    id: 1, type: "restaurant_signup",
    message: "New restaurant registered: Sakura Sushi",
    time: "12 min ago", iconName: "Store", iconColor: "text-purple-400",
  },
  {
    id: 2, type: "order",
    message: "Order FED-X9Y8Z7 completed at The Golden Fork ($67.50)",
    time: "18 min ago", iconName: "CheckCircle", iconColor: "text-green-400",
  },
  {
    id: 3, type: "user_signup",
    message: "New user registered: alex.johnson@email.com",
    time: "25 min ago", iconName: "Users", iconColor: "text-blue-400",
  },
  {
    id: 4, type: "order_cancelled",
    message: "Order FED-A2B3C4 cancelled at Pizza Palace",
    time: "32 min ago", iconName: "XCircle", iconColor: "text-red-400",
  },
  {
    id: 5, type: "restaurant_approval",
    message: "Thai Delight pending approval - submitted 2 hours ago",
    time: "2 hr ago", iconName: "AlertCircle", iconColor: "text-amber-400",
  },
  {
    id: 6, type: "order",
    message: "Order FED-D5E6F7 completed at Taco Fiesta ($34.20)",
    time: "3 hr ago", iconName: "CheckCircle", iconColor: "text-green-400",
  },
  {
    id: 7, type: "restaurant_signup",
    message: "New restaurant registered: The Burger Joint",
    time: "5 hr ago", iconName: "Store", iconColor: "text-purple-400",
  },
  {
    id: 8, type: "user_signup",
    message: "New user registered: maria.garcia@email.com",
    time: "6 hr ago", iconName: "Users", iconColor: "text-blue-400",
  },
];

// ============================================
// ADMIN ANALYTICS — Curated Charts
// ============================================
// Used by: src/app/admin/analytics/page.tsx
// Rich multi-month data that requires a large platform to compute.

/** Monthly GMV + platform fees area chart (7 months). */
export const adminPlatformRevenueData = [
  { month: "Sep", revenue: 420000, fees: 10500 },
  { month: "Oct", revenue: 480000, fees: 12000 },
  { month: "Nov", revenue: 510000, fees: 12750 },
  { month: "Dec", revenue: 620000, fees: 15500 },
  { month: "Jan", revenue: 550000, fees: 13750 },
  { month: "Feb", revenue: 590000, fees: 14750 },
  { month: "Mar", revenue: 684000, fees: 17100 },
];

/** Orders per restaurant horizontal bar chart. */
export const adminOrdersPerRestaurant = [
  { name: "Pizza Palace", orders: 4150 },
  { name: "Taco Fiesta", orders: 3210 },
  { name: "The Golden Fork", orders: 2847 },
  { name: "Sakura Sushi", orders: 1923 },
  { name: "Le Petit Bistro", orders: 1580 },
  { name: "Wok Express", orders: 890 },
];

/** Weekly growth metrics (12 weeks). */
export const adminGrowthData = [
  { week: "W1", newUsers: 42, newRestaurants: 1 },
  { week: "W2", newUsers: 58, newRestaurants: 0 },
  { week: "W3", newUsers: 67, newRestaurants: 2 },
  { week: "W4", newUsers: 53, newRestaurants: 1 },
  { week: "W5", newUsers: 84, newRestaurants: 3 },
  { week: "W6", newUsers: 71, newRestaurants: 0 },
  { week: "W7", newUsers: 92, newRestaurants: 2 },
  { week: "W8", newUsers: 78, newRestaurants: 1 },
  { week: "W9", newUsers: 105, newRestaurants: 2 },
  { week: "W10", newUsers: 88, newRestaurants: 1 },
  { week: "W11", newUsers: 112, newRestaurants: 3 },
  { week: "W12", newUsers: 96, newRestaurants: 2 },
];

/** Top performing restaurants by revenue. */
export const adminTopRestaurants = [
  { name: "Pizza Palace", revenue: 201000, orders: 4150, rating: 4.3, growth: "+15%" },
  { name: "The Golden Fork", revenue: 148230, orders: 2847, rating: 4.7, growth: "+22%" },
  { name: "Le Petit Bistro", revenue: 134200, orders: 1580, rating: 4.9, growth: "+31%" },
  { name: "Sakura Sushi", revenue: 112450, orders: 1923, rating: 4.8, growth: "+18%" },
  { name: "Taco Fiesta", revenue: 95800, orders: 3210, rating: 4.5, growth: "+12%" },
];

/** Revenue breakdown pie chart by restaurant. */
export const adminRevenueByRestaurant = [
  { name: "Pizza Palace", value: 201000, color: "#a855f7" },
  { name: "The Golden Fork", value: 148230, color: "#3b82f6" },
  { name: "Le Petit Bistro", value: 134200, color: "#10b981" },
  { name: "Sakura Sushi", value: 112450, color: "#f59e0b" },
  { name: "Taco Fiesta", value: 95800, color: "#ef4444" },
  { name: "Others", value: 42100, color: "#6b7280" },
];

/** Platform fee revenue vs net revenue stacked bar (7 months). */
export const adminAnalyticsFeeRevenueData = [
  { month: "Sep", platformFees: 10500, net: 4200 },
  { month: "Oct", platformFees: 12000, net: 4800 },
  { month: "Nov", platformFees: 12750, net: 5100 },
  { month: "Dec", platformFees: 15500, net: 6200 },
  { month: "Jan", platformFees: 13750, net: 5500 },
  { month: "Feb", platformFees: 14750, net: 5900 },
  { month: "Mar", platformFees: 17100, net: 6840 },
];

/** KPI cards for the admin analytics page (curated large-scale metrics). */
export const adminAnalyticsKpis: StatCard[] = [
  { label: "Total GMV", value: "$3.86M", change: "+22%", iconName: "DollarSign", color: "text-green-400 bg-green-500/20" },
  { label: "Platform Fees", value: "$96.4K", change: "+22%", iconName: "TrendingUp", color: "text-purple-400 bg-purple-500/20" },
  { label: "New Users (12w)", value: "946", change: "+34%", iconName: "Users", color: "text-blue-400 bg-blue-500/20" },
  { label: "New Restaurants (12w)", value: "18", change: "+50%", iconName: "Store", color: "text-amber-400 bg-amber-500/20" },
];
