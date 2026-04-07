import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  // Public API routes — accessible without authentication
  const isPublicApiRoute =
    nextUrl.pathname.startsWith("/api/auth") ||
    (nextUrl.pathname.startsWith("/api/restaurants") && req.method === "GET") ||
    (nextUrl.pathname.startsWith("/api/menu") && req.method === "GET") ||
    // Guest promo validation: GET /api/promotions?code=X (single code lookup is public,
    // full list requires auth — enforced in the route handler)
    (nextUrl.pathname === "/api/promotions" && req.method === "GET" && nextUrl.searchParams.has("code")) ||
    // Guest checkout — POST to /api/orders only
    (nextUrl.pathname === "/api/orders" && req.method === "POST") ||
    // Guest order confirmation view — GET to /api/orders/[id] (route handler enforces privacy)
    (nextUrl.pathname.startsWith("/api/orders/") && req.method === "GET") ||
    // Stripe checkout session creation (called after guest order placement)
    (nextUrl.pathname === "/api/checkout_sessions" && req.method === "POST") ||
    // Stripe webhooks (called by Stripe servers, verified via signature)
    nextUrl.pathname.startsWith("/api/webhooks/") ||
    // Health check (uptime monitors) — rate-limited at the route level
    (nextUrl.pathname === "/api/health" && req.method === "GET");

  // Protect Admin Routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    if (req.auth?.user?.role !== "admin") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  // Protect Dashboard Routes
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    const role = req.auth?.user?.role;
    if (role !== "owner" && role !== "admin") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  // Protect all non-public API routes
  if (isApiRoute && !isPublicApiRoute && !isLoggedIn) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return;
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
