/**
 * @vitest-environment node
 *
 * Tests for /api/admin/analytics/signups and /api/admin/analytics/fees.
 * Mocks Prisma $queryRaw and requireAdmin so tests run without DB or session.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { prismaMock, requireAdminMock } = vi.hoisted(() => ({
  prismaMock: {
    $queryRaw: vi.fn(),
    platformSettings: { findUnique: vi.fn() },
  },
  requireAdminMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock("@/lib/api-auth", () => ({
  requireAdmin: requireAdminMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

// Bypass rate limiting in tests so we can fire many requests rapidly.
vi.mock("@/lib/rate-limit", async () => {
  const { NextResponse } = await import("next/server");
  return {
    adminLimiter: { check: () => ({ success: true, remaining: 999 }) },
    healthLimiter: { check: () => ({ success: true, remaining: 999 }) },
    rateLimitResponse: () =>
      NextResponse.json({ error: "Too many requests" }, { status: 429 }),
    getClientIp: () => "test-ip",
  };
});

describe("GET /api/admin/analytics/signups", () => {
  beforeEach(() => {
    prismaMock.$queryRaw.mockReset();
    requireAdminMock.mockReset();
    requireAdminMock.mockResolvedValue({ user: { id: "u_1", role: "admin" } });
  });

  it("returns 12 weekly buckets with zero-fill when no data is present", async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([]); // users
    prismaMock.$queryRaw.mockResolvedValueOnce([]); // restaurants

    const { GET } = await import("@/app/api/admin/analytics/signups/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/signups?period=12w");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(12);
    expect(body.data[0]).toHaveProperty("weekStart");
    expect(body.data[0]).toHaveProperty("newUsers", 0);
    expect(body.data[0]).toHaveProperty("newRestaurants", 0);
  });

  it("merges raw user + restaurant counts into the same week buckets", async () => {
    // Pick a Monday for predictability
    const monday = new Date("2026-03-30T00:00:00.000Z");
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { weekStart: monday, count: BigInt(5) },
    ]);
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { weekStart: monday, count: BigInt(2) },
    ]);

    const { GET } = await import("@/app/api/admin/analytics/signups/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/signups?period=4w");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(4);
    const weekKey = monday.toISOString().split("T")[0];
    const matched = body.data.find((d: { weekStart: string }) => d.weekStart === weekKey);
    expect(matched).toBeDefined();
    expect(matched.newUsers).toBe(5);
    expect(matched.newRestaurants).toBe(2);
  });

  it("supports 4w / 12w / 26w / 52w periods", async () => {
    prismaMock.$queryRaw.mockResolvedValue([]);

    const { GET } = await import("@/app/api/admin/analytics/signups/route");

    for (const [period, expected] of [["4w", 4], ["12w", 12], ["26w", 26], ["52w", 52]] as const) {
      const req = new NextRequest(
        `http://localhost/api/admin/analytics/signups?period=${period}`
      );
      const res = await GET(req);
      const body = await res.json();
      expect(body.data).toHaveLength(expected);
    }
  });

  it("falls back to 12 weeks for invalid period", async () => {
    prismaMock.$queryRaw.mockResolvedValue([]);

    const { GET } = await import("@/app/api/admin/analytics/signups/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/signups?period=garbage");
    const res = await GET(req);
    const body = await res.json();
    expect(body.data).toHaveLength(12);
  });

  it("returns 403 when not an admin", async () => {
    requireAdminMock.mockResolvedValue({
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    });

    const { GET } = await import("@/app/api/admin/analytics/signups/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/signups");
    const res = await GET(req);
    expect(res.status).toBe(403);
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });

  it("returns 500 on DB failure", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("db down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { GET } = await import("@/app/api/admin/analytics/signups/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/signups");
    const res = await GET(req);
    expect(res.status).toBe(500);
    errSpy.mockRestore();
  });
});

describe("GET /api/admin/analytics/fees", () => {
  beforeEach(() => {
    prismaMock.$queryRaw.mockReset();
    prismaMock.platformSettings.findUnique.mockReset();
    requireAdminMock.mockReset();
    requireAdminMock.mockResolvedValue({ user: { id: "u_1", role: "admin" } });
    prismaMock.platformSettings.findUnique.mockResolvedValue({ platformFeePercent: 2.5 });
  });

  it("returns monthly buckets with computed platform fees and net revenue", async () => {
    const monthStart = new Date("2026-03-01T00:00:00.000Z");
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { monthStart, gmv: 1000 },
    ]);

    const { GET } = await import("@/app/api/admin/analytics/fees/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/fees?period=4w");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.feePercent).toBe(2.5);
    const matched = body.data.find((d: { monthStart: string }) =>
      d.monthStart.startsWith("2026-03")
    );
    expect(matched).toBeDefined();
    expect(matched.gmv).toBe(1000);
    expect(matched.platformFees).toBe(25); // 2.5% of 1000
    expect(matched.net).toBe(975);
  });

  it("falls back to 2.5% fee when settings row is missing", async () => {
    prismaMock.platformSettings.findUnique.mockResolvedValue(null);
    prismaMock.$queryRaw.mockResolvedValueOnce([]);

    const { GET } = await import("@/app/api/admin/analytics/fees/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/fees?period=12w");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.feePercent).toBe(2.5);
  });

  it("returns 403 when not an admin", async () => {
    requireAdminMock.mockResolvedValue({
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    });

    const { GET } = await import("@/app/api/admin/analytics/fees/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/fees");
    const res = await GET(req);
    expect(res.status).toBe(403);
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });

  it("returns 500 on DB failure", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("db down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { GET } = await import("@/app/api/admin/analytics/fees/route");
    const req = new NextRequest("http://localhost/api/admin/analytics/fees");
    const res = await GET(req);
    expect(res.status).toBe(500);
    errSpy.mockRestore();
  });
});
