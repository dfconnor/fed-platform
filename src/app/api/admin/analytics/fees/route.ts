/**
 * /api/admin/analytics/fees
 *
 * Returns monthly platform fee revenue (and net revenue) for the admin
 * fee revenue chart. Fees are computed as totalRevenue * platformFeePercent.
 *
 * Query params:
 *   period — 4w | 12w | 26w | 52w (default: 12w)
 *
 * Response: { data: Array<{ monthStart: string; gmv: number; platformFees: number; net: number }> }
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

    // Pull current platform fee % from settings (fallback 2.5% if missing)
    const settings = await prisma.platformSettings.findUnique({
      where: { id: "default" },
    });
    const feePercent = settings?.platformFeePercent ?? 2.5;

    // Aggregate gross revenue by month. Only completed/delivered/picked-up
    // orders count toward fee revenue (matches host payout logic).
    const rows: { monthStart: Date; gmv: number }[] = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as "monthStart",
        SUM(total) as gmv
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
        AND "status" IN ('completed', 'delivered', 'picked_up')
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const monthMap = new Map(
      rows.map((r) => [
        new Date(r.monthStart).toISOString().split("T")[0].slice(0, 7), // YYYY-MM
        Number(r.gmv),
      ])
    );

    // Build a zero-filled monthly series anchored on the first of the month
    const firstMonth = new Date(startDate);
    firstMonth.setUTCDate(1);
    firstMonth.setUTCHours(0, 0, 0, 0);

    // How many months does the period span? round up so we always render
    // the current month even if the period started mid-month.
    const monthCount = Math.max(1, Math.ceil(weeks / 4.345));

    const data: Array<{
      monthStart: string;
      gmv: number;
      platformFees: number;
      net: number;
    }> = [];
    for (let i = 0; i < monthCount; i++) {
      const month = new Date(firstMonth);
      month.setUTCMonth(firstMonth.getUTCMonth() + i);
      const key = month.toISOString().split("T")[0].slice(0, 7);
      const gmv = monthMap.get(key) ?? 0;
      const platformFees = Math.round(gmv * (feePercent / 100) * 100) / 100;
      data.push({
        monthStart: `${key}-01`,
        gmv: Math.round(gmv * 100) / 100,
        platformFees,
        net: Math.round((gmv - platformFees) * 100) / 100,
      });
    }

    return NextResponse.json({ data, feePercent });
  } catch (error) {
    console.error("Error fetching fee analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch fee analytics" },
      { status: 500 }
    );
  }
}
