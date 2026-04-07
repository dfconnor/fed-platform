import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter using a sliding window.
 * Works per serverless instance — provides basic abuse protection.
 * For production at scale, replace with Redis or Vercel KV.
 */
export function rateLimit({
  maxRequests,
  windowMs,
}: {
  maxRequests: number;
  windowMs: number;
}) {
  const store = new Map<string, RateLimitEntry>();

  // Periodically clean expired entries to prevent memory leaks
  const CLEANUP_INTERVAL = 60_000;
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
      if (now >= entry.resetTime) {
        store.delete(key);
      }
    }
  }

  return {
    check(ip: string): { success: boolean; remaining: number } {
      cleanup();
      const now = Date.now();
      const entry = store.get(ip);

      if (!entry || now >= entry.resetTime) {
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return { success: true, remaining: maxRequests - 1 };
      }

      entry.count++;
      if (entry.count > maxRequests) {
        return { success: false, remaining: 0 };
      }

      return { success: true, remaining: maxRequests - entry.count };
    },
  };
}

// Shared limiters for different route groups
export const authLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });
export const checkoutLimiter = rateLimit({ maxRequests: 5, windowMs: 60_000 });
// Guest order placement (authenticated or not)
export const orderLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });
// Restaurant owners editing menu / promotions (authenticated)
export const ownerWriteLimiter = rateLimit({ maxRequests: 20, windowMs: 60_000 });
// Promo code mutations (lower than ownerWrite — these affect pricing globally)
export const promoLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });
// Admin actions (lowest — admin volume is small, abuse risk is high)
export const adminLimiter = rateLimit({ maxRequests: 5, windowMs: 60_000 });
// Public health/uptime checks — lenient but bounded
export const healthLimiter = rateLimit({ maxRequests: 60, windowMs: 60_000 });

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}

/** Extract client IP from request headers (works on Vercel and behind proxies). */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
