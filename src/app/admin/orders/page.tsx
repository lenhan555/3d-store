// ─────────────────────────────────────────────────────
// File:    src/app/admin/orders/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 4
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  adminGetOrders, adminUpdateOrderStatus, getAdminStats,
  AdminOrder,
} from '@/lib/adminApi';
import { formatPrice, formatDate } from '@/lib/formatters';
import { Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const ORDER_STATUSES   = ['pending','confirmed','printing','shipped','delivered','cancelled'];
const PAYMENT_STATUSES = ['pending','paid','failed','refunded'];

const ORDER_COLORS: Record<string, string> = {
  pending:   'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  confirmed: 'bg-blue-900/40 text-blue-300 border-blue-700',
  printing:  'bg-purple-900/40 text-purple-300 border-purple-700',
  shipped:   'bg-indigo-900/40 text-indigo-300 border-indigo-700',
  delivered: 'bg-green-900/40 text-green-300 border-green-700',
  cancelled: 'bg-stone-700/40 text-stone-400 border-stone-600',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending:  'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  paid:     'bg-green-900/40 text-green-300 border-green-700',
  failed:   'bg-red-900/40 text-red-300 border-red-700',
  refunded: 'bg-stone-700/40 text-stone-400 border-stone-600',
};

function Badge({ value, map }: { value: string; map: Record<string, string> }) {
  const cls = map[value] ?? 'bg-stone-700/40 text-stone-400 border-stone-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {value}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<AdminOrder[]>([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const [stats, setStats] = useState<{
    total_orders: number; pending_orders: number;
    total_products: number; low_stock: number; revenue_total: number;
  } | null>(null);

  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetOrders(page, statusFilter || undefined);
      setOrders(data.orders);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => {});
  }, []);

  async function updateStatus(id: number, field: 'order_status' | 'payment_status', value: string) {
    setUpdating(id);
    try {
      await adminUpdateOrderStatus(id, { [field]: value });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
      getAdminStats().then(setStats).catch(() => {});
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Orders</h1>
          <p className="text-sm text-stone-500 mt-0.5">{total} total orders</p>
        </div>
        <button onClick={load} className="btn-secondary flex items-center gap-1.5 !py-2 !px-3 text-sm">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Orders',    value: stats.total_orders },
            { label: 'Pending',         value: stats.pending_orders },
            { label: 'Products Active', value: stats.total_products },
            { label: 'Low Stock',       value: stats.low_stock },
            { label: 'Revenue',         value: formatPrice(stats.revenue_total) },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3">
              <p className="text-xs text-stone-500">{s.label}</p>
              <p className="text-lg font-bold text-stone-900 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {['', ...ORDER_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-brand-400'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-stone-400" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-stone-400 py-16">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Order Status</th>
                  <th className="px-4 py-3 font-medium">Payment Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map(order => (
                  <>
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50 cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-brand-600 font-medium">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{order.customer_name}</p>
                        <p className="text-stone-400 text-xs">{order.customer_email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-stone-500 text-xs capitalize">
                        {order.payment_method}
                      </td>
                      <td className="px-4 py-3">
                        {updating === order.id ? (
                          <Loader2 size={14} className="animate-spin text-stone-400" />
                        ) : (
                          <select
                            value={order.order_status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateStatus(order.id, 'order_status', e.target.value)}
                            className="text-xs rounded-md border border-stone-200 bg-white px-2 py-1 focus:outline-none focus:border-brand-400"
                          >
                            {ORDER_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {updating === order.id ? null : (
                          <select
                            value={order.payment_status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateStatus(order.id, 'payment_status', e.target.value)}
                            className="text-xs rounded-md border border-stone-200 bg-white px-2 py-1 focus:outline-none focus:border-brand-400"
                          >
                            {PAYMENT_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expanded === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-stone-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                              <p className="font-medium text-stone-700 mb-1">Shipping Address</p>
                              <p className="text-stone-500 whitespace-pre-line">{order.shipping_address}</p>
                              {order.customer_phone && (
                                <p className="text-stone-500 mt-1">📞 {order.customer_phone}</p>
                              )}
                              {order.notes && (
                                <p className="text-stone-400 mt-2 italic text-xs">Note: {order.notes}</p>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-stone-700 mb-1">Summary</p>
                              <div className="space-y-1 text-stone-500 text-xs">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>{formatPrice(order.shipping_fee)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-stone-800 border-t border-stone-200 pt-1 mt-1">
                                  <span>Total</span>
                                  <span>{formatPrice(order.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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
