// ─────────────────────────────────────────────────────
// File:    src/components/product/ProductCard.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Catalog grid card. Shows image, name, material, price, Add to Cart.
// ─────────────────────────────────────────────────────
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatters';
import { useCartStore } from '@/store/cart';
import { StockBadge } from '@/components/ui/Badge';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const imgSrc = product.primary_image
    ? `/${product.primary_image}`
    : '/images/placeholder.webp';

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate when clicking the button inside the link
    addItem({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      price:     product.price,
      color:     product.color_options?.[0] ?? null,
      imagePath: product.primary_image ?? null,
    });
  }

  return (
    <Link href={`/products/${product.slug}`} className="product-card group block">
      {/* Product image */}
      <div className="relative aspect-product bg-stone-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {product.stock_qty <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium text-stone-500">Sold out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-stone-400 mb-0.5">{product.material}</p>
        <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-brand-600">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_qty <= 0}
            className="btn-primary !px-3 !py-2 text-xs shrink-0"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>

        <div className="mt-2">
          <StockBadge qty={product.stock_qty} />
        </div>
      </div>
    </Link>
  );
}
