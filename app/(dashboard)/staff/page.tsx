'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: 'branch_manager' | 'staff';
  isActive: boolean;
}

export default function StaffPage() {
  return <ProtectedRoute roles={['super_admin', 'branch_manager']}><StaffContent /></ProtectedRoute>;
}

function StaffContent() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await api.get<StaffUser[]>('/staff');
    if (res.status === 'success') setStaff((res as ApiSuccess<StaffUser[]>).data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await api.post('/staff', form);
    setShowForm(false);
    setForm({ name: '', email: '', password: '', role: 'staff' });
    load();
    setSaving(false);
  }

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Staff</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{staff.length} staff members</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? 'Cancel' : '+ Add Staff'}
        </Button>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="gold">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>New Staff Member</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              <Input label="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required hint="Min 8 characters" />
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Role</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-[var(--radius-md)] border px-4 py-2.5 text-sm bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border-[var(--color-border)]">
                  <option value="staff">Staff / Cashier</option>
                  <option value="branch_manager">Branch Manager</option>
                </select>
              </div>
              <div className="col-span-2"><Button type="submit" loading={saving}>Create</Button></div>
            </form>
          </BentoCard>
        )}

        <BentoCard col={12}>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
          ) : staff.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>No staff yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {staff.map((s) => (
                <div key={s._id} className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                  <Avatar name={s.name} />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{s.email}</p>
                  </div>
                  <Badge variant={s.role === 'branch_manager' ? 'cyan' : 'gold'}>
                    {s.role.replace('_', ' ')}
                  </Badge>
                  <Badge variant={s.isActive ? 'success' : 'muted'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
