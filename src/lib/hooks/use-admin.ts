/**
 * =========================================================================
 * USE ADMIN — SWR hooks for admin pages
 * =========================================================================
 *
 * Three hooks covering the admin dashboard:
 *
 * - `useAdminRestaurants(search?, status?)` — list, update, delete restaurants
 * - `useAdminUsers(search?, role?)`         — list users, update roles
 * - `usePlatformSettings()`                 — read/write platform settings
 *
 * All hooks use conditional fetching and provide mutation helpers that
 * revalidate the SWR cache after server-side changes.
 * =========================================================================
 */

import useSWR from "swr";
import { fetcher, apiMutate } from "@/lib/hooks/fetcher";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Admin-facing restaurant summary. */
export interface AdminRestaurant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  owner: { name: string; email: string };
  createdAt: string;
  [key: string]: unknown;
}

/** Admin-facing user record. */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  [key: string]: unknown;
}

/** Platform settings object. */
export interface PlatformSettings {
  platformName: string;
  platformFee: number;
  supportEmail: string;
  maintenanceMode: boolean;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// useAdminRestaurants
// ---------------------------------------------------------------------------

/** Shape returned by GET /api/admin/restaurants */
interface AdminRestaurantsResponse {
  restaurants: AdminRestaurant[];
}

/**
 * Fetch and manage the list of restaurants (admin).
 *
 * @param search - Optional search string to filter by name.
 * @param status - Optional status filter (e.g. "active", "inactive").
 */
export function useAdminRestaurants(search?: string, status?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status && status !== "all") params.set("status", status);

  const key = `/api/admin/restaurants?${params}`;

  const { data, error, isLoading, mutate } = useSWR<AdminRestaurantsResponse>(
    key,
    fetcher
  );

  /**
   * Update a restaurant's fields (e.g. toggle isActive).
   *
   * @param id      - The restaurant's ID.
   * @param updates - Partial fields to patch.
   */
  const updateAdminRestaurant = async (
    id: string,
    updates: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/admin/restaurants", "PATCH", {
      id,
      ...updates,
    });
    mutate();
    return result;
  };

  /**
   * Delete a restaurant.
   *
   * @param id - The restaurant's ID.
   */
  const deleteAdminRestaurant = async (id: string) => {
    const result = await apiMutate(
      `/api/admin/restaurants?id=${id}`,
      "DELETE"
    );
    mutate();
    return result;
  };

  return {
    restaurants: data?.restaurants ?? [],
    isLoading,
    error,
    mutate,
    updateAdminRestaurant,
    deleteAdminRestaurant,
  };
}

// ---------------------------------------------------------------------------
// useAdminUsers
// ---------------------------------------------------------------------------

/** Shape returned by GET /api/admin/users */
interface AdminUsersResponse {
  users: AdminUser[];
}

/**
 * Fetch and manage users (admin).
 *
 * @param search - Optional search string to filter by name/email.
 * @param role   - Optional role filter (e.g. "admin", "owner", "customer").
 */
export function useAdminUsers(search?: string, role?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (role && role !== "all") params.set("role", role);

  const key = `/api/admin/users?${params}`;

  const { data, error, isLoading, mutate } = useSWR<AdminUsersResponse>(
    key,
    fetcher
  );

  /**
   * Update a user's role.
   *
   * @param id   - The user's ID.
   * @param role - The new role string.
   */
  const updateAdminUserRole = async (id: string, newRole: string) => {
    const result = await apiMutate("/api/admin/users", "PATCH", {
      id,
      role: newRole,
    });
    mutate();
    return result;
  };

  return {
    users: data?.users ?? [],
    isLoading,
    error,
    mutate,
    updateAdminUserRole,
  };
}

// ---------------------------------------------------------------------------
// usePlatformSettings
// ---------------------------------------------------------------------------

/** Shape returned by GET /api/admin/settings */
interface PlatformSettingsResponse {
  settings: PlatformSettings;
}

/**
 * Fetch and manage platform-wide settings (admin).
 */
export function usePlatformSettings() {
  const { data, error, isLoading, mutate } = useSWR<PlatformSettingsResponse>(
    "/api/admin/settings",
    fetcher
  );

  /**
   * Update platform settings.
   *
   * @param updates - Partial settings fields to patch.
   */
  const updatePlatformSettings = async (
    updates: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/admin/settings", "PATCH", updates);
    mutate();
    return result;
  };

  return {
    settings: data?.settings ?? null,
    isLoading,
    error,
    mutate,
    updatePlatformSettings,
  };
}
