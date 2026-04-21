// ─────────────────────────────────────────────────────
// File:    src/app/admin/products/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 4
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminGetProducts, adminToggleProduct, AdminProduct } from '@/lib/adminApi';
import { formatPrice } from '@/lib/formatters';
import { Plus, Loader2, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts]   = useState<AdminProduct[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetProducts(page);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleToggle(product: AdminProduct) {
    setToggling(product.id);
    try {
      await adminToggleProduct(product.id, !product.is_active);
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ));
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Products</h1>
          <p className="text-sm text-stone-500 mt-0.5">{total} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-1.5">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-stone-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-1.5">
              <Plus size={16} /> Add first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium w-16">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Material</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden flex items-center justify-center">
                        {product.primary_image ? (
                          <Image
                            src={product.primary_image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-stone-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{product.name}</p>
                      <p className="text-stone-400 text-xs font-mono">{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{product.material}</td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock_qty <= 3 ? 'text-red-500' : 'text-stone-700'}`}>
                        {product.stock_qty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(product)}
                        disabled={toggling === product.id}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                          product.is_active ? 'bg-brand-500' : 'bg-stone-300'
                        }`}
                        title={product.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          product.is_active ? 'translate-x-4' : 'translate-x-1'
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-brand-600 transition-colors"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary !py-1.5 !px-3 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary !py-1.5 !px-3 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
