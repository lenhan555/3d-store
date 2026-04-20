// ─────────────────────────────────────────────────────
// File:    src/components/cart/CartSummary.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

const SHIPPING_FEE      = 35_000;   // VND — matches settings table default
const FREE_SHIPPING_MIN = 500_000;

export function CartSummary({ subtotal }: { subtotal: number }) {
  const shippingFee  = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total        = subtotal + shippingFee;
  const remaining    = FREE_SHIPPING_MIN - subtotal;

  return (
    <div className="bg-stone-50 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-stone-700">Order summary</h2>

      {/* Free shipping progress */}
      {subtotal < FREE_SHIPPING_MIN && (
        <div>
          <p className="text-xs text-stone-500 mb-1.5">
            Add {formatPrice(remaining)} more for free shipping
          </p>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / FREE_SHIPPING_MIN) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Totals */}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-stone-600">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-stone-600">
          <dt>Shipping</dt>
          <dd>
            {shippingFee === 0
              ? <span className="text-green-600 font-medium">Free</span>
              : formatPrice(shippingFee)
            }
          </dd>
        </div>
        <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
          <dt>Total</dt>
          <dd className="text-brand-600">{formatPrice(total)}</dd>
        </div>
      </dl>

      <Link href="/checkout" className="btn-primary w-full !py-3 text-sm justify-center">
        Proceed to checkout
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
