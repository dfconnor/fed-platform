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

import React, { createContext, useContext, type ReactNode } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks/fetcher";

// ============================================
// CONSTANTS — change these to switch the demo restaurant
// ============================================

/** The slug of the restaurant shown in the dashboard. */
export const DEMO_RESTAURANT_SLUG = "the-golden-fork";

// ============================================
// DASHBOARD CONTEXT
// ============================================

interface DashboardContextValue {
  /** Prisma restaurant ID (cuid) */
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
  /** Error from fetch, if any */
  error: Error | undefined;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

/**
 * Wrap the dashboard layout with this provider.
 * It fetches the demo restaurant once and shares the data with all pages.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading } = useSWR<{
    restaurant: {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      owner: { name: string | null };
    };
  }>(`/api/restaurants/${DEMO_RESTAURANT_SLUG}`, fetcher, {
    // Revalidate on focus but not too aggressively
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const value: DashboardContextValue = {
    restaurantId: data?.restaurant?.id ?? "",
    slug: DEMO_RESTAURANT_SLUG,
    restaurantName: data?.restaurant?.name ?? "Loading...",
    restaurantDescription: data?.restaurant?.description ?? "",
    ownerName: data?.restaurant?.owner?.name ?? "Owner",
    isLoading,
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
