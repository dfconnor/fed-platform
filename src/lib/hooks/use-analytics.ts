/**
 * =========================================================================
 * USE ANALYTICS — SWR hooks for analytics data
 * =========================================================================
 *
 * Two hooks for fetching analytics:
 *
 * - `useAnalytics(restaurantId, period)` — per-restaurant analytics
 *   (overview: revenue, orders, customers, etc.)
 *
 * - `usePlatformAnalytics(period)` — platform-wide analytics for the
 *   admin dashboard (all restaurants aggregated).
 *
 * Both hooks conditionally fetch based on required parameters.
 * =========================================================================
 */

import useSWR from "swr";
import { fetcher } from "@/lib/hooks/fetcher";

/** Chart data point for order-type / payment-method pie charts. */
export interface ChartSlice {
  name: string;
  value: number;
  color: string;
}

/** Overview analytics for a single restaurant. */
export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  ordersByHour: { hour: number; orders: number }[];
  orderTypes: ChartSlice[];
  paymentMethods: ChartSlice[];
  [key: string]: unknown; // Allow additional fields from the API
}

/** Platform-wide analytics for admins. */
export interface PlatformAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalRestaurants: number;
  totalUsers: number;
  platformFees: number;
  feePercent: number;
  revenueByDay: { date: string; revenue: number }[];
  topRestaurants: {
    id: string;
    name: string;
    revenue: number;
    orders: number;
    growth: string;
  }[];
  ordersPerRestaurant: { name: string; orders: number }[];
  revenueByRestaurant: ChartSlice[];
  [key: string]: unknown;
}

/**
 * Fetch analytics for a single restaurant.
 *
 * @param restaurantId - The restaurant's ID. Pass a falsy value to skip.
 * @param period       - Time period (e.g. "7d", "30d", "90d", "12m").
 *                       Defaults to "30d".
 */
export function useAnalytics(
  restaurantId: string | undefined | null,
  period: string = "30d"
) {
  const params = new URLSearchParams();
  if (restaurantId) params.set("restaurantId", restaurantId);
  params.set("period", period);
  params.set("type", "overview");

  const key = restaurantId ? `/api/analytics?${params}` : null;

  const { data, error, isLoading, mutate } = useSWR<AnalyticsOverview>(
    key,
    fetcher
  );

  return {
    analytics: data ?? null,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetch platform-wide analytics (admin dashboard).
 *
 * @param period - Time period (e.g. "7d", "30d", "90d", "12m").
 *                 Defaults to "30d".
 */
export function usePlatformAnalytics(period: string = "30d") {
  const params = new URLSearchParams();
  params.set("type", "platform");
  params.set("period", period);

  const key = `/api/analytics?${params}`;

  const { data, error, isLoading, mutate } = useSWR<PlatformAnalytics>(
    key,
    fetcher
  );

  return {
    analytics: data ?? null,
    isLoading,
    error,
    mutate,
  };
}

/** Weekly signup time-series for the admin growth chart. */
export interface SignupAnalytics {
  data: { weekStart: string; newUsers: number; newRestaurants: number }[];
}

/**
 * Fetch weekly signup counts (users + restaurants) for the admin growth chart.
 *
 * @param period - "4w" | "12w" | "26w" | "52w" (default "12w")
 */
export function useSignupAnalytics(period: string = "12w") {
  const { data, error, isLoading, mutate } = useSWR<SignupAnalytics>(
    `/api/admin/analytics/signups?period=${period}`,
    fetcher
  );
  return { data: data?.data ?? null, isLoading, error, mutate };
}

/** Monthly fee revenue time-series for the admin platform fees chart. */
export interface FeeAnalytics {
  data: {
    monthStart: string;
    gmv: number;
    platformFees: number;
    net: number;
  }[];
  feePercent: number;
}

/**
 * Fetch monthly platform fee revenue for the admin fees chart.
 *
 * @param period - "4w" | "12w" | "26w" | "52w" (default "12w")
 */
export function useFeeAnalytics(period: string = "12w") {
  const { data, error, isLoading, mutate } = useSWR<FeeAnalytics>(
    `/api/admin/analytics/fees?period=${period}`,
    fetcher
  );
  return {
    data: data?.data ?? null,
    feePercent: data?.feePercent ?? 2.5,
    isLoading,
    error,
    mutate,
  };
}
