// ─────────────────────────────────────────────────────
// File:    src/app/checkout/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { createOrder } from '@/lib/api';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PaymentSelector } from '@/components/checkout/PaymentSelector';
import { formatPrice } from '@/lib/formatters';
import type { CheckoutFormData } from '@/components/checkout/CheckoutForm';

const SHIPPING_FEE      = 35_000;
const FREE_SHIPPING_MIN = 500_000;

type PaymentMethod = 'bank_transfer' | 'vnpay' | 'momo';

function validate(data: CheckoutFormData) {
  const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
  if (!data.customer_name.trim())    errors.customer_name    = 'Full name is required.';
  if (!data.customer_email.trim())   errors.customer_email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email))
                                     errors.customer_email   = 'Please enter a valid email.';
  if (!data.shipping_address.trim()) errors.shipping_address = 'Shipping address is required.';
  return errors;
}

export default function CheckoutPage() {
  const router    = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState<CheckoutFormData>({
    customer_name:    '',
    customer_email:   '',
    customer_phone:   '',
    shipping_address: '',
    notes:            '',
  });
  const [payment, setPayment]   = useState<PaymentMethod>('bank_transfer');
  const [errors, setErrors]     = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) router.replace('/cart');
  }, [items, router]);

  function handleChange(field: keyof CheckoutFormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError(null);

    try {
      const result = await createOrder({
        customer_name:    form.customer_name.trim(),
        customer_email:   form.customer_email.trim(),
        customer_phone:   form.customer_phone.trim() || undefined,
        shipping_address: form.shipping_address.trim(),
        payment_method:   payment,
        notes:            form.notes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          color:     i.color,
        })),
      });

      // Store bank details in sessionStorage for the confirmation page
      if (result.bankDetails) {
        sessionStorage.setItem(
          `order_${result.orderNumber}`,
          JSON.stringify(result.bankDetails)
        );
      }

      clearCart();
      router.push(`/order/${result.orderNumber}`);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  const subtotal    = totalPrice();
  const shippingFee = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total       = subtotal + shippingFee;

  if (items.length === 0) return null; // redirecting

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: form + payment */}
          <div className="lg:col-span-3 space-y-8">
            <CheckoutForm data={form} errors={errors} onChange={handleChange} />

            <div>
              <h2 className="text-base font-semibold text-stone-800 mb-3">
                Payment method
              </h2>
              <PaymentSelector value={payment} onChange={setPayment} />
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-stone-50 rounded-xl p-5 sticky top-20">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                Your order
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.color}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                      <Image
                        src={item.imagePath ? `/${item.imagePath}` : '/images/placeholder.webp'}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 line-clamp-1">{item.name}</p>
                      {item.color && <p className="text-xs text-stone-400">{item.color}</p>}
                    </div>
                    <p className="text-xs font-semibold text-stone-800 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <dl className="space-y-1.5 text-sm border-t border-stone-200 pt-3">
                <div className="flex justify-between text-stone-500">
                  <dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-stone-500">
                  <dt>Shipping</dt>
                  <dd>{shippingFee === 0 ? <span className="text-green-600">Free</span> : formatPrice(shippingFee)}</dd>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                  <dt>Total</dt>
                  <dd className="text-brand-600">{formatPrice(total)}</dd>
                </div>
              </dl>

              {/* Submit */}
              {serverError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full !py-3 mt-4 text-sm"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'Placing order…' : 'Place order'}
              </button>

              <p className="text-xs text-stone-400 text-center mt-3">
                By placing your order you agree to our terms.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
