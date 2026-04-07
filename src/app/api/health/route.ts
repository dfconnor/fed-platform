/**
 * /api/health
 *
 * Lightweight health probe for uptime monitors and Vercel deployment checks.
 * Verifies the database is reachable via a trivial round-trip query.
 *
 * Response (200):
 *   { status: "ok", db: "connected", version, timestamp }
 *
 * Response (503):
 *   { status: "error", db: "disconnected", error, version, timestamp }
 *
 * No auth required. Rate limited at 60 req/min per IP to prevent abuse.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { healthLimiter, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

const VERSION = "1.0.0";

export async function GET(req: NextRequest) {
  const limit = healthLimiter.check(getClientIp(req));
  if (!limit.success) return rateLimitResponse();

  const timestamp = new Date().toISOString();

  try {
    // Trivial round-trip — confirms the connection pool is alive
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      db: "connected",
      version: VERSION,
      timestamp,
    });
  } catch (error) {
    console.error("[health] DB check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        version: VERSION,
        timestamp,
      },
      { status: 503 }
    );
  }
}
