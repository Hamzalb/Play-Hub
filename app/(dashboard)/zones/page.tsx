'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { useBranch } from '@/lib/hooks/useBranch';
import { useToast } from '@/components/ui/Toast';
import { Zone, ApiSuccess } from '@/types';
import { Layers, Edit2 } from '@/components/ui/icons';

const ZONE_TYPE_OPTIONS = [
  { value: 'console', label: 'Console' },
  { value: 'pc',      label: 'PC' },
  { value: 'vr',      label: 'VR' },
  { value: 'arcade',  label: 'Arcade' },
  { value: 'pool',    label: 'Pool' },
  { value: 'other',   label: 'Other' },
];

const TYPE_COLOR: Record<string, 'violet' | 'cyan' | 'gold' | 'muted'> = {
  console: 'violet',
  pc:      'cyan',
  vr:      'gold',
  arcade:  'violet',
  pool:    'cyan',
  other:   'muted',
};

const EMPTY_FORM = { name: '', type: 'console', capacity: '', pricePerHour: '' };

export default function ZonesPage() {
  return <ProtectedRoute><ZonesContent /></ProtectedRoute>;
}

function ZonesContent() {
  const [zones, setZones]       = useState<Zone[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const { branchId } = useBranch();
  const { success: toastOk, error: toastErr } = useToast();

  async function load() {
    if (!branchId) { setLoading(false); return; }
    setLoading(true);
    const res = await api.get<Zone[]>(`/zones?branchId=${branchId}`);
    if (res.status === 'success') setZones((res as ApiSuccess<Zone[]>).data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [branchId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await api.patch(`/zones/${editId}`, {
          name:         form.name,
          type:         form.type,
          capacity:     Number(form.capacity),
          pricePerHour: Number(form.pricePerHour),
        });
        if (res.status === 'success') {
          toastOk(`Zone "${form.name}" updated`);
          setEditId(null);
          setShowForm(false);
          setForm(EMPTY_FORM);
          load();
        } else {
          toastErr((res as { message: string }).message || 'Failed to update zone');
        }
      } else {
        const res = await api.post('/zones', {
          branchId,
          name:         form.name,
          type:         form.type,
          capacity:     Number(form.capacity),
          pricePerHour: Number(form.pricePerHour),
        });
        if (res.status === 'success') {
          toastOk(`Zone "${form.name}" created`);
          setShowForm(false);
          setForm(EMPTY_FORM);
          load();
        } else {
          toastErr((res as { message: string }).message || 'Failed to create zone');
        }
      }
    } catch {
      toastErr('Network error — is the backend running?');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(zone: Zone) {
    const isActive = !zone.isActive;
    const zoneId = zone.id ?? zone._id!;
    const res = await api.patch(`/zones/${zoneId}`, { isActive });
    if (res.status === 'success') {
      toastOk(`Zone ${isActive ? 'activated' : 'deactivated'}`);
      load();
    } else {
      toastErr('Failed to update zone');
    }
  }

  function startEdit(zone: Zone) {
    setForm({
      name:         zone.name,
      type:         zone.type,
      capacity:     String(zone.capacity),
      pricePerHour: String(zone.pricePerHour),
    });
    setEditId(zone.id ?? zone._id ?? null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  }

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Zones</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {zones.filter(z => z.isActive).length} active zones
          </p>
        </div>
        <Button
          variant={showForm ? 'secondary' : 'primary'}
          onClick={showForm ? cancelForm : () => setShowForm(true)}
        >
          {showForm ? 'Cancel' : '+ Add Zone'}
        </Button>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="violet">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {editId ? 'Edit Zone' : 'New Zone'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Zone Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Console Zone A"
                required
              />
              <Select
                label="Type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                options={ZONE_TYPE_OPTIONS}
              />
              <Input
                label="Capacity (stations)"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                placeholder="10"
                required
              />
              <Input
                label="Price / Hour ($)"
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerHour}
                onChange={(e) => setForm((f) => ({ ...f, pricePerHour: e.target.value }))}
                placeholder="8.00"
                required
              />
              <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
                <Button type="submit" loading={saving}>
                  {editId ? 'Save changes' : 'Create Zone'}
                </Button>
                <Button type="button" variant="ghost" onClick={cancelForm}>Cancel</Button>
              </div>
            </form>
          </BentoCard>
        )}

        <BentoCard col={12}>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : zones.length === 0 ? (
            <EmptyState
              icon={<Layers size={24} />}
              title="No zones yet"
              description="Add your first zone to start managing gaming areas and their pricing."
              action={{ label: '+ Add Zone', onClick: () => setShowForm(true) }}
            />
          ) : (
            <div className="table-scroll">
              <table className="w-full text-sm" style={{ minWidth: '560px' }}>
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)' }}>
                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Type</th>
                    <th className="text-right py-3 px-4 font-semibold uppercase text-xs tracking-widest">Capacity</th>
                    <th className="text-right py-3 px-4 font-semibold uppercase text-xs tracking-widest">Price/hr</th>
                    <th className="text-center py-3 px-4 font-semibold uppercase text-xs tracking-widest">Status</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => (
                    <motion.tr
                      key={zone.id ?? zone._id!}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Layers size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                          <span style={{ color: 'var(--color-text-primary)' }}>{zone.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={TYPE_COLOR[zone.type] ?? 'muted'} className="capitalize">
                          {zone.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums" style={{ color: 'var(--color-text-secondary)' }}>
                        {zone.capacity}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums" style={{ color: 'var(--color-cyan-light)' }}>
                        ${zone.pricePerHour.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={zone.isActive ? 'success' : 'muted'}>
                          {zone.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(zone)} aria-label="Edit zone">
                            <Edit2 size={13} />
                          </Button>
                          <Button
                            size="sm"
                            variant={zone.isActive ? 'danger' : 'secondary'}
                            onClick={() => toggleActive(zone)}
                          >
                            {zone.isActive ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
