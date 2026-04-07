/**
 * @vitest-environment node
 *
 * Tests for /api/restaurants and /api/restaurants/[slug]
 *
 * Mocks the Prisma client so tests run without a database. The route handlers
 * are imported dynamically after the mock is in place.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    restaurant: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

// Avoid loading next-auth (which has ESM resolution issues under vitest)
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

const SAKURA = {
  id: "rest_1",
  name: "Sakura Sushi",
  slug: "sakura-sushi",
  cuisine: "Japanese",
  description: "Fresh fish",
  logoUrl: null,
  bannerUrl: null,
  city: "Portland",
  state: "OR",
  primaryColor: "#DC2626",
  estimatedPrepTime: 20,
  isActive: true,
  acceptsOrders: true,
  owner: { name: "Owner" },
  categories: [
    { id: "cat_1", items: [{ id: "i1" }, { id: "i2" }, { id: "i3" }] },
    { id: "cat_2", items: [{ id: "i4" }] },
  ],
  reviews: [{ rating: 5 }, { rating: 4 }],
  _count: { orders: 8 },
};

describe("GET /api/restaurants", () => {
  beforeEach(() => {
    prismaMock.restaurant.findMany.mockReset();
    prismaMock.restaurant.count.mockReset();
  });

  it("returns the list of active restaurants with computed avgRating and itemCount", async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([SAKURA]);
    prismaMock.restaurant.count.mockResolvedValue(1);

    const { GET } = await import("@/app/api/restaurants/route");
    const req = new Request("http://localhost/api/restaurants");
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.restaurants).toHaveLength(1);
    expect(body.restaurants[0].slug).toBe("sakura-sushi");
    // (5 + 4) / 2 = 4.5
    expect(body.restaurants[0].avgRating).toBe(4.5);
    // 3 + 1 active items across 2 categories
    expect(body.restaurants[0].itemCount).toBe(4);
    expect(body.restaurants[0].reviewCount).toBe(2);
    expect(body.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it("filters by ownerId when query param is provided", async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([]);
    prismaMock.restaurant.count.mockResolvedValue(0);

    const { GET } = await import("@/app/api/restaurants/route");
    const req = new Request("http://localhost/api/restaurants?ownerId=user_42");
    await GET(req as never);

    expect(prismaMock.restaurant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ ownerId: "user_42" }),
      })
    );
  });

  it("returns an empty list with zero pagination when no restaurants exist", async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([]);
    prismaMock.restaurant.count.mockResolvedValue(0);

    const { GET } = await import("@/app/api/restaurants/route");
    const req = new Request("http://localhost/api/restaurants");
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.restaurants).toEqual([]);
    expect(body.pagination.total).toBe(0);
    expect(body.pagination.totalPages).toBe(0);
  });

  it("returns a 500 error when the DB query throws", async () => {
    prismaMock.restaurant.findMany.mockRejectedValue(new Error("db down"));
    prismaMock.restaurant.count.mockRejectedValue(new Error("db down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { GET } = await import("@/app/api/restaurants/route");
    const req = new Request("http://localhost/api/restaurants");
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBeTruthy();
    errSpy.mockRestore();
  });
});

describe("GET /api/restaurants/[slug]", () => {
  beforeEach(() => {
    prismaMock.restaurant.findUnique.mockReset();
  });

  it("returns the restaurant detail when slug exists", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue({
      ...SAKURA,
      reviews: [
        { rating: 5, user: { name: "Alice", avatarUrl: null } },
        { rating: 3, user: { name: "Bob", avatarUrl: null } },
      ],
    });

    const { GET } = await import("@/app/api/restaurants/[slug]/route");
    const req = new NextRequest("http://localhost/api/restaurants/sakura-sushi");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "sakura-sushi" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.restaurant.slug).toBe("sakura-sushi");
    expect(body.restaurant.avgRating).toBe(4); // (5 + 3) / 2
    expect(body.restaurant.reviewCount).toBe(2);
  });

  it("returns 404 when slug does not exist", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(null);

    const { GET } = await import("@/app/api/restaurants/[slug]/route");
    const req = new NextRequest("http://localhost/api/restaurants/nonexistent");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "nonexistent" }),
    });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Restaurant not found");
  });

  it("returns 500 when the query throws", async () => {
    prismaMock.restaurant.findUnique.mockRejectedValue(new Error("db down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { GET } = await import("@/app/api/restaurants/[slug]/route");
    const req = new NextRequest("http://localhost/api/restaurants/sakura-sushi");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "sakura-sushi" }),
    });

    expect(res.status).toBe(500);
    errSpy.mockRestore();
  });
});
