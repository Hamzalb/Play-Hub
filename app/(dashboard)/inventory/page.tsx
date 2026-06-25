'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useBranch } from '@/lib/hooks/useBranch';
import { Product, ApiSuccess, Pagination as PaginationMeta } from '@/types';

const PAGE_SIZE = 20;

export default function InventoryPage() {
  return <ProtectedRoute roles={['super_admin', 'branch_manager', 'staff']}><InventoryContent /></ProtectedRoute>;
}

function InventoryContent() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ name: '', category: 'snack', price: '', costPrice: '', stock: '', reorderThreshold: '5' });
  const [saving, setSaving]         = useState(false);
  const { branchId }                = useBranch();
  const { success: toastOk, error: toastErr } = useToast();

  const load = useCallback(async (p: number) => {
    if (!branchId) { setLoading(false); return; }
    setLoading(true);
    const res = await api.get<Product[]>(`/inventory/products?branchId=${branchId}&page=${p}&limit=${PAGE_SIZE}`);
    if (res.status === 'success') {
      setProducts((res as ApiSuccess<Product[]>).data);
      const meta = (res as ApiSuccess<Product[]> & { pagination?: PaginationMeta }).pagination;
      if (meta) setPagination(meta);
    } else {
      toastErr((res as { message: string }).message ?? 'Failed to load products');
    }
    setLoading(false);
  }, [branchId, toastErr]);

  useEffect(() => { load(page); }, [load, page]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!branchId) { toastErr('No branch selected — choose a branch first'); return; }
    setSaving(true);
    try {
      const res = await api.post('/inventory/products', {
        ...form,
        branchId,
        price:            parseFloat(form.price),
        costPrice:        parseFloat(form.costPrice),
        stock:            parseInt(form.stock),
        reorderThreshold: parseInt(form.reorderThreshold),
      });
      if (res.status === 'success') {
        toastOk(`Product "${form.name}" added`);
        setShowForm(false);
        setForm({ name: '', category: 'snack', price: '', costPrice: '', stock: '', reorderThreshold: '5' });
        load(1);
        setPage(1);
      } else {
        toastErr((res as { message: string }).message || 'Failed to add product');
      }
    } catch {
      toastErr('Network error — is the backend running?');
    } finally {
      setSaving(false);
    }
  }

  const catColor = (c: string): 'cyan' | 'gold' | 'muted' =>
    c === 'drink' ? 'cyan' : c === 'snack' ? 'gold' : 'muted';

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Inventory</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {pagination ? `${pagination.total} products` : `${products.length} products`}
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </Button>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="cyan">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>New Product</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-[var(--radius-md)] border px-4 py-2.5 text-sm cursor-pointer focus:outline-none transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)', colorScheme: 'dark' }}
                >
                  <option value="snack">Snack</option>
                  <option value="drink">Drink</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
              <Input label="Cost ($)" type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value }))} required />
              <Input label="Initial stock" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} required />
              <Input label="Reorder threshold" type="number" value={form.reorderThreshold} onChange={(e) => setForm((f) => ({ ...f, reorderThreshold: e.target.value }))} />
              <div className="col-span-4"><Button type="submit" loading={saving}>Add Product</Button></div>
            </form>
          </BentoCard>
        )}

        {loading ? (
          <>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <BentoCard key={i} col={3}>
                <div className="space-y-3 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-5 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div className="h-5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                  <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-8 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.03)' }} />
                </div>
              </BentoCard>
            ))}
          </>
        ) : products.length === 0 ? (
          <BentoCard col={12}>
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>No products found.</p>
          </BentoCard>
        ) : (
          <>
            {products.map((p) => (
              <BentoCard key={p._id ?? p.id ?? p.name} col={3}>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={catColor(p.category)}>{p.category}</Badge>
                  <Badge variant={p.stock <= p.reorderThreshold ? 'danger' : 'success'}>
                    {p.stock} in stock
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1 truncate" style={{ color: 'var(--color-text-primary)' }}>{p.name}</h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-cyan-light)' }}>${p.price.toFixed(2)}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Cost: ${p.costPrice.toFixed(2)} · Threshold: {p.reorderThreshold}
                </p>
              </BentoCard>
            ))}
            {pagination && (
              <BentoCard col={12} className="py-2">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              </BentoCard>
            )}
          </>
        )}
      </BentoGrid>
    </main>
  );
}
