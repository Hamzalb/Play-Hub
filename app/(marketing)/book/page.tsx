'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { Check, ArrowRight, ChevronRight } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Branch { _id: string; name: string; address: string; phone?: string; }
interface Zone   { _id: string; name: string; type: string; capacity: number; pricePerHour: number; }
interface AvailZone { zone: Zone; available: number; occupied: number; }

const ZONE_TYPE_LABELS: Record<string, string> = {
  console: 'Console Gaming', pc: 'PC Gaming', vr: 'VR Experience',
  arcade: 'Arcade',          pool: 'Billiards',  other: 'Other',
};

const DURATIONS = [30, 60, 90, 120, 180];

// ─── Step indicator ──────────────────────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const labels = ['Branch', 'Zone', 'Date & Time', 'Confirm'];
  return (
    <div className="flex items-center gap-2 mb-10" role="list" aria-label="Booking steps">
      {labels.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2 flex-1" role="listitem">
            <div className={cn('flex items-center gap-2 min-w-0', active ? '' : 'opacity-60')}>
              <span
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: done ? 'var(--color-violet-mid)' : active ? 'var(--color-violet-dim)' : 'rgba(255,255,255,0.06)',
                  border:     active ? '2px solid var(--color-violet-mid)' : '2px solid transparent',
                  color:      done || active ? 'var(--color-violet-light)' : 'var(--color-text-muted)',
                }}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
              </span>
              <span className="text-xs font-medium hidden sm:block" style={{ color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className="flex-1 h-px" style={{ background: i < current ? 'var(--color-violet-mid)' : 'var(--color-border)' }} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BookPage() {
  const router = useRouter();
  const [step, setStep]           = useState(0);
  const [branches, setBranches]   = useState<Branch[]>([]);
  const [zones, setZones]         = useState<AvailZone[]>([]);
  const [branch, setBranch]       = useState<Branch | null>(null);
  const [zone, setZone]           = useState<Zone | null>(null);
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime]           = useState('10:00');
  const [duration, setDuration]   = useState(60);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Load branches
  useEffect(() => {
    api.get<Branch[]>('/branches').then((res) => {
      if (res.status === 'success') setBranches((res as ApiSuccess<Branch[]>).data);
    });
  }, []);

  // Load zone availability when branch + date change
  useEffect(() => {
    if (!branch) return;
    api.get<AvailZone[]>(`/bookings/availability?branchId=${branch._id}&date=${date}`).then((res) => {
      if (res.status === 'success') setZones((res as ApiSuccess<AvailZone[]>).data);
    });
  }, [branch, date]);

  const price = zone ? parseFloat(((zone.pricePerHour / 60) * duration).toFixed(2)) : 0;
  const startDateTime = `${date}T${time}:00`;

  async function handleConfirm() {
    if (!branch || !zone) return;
    setSubmitting(true);
    const res = await api.post<{ _id: string }>('/bookings', {
      branchId: branch._id,
      zoneId: zone._id,
      startTime: new Date(startDateTime).toISOString(),
      durationMinutes: duration,
      guestName: guestName || undefined,
    });
    if (res.status === 'success') {
      setBookingId((res as ApiSuccess<{ _id: string }>).data._id ?? '');
      router.push(`/book/success?id=${(res as ApiSuccess<{ _id: string }>).data._id}`);
    }
    setSubmitting(false);
  }

  const slideProps = (dir: number) => ({
    initial:  { opacity: 0, x: dir * 32 },
    animate:  { opacity: 1, x: 0 },
    exit:     { opacity: 0, x: dir * -24 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  return (
    <>
      <MarketingNav />
      <main id="main-content" className="min-h-dvh px-4 pt-20 sm:pt-28 pb-12 max-w-[720px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="cyan" className="mb-3">Online Booking</Badge>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Book a session
          </h1>
        </div>

        <Steps current={step} />

        <AnimatePresence mode="wait">
          {/* ── Step 0: Choose branch ── */}
          {step === 0 && (
            <motion.div key="branch" {...slideProps(1)}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Choose a location
              </h2>
              {branches.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)' }}>Loading branches…</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {branches.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => { setBranch(b); setStep(1); }}
                      className="glass-card text-left flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-[var(--color-violet)] group"
                      style={{ border: '1px solid var(--color-border)' }}
                    >
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{b.name}</p>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{b.address}</p>
                        {b.phone && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{b.phone}</p>}
                      </div>
                      <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} className="flex-shrink-0 group-hover:text-[var(--color-violet-light)] transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Step 1: Choose zone + date ── */}
          {step === 1 && (
            <motion.div key="zone" {...slideProps(1)}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Choose zone & date
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setStep(0)}>← Back</Button>
              </div>

              <Input
                label="Date"
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="mb-5"
              />

              <div className="flex flex-col gap-3">
                {zones.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)' }}>Loading zones…</p>
                ) : zones.map(({ zone: z, available }) => (
                  <button
                    key={z._id}
                    disabled={available === 0}
                    onClick={() => { setZone(z); setStep(2); }}
                    className="glass-card text-left flex items-center justify-between gap-4 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:enabled:border-[var(--color-cyan)] group"
                    style={{ border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{z.name}</p>
                        <Badge variant="muted">{ZONE_TYPE_LABELS[z.type] ?? z.type}</Badge>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        ${z.pricePerHour.toFixed(2)}/hr · {available} of {z.capacity} available
                      </p>
                    </div>
                    <Badge variant={available > 0 ? 'success' : 'danger'}>
                      {available > 0 ? `${available} open` : 'Full'}
                    </Badge>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Time + duration ── */}
          {step === 2 && (
            <motion.div key="time" {...slideProps(1)}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Pick your time
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</Button>
              </div>

              <div className="glass-card mb-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Duration</p>
                    <div className="flex gap-2 flex-wrap">
                      {DURATIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className="px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium border transition-all cursor-pointer"
                          style={{
                            background: duration === d ? 'var(--color-violet-dim)' : 'rgba(255,255,255,0.04)',
                            borderColor: duration === d ? 'rgba(139,92,246,0.4)' : 'var(--color-border)',
                            color: duration === d ? 'var(--color-violet-light)' : 'var(--color-text-secondary)',
                          }}
                        >
                          {d < 60 ? `${d}m` : `${d / 60}h`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price preview */}
              <div className="glass-card mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Estimated total</p>
                  <p className="text-2xl font-bold mt-0.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-violet-light)' }}>
                    ${price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{zone?.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{duration} min · {branch?.name}</p>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => setStep(3)}>
                Continue <ArrowRight size={15} />
              </Button>
            </motion.div>
          )}

          {/* ── Step 3: Guest info + confirm ── */}
          {step === 3 && (
            <motion.div key="confirm" {...slideProps(1)}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Your details
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>← Back</Button>
              </div>

              <div className="glass-card mb-5">
                <div className="flex flex-col gap-4">
                  <Input label="Your name (optional)" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Walk-in guest" />
                  <Input label="Email (optional)" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="For confirmation email" />
                </div>
              </div>

              {/* Summary */}
              <div className="glass-card glass-card-violet mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Booking summary
                </p>
                {[
                  { label: 'Location',   value: branch?.name ?? '' },
                  { label: 'Zone',       value: zone?.name ?? '' },
                  { label: 'Date',       value: date },
                  { label: 'Time',       value: time },
                  { label: 'Duration',   value: `${duration} minutes` },
                  { label: 'Total',      value: `$${price.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full" size="lg" loading={submitting} onClick={handleConfirm}>
                Confirm booking · ${price.toFixed(2)}
              </Button>
              <p className="text-xs text-center mt-3" style={{ color: 'var(--color-text-muted)' }}>
                Already a member?{' '}
                <Link href="/login" className="hover:underline" style={{ color: 'var(--color-violet-light)' }}>Sign in</Link> to link this booking.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
