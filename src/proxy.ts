/**
 * Route protection proxy (Next.js 16+ convention — replaces middleware.ts).
 *
 * Runs on the server before every matched route. In development mode,
 * auth is bypassed by default so the demo works without login.
 * Set ENFORCE_AUTH=true in .env to test auth in dev.
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  // -------------------------------------------------------------------
  // Development bypass: allow access without login so the demo works.
  // Set ENFORCE_AUTH=true in .env to test auth in dev.
  // In production, auth is always enforced.
  // -------------------------------------------------------------------
  const isDev = process.env.NODE_ENV === "development";
  const enforceAuth = process.env.ENFORCE_AUTH === "true";

  if (isDev && !enforceAuth) {
    return NextResponse.next();
  }

  let token;
  try {
    token = await getToken({ req });
  } catch {
    // Auth not configured or errored — allow access in dev, block in prod
    if (isDev) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // /admin/* requires "admin" role
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // /dashboard/* requires "owner" or "admin" role
  if (
    pathname.startsWith("/dashboard") &&
    !["owner", "admin"].includes(token.role as string)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
