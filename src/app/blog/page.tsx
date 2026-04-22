// ─────────────────────────────────────────────────────
// File:    src/app/blog/page.tsx
// Agent:   @Content_Creator | Sprint: 6 (planned)
// ─────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Cảm hứng trang trí nhà',
  description: 'Bài viết về thiết kế nội thất, in 3D và ý tưởng trang trí nhà từ Jun 3D Studio.',
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-100 mb-6">
        Sắp ra mắt
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
        Blog trang trí nhà
      </h1>
      <p className="text-stone-500 text-lg max-w-md mx-auto mb-8">
        Cảm hứng decor, hướng dẫn chọn màu, và câu chuyện đằng sau mỗi sản phẩm in 3D.
      </p>
      <p className="text-stone-400 text-sm mb-8">
        Blog đang được xây dựng — trong thời gian chờ, hãy khám phá bộ sưu tập của chúng tôi.
      </p>
      <Link href="/products" className="btn-primary">
        Xem sản phẩm <ArrowRight size={16} />
      </Link>
    </div>
  );
}
