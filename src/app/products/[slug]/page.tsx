// ─────────────────────────────────────────────────────
// File:    src/app/products/[slug]/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Product detail page — gallery, specs, color picker, Add to Cart.
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { getProduct } from '@/lib/api';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { Spinner } from '@/components/ui/Spinner';
import { StockBadge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/formatters';
import type { Product } from '@/types/product';

export default function ProductDetailPage() {
  const { slug }    = useParams<{ slug: string }>();
  const router      = useRouter();
  const addItem     = useCartStore((s) => s.addItem);

  const [product, setProduct]     = useState<Product | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [selectedColor, setColor] = useState<string | null>(null);
  const [added, setAdded]         = useState(false);

  useEffect(() => {
    if (!slug) return;
    getProduct(slug)
      .then(({ product }) => {
        setProduct(product);
        setColor(product.color_options?.[0] ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      price:     product.price,
      color:     selectedColor,
      imagePath: product.images[0]?.image_path ?? null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-500 mb-4">{error || 'Product not found.'}</p>
        <button className="btn-secondary" onClick={() => router.push('/products')}>
          Back to products
        </button>
      </div>
    );
  }

  const outOfStock = product.stock_qty <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="btn-ghost mb-6 -ml-2"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-stone-400 mb-1">{product.material}</p>
            <h1 className="text-2xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-brand-600">
              {formatPrice(product.price)}
            </span>
            <StockBadge qty={product.stock_qty} />
          </div>

          {product.description && (
            <p className="text-stone-600 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color picker */}
          {product.color_options && product.color_options.length > 1 && (
            <div>
              <p className="text-sm font-medium text-stone-700 mb-2">
                Color:{' '}
                <span className="font-normal text-stone-500">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.color_options.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedColor === color
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="btn-primary w-full !py-3 text-base"
          >
            <ShoppingCart size={18} />
            {outOfStock ? 'Out of stock' : added ? 'Added to cart ✓' : 'Add to cart'}
          </button>

          {/* Specs */}
          <ProductSpecs product={product} />
        </div>
      </div>
    </div>
  );
}
