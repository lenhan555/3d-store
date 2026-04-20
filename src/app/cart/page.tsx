// ─────────────────────────────────────────────────────
// File:    src/app/cart/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-stone-200 mb-4" />
        <h1 className="text-xl font-bold text-stone-900 mb-2">Your cart is empty</h1>
        <p className="text-stone-400 text-sm mb-6">
          Browse our products and add something you love.
        </p>
        <Link href="/products" className="btn-primary">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">
          Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-400 transition-colors underline underline-offset-2"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-100 px-5 py-1">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.color}`} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div>
          <CartSummary subtotal={totalPrice()} />
        </div>
      </div>
    </div>
  );
}
