/**
 * =========================================================================
 * USE PROMOTIONS — SWR hook for promotion CRUD
 * =========================================================================
 *
 * Fetches promotions for a restaurant and provides mutation helpers for
 * creating, updating, and deleting promotions.
 *
 * Usage:
 *   const {
 *     promotions,
 *     isLoading,
 *     createPromotion,
 *     updatePromotion,
 *     deletePromotion,
 *   } = usePromotions(restaurantId);
 *
 * The hook conditionally fetches: if `restaurantId` is falsy, no request
 * is made.
 * =========================================================================
 */

import useSWR from "swr";
import { fetcher, apiMutate } from "@/lib/hooks/fetcher";

/** Shape of a single promotion from the API (matches Prisma model). */
export interface Promotion {
  id: string;
  restaurantId: string;
  code: string;
  description: string | null;
  discountType: string; // "percentage" | "fixed"
  discountValue: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  startsAt: string; // ISO date string
  expiresAt: string; // ISO date string
  isActive: boolean;
}

/** Shape returned by GET /api/promotions */
interface PromotionsResponse {
  promotions: Promotion[];
}

/**
 * Fetch and manage promotions for a restaurant.
 *
 * @param restaurantId - The restaurant's ID. Pass a falsy value to skip.
 */
export function usePromotions(restaurantId: string | undefined | null) {
  const key = restaurantId
    ? `/api/promotions?restaurantId=${restaurantId}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<PromotionsResponse>(
    key,
    fetcher
  );

  /**
   * Create a new promotion.
   *
   * @param promotionData - Fields for the new promotion.
   */
  const createPromotion = async (
    promotionData: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/promotions", "POST", {
      restaurantId,
      ...promotionData,
    });
    mutate();
    return result;
  };

  /**
   * Update an existing promotion.
   *
   * @param id      - The promotion's ID.
   * @param updates - Partial promotion fields to update.
   */
  const updatePromotion = async (
    id: string,
    updates: Record<string, unknown>
  ) => {
    const result = await apiMutate("/api/promotions", "PATCH", {
      id,
      ...updates,
    });
    mutate();
    return result;
  };

  /**
   * Delete a promotion.
   *
   * @param id - The promotion's ID.
   */
  const deletePromotion = async (id: string) => {
    const result = await apiMutate(
      `/api/promotions?id=${id}`,
      "DELETE"
    );
    mutate();
    return result;
  };

  return {
    promotions: data?.promotions ?? [],
    isLoading,
    error,
    mutate,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
}
