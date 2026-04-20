// ─────────────────────────────────────────────────────
// File:    src/components/ui/Badge.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────

type BadgeVariant = 'green' | 'yellow' | 'red' | 'stone' | 'brand';

const variantClass: Record<BadgeVariant, string> = {
  green:  'bg-green-50 text-green-700 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red:    'bg-red-50 text-red-600 border-red-200',
  stone:  'bg-stone-100 text-stone-600 border-stone-200',
  brand:  'bg-brand-50 text-brand-700 border-brand-200',
};

export function Badge({
  children,
  variant = 'stone',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${variantClass[variant]}`}
    >
      {children}
    </span>
  );
}

export function StockBadge({ qty }: { qty: number }) {
  if (qty <= 0)  return <Badge variant="red">Out of stock</Badge>;
  if (qty <= 3)  return <Badge variant="yellow">Only {qty} left</Badge>;
  return <Badge variant="green">In stock</Badge>;
}
