// ─────────────────────────────────────────────────────
// File:    src/components/layout/Navbar.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-stone-900 hover:text-brand-600 transition-colors"
        >
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">J</span>
          </div>
          <span className="text-sm">Jun 3D Studio</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/" className="btn-ghost text-sm">
            Home
          </Link>
          <Link href="/products" className="btn-ghost text-sm">
            Products
          </Link>
        </nav>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative btn-ghost !px-2.5"
          aria-label={`Cart — ${totalItems} items`}
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
