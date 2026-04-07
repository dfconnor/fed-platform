/**
 * @vitest-environment node
 *
 * Tests for /api/health.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

// Bypass rate limiting in tests so we can fire many requests rapidly.
vi.mock("@/lib/rate-limit", async () => {
  const { NextResponse } = await import("next/server");
  return {
    healthLimiter: { check: () => ({ success: true, remaining: 999 }) },
    rateLimitResponse: () =>
      NextResponse.json({ error: "Too many requests" }, { status: 429 }),
    getClientIp: () => "test-ip",
  };
});

describe("GET /api/health", () => {
  beforeEach(() => {
    prismaMock.$queryRaw.mockReset();
  });

  it("returns 200 with status=ok when DB is reachable", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("@/app/api/health/route");
    const req = new NextRequest("http://localhost/api/health");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.db).toBe("connected");
    expect(body.version).toBe("1.0.0");
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("returns 503 with status=error when DB is unreachable", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("ECONNREFUSED"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { GET } = await import("@/app/api/health/route");
    const req = new NextRequest("http://localhost/api/health");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.status).toBe("error");
    expect(body.db).toBe("disconnected");
    expect(body.error).toContain("ECONNREFUSED");
    expect(body.version).toBe("1.0.0");
    expect(body.timestamp).toBeTruthy();
    errSpy.mockRestore();
  });

  it("includes a fresh ISO timestamp on every request", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("@/app/api/health/route");
    const req = new NextRequest("http://localhost/api/health");

    const res1 = await GET(req);
    const body1 = await res1.json();
    await new Promise((r) => setTimeout(r, 10));
    const res2 = await GET(req);
    const body2 = await res2.json();

    expect(body1.timestamp).not.toBe(body2.timestamp);
  });
});
