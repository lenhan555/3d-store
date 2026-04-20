// ─────────────────────────────────────────────────────
// File:    src/components/checkout/PaymentSelector.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
import { Badge } from '@/components/ui/Badge';

type PaymentMethod = 'bank_transfer' | 'vnpay' | 'momo';

const methods = [
  {
    id:    'bank_transfer' as PaymentMethod,
    label: 'Bank Transfer',
    desc:  'Transfer directly to our bank account. Details shown after checkout.',
    available: true,
  },
  {
    id:    'vnpay' as PaymentMethod,
    label: 'VNPay',
    desc:  'Pay via VNPay gateway.',
    available: false,
  },
  {
    id:    'momo' as PaymentMethod,
    label: 'MoMo',
    desc:  'Pay via MoMo e-wallet.',
    available: false,
  },
];

export function PaymentSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  return (
    <div className="space-y-2">
      {methods.map((m) => (
        <label
          key={m.id}
          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
            !m.available
              ? 'opacity-50 cursor-not-allowed border-stone-100 bg-stone-50'
              : value === m.id
              ? 'border-brand-400 bg-brand-50'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <input
            type="radio"
            name="payment_method"
            value={m.id}
            checked={value === m.id}
            disabled={!m.available}
            onChange={() => m.available && onChange(m.id)}
            className="mt-0.5 accent-brand-500"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-800">{m.label}</span>
              {!m.available && (
                <Badge variant="stone">Coming soon</Badge>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{m.desc}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
