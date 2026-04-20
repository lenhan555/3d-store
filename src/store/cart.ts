// ─────────────────────────────────────────────────────
// File:    src/store/cart.ts
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Zustand cart store with localStorage persistence.
// ─────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartState } from '@/types/cart';

// Two items are the "same" if productId AND color match
function sameItem(a: CartItem, b: Omit<CartItem, 'quantity'>): boolean {
  return a.productId === b.productId && a.color === b.color;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => sameItem(i, newItem));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameItem(i, newItem)
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },

      removeItem: (productId, color = null) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.color === color)
          ),
        }));
      },

      updateQuantity: (productId, quantity, color = null) => {
        if (quantity < 1) {
          get().removeItem(productId, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'jun3d-cart', // localStorage key
    }
  )
);
