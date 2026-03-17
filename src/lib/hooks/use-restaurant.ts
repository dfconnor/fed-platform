/**
 * =========================================================================
 * USE RESTAURANT — SWR hook for restaurant details
 * =========================================================================
 *
 * Fetches full restaurant data by slug and provides a mutation helper
 * for updating restaurant settings.
 *
 * Usage:
 *   const { restaurant, isLoading, error, updateRestaurant } = useRestaurant("joes-pizza");
 *
 * The hook conditionally fetches: if `slug` is falsy, no request is made.
 * =========================================================================
 */

import useSWR from "swr";
import { fetcher, apiMutate } from "@/lib/hooks/fetcher";

/** Shape returned by GET /api/restaurants/[slug] */
interface RestaurantResponse {
  restaurant: Restaurant;
}

/** Full restaurant object from the API. */
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cuisine: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  isActive: boolean;
  acceptsOrders: boolean;
  taxRate: number;
  serviceFee: number;
  minOrderAmount: number;
  estimatedPrepTime: number;
  businessHours: string | null; // JSON string
  owner: { name: string };
  categories: Category[];
  avgRating: number | null;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  calories: number | null;
  modifierGroups: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  priceAdjustment: number;
  isDefault: boolean;
}

/**
 * Fetch and manage a single restaurant by slug.
 *
 * @param slug - The restaurant's URL slug (e.g. "joes-pizza").
 *               Pass a falsy value to skip fetching.
 */
export function useRestaurant(slug: string | undefined | null) {
  const key = slug ? `/api/restaurants/${slug}` : null;

  const { data, error, isLoading, mutate } = useSWR<RestaurantResponse>(
    key,
    fetcher
  );

  /**
   * Update restaurant fields via PATCH.
   *
   * @param restaurantSlug - Slug of the restaurant to update.
   * @param updates        - Partial restaurant fields to patch.
   * @returns The updated restaurant from the server.
   */
  const updateRestaurant = async (
    restaurantSlug: string,
    updates: Partial<Omit<Restaurant, "id" | "slug" | "owner" | "categories" | "avgRating" | "reviewCount">>
  ) => {
    const result = await apiMutate<RestaurantResponse>(
      `/api/restaurants/${restaurantSlug}`,
      "PATCH",
      updates as Record<string, unknown>
    );
    // Revalidate SWR cache so the UI reflects the update
    mutate();
    return result.restaurant;
  };

  return {
    restaurant: data?.restaurant ?? null,
    isLoading,
    error,
    mutate,
    updateRestaurant,
  };
}
