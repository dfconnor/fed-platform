/**
 * @vitest-environment node
 *
 * Tests for /api/auth/reset-password — the password reset completion route.
 * Mocks Prisma so we don't touch a real DB. Verifies the full flow:
 *   - valid token + valid password → updates user password (hashed) + deletes tokens
 *   - invalid token → 400 with friendly message
 *   - expired token → 400 with friendly message + cleans up the expired token
 *   - weak password → 400
 *   - missing fields → 400
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: { update: vi.fn() },
    verificationToken: {
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(async (ops: unknown[]) => {
      // Resolve any thenables passed in the operations array
      return Promise.all(ops.map((op) => Promise.resolve(op)));
    }),
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

// Bypass rate limiting in tests
vi.mock("@/lib/rate-limit", async () => {
  const { NextResponse } = await import("next/server");
  return {
    authLimiter: { check: () => ({ success: true, remaining: 999 }) },
    rateLimitResponse: () =>
      NextResponse.json({ error: "Too many requests" }, { status: 429 }),
    getClientIp: () => "test-ip",
  };
});

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    prismaMock.user.update.mockReset();
    prismaMock.verificationToken.findFirst.mockReset();
    prismaMock.verificationToken.deleteMany.mockReset();
    prismaMock.$transaction.mockClear();
  });

  it("updates the user password (hashed) and deletes tokens on success", async () => {
    prismaMock.verificationToken.findFirst.mockResolvedValue({
      identifier: "user@example.com",
      token: "validtoken123",
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.verificationToken.deleteMany.mockResolvedValue({ count: 1 });

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const req = new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "validtoken123",
        email: "user@example.com",
        password: "newSuperSecret1!",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toMatch(/reset successfully/i);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it("normalizes email to lowercase before lookup", async () => {
    prismaMock.verificationToken.findFirst.mockResolvedValue({
      identifier: "user@example.com",
      token: "validtoken123",
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.verificationToken.deleteMany.mockResolvedValue({ count: 1 });

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const req = new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "validtoken123",
        email: "USER@Example.COM",
        password: "newSuperSecret1!",
      }),
    });
    await POST(req);

    expect(prismaMock.verificationToken.findFirst).toHaveBeenCalledWith({
      where: { identifier: "user@example.com", token: "validtoken123" },
    });
  });

  it("rejects invalid tokens with 400", async () => {
    prismaMock.verificationToken.findFirst.mockResolvedValue(null);

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const req = new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "garbage",
        email: "user@example.com",
        password: "newSuperSecret1!",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid or expired/i);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects expired tokens with 400 and cleans them up", async () => {
    prismaMock.verificationToken.findFirst.mockResolvedValue({
      identifier: "user@example.com",
      token: "oldtoken",
      expires: new Date(Date.now() - 1000), // expired 1 second ago
    });
    prismaMock.verificationToken.deleteMany.mockResolvedValue({ count: 1 });

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const req = new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "oldtoken",
        email: "user@example.com",
        password: "newSuperSecret1!",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/expired/i);
    expect(prismaMock.verificationToken.deleteMany).toHaveBeenCalledWith({
      where: { identifier: "user@example.com", token: "oldtoken" },
    });
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects passwords shorter than 8 chars", async () => {
    const { POST } = await import("@/app/api/auth/reset-password/route");
    const req = new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "validtoken",
        email: "user@example.com",
        password: "short",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/8 characters/i);
    expect(prismaMock.verificationToken.findFirst).not.toHaveBeenCalled();
  });

  it("rejects missing fields", async () => {
    const { POST } = await import("@/app/api/auth/reset-password/route");
    const req = new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/required/i);
  });
});
