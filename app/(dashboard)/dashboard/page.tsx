'use client';

import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Bell, ShoppingCart, Calendar } from '@/components/ui/icons';

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Overview
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* KPIs */}
      <BentoGrid className="mb-6">
        <KpiCard label="Revenue Today"   value={4820}  prefix="$"  trend={12.4}  trendLabel="vs yesterday"  accent="gold"   col={3} />
        <KpiCard label="Active Sessions" value={14}                trend={0}     trendLabel="on track"      accent="violet" col={3} />
        <KpiCard label="Total Members"   value={384}               trend={5.2}   trendLabel="this month"    accent="cyan"   col={3} />
        <KpiCard label="Open Alerts"     value={2}                 trend={-33}   trendLabel="vs yesterday"  accent="violet" col={3} />
      </BentoGrid>

      {/* Main grid */}
      <BentoGrid>
        {/* Live occupancy */}
        <BentoCard col={7} row={2} glow="violet">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Live Occupancy
              </p>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Console Zone — 8 / 10
              </h2>
            </div>
            <Badge variant="violet">
              <TrendingUp size={12} />
              Peak pricing
            </Badge>
          </div>

          <div className="flex gap-2 flex-wrap" aria-label="Station occupancy grid">
            {Array.from({ length: 10 }, (_, i) => {
              const occupied = i < 8;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  role="status"
                  aria-label={`Station ${i + 1}: ${occupied ? 'occupied' : 'available'}`}
                  className="h-14 w-14 rounded-[var(--radius-md)] flex flex-col items-center justify-center gap-1 transition-all"
                  style={{
                    background: occupied ? 'var(--color-violet-dim)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${occupied ? 'rgba(139,92,246,0.3)' : 'var(--color-border)'}`,
                  }}
                >
                  <span className="text-xs font-bold tabular-nums"
                    style={{ color: occupied ? 'var(--color-violet-light)' : 'var(--color-text-faint)' }}>
                    {i + 1}
                  </span>
                  {occupied && (
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ background: 'var(--color-success)' }}
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            2 stations available · ×1.5 weekend peak multiplier active
          </p>
        </BentoCard>

        {/* Alerts + quick actions */}
        <BentoCard col={5} row={2}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Active Alerts
          </p>
          <div className="flex flex-col gap-2.5 mb-6">
            {[
              { type: 'Low Stock', detail: 'Cola — 6 units remaining', sev: 'warning' as const },
              { type: 'Maintenance', detail: 'Station #3 — PS5 offline', sev: 'danger' as const },
            ].map(({ type, detail, sev }) => (
              <div
                key={type}
                className="flex items-start gap-3 p-3 rounded-[var(--radius-md)]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}
              >
                <Bell size={14} style={{ color: sev === 'danger' ? 'var(--color-danger)' : 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{type}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{detail}</p>
                </div>
                <Badge variant={sev} className="ml-auto flex-shrink-0">{sev}</Badge>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/pos">
              <Button variant="primary" size="sm" className="w-full">
                <ShoppingCart size={14} />
                Open POS
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="secondary" size="sm" className="w-full">
                <Calendar size={14} />
                New Booking
              </Button>
            </Link>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
