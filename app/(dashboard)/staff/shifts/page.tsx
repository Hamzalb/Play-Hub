'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { Plus, Clock } from '@/components/ui/icons';
import Link from 'next/link';

interface StaffUser { _id: string; name: string; email: string; role: string; }
interface Shift {
  _id: string; userId: { _id: string; name: string; email: string } | string;
  scheduledStart: string; scheduledEnd: string;
  actualStart?: string; actualEnd?: string; note?: string;
}

function shiftDuration(s: Shift) {
  const ms = new Date(s.scheduledEnd).getTime() - new Date(s.scheduledStart).getTime();
  const h  = Math.floor(ms / 3_600_000);
  const m  = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h${m > 0 ? ` ${m}m` : ''}`;
}

export default function ShiftsPage() {
  return (
    <ProtectedRoute roles={['super_admin', 'branch_manager']}>
      <ShiftsContent />
    </ProtectedRoute>
  );
}

function ShiftsContent() {
  const today = new Date().toISOString().slice(0, 10);
  const [shifts, setShifts]   = useState<Shift[]>([]);
  const [staff, setStaff]     = useState<StaffUser[]>([]);
  const [from, setFrom]       = useState(today);
  const [to, setTo]           = useState(today);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ userId: '', scheduledStart: `${today}T09:00`, scheduledEnd: `${today}T17:00`, note: '' });
  const { success, error: toastErr } = useToast();

  const load = async () => {
    setLoading(true);
    const res = await api.get<Shift[]>(`/staff/shifts?from=${from}&to=${to}T23:59`);
    if (res.status === 'success') setShifts((res as ApiSuccess<Shift[]>).data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [from, to]);
  useEffect(() => {
    api.get<StaffUser[]>('/staff').then((res) => {
      if (res.status === 'success') setStaff((res as ApiSuccess<StaffUser[]>).data);
    });
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await api.post('/staff/shifts', form);
    if (res.status === 'success') { success('Shift created'); setShowForm(false); load(); }
    else toastErr((res as { message: string }).message);
    setSaving(false);
  }

  async function clockIn(id: string)  { await api.patch(`/staff/shifts/${id}/clockin`, {}); success('Clocked in'); load(); }
  async function clockOut(id: string) { await api.patch(`/staff/shifts/${id}/clockout`, {}); success('Clocked out'); load(); }

  const getStaffName = (s: Shift) =>
    typeof s.userId === 'object' ? (s.userId as { name: string }).name : 'Staff';

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/staff"><Button variant="ghost" size="sm">← Staff</Button></Link>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Shift Schedule
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage staff shifts and clock in/out</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
          <Plus size={15} /> {showForm ? 'Cancel' : 'New shift'}
        </Button>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="cyan">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>Create shift</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Staff member *</label>
                <select value={form.userId} onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))} required
                  className="w-full rounded-[var(--radius-md)] border px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] border-[var(--color-border)]">
                  <option value="">Select staff…</option>
                  {staff.map((s) => <option key={s._id} value={s._id}>{s.name} — {s.role}</option>)}
                </select>
              </div>
              <Input label="Note (optional)" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
              <Input label="Shift start" type="datetime-local" value={form.scheduledStart} onChange={(e) => setForm((f) => ({ ...f, scheduledStart: e.target.value }))} required showRequired />
              <Input label="Shift end" type="datetime-local" value={form.scheduledEnd} onChange={(e) => setForm((f) => ({ ...f, scheduledEnd: e.target.value }))} required showRequired />
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}>Create shift</Button>
              </div>
            </form>
          </BentoCard>
        )}

        {/* Date filter */}
        <BentoCard col={12}>
          <div className="flex gap-4 items-end flex-wrap">
            <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input label="To"   type="date" value={to}   onChange={(e) => setTo(e.target.value)}   />
            <Button variant="secondary" size="md" onClick={load}>Refresh</Button>
          </div>
        </BentoCard>

        {/* Shift list */}
        <BentoCard col={12}>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading shifts…</p>
          ) : shifts.length === 0 ? (
            <div className="text-center py-10">
              <Clock size={28} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No shifts scheduled for this range.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {shifts.map((s) => {
                const clocked = !!s.actualStart;
                const done    = !!s.actualEnd;
                return (
                  <motion.div key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] border flex-wrap"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--color-border)' }}>
                    <Avatar name={getStaffName(s)} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>{getStaffName(s)}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(s.scheduledStart).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {' – '}
                        {new Date(s.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' · '}{shiftDuration(s)}
                      </p>
                      {s.note && <p className="text-xs mt-0.5 italic" style={{ color: 'var(--color-text-muted)' }}>{s.note}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={done ? 'success' : clocked ? 'gold' : 'muted'}>
                        {done ? 'Done' : clocked ? 'On shift' : 'Scheduled'}
                      </Badge>
                      {!clocked && !done && <Button size="sm" variant="secondary" onClick={() => clockIn(s._id)}>Clock in</Button>}
                      {clocked && !done   && <Button size="sm" variant="danger"    onClick={() => clockOut(s._id)}>Clock out</Button>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
