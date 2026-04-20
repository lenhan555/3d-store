// ─────────────────────────────────────────────────────
// File:    src/types/product.ts
// Agent:   @Frontend_Engineer | Sprint: 2
// ─────────────────────────────────────────────────────

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
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
  created_at: string;
  // Joined fields from API
  images: ProductImage[];
  primary_image?: string | null;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
