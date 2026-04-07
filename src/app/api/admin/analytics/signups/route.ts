/**
 * /api/admin/analytics/signups
 *
 * Returns weekly user + restaurant signup counts for the admin growth chart.
 *
 * Query params:
 *   period — 4w | 12w | 26w | 52w (default: 12w)
 *
 * Response: { data: Array<{ weekStart: string; newUsers: number; newRestaurants: number }> }
 *
 * Admin only. Uses raw SQL with DATE_TRUNC for postgres-side aggregation.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { adminLimiter, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

const PERIOD_WEEKS: Record<string, number> = {
  "4w": 4,
  "12w": 12,
  "26w": 26,
  "52w": 52,
};

export async function GET(req: NextRequest) {
  const limit = adminLimiter.check(getClientIp(req));
  if (!limit.success) return rateLimitResponse();

  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const period = req.nextUrl.searchParams.get("period") || "12w";
    const weeks = PERIOD_WEEKS[period] ?? 12;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    // Aggregate users per ISO week (Monday-anchored). DATE_TRUNC('week', ...)
    // returns the Monday of each week in postgres.
    const userRows: { weekStart: Date; count: bigint }[] = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', "createdAt") as "weekStart",
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${startDate}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const restaurantRows: { weekStart: Date; count: bigint }[] = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', "createdAt") as "weekStart",
        COUNT(*) as count
      FROM "Restaurant"
      WHERE "createdAt" >= ${startDate}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // Build a complete weekly series with zero-fill for empty weeks. Anchor on
    // the Monday of each week so the bucket boundaries align with DATE_TRUNC.
    const userMap = new Map(
      userRows.map((r) => [
        new Date(r.weekStart).toISOString().split("T")[0],
        Number(r.count),
      ])
    );
    const restaurantMap = new Map(
      restaurantRows.map((r) => [
        new Date(r.weekStart).toISOString().split("T")[0],
        Number(r.count),
      ])
    );

    // Find the Monday of the earliest week in the range
    const firstMonday = new Date(startDate);
    const dow = firstMonday.getUTCDay();
    const daysToMonday = (dow + 6) % 7;
    firstMonday.setUTCDate(firstMonday.getUTCDate() - daysToMonday);
    firstMonday.setUTCHours(0, 0, 0, 0);

    const data: Array<{ weekStart: string; newUsers: number; newRestaurants: number }> = [];
    for (let i = 0; i < weeks; i++) {
      const week = new Date(firstMonday);
      week.setUTCDate(firstMonday.getUTCDate() + i * 7);
      const key = week.toISOString().split("T")[0];
      data.push({
        weekStart: key,
        newUsers: userMap.get(key) ?? 0,
        newRestaurants: restaurantMap.get(key) ?? 0,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching signup analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch signup analytics" },
      { status: 500 }
    );
  }
}
