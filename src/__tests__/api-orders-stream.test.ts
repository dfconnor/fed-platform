/**
 * @vitest-environment node
 *
 * Tests for the SSE order status stream at GET /api/orders/[id]/stream.
 * Mocks Prisma + auth so the route can be exercised in isolation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock, authMock } = vi.hoisted(() => ({
  prismaMock: {
    order: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    restaurant: {
      findUnique: vi.fn(),
    },
  },
  authMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: authMock,
}));

const ORDER = {
  id: "order_1",
  status: "pending",
  customerId: "user_1",
  restaurantId: "rest_1",
};

const params = Promise.resolve({ id: "order_1" });

function makeReq() {
  return new NextRequest("http://localhost/api/orders/order_1/stream");
}

async function readFirstEvent(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const { value } = await reader.read();
  await reader.cancel();
  return new TextDecoder().decode(value);
}

describe("GET /api/orders/[id]/stream", () => {
  beforeEach(() => {
    prismaMock.order.findFirst.mockReset();
    prismaMock.order.findUnique.mockReset();
    prismaMock.restaurant.findUnique.mockReset();
    authMock.mockReset();
  });

  it("returns 404 when the order does not exist", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);
    authMock.mockResolvedValue(null);

    const { GET } = await import("@/app/api/orders/[id]/stream/route");
    const res = await GET(makeReq(), { params });

    expect(res.status).toBe(404);
  });

  it("returns 403 when an unrelated user requests another customer's order", async () => {
    prismaMock.order.findFirst.mockResolvedValue(ORDER);
    prismaMock.restaurant.findUnique.mockResolvedValue({ ownerId: "owner_x" });
    authMock.mockResolvedValue({
      user: { id: "stranger", role: "customer" },
    });

    const { GET } = await import("@/app/api/orders/[id]/stream/route");
    const res = await GET(makeReq(), { params });

    expect(res.status).toBe(403);
  });

  it("opens an SSE stream and emits initial status for guest orders", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      ...ORDER,
      customerId: null, // guest order
    });
    authMock.mockResolvedValue(null);

    const { GET } = await import("@/app/api/orders/[id]/stream/route");
    const res = await GET(makeReq(), { params });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    expect(res.headers.get("Cache-Control")).toContain("no-cache");

    const firstChunk = await readFirstEvent(res.body!);
    expect(firstChunk).toContain("event: status");
    expect(firstChunk).toContain('"status":"pending"');
  });

  it("allows the order's customer to subscribe", async () => {
    prismaMock.order.findFirst.mockResolvedValue(ORDER);
    authMock.mockResolvedValue({
      user: { id: "user_1", role: "customer" },
    });

    const { GET } = await import("@/app/api/orders/[id]/stream/route");
    const res = await GET(makeReq(), { params });

    expect(res.status).toBe(200);
    await res.body?.cancel();
  });

  it("allows the restaurant owner to subscribe", async () => {
    prismaMock.order.findFirst.mockResolvedValue(ORDER);
    prismaMock.restaurant.findUnique.mockResolvedValue({ ownerId: "owner_1" });
    authMock.mockResolvedValue({
      user: { id: "owner_1", role: "owner" },
    });

    const { GET } = await import("@/app/api/orders/[id]/stream/route");
    const res = await GET(makeReq(), { params });

    expect(res.status).toBe(200);
    await res.body?.cancel();
  });
});
