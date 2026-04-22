// ─────────────────────────────────────────────────────
// File:    src/app/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 5 (UX redesign)
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Printer, Truck, BadgeCheck, Star, Package, Clock } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import type { Product } from '@/types/product';

const STEPS = [
  { icon: Package,    step: '01', title: 'Chọn sản phẩm',   desc: 'Duyệt danh mục và chọn mẫu bạn yêu thích.' },
  { icon: Printer,    step: '02', title: 'In theo yêu cầu', desc: 'Mỗi sản phẩm được in 3D riêng cho bạn bằng nhựa PLA Matte cao cấp.' },
  { icon: Truck,      step: '03', title: 'Giao tận nhà',    desc: 'Đóng gói cẩn thận và giao hàng toàn quốc trong 2–4 ngày.' },
];

const TRUST = [
  { icon: BadgeCheck, label: 'Chất lượng đảm bảo',  sub: 'In 3D bằng nhựa PLA Matte cao cấp' },
  { icon: Truck,      label: 'Giao hàng toàn quốc', sub: 'Đóng gói cẩn thận, ship 2–4 ngày' },
  { icon: Clock,      label: 'Made to order',        sub: 'Sản xuất ngay sau khi đặt hàng' },
  { icon: Star,       label: 'Thiết kế độc quyền',  sub: 'Mẫu mã đẹp, không bán đại trà' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(({ products }) => setFeatured(products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-500/30 mb-6">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              In 3D theo yêu cầu — Made to order
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight mb-5">
              Trang trí nhà<br />
              <span className="text-brand-400">độc đáo & tinh tế</span>
            </h1>

            <p className="text-stone-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Lọ hoa, tượng trang trí và đồ decor in 3D từ nhựa PLA Matte.
              Mỗi sản phẩm được tạo ra riêng cho bạn.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary !px-7 !py-3.5 text-base">
                Xem sản phẩm
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://m.me/jun3dstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-7 !py-3.5 text-base !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────── */}
      <section className="bg-brand-500">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
            {['✓ Nhựa PLA Matte cao cấp', '✓ Giao toàn quốc', '✓ Đổi trả trong 7 ngày', '✓ Thanh toán khi nhận hàng (COD)'].map(t => (
              <span key={t} className="text-white text-xs sm:text-sm font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Sản phẩm nổi bật</h2>
            <p className="text-sm text-stone-500 mt-1">Được yêu thích nhất tại Jun 3D Studio</p>
          </div>
          <Link href="/products" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-stone-400 text-lg font-medium">Sản phẩm sắp ra mắt</p>
            <p className="text-stone-400 text-sm mt-1">Quay lại sớm để khám phá!</p>
          </div>
        )}

        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="bg-stone-50 border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-stone-900">Quy trình đặt hàng</h2>
            <p className="text-stone-500 mt-2 text-sm">Đơn giản — chỉ 3 bước</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center">
                    <Icon size={24} className="text-brand-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-stone-900">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Material highlight ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-xl">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Chất liệu</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">
              PLA Matte — Tinh tế từng chi tiết
            </h2>
            <p className="text-stone-300 leading-relaxed mb-6">
              Nhựa PLA Matte tạo bề mặt mịn, hiện đại và thân thiện với môi trường.
              Màu sắc bền, không bong tróc, phù hợp với mọi không gian nội thất.
            </p>
            <div className="flex flex-wrap gap-2 mb-7">
              {['Trắng sữa', 'Đen mờ', 'Nâu đất', 'Xanh rêu', 'Hồng phấn', 'Ghi xám'].map(color => (
                <span key={color} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">
                  {color}
                </span>
              ))}
            </div>
            <Link href="/products" className="btn-primary">
              Xem bộ sưu tập <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust grid ───────────────────────────────────── */}
      <section className="bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-brand-500" />
              </div>
              <p className="text-sm font-semibold text-stone-800">{label}</p>
              <p className="text-xs text-stone-500 leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            Bắt đầu trang trí không gian của bạn
          </h2>
          <p className="text-stone-500 mb-7 max-w-md mx-auto">
            Khám phá hàng trăm mẫu thiết kế độc đáo. Đặt hàng ngay hôm nay.
          </p>
          <Link href="/products" className="btn-primary !px-8 !py-3.5 text-base">
            Mua sắm ngay <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
