'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { MemberNav } from '@/components/member/MemberNav';
import { api } from '@/lib/api';
import { ApiSuccess, Booking } from '@/types';
import { Calendar } from '@/components/ui/icons';

const STATUS_COLOR: Record<string, 'violet' | 'cyan' | 'gold' | 'success' | 'warning' | 'danger' | 'muted'> = {
  confirmed: 'cyan', active: 'gold', completed: 'success', cancelled: 'muted', pending: 'warning',
};

export default function MemberBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    setLoading(true);
    // In full impl, this would use member JWT to filter by memberId
    api.get<Booking[]>('/bookings').then((res) => {
      if (res.status === 'success') setBookings((res as ApiSuccess<Booking[]>).data);
    }).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const filtered = bookings.filter((b) =>
    filter === 'upcoming'
      ? new Date(b.startTime) >= now && b.status !== 'cancelled'
      : new Date(b.startTime) < now || b.status === 'cancelled'
  );

  return (
    <>
    <MemberNav />
    <main className="min-h-dvh px-4 py-12 sm:px-8 max-w-[800px] mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
        My Bookings
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['upcoming', 'past'] as const).map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all cursor-pointer"
            style={{
              background: filter === tab ? 'var(--color-violet-dim)' : 'rgba(255,255,255,0.04)',
              color:      filter === tab ? 'var(--color-violet-light)' : 'var(--color-text-muted)',
              border:     `1px solid ${filter === tab ? 'rgba(139,92,246,0.3)' : 'var(--color-border)'}`,
            }}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map((i) => <SkeletonRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Calendar size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            No {filter} bookings
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            {filter === 'upcoming' ? 'Book a session to get started.' : 'Your past bookings will appear here.'}
          </p>
          {filter === 'upcoming' && <Link href="/book"><Button>Book a session →</Button></Link>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((b, i) => (
            <motion.div key={b._id ?? b.id ?? b.startTime} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {b.guestName ?? 'Session'}
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(b.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  {' · '}
                  {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' · '}{b.durationMinutes} min
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-cyan-light)' }}>${b.price.toFixed(2)}</p>
              </div>
              <Badge variant={STATUS_COLOR[b.status] ?? 'muted'}>{b.status}</Badge>
            </motion.div>
          ))}
        </div>
      )}
    </main>
    </>
  );
}
