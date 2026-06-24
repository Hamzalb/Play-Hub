import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/ui/KpiCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Welcome to PlayHub' };

export default function LandingPage() {
  return (
    <main className="min-h-dvh px-4 py-16 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
      {/* ── Hero ── */}
      <section className="mb-16 text-center">
        <Badge variant="violet" className="mb-6">
          🎮 Entertainment Center Management
        </Badge>
        <h1
          className="text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Play
          <span style={{ color: 'var(--color-violet-light)' }}>Hub</span>
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          One dashboard to run every console, booking, member, and snack bar across all your branches.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="primary" size="lg">Book a Session</Button>
          <Button variant="secondary" size="lg">Staff Login</Button>
        </div>
      </section>

      {/* ── Bento demo grid (design system showcase) ── */}
      <BentoGrid className="mb-16">
        <KpiCard label="Today's Revenue"  value={4820}  prefix="$" trend={12.4}  trendLabel="vs yesterday" accent="violet" col={3} />
        <KpiCard label="Active Sessions"  value={14}                trend={0}    trendLabel="on track"    accent="cyan"   col={3} />
        <KpiCard label="Members Online"   value={38}                trend={5.2}  trendLabel="vs avg"      accent="lime"   col={3} />
        <KpiCard label="Open Alerts"      value={2}                 trend={-33}  trendLabel="vs yesterday" accent="violet" col={3} />

        <BentoCard col={8} row={2} glow="violet">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Live Occupancy
          </p>
          <p className="text-2xl font-bold mb-2" style={{ color: 'var(--color-violet-light)' }}>Console Zone — 8/10</p>
          <div className="flex gap-2 flex-wrap mt-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: i < 8
                    ? 'var(--color-violet-glow)'
                    : 'var(--color-bg-subtle)',
                  color: i < 8
                    ? 'var(--color-violet-light)'
                    : 'var(--color-text-muted)',
                  border: `1px solid ${i < 8 ? 'var(--color-violet)' : 'var(--color-border)'}`,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            2 stations available · Peak pricing active
          </p>
        </BentoCard>

        <BentoCard col={4} row={2} glow="cyan">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Recent Alerts
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <Badge variant="warning">Low Stock</Badge>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Cola (6 left)</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="danger">Maintenance</Badge>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Station #3 — PS5</p>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      {/* ── Design tokens showcase ── */}
      <section className="mb-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Design System — Color Accents
        </h2>
        <div className="flex gap-4 flex-wrap">
          {['violet', 'cyan', 'lime'].map((c) => (
            <div key={c} className="glass-card flex-1 min-w-[140px] text-center" style={{ minHeight: '80px' }}>
              <div
                className="h-6 w-6 rounded-full mx-auto mb-2"
                style={{ background: `var(--color-${c})`, boxShadow: `0 0 12px var(--color-${c})` }}
              />
              <p className="text-xs capitalize font-medium" style={{ color: `var(--color-${c}-light)` }}>{c}</p>
            </div>
          ))}
          <div className="glass-card flex-1 min-w-[140px] text-center" style={{ minHeight: '80px' }}>
            <div className="flex gap-1 justify-center mb-2">
              <div className="h-3 w-3 rounded-full" style={{ background: 'var(--color-success)' }} />
              <div className="h-3 w-3 rounded-full" style={{ background: 'var(--color-warning)' }} />
              <div className="h-3 w-3 rounded-full" style={{ background: 'var(--color-danger)' }} />
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Status</p>
          </div>
        </div>
      </section>
    </main>
  );
}
