import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/store";
import type { CartItem } from "@/lib/store";

// Reset the Zustand store before each test
beforeEach(() => {
  localStorage.clear();
  useCartStore.getState().clearCart();
});

// Helper to create a cart item (without the auto-generated id)
function makeItem(overrides: Partial<Omit<CartItem, "id">> = {}): Omit<CartItem, "id"> {
  return {
    menuItemId: "item-1",
    name: "Classic Burger",
    price: 12.99,
    quantity: 1,
    modifiers: [],
    ...overrides,
  };
}

// ============================================
// addItem
// ============================================

describe("addItem", () => {
  it("adds an item to an empty cart", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe("Classic Burger");
    expect(state.restaurantSlug).toBe("burger-palace");
    expect(state.restaurantName).toBe("Burger Palace");
  });

  it("increments quantity when adding the same item", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem({ quantity: 1 }), "burger-palace", "Burger Palace");
    store.addItem(makeItem({ quantity: 2 }), "burger-palace", "Burger Palace");

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("adds as separate line items when modifiers differ", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    store.addItem(
      makeItem({
        modifiers: [{ id: "mod-1", name: "Extra Cheese", priceAdjustment: 1.5 }],
      }),
      "burger-palace",
      "Burger Palace"
    );

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
  });

  it("clears cart when switching restaurants", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    store.addItem(
      makeItem({ menuItemId: "item-2", name: "Margherita" }),
      "pizza-place",
      "Pizza Place"
    );

    const state = useCartStore.getState();
    // Old item should be gone, only the new restaurant's item remains
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe("Margherita");
    expect(state.restaurantSlug).toBe("pizza-place");
  });
});

// ============================================
// removeItem
// ============================================

describe("removeItem", () => {
  it("removes an item by id", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    const itemId = useCartStore.getState().items[0].id;

    store.removeItem(itemId);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it("resets restaurant info when last item is removed", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    const itemId = useCartStore.getState().items[0].id;

    store.removeItem(itemId);
    const state = useCartStore.getState();
    expect(state.restaurantSlug).toBeNull();
    expect(state.restaurantName).toBeNull();
  });

  it("keeps other items when removing one", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    store.addItem(
      makeItem({ menuItemId: "item-2", name: "Fries" }),
      "burger-palace",
      "Burger Palace"
    );

    const firstId = useCartStore.getState().items[0].id;
    store.removeItem(firstId);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe("Fries");
    expect(state.restaurantSlug).toBe("burger-palace");
  });
});

// ============================================
// clearCart
// ============================================

describe("clearCart", () => {
  it("removes all items and resets restaurant info", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    store.addItem(
      makeItem({ menuItemId: "item-2", name: "Fries" }),
      "burger-palace",
      "Burger Palace"
    );

    store.clearCart();
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.restaurantSlug).toBeNull();
    expect(state.restaurantName).toBeNull();
  });

  it("is a no-op on an already empty cart", () => {
    const store = useCartStore.getState();
    store.clearCart();
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });
});

// ============================================
// wouldSwitchRestaurant
// ============================================

describe("wouldSwitchRestaurant", () => {
  it("returns false when cart is empty", () => {
    const store = useCartStore.getState();
    expect(store.wouldSwitchRestaurant("any-slug")).toBe(false);
  });

  it("returns false when slug matches current restaurant", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    expect(useCartStore.getState().wouldSwitchRestaurant("burger-palace")).toBe(false);
  });

  it("returns true when slug differs from current restaurant", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem(), "burger-palace", "Burger Palace");
    expect(useCartStore.getState().wouldSwitchRestaurant("pizza-place")).toBe(true);
  });
});

// ============================================
// subtotal (tip not included — subtotal is item totals only)
// ============================================

describe("subtotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(useCartStore.getState().subtotal()).toBe(0);
  });

  it("calculates subtotal for a single item", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem({ price: 10, quantity: 2 }), "r", "R");
    // 10 * 2 = 20
    expect(useCartStore.getState().subtotal()).toBeCloseTo(20);
  });

  it("includes modifier prices in subtotal", () => {
    const store = useCartStore.getState();
    store.addItem(
      makeItem({
        price: 10,
        quantity: 1,
        modifiers: [
          { id: "m1", name: "Bacon", priceAdjustment: 2 },
          { id: "m2", name: "Cheese", priceAdjustment: 1.5 },
        ],
      }),
      "r",
      "R"
    );
    // (10 + 2 + 1.5) * 1 = 13.5
    expect(useCartStore.getState().subtotal()).toBeCloseTo(13.5);
  });

  it("sums multiple items correctly", () => {
    const store = useCartStore.getState();
    store.addItem(makeItem({ price: 10, quantity: 2 }), "r", "R");
    store.addItem(
      makeItem({ menuItemId: "item-2", name: "Fries", price: 5, quantity: 3 }),
      "r",
      "R"
    );
    // (10 * 2) + (5 * 3) = 35
    expect(useCartStore.getState().subtotal()).toBeCloseTo(35);
  });
});
