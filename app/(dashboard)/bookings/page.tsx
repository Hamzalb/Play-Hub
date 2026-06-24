'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Booking, ApiSuccess } from '@/types';

interface AvailabilityZone {
  zone: { _id: string; name: string; type: string; capacity: number };
  capacity: number;
  occupied: number;
  available: number;
}

type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
const STATUS_COLORS: Record<BookingStatus, 'violet' | 'cyan' | 'lime' | 'success' | 'warning' | 'danger' | 'muted'> = {
  pending:   'warning',
  confirmed: 'cyan',
  active:    'lime',
  completed: 'success',
  cancelled: 'muted',
};

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}

function BookingsContent() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [availability, setAvailability] = useState<AvailabilityZone[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    zoneId: '',
    startTime: `${today}T10:00`,
    durationMinutes: '60',
    guestName: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  async function load() {
    setLoading(true);
    const [avRes, bkRes] = await Promise.all([
      api.get<AvailabilityZone[]>(`/bookings/availability?date=${date}`),
      api.get<Booking[]>(`/bookings?date=${date}`),
    ]);
    if (avRes.status === 'success') setAvailability((avRes as ApiSuccess<AvailabilityZone[]>).data);
    if (bkRes.status === 'success') setBookings((bkRes as ApiSuccess<Booking[]>).data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [date]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    const res = await api.post('/bookings', {
      zoneId: createForm.zoneId,
      startTime: new Date(createForm.startTime).toISOString(),
      durationMinutes: parseInt(createForm.durationMinutes),
      guestName: createForm.guestName || undefined,
    });
    if (res.status !== 'success') {
      setCreateError((res as { message: string }).message);
    } else {
      setShowCreate(false);
      setCreateForm({ zoneId: '', startTime: `${date}T10:00`, durationMinutes: '60', guestName: '' });
      load();
    }
    setCreating(false);
  }

  async function handleCancel(id: string) {
    await api.patch(`/bookings/${id}/cancel`, {});
    load();
  }

  async function handleCheckIn(id: string) {
    await api.patch(`/bookings/${id}/checkin`, {});
    load();
  }

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Bookings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Session reservations and walk-ins</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          <Button onClick={() => setShowCreate((s) => !s)} variant={showCreate ? 'secondary' : 'primary'}>
            {showCreate ? 'Cancel' : '+ New Booking'}
          </Button>
        </div>
      </div>

      <BentoGrid>
        {/* ── Create booking form ── */}
        {showCreate && (
          <BentoCard col={12} glow="violet">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>New Booking</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>Zone</label>
                <select
                  value={createForm.zoneId}
                  onChange={(e) => setCreateForm((f) => ({ ...f, zoneId: e.target.value }))}
                  required
                  className="w-full rounded-[var(--radius-md)] border px-4 py-2.5 text-sm bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border-[var(--color-border)]"
                >
                  <option value="">Select a zone</option>
                  {availability.map((av) => (
                    <option key={av.zone._id} value={av.zone._id}>
                      {av.zone.name} ({av.available} available)
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Start time"
                type="datetime-local"
                value={createForm.startTime}
                onChange={(e) => setCreateForm((f) => ({ ...f, startTime: e.target.value }))}
                required
              />
              <Input
                label="Duration (min)"
                type="number"
                min="30" step="30"
                value={createForm.durationMinutes}
                onChange={(e) => setCreateForm((f) => ({ ...f, durationMinutes: e.target.value }))}
              />
              <div className="col-span-2">
                <Input
                  label="Guest name (optional)"
                  value={createForm.guestName}
                  onChange={(e) => setCreateForm((f) => ({ ...f, guestName: e.target.value }))}
                  placeholder="Leave blank for member booking"
                />
              </div>
              {createError && (
                <div className="col-span-4">
                  <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)] rounded-lg px-3 py-2">{createError}</p>
                </div>
              )}
              <div className="col-span-4">
                <Button type="submit" loading={creating}>Create Booking</Button>
              </div>
            </form>
          </BentoCard>
        )}

        {/* ── Zone availability ── */}
        <BentoCard col={5} row={2}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Zone Availability — {date}
          </h2>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
          ) : availability.map((av) => (
            <div key={av.zone._id} className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{av.zone.name}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {av.occupied}/{av.capacity}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: av.capacity }, (_, i) => (
                  <div
                    key={i}
                    className="h-3 flex-1 rounded-full"
                    style={{
                      background: i < av.occupied
                        ? 'var(--color-violet)'
                        : 'var(--color-bg-subtle)',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: av.available > 0 ? 'var(--color-lime)' : 'var(--color-danger)' }}>
                {av.available > 0 ? `${av.available} available` : 'Full'}
              </p>
            </div>
          ))}
        </BentoCard>

        {/* ── Booking list ── */}
        <BentoCard col={7} row={2}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Bookings — {date}
          </h2>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>No bookings for this date.</p>
          ) : (
            <div className="flex flex-col gap-3 overflow-auto max-h-96">
              {bookings.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between gap-4 p-3 rounded-[var(--radius-md)] border"
                  style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {b.guestName ?? 'Member'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' → '}
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' · '}{b.durationMinutes} min
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-cyan-light)' }}>
                      ${b.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={STATUS_COLORS[b.status as BookingStatus]}>{b.status}</Badge>
                    {b.status === 'confirmed' && (
                      <Button size="sm" variant="secondary" onClick={() => handleCheckIn(b.id)}>
                        Check In
                      </Button>
                    )}
                    {['confirmed', 'pending'].includes(b.status) && (
                      <Button size="sm" variant="danger" onClick={() => handleCancel(b.id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
