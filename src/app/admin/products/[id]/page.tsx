// ─────────────────────────────────────────────────────
// File:    src/app/admin/products/[id]/page.tsx
// Agent:   @Frontend_Engineer | Sprint: 4
// ─────────────────────────────────────────────────────
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  adminGetProduct, adminCreateProduct, adminUpdateProduct,
  adminUploadImage, adminDeleteImage, adminSetPrimaryImage,
  AdminProduct,
} from '@/lib/adminApi';
import { Loader2, ArrowLeft, Upload, Trash2, Star } from 'lucide-react';

type FormData = {
  name: string; material: string; price: string; stock_qty: string;
  description: string; color_options: string;
  print_time_hours: string; width_mm: string; height_mm: string;
  depth_mm: string; weight_grams: string; sort_order: string; is_active: boolean;
};

const EMPTY: FormData = {
  name: '', material: 'PLA Matte', price: '', stock_qty: '0',
  description: '', color_options: '',
  print_time_hours: '', width_mm: '', height_mm: '',
  depth_mm: '', weight_grams: '', sort_order: '0', is_active: true,
};

export default function AdminProductFormPage() {
  const router  = useRouter();
  const params  = useParams();
  const isNew   = params.id === 'new';
  const id      = isNew ? null : Number(params.id);

  const [form, setForm]         = useState<FormData>(EMPTY);
  const [images, setImages]     = useState<AdminProduct['images']>([]);
  const [loading, setLoading]   = useState(!isNew);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    adminGetProduct(id!).then(({ product }) => {
      setForm({
        name:             product.name,
        material:         product.material,
        price:            String(product.price),
        stock_qty:        String(product.stock_qty),
        description:      product.description ?? '',
        color_options:    (product.color_options ?? []).join(', '),
        print_time_hours: product.print_time_hours != null ? String(product.print_time_hours) : '',
        width_mm:         product.width_mm != null ? String(product.width_mm) : '',
        height_mm:        product.height_mm != null ? String(product.height_mm) : '',
        depth_mm:         product.depth_mm != null ? String(product.depth_mm) : '',
        weight_grams:     product.weight_grams != null ? String(product.weight_grams) : '',
        sort_order:       String(product.sort_order),
        is_active:        product.is_active,
      });
      setImages(product.images ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, isNew]);

  function set(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function buildPayload() {
    const colors = form.color_options.split(',').map(s => s.trim()).filter(Boolean);
    return {
      name:             form.name.trim(),
      material:         form.material.trim(),
      price:            Number(form.price),
      stock_qty:        Number(form.stock_qty),
      description:      form.description.trim() || null,
      color_options:    colors.length ? colors : null,
      print_time_hours: form.print_time_hours ? Number(form.print_time_hours) : null,
      width_mm:         form.width_mm   ? Number(form.width_mm)   : null,
      height_mm:        form.height_mm  ? Number(form.height_mm)  : null,
      depth_mm:         form.depth_mm   ? Number(form.depth_mm)   : null,
      weight_grams:     form.weight_grams ? Number(form.weight_grams) : null,
      sort_order:       Number(form.sort_order),
      is_active:        form.is_active,
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isNew) {
        const { productId } = await adminCreateProduct(buildPayload());
        router.replace(`/admin/products/${productId}`);
      } else {
        await adminUpdateProduct(id!, buildPayload());
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploading(true);
    try {
      const result = await adminUploadImage(id, file);
      setImages(prev => [...(prev ?? []), result.image]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!id) return;
    await adminDeleteImage(id, imageId);
    setImages(prev => (prev ?? []).filter(img => img.id !== imageId));
  }

  async function handleSetPrimary(imageId: number) {
    if (!id) return;
    await adminSetPrimaryImage(id, imageId);
    setImages(prev => (prev ?? []).map(img => ({ ...img, is_primary: img.id === imageId })));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/admin/products')} className="text-stone-400 hover:text-stone-700 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-stone-900">
          {isNew ? 'Add Product' : 'Edit Product'}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-stone-700">Core Details</h2>

          <Field label="Product Name *">
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="input-field" placeholder="Minimalist Vase No. 3" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Material *">
              <input required value={form.material} onChange={e => set('material', e.target.value)}
                className="input-field" placeholder="PLA Matte" />
            </Field>
            <Field label="Colors (comma-separated)">
              <input value={form.color_options} onChange={e => set('color_options', e.target.value)}
                className="input-field" placeholder="White, Black, Terracotta" />
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} className="input-field resize-none" placeholder="Product description…" />
          </Field>
        </section>

        {/* Pricing & Stock */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-stone-700">Pricing & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (VND) *">
              <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                className="input-field" placeholder="250000" />
            </Field>
            <Field label="Stock Qty *">
              <input required type="number" min="0" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)}
                className="input-field" placeholder="10" />
            </Field>
            <Field label="Sort Order">
              <input type="number" min="0" value={form.sort_order} onChange={e => set('sort_order', e.target.value)}
                className="input-field" placeholder="0" />
            </Field>
          </div>
        </section>

        {/* Specs */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-stone-700">Specifications (optional)</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Print Time (hours)">
              <input type="number" min="0" step="0.5" value={form.print_time_hours}
                onChange={e => set('print_time_hours', e.target.value)} className="input-field" placeholder="8" />
            </Field>
            <Field label="Weight (grams)">
              <input type="number" min="0" value={form.weight_grams}
                onChange={e => set('weight_grams', e.target.value)} className="input-field" placeholder="120" />
            </Field>
            <Field label="Width (mm)">
              <input type="number" min="0" value={form.width_mm}
                onChange={e => set('width_mm', e.target.value)} className="input-field" placeholder="80" />
            </Field>
            <Field label="Height (mm)">
              <input type="number" min="0" value={form.height_mm}
                onChange={e => set('height_mm', e.target.value)} className="input-field" placeholder="200" />
            </Field>
            <Field label="Depth (mm)">
              <input type="number" min="0" value={form.depth_mm}
                onChange={e => set('depth_mm', e.target.value)} className="input-field" placeholder="80" />
            </Field>
          </div>
        </section>

        {/* Status + save */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Saved.</p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-brand-500 focus:ring-brand-500" />
            <span className="text-sm text-stone-700">Active (visible in store)</span>
          </label>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isNew ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Images — only after product exists */}
      {!isNew && (
        <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-700">Images</h2>
            <label className={`btn-secondary flex items-center gap-1.5 text-sm cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading…' : 'Upload'}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={handleUpload} />
            </label>
          </div>

          {(!images || images.length === 0) ? (
            <p className="text-sm text-stone-400 text-center py-6">No images yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images!.map(img => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden bg-stone-100 aspect-square">
                  <Image
                    src={img.image_path}
                    alt={img.alt_text ?? ''}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!img.is_primary && (
                      <button onClick={() => handleSetPrimary(img.id)}
                        title="Set as primary"
                        className="p-1.5 bg-yellow-400 rounded-full hover:bg-yellow-300 transition-colors">
                        <Star size={12} className="text-white" />
                      </button>
                    )}
                    <button onClick={() => handleDeleteImage(img.id)}
                      title="Delete"
                      className="p-1.5 bg-red-500 rounded-full hover:bg-red-400 transition-colors">
                      <Trash2 size={12} className="text-white" />
                    </button>
                  </div>
                  {img.is_primary && (
                    <span className="absolute top-1 left-1 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-stone-400">JPEG/PNG/WebP · max 5MB · auto-converted to WebP 800×800</p>
        </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
