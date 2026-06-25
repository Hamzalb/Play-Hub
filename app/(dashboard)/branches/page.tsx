'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Plus, Settings, Package, ChevronRight } from '@/components/ui/icons';

interface Branch {
  _id: string; name: string; address: string;
  phone?: string; timezone: string; isActive: boolean;
}

interface Zone {
  _id: string; name: string; type: string;
  capacity: number; pricePerHour: number; isActive: boolean;
}

const ZONE_TYPES = ['console', 'pc', 'vr', 'arcade', 'pool', 'other'] as const;

// ─── Zone panel for a single branch ──────────────────────────────────────────
function ZonePanel({ branchId, branchName }: { branchId: string; branchName: string }) {
  const [zones, setZones]       = useState<Zone[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [zoneForm, setZoneForm] = useState({ name: '', type: 'console', capacity: '10', pricePerHour: '8' });
  const { success: toastOk, error: toastErr } = useToast();

  const loadZones = async () => {
    setLoading(true);
    const res = await api.get<Zone[]>(`/branches/${branchId}/zones`);
    if (res.status === 'success') setZones((res as ApiSuccess<Zone[]>).data);
    setLoading(false);
  };

  useEffect(() => { loadZones(); }, [branchId]);

  const updateZF = (k: keyof typeof zoneForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setZoneForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleAddZone(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await api.post(`/branches/${branchId}/zones`, {
      name:         zoneForm.name.trim(),
      type:         zoneForm.type,
      capacity:     parseInt(zoneForm.capacity),
      pricePerHour: parseFloat(zoneForm.pricePerHour),
    });
    if (res.status === 'success') {
      toastOk(`Zone "${zoneForm.name}" added to ${branchName}`);
      setShowAdd(false);
      setZoneForm({ name: '', type: 'console', capacity: '10', pricePerHour: '8' });
      loadZones();
    } else {
      toastErr((res as { message: string }).message || 'Failed to add zone');
    }
    setSaving(false);
  }

  async function toggleZone(zone: Zone) {
    await api.patch(`/branches/${branchId}/zones/${zone._id}`, { isActive: !zone.isActive });
    toastOk(`Zone ${zone.isActive ? 'disabled' : 'enabled'}`);
    loadZones();
  }

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
      {/* Zone list header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5"
          style={{ color: 'var(--color-text-muted)' }}>
          <Package size={12} />
          Zones / Stations
          {zones.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs"
              style={{ background: 'var(--color-violet-dim)', color: 'var(--color-violet-light)' }}>
              {zones.length}
            </span>
          )}
        </p>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="text-xs flex items-center gap-1 hover:underline cursor-pointer"
          style={{ color: 'var(--color-violet-light)' }}
        >
          <Plus size={11} /> {showAdd ? 'Cancel' : 'Add zone'}
        </button>
      </div>

      {/* Add zone form */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddZone}
            className="mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 p-3 rounded-[var(--radius-md)]"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}>
              <div className="col-span-2">
                <Input
                  label="Zone name"
                  value={zoneForm.name}
                  onChange={updateZF('name')}
                  placeholder="e.g. Console Zone A"
                  required
                  showRequired
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}>Type *</label>
                <select value={zoneForm.type} onChange={updateZF('type')} required
                  className="w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] border-[var(--color-border)]">
                  {ZONE_TYPES.map(t => (
                    <option key={t} value={t} style={{ background: '#0d1321' }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <Input label="Capacity (seats)" type="number" min="1"
                value={zoneForm.capacity} onChange={updateZF('capacity')} required showRequired />
              <div className="col-span-2">
                <Input label="Price per hour ($)" type="number" step="0.50" min="0"
                  value={zoneForm.pricePerHour} onChange={updateZF('pricePerHour')} required showRequired />
              </div>
              <div className="col-span-2">
                <Button type="submit" size="sm" loading={saving}>Add zone</Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Zone list */}
      {loading ? (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Loading zones…</p>
      ) : zones.length === 0 ? (
        <div className="rounded-[var(--radius-md)] p-3 text-center"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-danger)' }}>
            No zones yet — bookings won&apos;t work without zones
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Click <strong>Add zone</strong> above to create your first station.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {zones.map((z) => (
            <div key={z._id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-md)]"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--color-border)' }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {z.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {z.type} · {z.capacity} seats · ${z.pricePerHour}/hr
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={z.isActive ? 'success' : 'muted'}>
                  {z.isActive ? 'Active' : 'Off'}
                </Badge>
                <button onClick={() => toggleZone(z)}
                  className="text-xs hover:underline cursor-pointer"
                  style={{ color: 'var(--color-text-muted)' }}>
                  {z.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BranchesPage() {
  return (
    <ProtectedRoute roles={['super_admin']}>
      <BranchesContent />
    </ProtectedRoute>
  );
}

function BranchesContent() {
  const [branches, setBranches]   = useState<Branch[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [expandedId, setExpandedId]    = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', timezone: 'UTC' });
  const { success, error: toastErr } = useToast();

  const load = async () => {
    setLoading(true);
    const res = await api.get<Branch[]>('/branches');
    if (res.status === 'success') {
      const data = (res as ApiSuccess<Branch[]>).data;
      setBranches(data);
      // Auto-expand the first branch if only one exists
      if (data.length === 1 && !expandedId) setExpandedId(data[0]!._id);
    }
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
      success('Branch created — now add zones to it below');
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
          <h1 className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Branches &amp; Zones
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {branches.length} location{branches.length !== 1 ? 's' : ''} — add zones to each branch to enable bookings
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
          <Plus size={15} /> {showForm ? 'Cancel' : 'Add branch'}
        </Button>
      </div>

      <BentoGrid>
        {/* New branch form */}
        {showForm && (
          <BentoCard col={12} glow="violet">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>
              New branch
            </h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Branch name" value={form.name} onChange={update('name')} required showRequired />
              <Input label="Address"     value={form.address} onChange={update('address')} required showRequired />
              <Input label="Phone (optional)" value={form.phone} onChange={update('phone')} />
              <Input label="Timezone" value={form.timezone} onChange={update('timezone')} hint="e.g. America/New_York" />
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}>Create branch</Button>
              </div>
            </form>
          </BentoCard>
        )}

        {/* Branch list */}
        {loading
          ? [1, 2].map((i) => <SkeletonCard key={i} className="col-span-12" />)
          : branches.length === 0
            ? (
              <BentoCard col={12}>
                <div className="text-center py-12">
                  <Settings size={28} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No branches yet</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    Add your first location to get started.
                  </p>
                  <Button onClick={() => setShowForm(true)}><Plus size={15} /> Add first branch</Button>
                </div>
              </BentoCard>
            )
            : branches.map((b) => {
              const expanded = expandedId === b._id;
              return (
                <motion.div key={b._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="col-span-12">
                  <div className="glass-card">
                    {/* Branch header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{b.name}</p>
                          <Badge variant={b.isActive ? 'success' : 'muted'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{b.address}</p>
                        {b.phone && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{b.phone}</p>}
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Timezone: {b.timezone}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                        {/* Zones expand toggle */}
                        <button
                          onClick={() => setExpandedId(expanded ? null : b._id)}
                          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-[var(--radius-md)] border transition-all cursor-pointer"
                          style={{
                            color:        'var(--color-violet-light)',
                            borderColor:  expanded ? 'rgba(139,92,246,0.35)' : 'var(--color-border)',
                            background:   expanded ? 'var(--color-violet-dim)' : 'transparent',
                          }}
                          aria-expanded={expanded}
                        >
                          <Package size={14} />
                          Manage zones
                          <ChevronRight
                            size={13}
                            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                          />
                        </button>
                        <Button size="sm" variant="secondary" onClick={() => handleToggle(b)}>
                          {b.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(b)}>Delete</Button>
                      </div>
                    </div>

                    {/* Zones panel (expandable) */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ZonePanel branchId={b._id} branchName={b.name} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
        }
      </BentoGrid>
    </div>
  );
}
