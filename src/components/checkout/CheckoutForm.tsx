// ─────────────────────────────────────────────────────
// File:    src/components/checkout/CheckoutForm.tsx
// Agent:   @Frontend_Engineer | Sprint: 3
// ─────────────────────────────────────────────────────
'use client';

export interface CheckoutFormData {
  customer_name:    string;
  customer_email:   string;
  customer_phone:   string;
  shipping_address: string;
  notes:            string;
}

export function CheckoutForm({
  data,
  errors,
  onChange,
}: {
  data:     CheckoutFormData;
  errors:   Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}) {
  function field(
    id: keyof CheckoutFormData,
    label: string,
    type = 'text',
    required = true,
    placeholder = ''
  ) {
    return (
      <div>
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type={type}
          value={data[id]}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className={`form-input ${errors[id] ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
          autoComplete={id === 'customer_email' ? 'email' : id === 'customer_name' ? 'name' : undefined}
        />
        {errors[id] && (
          <p className="text-xs text-red-500 mt-1">{errors[id]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-stone-800">Delivery information</h2>

      {field('customer_name',  'Full name',     'text',  true, 'Nguyen Van A')}
      {field('customer_email', 'Email',         'email', true, 'you@email.com')}
      {field('customer_phone', 'Phone number',  'tel',   false, '0901 234 567')}

      <div>
        <label htmlFor="shipping_address" className="form-label">
          Shipping address <span className="text-red-400">*</span>
        </label>
        <textarea
          id="shipping_address"
          rows={3}
          value={data.shipping_address}
          onChange={(e) => onChange('shipping_address', e.target.value)}
          placeholder="Street address, ward, district, city"
          className={`form-input resize-none ${errors.shipping_address ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
        />
        {errors.shipping_address && (
          <p className="text-xs text-red-500 mt-1">{errors.shipping_address}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="form-label">
          Order notes <span className="text-stone-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Color preferences, special requests…"
          className="form-input resize-none"
        />
      </div>
    </div>
  );
}
