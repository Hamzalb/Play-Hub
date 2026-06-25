'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { Plus, Settings } from '@/components/ui/icons';

interface Branch {
  _id: string; name: string; address: string;
  phone?: string; timezone: string; isActive: boolean;
}

export default function BranchesPage() {
  return (
    <ProtectedRoute roles={['super_admin']}>
      <BranchesContent />
    </ProtectedRoute>
  );
}

function BranchesContent() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', timezone: 'UTC' });
  const { success, error: toastErr } = useToast();

  const load = async () => {
    setLoading(true);
    const res = await api.get<Branch[]>('/branches');
    if (res.status === 'success') setBranches((res as ApiSuccess<Branch[]>).data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await api.post('/branches', form);
    if (res.status === 'success') {
      success('Branch created');
      setShowForm(false);
      setForm({ name: '', address: '', phone: '', timezone: 'UTC' });
      load();
    } else {
      toastErr((res as { message: string }).message);
    }
    setSaving(false);
  }

  async function handleToggle(b: Branch) {
    await api.patch(`/branches/${b._id}`, { isActive: !b.isActive });
    success(`Branch ${b.isActive ? 'deactivated' : 'activated'}`);
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await api.delete(`/branches/${deleteTarget._id}`);
    if (res.status === 'success') { success('Branch deleted'); load(); }
    else toastErr('Could not delete branch');
    setDeleteTarget(null);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="All branch data (bookings, products, staff) will be permanently removed. This cannot be undone."
        confirmLabel="Delete branch"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>Branches</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{branches.length} location{branches.length !== 1 ? 's' : ''} in your company</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
          <Plus size={15} /> {showForm ? 'Cancel' : 'Add branch'}
        </Button>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="violet">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>New branch</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Branch name" value={form.name} onChange={update('name')} required showRequired />
              <Input label="Address" value={form.address} onChange={update('address')} required showRequired />
              <Input label="Phone (optional)" value={form.phone} onChange={update('phone')} />
              <Input label="Timezone" value={form.timezone} onChange={update('timezone')} hint="e.g. America/New_York" />
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}>Create branch</Button>
              </div>
            </form>
          </BentoCard>
        )}

        {loading
          ? [1,2,3].map((i) => <SkeletonCard key={i} className="col-span-12 md:col-span-4" />)
          : branches.length === 0
            ? (
              <BentoCard col={12}>
                <div className="text-center py-12">
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No branches yet</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Add your first location to get started.</p>
                  <Button onClick={() => setShowForm(true)}><Plus size={15} /> Add first branch</Button>
                </div>
              </BentoCard>
            )
            : branches.map((b) => (
              <motion.div key={b._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 md:col-span-4">
                <div className="glass-card h-full flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{b.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{b.address}</p>
                    </div>
                    <Badge variant={b.isActive ? 'success' : 'muted'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  {b.phone && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{b.phone}</p>}
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Timezone: {b.timezone}</p>
                  <div className="flex gap-2 mt-auto flex-wrap">
                    <Button size="sm" variant="secondary" onClick={() => handleToggle(b)}>
                      {b.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(b)}>Delete</Button>
                  </div>
                </div>
              </motion.div>
            ))}
      </BentoGrid>
    </div>
  );
}
