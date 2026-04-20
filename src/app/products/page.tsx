// ─────────────────────────────────────────────────────
// File:    src/app/products/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Product catalog — paginated grid with loading skeleton.
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import type { Product, ProductsResponse } from '@/types/product';

// Loading skeleton — same grid layout as real cards
function ProductSkeleton() {
  return (
    <div className="product-card animate-pulse">
      <div className="aspect-product bg-stone-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-4 bg-stone-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [data, setData]       = useState<ProductsResponse | null>(null);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts(page, 12)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">All Products</h1>
        {data && (
          <p className="text-sm text-stone-500 mt-1">
            {data.total} {data.total === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center py-16">
          <p className="text-stone-500 mb-4">{error}</p>
          <button className="btn-secondary" onClick={() => setPage(1)}>
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && data?.products.length === 0 && (
        <div className="text-center py-24">
          <p className="text-stone-400 text-lg">No products yet.</p>
          <p className="text-stone-400 text-sm mt-1">Check back soon!</p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && data && data.products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                className="btn-secondary !px-4"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-stone-500">
                Page {data.page} of {data.totalPages}
              </span>
              <button
                className="btn-secondary !px-4"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
