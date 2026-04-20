// ─────────────────────────────────────────────────────
// File:    src/lib/formatters.ts
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────

/** Format a VND price: 250000 → "250.000 ₫" */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string → "20 Apr 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format print time: 3.5 → "3h 30m" */
export function formatPrintTime(hours: number | null): string {
  if (!hours) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Format dimensions: 80, 120, 60 → "80 × 120 × 60 mm" */
export function formatDimensions(
  w: number | null,
  h: number | null,
  d: number | null
): string {
  if (!w && !h && !d) return '—';
  return [w, h, d].filter(Boolean).join(' × ') + ' mm';
}

/** Generate an order number: ORD-20260421-0001 */
export function formatOrderNumber(id: number): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD-${date}-${String(id).padStart(4, '0')}`;
}
