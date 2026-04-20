// ─────────────────────────────────────────────────────
// File:    src/components/cart/CartItem.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/cart';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/formatters';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  const imgSrc = item.imagePath
    ? `/${item.imagePath}`
    : '/images/placeholder.webp';

  return (
    <div className="flex gap-4 py-4 border-b border-stone-100 last:border-0">
      {/* Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-100">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
          {item.name}
        </p>
        {item.color && (
          <p className="text-xs text-stone-400 mt-0.5">Color: {item.color}</p>
        )}
        <p className="text-sm font-bold text-brand-600 mt-1">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Qty controls + remove */}
      <div className="flex flex-col items-end justify-between gap-2 shrink-0">
        <button
          onClick={() => removeItem(item.productId, item.color)}
          className="text-stone-300 hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={15} />
        </button>

        <div className="flex items-center gap-1 border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color)}
            className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="w-6 text-center text-sm font-medium text-stone-800">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color)}
            className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
