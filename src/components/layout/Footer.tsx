// ─────────────────────────────────────────────────────
// File:    src/components/layout/Footer.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-stone-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">J</span>
            </div>
            <span className="font-bold text-stone-900 text-sm">Jun 3D Studio</span>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Custom 3D-printed home decor. Every piece made to order in PLA Matte.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Shop
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/products" className="text-stone-600 hover:text-brand-600 transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-stone-600 hover:text-brand-600 transition-colors">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment info */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Payment
          </h4>
          <p className="text-sm text-stone-500 leading-relaxed">
            We accept bank transfer. Details will be shown after checkout.
          </p>
          <p className="text-xs text-stone-400 mt-2">
            Orders processed within 1–2 business days.
          </p>
        </div>
      </div>

      <div className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Jun 3D Studio. All rights reserved.
      </div>
    </footer>
  );
}
