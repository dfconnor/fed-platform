/**
 * =========================================================================
 * SHARED SWR FETCHER & API MUTATION HELPERS
 * =========================================================================
 *
 * Central data-fetching utilities used by all SWR hooks.
 *
 * - `fetcher` — default SWR fetcher: fetch + JSON parse + error handling
 * - `apiMutate` — POST/PATCH/DELETE helper with JSON body + error handling
 *
 * Every API call goes through these two functions so error handling,
 * headers, and response parsing are consistent across the app.
 * =========================================================================
 */

/**
 * Default SWR fetcher.
 * Throws on non-2xx responses so SWR surfaces the error.
 */
export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.error || `Request failed: ${res.status}`);
    (error as ApiError).status = res.status;
    (error as ApiError).info = body;
    throw error;
  }
  return res.json();
}

/**
 * Typed error for API responses.
 */
export interface ApiError extends Error {
  status: number;
  info: Record<string, unknown>;
}

/**
 * Perform a mutation (POST, PATCH, DELETE) against an API route.
 *
 * @param url    - API endpoint (e.g. "/api/menu")
 * @param method - HTTP method
 * @param body   - Request body (omit for DELETE)
 * @returns Parsed JSON response
 * @throws Error with status + info on failure
 *
 * @example
 * // Create a menu item
 * const result = await apiMutate("/api/menu", "POST", {
 *   type: "item",
 *   categoryId: "abc",
 *   name: "New Burger",
 *   price: 14.99,
 * });
 */
export async function apiMutate<T = unknown>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    const error = new Error(info.error || `${method} ${url} failed: ${res.status}`);
    (error as ApiError).status = res.status;
    (error as ApiError).info = info;
    throw error;
  }

  return res.json();
}
