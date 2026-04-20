// ─────────────────────────────────────────────────────
// File:    src/app/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Homepage — hero banner + featured products grid.
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import type { Product } from '@/types/product';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(({ products }) => setFeatured(products))
      .catch(() => {}) // silent — hero still shows
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-medium px-3 py-1 rounded-full border border-brand-500/30">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
            Made to order
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-xl">
            3D Printed<br />Home Decor
          </h1>
          <p className="text-stone-300 text-lg max-w-md leading-relaxed">
            Handcrafted in PLA Matte. Vases, sculptures, and decorative objects
            designed to bring warmth to your space.
          </p>
          <Link href="/products" className="btn-primary !px-6 !py-3 text-base">
            Shop now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">Featured</h2>
          <Link
            href="/products"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-400">Products coming soon.</p>
          </div>
        )}

        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Value props */}
      <section className="border-t border-stone-100 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { title: 'Made to Order', desc: 'Each piece printed fresh for you' },
            { title: 'PLA Matte Finish', desc: 'Smooth, modern, eco-conscious material' },
            { title: 'Fast Shipping', desc: 'Ready within 2–4 business days' },
          ].map(({ title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
              <p className="text-sm text-stone-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
