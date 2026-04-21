// ─────────────────────────────────────────────────────
// File:    src/lib/adminApi.ts
// Agent:   @Frontend_Engineer | Sprint: 4
// Purpose: Admin API calls — auto-attaches JWT from localStorage.
// ─────────────────────────────────────────────────────

const TOKEN_KEY = 'jun3d_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Check token expiry client-side (JWT payload is base64, no signature needed) */
export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
    throw new Error('Session expired.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────
export async function adminLogin(email: string, password: string) {
  const data = await adminFetch<{ token: string; email: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

// ── Stats ────────────────────────────────────────────
export async function getAdminStats() {
  return adminFetch<{
    total_orders: number;
    pending_orders: number;
    total_products: number;
    low_stock: number;
    revenue_total: number;
  }>('/api/admin/orders/dashboard/stats');
}

// ── Products ─────────────────────────────────────────
export async function adminGetProducts(page = 1) {
  return adminFetch<{ products: AdminProduct[]; total: number; totalPages: number }>(
    `/api/admin/products?page=${page}`
  );
}

export async function adminGetProduct(id: number) {
  return adminFetch<{ product: AdminProduct }>(`/api/admin/products/${id}`);
}

export async function adminCreateProduct(data: Partial<AdminProduct>) {
  return adminFetch<{ productId: number; slug: string }>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(id: number, data: Partial<AdminProduct>) {
  return adminFetch('/api/admin/products/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminToggleProduct(id: number, active: boolean) {
  return adminFetch('/api/admin/products/' + id, {
    method: 'PUT',
    body: JSON.stringify({ is_active: active }),
  });
}

export async function adminUploadImage(productId: number, file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`/api/admin/products/${productId}/images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Upload failed.');
  }
  return res.json();
}

export async function adminDeleteImage(productId: number, imageId: number) {
  return adminFetch(`/api/admin/products/${productId}/images/${imageId}`, { method: 'DELETE' });
}

export async function adminSetPrimaryImage(productId: number, imageId: number) {
  return adminFetch(`/api/admin/products/${productId}/images/${imageId}/primary`, { method: 'PUT' });
}

// ── Orders ───────────────────────────────────────────
export async function adminGetOrders(page = 1, status?: string) {
  const q = status ? `&status=${status}` : '';
  return adminFetch<{ orders: AdminOrder[]; total: number; totalPages: number }>(
    `/api/admin/orders?page=${page}${q}`
  );
}

export async function adminGetOrder(id: number) {
  return adminFetch<{ order: AdminOrder }>(`/api/admin/orders/${id}`);
}

export async function adminUpdateOrderStatus(
  id: number,
  update: { order_status?: string; payment_status?: string }
) {
  return adminFetch(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(update),
  });
}

// ── Types ────────────────────────────────────────────
export interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  material: string;
  color_options: string[] | null;
  price: number;
  stock_qty: number;
  print_time_hours: number | null;
  width_mm: number | null;
  height_mm: number | null;
  depth_mm: number | null;
  weight_grams: number | null;
  is_active: boolean;
  sort_order: number;
  primary_image?: string | null;
  image_count?: number;
  images?: Array<{ id: number; image_path: string; is_primary: boolean; alt_text: string | null }>;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  items?: Array<{
    id: number; product_name: string; color: string | null;
    quantity: number; unit_price: number; line_total: number;
  }>;
}
