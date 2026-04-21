// ─────────────────────────────────────────────────────
// File:    src/app/admin/layout.tsx
// Agent:   @Frontend_Engineer | Sprint: 4
// Purpose: Admin shell — sidebar nav + auth guard.
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react';
import { isTokenValid, clearToken } from '@/lib/adminApi';

const navItems = [
  { href: '/admin/orders',   label: 'Orders',   icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setReady(true); return; }
    if (!isTokenValid()) {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  function logout() {
    clearToken();
    router.push('/admin/login');
  }

  if (!ready) return null;
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-stone-900 text-white flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-stone-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">J</span>
            </div>
            <span className="text-sm font-bold">Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          <Link
            href="/admin/orders"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith('/admin/orders')
                ? 'bg-stone-700 text-white font-medium'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <ShoppingBag size={15} />
            Orders
          </Link>
          <Link
            href="/admin/products"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith('/admin/products')
                ? 'bg-stone-700 text-white font-medium'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Package size={15} />
            Products
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-stone-700">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
