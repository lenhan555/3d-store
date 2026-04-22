// ─────────────────────────────────────────────────────
// File:    src/components/layout/Navbar.tsx
// Agent:   @Frontend_Engineer | Sprint: 5 (UX redesign)
// ─────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, BookOpen } from 'lucide-react';
import { useCartStore } from '@/store/cart';

const NAV_LINKS = [
  { href: '/',         label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm'  },
  { href: '/blog',     label: 'Blog'       },
];

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const pathname   = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-stone-900 hover:text-brand-600 transition-colors shrink-0"
        >
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">J</span>
          </div>
          <span className="text-sm font-bold tracking-tight">Jun 3D Studio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            aria-label={`Giỏ hàng — ${totalItems} sản phẩm`}
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
