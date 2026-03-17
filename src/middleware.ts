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
  const isPublicApiRoute = nextUrl.pathname.startsWith("/api/auth") ||
                           (nextUrl.pathname.startsWith("/api/restaurants") && req.method === "GET") ||
                           (nextUrl.pathname.startsWith("/api/menu") && req.method === "GET");

  // Protect Admin Routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    if ((req.auth?.user as { role?: string })?.role !== "admin") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  // Protect Dashboard Routes
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    const role = (req.auth?.user as { role?: string })?.role;
    if (role !== "owner" && role !== "admin") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  // Protect sensitive API Routes
  if (isApiRoute && !isPublicApiRoute) {
    if (!isLoggedIn && req.method !== "POST" && !nextUrl.pathname.startsWith("/api/orders")) {
      // Allow POST /api/orders for guest checkout, but protect others
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
