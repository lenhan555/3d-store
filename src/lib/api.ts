// ─────────────────────────────────────────────────────
// File:    src/lib/api.ts
// Agent:   @Frontend_Engineer | Sprint: 2
// Purpose: Typed fetch wrappers for all API endpoints.
//          Uses relative URLs — frontend and API are on the same server.
// ─────────────────────────────────────────────────────
import type { Product, ProductsResponse } from '@/types/product';

const BASE = ''; // same-origin; no CORS needed

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Products ─────────────────────────────────────────

export async function getProducts(
  page = 1,
  limit = 12
): Promise<ProductsResponse> {
  return apiFetch(`/api/products?page=${page}&limit=${limit}`);
}

export async function getFeaturedProducts(): Promise<{ products: Product[] }> {
  return apiFetch('/api/products/featured');
}

export async function getProduct(slug: string): Promise<{ product: Product }> {
  return apiFetch(`/api/products/${slug}`);
}

// ── Orders ───────────────────────────────────────────

export async function createOrder(data: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  payment_method: 'bank_transfer' | 'vnpay' | 'momo';
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
    color?: string | null;
  }>;
}) {
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrderStatus(orderNumber: string) {
  return apiFetch(`/api/orders/${orderNumber}`);
}
