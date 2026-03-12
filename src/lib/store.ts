import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartModifier {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface CartItem {
  id: string; // unique cart line id
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  modifiers: CartModifier[];
  notes?: string;
}

interface CartState {
  items: CartItem[];
  restaurantSlug: string | null;
  restaurantName: string | null;

  // Actions
  addItem: (
    item: Omit<CartItem, "id">,
    restaurantSlug: string,
    restaurantName: string
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;

  // Computed
  subtotal: () => number;
  itemCount: () => number;
}

function generateCartItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantSlug: null,
      restaurantName: null,

      addItem: (item, restaurantSlug, restaurantName) => {
        const state = get();

        // If switching restaurants, clear the cart first
        if (state.restaurantSlug && state.restaurantSlug !== restaurantSlug) {
          set({ items: [], restaurantSlug: null, restaurantName: null });
        }

        // Check if an identical item already exists (same menuItemId + same modifiers)
        const existingIndex = get().items.findIndex(
          (existing) =>
            existing.menuItemId === item.menuItemId &&
            JSON.stringify(existing.modifiers) ===
              JSON.stringify(item.modifiers) &&
            existing.notes === item.notes
        );

        if (existingIndex >= 0) {
          // Increment quantity of existing item
          const updated = [...get().items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          };
          set({ items: updated, restaurantSlug, restaurantName });
        } else {
          // Add as a new line item
          const newItem: CartItem = {
            ...item,
            id: generateCartItemId(),
          };
          set({
            items: [...get().items, newItem],
            restaurantSlug,
            restaurantName,
          });
        }
      },

      removeItem: (id) => {
        const items = get().items.filter((item) => item.id !== id);
        if (items.length === 0) {
          set({ items: [], restaurantSlug: null, restaurantName: null });
        } else {
          set({ items });
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      updateNotes: (id, notes) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, notes } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], restaurantSlug: null, restaurantName: null });
      },

      subtotal: () => {
        return get().items.reduce((sum, item) => {
          const modifierTotal = item.modifiers.reduce(
            (mSum, mod) => mSum + mod.priceAdjustment,
            0
          );
          return sum + (item.price + modifierTotal) * item.quantity;
        }, 0);
      },

      itemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "fed-cart",
    }
  )
);
