// ─────────────────────────────────────────────────────
// File:    src/components/product/ProductGallery.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Image carousel for product detail. No external carousel lib.
// ─────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/types/product';

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);

  // Fallback when no images uploaded yet
  const hasImages = images.length > 0;
  const activeSrc = hasImages
    ? `/${images[active].image_path}`
    : '/images/placeholder.webp';
  const activeAlt = hasImages
    ? (images[active].alt_text || productName)
    : productName;

  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setActive((i) => (i + 1) % images.length);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-stone-100 rounded-xl overflow-hidden">
        <Image
          src={activeSrc}
          alt={activeAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          unoptimized
        />

        {/* Prev/Next arrows — only shown when multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active
                  ? 'border-brand-500'
                  : 'border-transparent hover:border-stone-300'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={`/${img.image_path}`}
                alt={img.alt_text || `${productName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
