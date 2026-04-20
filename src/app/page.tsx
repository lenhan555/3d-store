// ─────────────────────────────────────────────────────
// File:    src/app/page.tsx
// Agent:   @Frontend_Engineer
// Sprint:  1
// Purpose: Homepage placeholder — Sprint 2 replaces this with
//          hero section + featured products grid.
// ─────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 px-4">
      {/* Logo placeholder */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-brand-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">J</span>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Jun 3D Studio
        </h1>
        <p className="mt-2 text-stone-500 text-base max-w-sm">
          Custom 3D-printed home decor — launching soon.
        </p>
      </div>

      {/* Status badge */}
      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full border border-brand-200">
        <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
        Store under construction
      </div>

      {/* API health check link — remove before launch */}
      <p className="mt-12 text-xs text-stone-400">
        <a
          href="/api/health"
          className="underline underline-offset-2 hover:text-stone-600 transition-colors"
        >
          Check server health
        </a>
      </p>
    </div>
  );
}
