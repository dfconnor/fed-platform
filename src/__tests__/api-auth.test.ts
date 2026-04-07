/**
 * @vitest-environment node
 *
 * Tests for /api/auth/register and /api/auth/forgot-password.
 * Mocks Prisma + email + auth so tests run without DB or network.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    verificationToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const sendEmailMock = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock("@/lib/email", async () => {
  const actual = await vi.importActual<typeof import("@/lib/email")>("@/lib/email");
  return {
    ...actual,
    sendEmail: sendEmailMock,
  };
});

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.create.mockReset();
  });

  it("creates a user with a hashed password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "user_1",
      ...data,
    }));

    const { POST } = await import("@/app/api/auth/register/route");
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Tom Wilson",
        email: "tom@example.com",
        password: "supersecret",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.user.email).toBe("tom@example.com");
    expect(body.user.role).toBe("customer");
    // Verify the password was hashed (not stored as plaintext)
    const createArgs = prismaMock.user.create.mock.calls[0][0];
    expect(createArgs.data.passwordHash).toBeDefined();
    expect(createArgs.data.passwordHash).not.toBe("supersecret");
    expect(createArgs.data.passwordHash.length).toBeGreaterThan(20);
  });

  it("normalizes the email to lowercase", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "user_2",
      ...data,
    }));

    const { POST } = await import("@/app/api/auth/register/route");
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Tom",
        email: "TOM@Example.COM",
        password: "supersecret",
      }),
    });
    await POST(req);

    const createArgs = prismaMock.user.create.mock.calls[0][0];
    expect(createArgs.data.email).toBe("tom@example.com");
  });

  it("rejects duplicate emails with 409", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "existing",
      email: "tom@example.com",
    });

    const { POST } = await import("@/app/api/auth/register/route");
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Tom",
        email: "tom@example.com",
        password: "supersecret",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.error).toMatch(/already exists/i);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("rejects passwords shorter than 8 characters", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const { POST } = await import("@/app/api/auth/register/route");
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Tom",
        email: "tom@example.com",
        password: "short",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/8 characters/i);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "tom@example.com" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBeTruthy();
  });
});

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.verificationToken.deleteMany.mockReset();
    prismaMock.verificationToken.create.mockReset();
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue(true);
  });

  it("creates a token and sends email when the user exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user_1",
      email: "lisa@example.com",
    });
    prismaMock.verificationToken.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.verificationToken.create.mockResolvedValue({});

    const { POST } = await import("@/app/api/auth/forgot-password/route");
    const req = new NextRequest("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "lisa@example.com" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toMatch(/reset link/i);
    expect(prismaMock.verificationToken.create).toHaveBeenCalled();
    const tokenCallArgs = prismaMock.verificationToken.create.mock.calls[0][0];
    expect(tokenCallArgs.data.identifier).toBe("lisa@example.com");
    expect(tokenCallArgs.data.token).toMatch(/^[a-f0-9]{64}$/);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock.mock.calls[0][0].to).toBe("lisa@example.com");
  });

  it("returns the same generic message when the user does not exist (no enumeration)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const { POST } = await import("@/app/api/auth/forgot-password/route");
    const req = new NextRequest("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "ghost@example.com" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toMatch(/reset link/i);
    expect(prismaMock.verificationToken.create).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const { POST } = await import("@/app/api/auth/forgot-password/route");
    const req = new NextRequest("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/email is required/i);
  });
});
