// ─────────────────────────────────────────────────────
// File:    src/app/order/[orderNumber]/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// Purpose: Order confirmation — shows status, items, and bank transfer details.
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Copy, Check, Clock } from 'lucide-react';
import { getOrderStatus } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { formatPrice, formatDate } from '@/lib/formatters';

interface BankDetails {
  bank_name: string;
  account_no: string;
  account_name: string;
  amount: number;
  reference: string;
}

interface OrderItem {
  id: number;
  product_name: string;
  product_slug: string;
  color: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface Order {
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={copy}
      className="ml-2 text-stone-400 hover:text-brand-500 transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

function BankTransferCard({ details }: { details: BankDetails }) {
  return (
    <div className="border border-brand-200 bg-brand-50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-brand-800 mb-4">
        Bank transfer details
      </h3>
      <dl className="space-y-2.5 text-sm">
        {[
          { label: 'Bank',           value: details.bank_name },
          { label: 'Account number', value: details.account_no },
          { label: 'Account name',   value: details.account_name },
          { label: 'Amount',         value: formatPrice(details.amount) },
          { label: 'Reference',      value: details.reference },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <dt className="text-brand-600 shrink-0 w-32">{label}</dt>
            <dd className="font-semibold text-brand-900 text-right flex items-center">
              {value}
              <CopyButton text={value} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-brand-600 mt-4 leading-relaxed">
        Please transfer the exact amount and use the order number as the reference.
        We will confirm your order within 1–2 business hours.
      </p>
    </div>
  );
}

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const [order, setOrder]           = useState<Order | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    // Retrieve bank details stored during checkout
    const stored = sessionStorage.getItem(`order_${orderNumber}`);
    if (stored) {
      try { setBankDetails(JSON.parse(stored)); } catch {}
    }

    getOrderStatus(orderNumber)
      .then(({ order }) => setOrder(order as Order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-stone-500 mb-4">{error || 'Order not found.'}</p>
        <Link href="/" className="btn-secondary">Go home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Success header */}
      <div className="text-center mb-8">
        <CheckCircle2 size={52} className="mx-auto text-green-500 mb-3" />
        <h1 className="text-2xl font-bold text-stone-900">Order placed!</h1>
        <p className="text-stone-500 text-sm mt-1">
          Thank you. We received your order.
        </p>
      </div>

      {/* Order meta */}
      <div className="bg-white border border-stone-100 rounded-xl p-5 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Order number</span>
          <span className="font-semibold text-stone-900 flex items-center">
            {order.order_number}
            <CopyButton text={order.order_number} />
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Date</span>
          <span className="text-stone-700">{formatDate(order.created_at)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Status</span>
          <span className="inline-flex items-center gap-1.5 text-yellow-600 font-medium">
            <Clock size={13} />
            Pending confirmation
          </span>
        </div>
      </div>

      {/* Bank transfer block */}
      {order.payment_method === 'bank_transfer' && bankDetails && (
        <div className="mb-4">
          <BankTransferCard details={bankDetails} />
        </div>
      )}

      {/* Items */}
      <div className="bg-white border border-stone-100 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Items ordered</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-stone-700 flex-1 min-w-0 line-clamp-1">
                {item.product_name}
                {item.color && <span className="text-stone-400"> · {item.color}</span>}
                <span className="text-stone-400"> × {item.quantity}</span>
              </span>
              <span className="font-medium text-stone-800 shrink-0 ml-4">
                {formatPrice(item.line_total)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <dl className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-stone-500">
            <dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-stone-500">
            <dt>Shipping</dt>
            <dd>
              {order.shipping_fee === 0
                ? <span className="text-green-600">Free</span>
                : formatPrice(order.shipping_fee)
              }
            </dd>
          </div>
          <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-100">
            <dt>Total</dt>
            <dd className="text-brand-600">{formatPrice(order.total_amount)}</dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/products" className="btn-secondary flex-1 justify-center">
          Continue shopping
        </Link>
        <Link href="/" className="btn-ghost flex-1 justify-center text-stone-500">
          Go home
        </Link>
      </div>
    </div>
  );
}
