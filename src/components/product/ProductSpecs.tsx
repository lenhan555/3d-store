// ─────────────────────────────────────────────────────
// File:    src/components/product/ProductSpecs.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Material, dimensions, print time display on product detail.
// ─────────────────────────────────────────────────────
import type { Product } from '@/types/product';
import { formatPrintTime, formatDimensions } from '@/lib/formatters';

export function ProductSpecs({ product }: { product: Product }) {
  const specs = [
    { label: 'Material',    value: product.material },
    { label: 'Dimensions',  value: formatDimensions(product.width_mm, product.height_mm, product.depth_mm) },
    { label: 'Print time',  value: formatPrintTime(product.print_time_hours) },
    { label: 'Weight',      value: product.weight_grams ? `${product.weight_grams} g` : '—' },
  ];

  return (
    <div className="border border-stone-100 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Specifications
        </h3>
      </div>
      <dl>
        {specs.map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex px-4 py-2.5 text-sm ${
              i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
            }`}
          >
            <dt className="w-32 shrink-0 text-stone-500">{label}</dt>
            <dd className="font-medium text-stone-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
