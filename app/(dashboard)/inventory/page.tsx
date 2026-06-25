'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useBranch } from '@/lib/hooks/useBranch';
import { Product, ApiSuccess } from '@/types';

export default function InventoryPage() {
  return <ProtectedRoute roles={['super_admin', 'branch_manager', 'staff']}><InventoryContent /></ProtectedRoute>;
}

function InventoryContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', category: 'snack', price: '', costPrice: '', stock: '', reorderThreshold: '5' });
  const [saving, setSaving]     = useState(false);
  const { branchId }            = useBranch();
  const { success: toastOk, error: toastErr } = useToast();

  async function load() {
    if (!branchId) { setLoading(false); return; }
    setLoading(true);
    const res = await api.get<Product[]>(`/inventory/products?branchId=${branchId}`);
    if (res.status === 'success') setProducts((res as ApiSuccess<Product[]>).data);
    else toastErr((res as { message: string }).message ?? 'Failed to load products');
    setLoading(false);
  }

  useEffect(() => { load(); }, [branchId]);

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
        load();
      } else {
        toastErr((res as { message: string }).message || 'Failed to add product');
      }
    } catch {
      toastErr('Network error — is the backend running?');
    } finally {
      setSaving(false);
    }
  }

  const catColor = (c: string) => c === 'drink' ? 'cyan' : c === 'snack' ? 'gold' : 'muted';

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Inventory</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{products.length} products</p>
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
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-[var(--radius-md)] border px-4 py-2.5 text-sm bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border-[var(--color-border)]">
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
          <BentoCard col={12}><p style={{ color: 'var(--color-text-muted)' }}>Loading…</p></BentoCard>
        ) : products.map((p) => (
          <BentoCard key={p._id ?? p.id ?? p.name} col={3}>
            <div className="flex items-start justify-between mb-3">
              <Badge variant={catColor(p.category) as 'cyan' | 'gold' | 'muted'}>{p.category}</Badge>
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
      </BentoGrid>
    </main>
  );
}
