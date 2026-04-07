/**
 * @vitest-environment node
 *
 * Tests for the createOrder server action (the actual order entry point —
 * cart pages call it directly). Mocks Prisma, headers, auth, and email.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, headersMock } = vi.hoisted(() => {
  const txMock = {
    promotion: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
  };

  return {
    prismaMock: {
      restaurant: { findUnique: vi.fn() },
      menuItem: { findMany: vi.fn() },
      order: { create: vi.fn() },
      $transaction: vi.fn(async (cb: (tx: typeof txMock) => unknown) => {
        return cb(txMock);
      }),
      __tx: txMock,
    },
    headersMock: vi.fn().mockResolvedValue(
      new Map([["x-forwarded-for", "203.0.113.7"]])
    ),
  };
});

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
  orderConfirmationEmail: vi.fn().mockReturnValue({
    subject: "Order confirmed",
    html: "<p>thanks</p>",
  }),
}));

const RESTAURANT = {
  id: "rest_1",
  name: "Sakura Sushi",
  slug: "sakura-sushi",
  isActive: true,
  acceptsOrders: true,
  taxRate: 0.1,
  serviceFee: 0,
  estimatedPrepTime: 20,
};

const MENU_ITEM_1 = {
  id: "item_1",
  name: "California Roll",
  price: 12.99,
  isActive: true,
};

describe("createOrder server action", () => {
  beforeEach(() => {
    prismaMock.restaurant.findUnique.mockReset();
    prismaMock.menuItem.findMany.mockReset();
    prismaMock.$transaction.mockClear();
    prismaMock.__tx.promotion.findFirst.mockReset();
    prismaMock.__tx.promotion.update.mockReset();
    prismaMock.__tx.order.create.mockReset();
    headersMock.mockResolvedValue(
      new Map([["x-forwarded-for", `203.0.113.${Math.floor(Math.random() * 254) + 1}`]])
    );
  });

  it("creates a valid order with correct totals", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(RESTAURANT);
    prismaMock.menuItem.findMany.mockResolvedValue([MENU_ITEM_1]);
    prismaMock.__tx.order.create.mockResolvedValue({
      id: "order_1",
      orderNumber: "FED-AB12-CD34",
      total: 14.29,
      customerEmail: "jake@example.com",
    });

    const { createOrder } = await import("@/lib/actions");
    const result = await createOrder({
      restaurantId: "rest_1",
      orderType: "pickup",
      items: [{ menuItemId: "item_1", quantity: 1 }],
      customerName: "Jake",
      customerEmail: "jake@example.com",
    });

    expect(result.success).toBe(true);
    expect(prismaMock.__tx.order.create).toHaveBeenCalledTimes(1);
    const createArgs = prismaMock.__tx.order.create.mock.calls[0][0];
    // 12.99 subtotal, 10% tax = 1.299, total = 14.289 → 14.29
    expect(createArgs.data.subtotal).toBeCloseTo(12.99, 2);
    expect(createArgs.data.taxAmount).toBeCloseTo(1.3, 2);
    expect(createArgs.data.total).toBeCloseTo(14.29, 2);
  });

  it("rejects orders with no items", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(RESTAURANT);

    const { createOrder } = await import("@/lib/actions");
    const result = await createOrder({
      restaurantId: "rest_1",
      orderType: "pickup",
      items: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/at least one item/i);
    }
  });

  it("rejects negative tip amounts", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(RESTAURANT);

    const { createOrder } = await import("@/lib/actions");
    const result = await createOrder({
      restaurantId: "rest_1",
      orderType: "pickup",
      items: [{ menuItemId: "item_1", quantity: 1 }],
      tipAmount: -5,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/tip.*negative/i);
    }
  });

  it("returns an error when restaurant does not exist", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(null);

    const { createOrder } = await import("@/lib/actions");
    const result = await createOrder({
      restaurantId: "rest_does_not_exist",
      orderType: "pickup",
      items: [{ menuItemId: "item_1", quantity: 1 }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/not found/i);
    }
  });

  it("rejects orders for inactive restaurants", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue({
      ...RESTAURANT,
      isActive: false,
    });

    const { createOrder } = await import("@/lib/actions");
    const result = await createOrder({
      restaurantId: "rest_1",
      orderType: "pickup",
      items: [{ menuItemId: "item_1", quantity: 1 }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/not currently accepting/i);
    }
  });

  it("rejects orders that reference unavailable menu items", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(RESTAURANT);
    // 2 items requested, only 1 found
    prismaMock.menuItem.findMany.mockResolvedValue([MENU_ITEM_1]);

    const { createOrder } = await import("@/lib/actions");
    const result = await createOrder({
      restaurantId: "rest_1",
      orderType: "pickup",
      items: [
        { menuItemId: "item_1", quantity: 1 },
        { menuItemId: "item_gone", quantity: 1 },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/unavailable/i);
    }
  });
});
