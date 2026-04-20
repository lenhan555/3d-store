// ─────────────────────────────────────────────────────
// File:    src/types/cart.ts
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  color: string | null;
  imagePath: string | null;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number, color?: string | null) => void;
  updateQuantity: (productId: number, quantity: number, color?: string | null) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
