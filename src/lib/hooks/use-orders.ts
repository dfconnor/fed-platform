/**
 * =========================================================================
 * USE ORDERS — SWR hook for order management
 * =========================================================================
 *
 * Fetches paginated orders for a restaurant and provides a mutation helper
 * for updating order status. Auto-refreshes every 30 seconds so the
 * dashboard stays current with incoming orders.
 *
 * Usage:
 *   const {
 *     orders,
 *     pagination,
 *     isLoading,
 *     updateStatus,
 *   } = useOrders(restaurantId, "pending");
 *
 * The hook conditionally fetches: if `restaurantId` is falsy, no request
 * is made.
 * =========================================================================
 */

import useSWR from "swr";
import { fetcher, apiMutate } from "@/lib/hooks/fetcher";

/** Shape of a single order from the API. */
export interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  serviceFee: number;
  tip: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  specialInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers: string | null;
  specialInstructions: string | null;
}

/** Pagination metadata from the API. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Shape returned by GET /api/orders */
interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

/**
 * Fetch orders for a restaurant with optional status filtering.
 *
 * @param restaurantId - The restaurant's ID. Pass a falsy value to skip.
 * @param status       - Optional status filter (e.g. "pending", "preparing").
 *                       Pass "all" or omit to fetch all statuses.
 * @param page         - Page number for pagination (default: 1).
 * @param limit        - Items per page (default: 20).
 */
export function useOrders(
  restaurantId: string | undefined | null,
  status?: string,
  page: number = 1,
  limit: number = 20
) {
  // Build query params
  const params = new URLSearchParams();
  if (restaurantId) params.set("restaurantId", restaurantId);
  if (status && status !== "all") params.set("status", status);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const key = restaurantId ? `/api/orders?${params}` : null;

  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    key,
    fetcher,
    {
      // Auto-refresh every 30 seconds to catch new orders
      refreshInterval: 30000,
    }
  );

  /**
   * Update the status of an order (e.g. "pending" → "preparing").
   *
   * @param orderId   - The order's ID.
   * @param newStatus - The new status string.
   * @returns The updated order from the server.
   */
  const updateStatus = async (orderId: string, newStatus: string) => {
    const result = await apiMutate<{ order: Order }>(
      `/api/orders/${orderId}`,
      "PATCH",
      { status: newStatus }
    );
    // Revalidate the order list
    mutate();
    return result.order;
  };

  return {
    orders: data?.orders ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    error,
    mutate,
    updateStatus,
  };
}
