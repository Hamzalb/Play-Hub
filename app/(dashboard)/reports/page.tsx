'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { Button } from '@/components/ui/Button';
import { BarChart } from '@/components/charts/BarChart';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { DailyReport, ApiSuccess } from '@/types';
import { BarChart2, TrendingUp } from '@/components/ui/icons';

export default function ReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selected, setSelected] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { success, error: toastError } = useToast();

  async function load() {
    setLoading(true);
    const res = await api.get<DailyReport[]>('/reports');
    if (res.status === 'success') {
      const data = (res as ApiSuccess<DailyReport[]>).data;
      setReports(data);
      if (data.length > 0) setSelected(data[0]!);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await api.post('/reports/generate', { date: new Date().toISOString().slice(0, 10) });
      if (res.status === 'success') {
        success("Today's report generated", 'Reports');
        load();
      } else {
        toastError('Failed to generate report');
      }
    } catch {
      toastError('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Daily Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Revenue snapshots generated nightly by cron
          </p>
        </div>
        <Button loading={generating} onClick={handleGenerate}>
          <BarChart2 size={16} />
          Generate Today
        </Button>
      </div>

      {loading ? (
        <BentoGrid>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} className={`col-span-${i < 4 ? 3 : 6}`} />)}
        </BentoGrid>
      ) : reports.length === 0 ? (
        <BentoCard col={12}>
          <div className="text-center py-16">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <BarChart2 size={24} style={{ color: 'var(--color-violet-light)' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              No reports yet
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Reports are generated nightly. Click below to generate today&apos;s snapshot now.
            </p>
            <Button onClick={handleGenerate} loading={generating}>Generate today&apos;s report</Button>
          </div>
        </BentoCard>
      ) : (
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Date sidebar */}
          <nav className="lg:w-52 flex-shrink-0" aria-label="Report dates">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-3 px-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              History
            </h2>
            <ul role="list" className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {reports.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelected(r)}
                    aria-current={selected?.id === r.id ? 'true' : undefined}
                    className="w-full text-left px-4 py-3 rounded-[var(--radius-md)] border transition-all cursor-pointer whitespace-nowrap"
                    style={{
                      background: selected?.id === r.id ? 'var(--color-violet-dim)' : 'rgba(255,255,255,0.025)',
                      borderColor: selected?.id === r.id ? 'rgba(139,92,246,0.3)' : 'var(--color-border)',
                      color: selected?.id === r.id ? 'var(--color-violet-light)' : 'var(--color-text-primary)',
                    }}
                  >
                    <p className="text-sm font-medium">{r.date}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      ${r.totalRevenue.toFixed(2)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Report detail */}
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-w-0"
            >
              <BentoGrid>
                <KpiCard label="Total Revenue"   value={selected.totalRevenue}   prefix="$" accent="gold"   col={4} />
                <KpiCard label="Session Revenue" value={selected.sessionRevenue} prefix="$" accent="violet" col={4} />
                <KpiCard label="Product Revenue" value={selected.productRevenue} prefix="$" accent="cyan"   col={4} />
                <KpiCard label="Total Orders"    value={selected.totalOrders}               accent="gold"   col={3} />
                <KpiCard label="New Members"     value={selected.newMembers}                accent="violet" col={3} />
                <KpiCard label="Points Awarded"  value={selected.loyaltyPointsAwarded}      accent="cyan"   col={3} />
                <KpiCard label="Points Redeemed" value={selected.loyaltyPointsRedeemed ?? 0} accent="gold" col={3} />

                {/* Revenue breakdown bar chart */}
                <BentoCard col={6} glow="violet">
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp size={16} style={{ color: 'var(--color-violet-light)' }} />
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                      Revenue breakdown
                    </p>
                  </div>
                  <BarChart
                    prefix="$"
                    items={[
                      { label: 'Sessions',  value: selected.sessionRevenue, color: 'violet' },
                      { label: 'Products',  value: selected.productRevenue, color: 'gold' },
                      { label: 'Total',     value: selected.totalRevenue,   color: 'cyan' },
                    ]}
                  />
                </BentoCard>

                {/* Top products */}
                {selected.topProducts && selected.topProducts.length > 0 && (
                  <BentoCard col={6}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
                      Top products
                    </p>
                    <BarChart
                      prefix="$"
                      items={selected.topProducts.map((p, i) => ({
                        label: p.name,
                        value: p.revenue ?? 0,
                        color: (['violet', 'gold', 'cyan', 'violet', 'gold'] as const)[i % 5],
                      }))}
                    />
                  </BentoCard>
                )}
              </BentoGrid>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
