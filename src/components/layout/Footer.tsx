// ─────────────────────────────────────────────────────
// File:    src/components/layout/Footer.tsx
// Agent:   @Frontend_Engineer | Sprint: 5 (UX redesign)
// ─────────────────────────────────────────────────────
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <span className="font-bold text-white text-sm">Jun 3D Studio</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-5">
              Đồ trang trí nhà in 3D độc đáo. Mỗi sản phẩm được tạo riêng cho bạn bằng nhựa PLA Matte cao cấp.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/jun3dstudio"
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-brand-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://instagram.com/jun3dstudio"
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-brand-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
              Mua sắm
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/products', label: 'Tất cả sản phẩm' },
                { href: '/products?material=PLA+Matte', label: 'PLA Matte' },
                { href: '/cart',     label: 'Giỏ hàng' },
                { href: '/blog',     label: 'Blog' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-stone-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
              Thông tin
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>Thời gian in: 2–4 ngày</li>
              <li>Giao hàng toàn quốc</li>
              <li>Đổi trả trong 7 ngày</li>
              <li>Thanh toán: Chuyển khoản / COD</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+84xxxxxxxxx" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                  <Phone size={14} className="text-brand-400 shrink-0" />
                  0xxx xxx xxx
                </a>
              </li>
              <li>
                <a href="mailto:admin@jun3d-studio.store" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                  <Mail size={14} className="text-brand-400 shrink-0" />
                  admin@jun3d-studio.store
                </a>
              </li>
              <li className="flex items-start gap-2 text-stone-400">
                <MapPin size={14} className="text-brand-400 shrink-0 mt-0.5" />
                <span>Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Jun 3D Studio. All rights reserved.</p>
          <p>Thiết kế & in 3D tại Việt Nam 🇻🇳</p>
        </div>
      </div>
    </footer>
  );
}
