'use client';

import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Play<span style={{ color: 'var(--color-violet-light)' }}>Hub</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={
            user?.role === 'super_admin' ? 'violet' :
            user?.role === 'branch_manager' ? 'cyan' : 'lime'
          }>
            {user?.role?.replace('_', ' ')}
          </Badge>
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </div>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex gap-2 flex-wrap mb-8">
        {[
          { href: '/dashboard', label: 'Overview' },
          { href: '/pos', label: 'POS' },
          { href: '/bookings', label: 'Bookings' },
          { href: '/members', label: 'Members' },
          { href: '/inventory', label: 'Inventory' },
          { href: '/staff', label: 'Staff' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/reports', label: 'Reports' },
          { href: '/alerts', label: 'Alerts' },
        ].map(({ href, label }) => (
          <Link key={href} href={href}>
            <Button variant="secondary" size="sm">{label}</Button>
          </Link>
        ))}
      </nav>

      {/* ── Bento KPIs ── */}
      <BentoGrid className="mb-8">
        <KpiCard label="Today's Revenue"  value={4820}  prefix="$"  trend={12.4}  trendLabel="vs yesterday" accent="violet" col={3} />
        <KpiCard label="Active Sessions"  value={14}                trend={0}     trendLabel="on track"     accent="cyan"   col={3} />
        <KpiCard label="Members Total"    value={384}               trend={5.2}   trendLabel="vs last month" accent="lime"   col={3} />
        <KpiCard label="Open Alerts"      value={2}                 trend={-33}   trendLabel="vs yesterday"  accent="violet" col={3} />

        <BentoCard col={8} row={2}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Live Occupancy — Console Zone
          </p>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: i < 8 ? 'var(--color-violet-glow)' : 'var(--color-bg-subtle)',
                  color: i < 8 ? 'var(--color-violet-light)' : 'var(--color-text-muted)',
                  border: `1px solid ${i < 8 ? 'var(--color-violet)' : 'var(--color-border)'}`,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            8 occupied · 2 available · Peak pricing active
          </p>
        </BentoCard>

        <BentoCard col={4} row={2}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Alerts
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <Badge variant="warning">Low Stock</Badge>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Cola — 6 units left</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="danger">Maintenance</Badge>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Station #3 — PS5</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/alerts">
              <Button variant="ghost" size="sm">View all alerts →</Button>
            </Link>
          </div>
        </BentoCard>
      </BentoGrid>

      <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
        Full KPI data from live reports — Phase 12
      </p>
    </main>
  );
}
