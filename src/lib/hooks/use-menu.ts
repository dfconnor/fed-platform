/**
 * =========================================================================
 * USE MENU — SWR hook for menu CRUD operations
 * =========================================================================
 *
 * Fetches categories and items from the restaurant endpoint, and provides
 * mutation helpers for creating, updating, and deleting categories, items,
 * and modifier groups via the /api/menu endpoint.
 *
 * Usage:
 *   const {
 *     categories,
 *     isLoading,
 *     createMenuItem,
 *     updateMenuItem,
 *     deleteMenuItem,
 *     createCategory,
 *     updateCategory,
 *     deleteCategory,
 *   } = useMenu("joes-pizza");
 *
 * The hook conditionally fetches: if `slug` is falsy, no request is made.
 * =========================================================================
 */

import useSWR from "swr";
import { fetcher, apiMutate } from "@/lib/hooks/fetcher";
import type { Category } from "@/lib/hooks/use-restaurant";

/** Shape returned by GET /api/restaurants/[slug] (only the fields we need) */
interface MenuResponse {
  restaurant: {
    categories: Category[];
  };
}

/**
 * Fetch and manage the menu for a restaurant.
 *
 * @param slug - The restaurant's URL slug. Pass a falsy value to skip fetching.
 */
export function useMenu(slug: string | undefined | null) {
  // includeInactive=true so the dashboard can see and toggle inactive items
  const key = slug ? `/api/restaurants/${slug}?includeInactive=true` : null;

  const { data, error, isLoading, mutate } = useSWR<MenuResponse>(
    key,
    fetcher
  );

  // ---------------------------------------------------------------------------
  // MENU ITEM MUTATIONS
  // ---------------------------------------------------------------------------

  /**
   * Create a new menu item.
   *
   * @param itemData - Fields for the new item (must include categoryId).
   */
  const createMenuItem = async (
    itemData: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/menu", "POST", {
      type: "item",
      ...itemData,
    });
    mutate(); // Revalidate the menu
    return result;
  };

  /**
   * Update an existing menu item.
   *
   * @param id      - The item's ID.
   * @param updates - Partial item fields to update.
   */
  const updateMenuItem = async (
    id: string,
    updates: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/menu", "PATCH", {
      type: "item",
      id,
      ...updates,
    });
    mutate();
    return result;
  };

  /**
   * Delete a menu item.
   *
   * @param id - The item's ID.
   */
  const deleteMenuItem = async (id: string) => {
    const result = await apiMutate(
      `/api/menu?type=item&id=${id}`,
      "DELETE"
    );
    mutate();
    return result;
  };

  // ---------------------------------------------------------------------------
  // CATEGORY MUTATIONS
  // ---------------------------------------------------------------------------

  /**
   * Create a new category.
   *
   * @param categoryData - Fields for the new category (name, description, etc.).
   */
  const createCategory = async (
    categoryData: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/menu", "POST", {
      type: "category",
      ...categoryData,
    });
    mutate();
    return result;
  };

  /**
   * Update an existing category.
   *
   * @param id      - The category's ID.
   * @param updates - Partial category fields to update.
   */
  const updateCategory = async (
    id: string,
    updates: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/menu", "PATCH", {
      type: "category",
      id,
      ...updates,
    });
    mutate();
    return result;
  };

  /**
   * Delete a category (and its items).
   *
   * @param id - The category's ID.
   */
  const deleteCategory = async (id: string) => {
    const result = await apiMutate(
      `/api/menu?type=category&id=${id}`,
      "DELETE"
    );
    mutate();
    return result;
  };

  return {
    categories: data?.restaurant?.categories ?? [],
    isLoading,
    error,
    mutate,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
