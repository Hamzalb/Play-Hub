'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BarChart } from '@/components/charts/BarChart';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useBranch } from '@/lib/hooks/useBranch';
import { DailyReport, ApiSuccess } from '@/types';
import { BarChart2, TrendingUp, Download } from '@/components/ui/icons';

function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }

export default function ReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selected, setSelected] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const today = toDateStr(new Date());
  const sevenDaysAgo = toDateStr(new Date(Date.now() - 6 * 86_400_000));
  const [fromDate, setFromDate] = useState(sevenDaysAgo);
  const [toDate, setToDate]     = useState(today);
  const { success, error: toastError } = useToast();
  const { branchId } = useBranch();

  async function load() {
    if (!branchId) { setLoading(false); return; }
    setLoading(true);
    const res = await api.get<DailyReport[]>(`/reports?branchId=${branchId}&from=${fromDate}&to=${toDate}`);
    if (res.status === 'success') {
      const data = (res as ApiSuccess<DailyReport[]>).data;
      setReports(data);
      if (data.length > 0) setSelected(data[0]!);
    } else {
      toastError((res as { message: string }).message ?? 'Failed to load reports');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [branchId, fromDate, toDate]);

  function exportCsv() {
    if (!selected) { toastError('Load a report first'); return; }
    const rows = [
      ['Metric', 'Value'],
      ['Date', selected.date],
      ['Total Revenue', selected.totalRevenue.toFixed(2)],
      ['Session Revenue', selected.sessionRevenue.toFixed(2)],
      ['Product Revenue', selected.productRevenue.toFixed(2)],
      ['Total Orders', String(selected.totalOrders)],
      ['New Members', String(selected.newMembers)],
      ['Points Awarded', String(selected.loyaltyPointsAwarded)],
      ['Points Redeemed', String(selected.loyaltyPointsRedeemed ?? 0)],
      ...(selected.topProducts ?? []).map((p) => [`Product: ${p.name}`, (p.revenue ?? 0).toFixed(2)]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `playhub-report-${selected.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success('Report exported');
  }

  async function handleGenerate() {
    if (!branchId) { toastError('No branch selected — choose a branch first'); return; }
    setGenerating(true);
    try {
      const res = await api.post('/reports/generate', { branchId, date: new Date().toISOString().slice(0, 10) });
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
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
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
        <div className="flex gap-2 flex-wrap items-end">
          <Button variant="secondary" onClick={exportCsv}>
            <Download size={15} />
            Export CSV
          </Button>
          <Button loading={generating} onClick={handleGenerate}>
            <BarChart2 size={16} />
            Generate Today
          </Button>
        </div>
      </div>

      {/* Date filter */}
      <div className="flex gap-3 items-end flex-wrap mb-8">
        <Input
          label="From"
          type="date"
          value={fromDate}
          max={toDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-40"
        />
        <Input
          label="To"
          type="date"
          value={toDate}
          min={fromDate}
          max={today}
          onChange={(e) => setToDate(e.target.value)}
          className="w-40"
        />
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
                <li key={r._id ?? r.id ?? r.date}>
                  <button
                    onClick={() => setSelected(r)}
                    aria-current={(selected?._id ?? selected?.id) === (r._id ?? r.id) ? 'true' : undefined}
                    className="w-full text-left px-4 py-3 rounded-[var(--radius-md)] border transition-all cursor-pointer whitespace-nowrap"
                    style={{
                      background: (selected?._id ?? selected?.id) === (r._id ?? r.id) ? 'var(--color-violet-dim)' : 'rgba(255,255,255,0.025)',
                      borderColor: (selected?._id ?? selected?.id) === (r._id ?? r.id) ? 'rgba(139,92,246,0.3)' : 'var(--color-border)',
                      color: (selected?._id ?? selected?.id) === (r._id ?? r.id) ? 'var(--color-violet-light)' : 'var(--color-text-primary)',
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
              key={selected._id ?? selected.id ?? selected.date}
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
