// ─────────────────────────────────────────────────────
// File:    src/components/ui/Spinner.tsx
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size];
  return (
    <div
      className={`${sizeClass} border-2 border-stone-200 border-t-brand-500 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
