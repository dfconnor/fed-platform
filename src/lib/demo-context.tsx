/**
 * =========================================================================
 * DEMO CONTEXT PROVIDERS
 * =========================================================================
 *
 * Provides the "current restaurant" and "platform settings" to all child
 * pages without requiring real authentication.
 *
 * HOW IT WORKS:
 * - DashboardProvider wraps the dashboard layout. It fetches the demo
 *   restaurant ("The Golden Fork") from the API and exposes its data
 *   through the useDashboard() hook.
 * - AdminProvider wraps the admin layout. It fetches platform settings
 *   from the API and exposes them through useAdminContext().
 *
 * REPLACING WITH REAL AUTH:
 * When you wire up real login, replace the hardcoded slug/owner lookup
 * with the authenticated user's session. The hook API stays the same.
 * =========================================================================
 */

"use client";

import React, { createContext, useContext, useEffect, type ReactNode } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/hooks/fetcher";
import { useSession } from "next-auth/react";

// ============================================
// CONSTANTS — change these to switch the demo restaurant
// ============================================

/** The slug of the restaurant shown in the dashboard. */
export const DEMO_RESTAURANT_SLUG = "the-golden-fork";

// ============================================
// DASHBOARD CONTEXT
// ============================================

interface DashboardContextValue {
  /** Prisma restaurant ID (cuid) — empty string if user has no restaurant */
  restaurantId: string;
  /** URL-safe slug */
  slug: string;
  /** Display name for the restaurant */
  restaurantName: string;
  /** Full restaurant description */
  restaurantDescription: string;
  /** Owner's display name */
  ownerName: string;
  /** True while the initial fetch is in progress */
  isLoading: boolean;
  /** True when fetch is complete and the user owns no restaurant */
  hasNoRestaurant: boolean;
  /** Error from fetch, if any */
  error: Error | undefined;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

/**
 * Wrap the dashboard layout with this provider.
 * It fetches the current user's restaurant and shares data with all pages.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // In a real app, you might have a "current restaurant" in the URL or session.
  // For now, we'll fetch the first restaurant owned by the user.
  const { data, error, isLoading } = useSWR<{
    restaurants: Array<{
      id: string;
      slug: string;
      name: string;
      description: string | null;
      owner: { name: string | null };
    }>;
  }>(session?.user?.id ? `/api/restaurants?ownerId=${session.user.id}` : null, fetcher);

  const restaurant = data?.restaurants?.[0];
  const sessionLoading = status === "loading";
  const fetchInFlight = isLoading || (session?.user?.id && data === undefined && !error);
  const fetchComplete = !sessionLoading && !fetchInFlight;
  const hasNoRestaurant = fetchComplete && !restaurant;

  // Admins land on /dashboard with no restaurant — send them to /admin instead.
  useEffect(() => {
    if (hasNoRestaurant && session?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [hasNoRestaurant, session?.user?.role, router]);

  // Display name: real name → "No restaurant assigned" once fetch is done → "Loading..." while pending
  let restaurantName = "Loading...";
  if (restaurant) {
    restaurantName = restaurant.name;
  } else if (hasNoRestaurant) {
    restaurantName =
      session?.user?.role === "admin" ? "Platform Admin" : "No restaurant assigned";
  }

  const value: DashboardContextValue = {
    restaurantId: restaurant?.id ?? "",
    slug: restaurant?.slug ?? "",
    restaurantName,
    restaurantDescription: restaurant?.description ?? "",
    ownerName: restaurant?.owner?.name ?? session?.user?.name ?? "Owner",
    isLoading: !fetchComplete,
    hasNoRestaurant,
    error,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Access the current restaurant context from any dashboard page.
 * Must be used inside DashboardProvider.
 */
export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard() must be used inside <DashboardProvider>");
  }
  return ctx;
}

// ============================================
// ADMIN CONTEXT
// ============================================

interface AdminContextValue {
  /** Platform display name */
  platformName: string;
  /** Full platform settings */
  platformSettings: {
    platformName: string;
    platformFeePercent: number;
    supportEmail: string;
    logoUrl: string | null;
  } | null;
  /** True while the initial fetch is in progress */
  isLoading: boolean;
  /** Error from fetch, if any */
  error: Error | undefined;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/**
 * Wrap the admin layout with this provider.
 * It fetches platform settings once and shares with all admin pages.
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading } = useSWR<{
    settings: {
      platformName: string;
      platformFeePercent: number;
      supportEmail: string;
      logoUrl: string | null;
    };
  }>("/api/admin/settings", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const value: AdminContextValue = {
    platformName: data?.settings?.platformName ?? "Fed",
    platformSettings: data?.settings ?? null,
    isLoading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

/**
 * Access platform settings from any admin page.
 * Must be used inside AdminProvider.
 */
export function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext() must be used inside <AdminProvider>");
  }
  return ctx;
}
