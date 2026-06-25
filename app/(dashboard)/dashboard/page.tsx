'use client';

import { useState, useEffect } from 'react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Bell, ShoppingCart, Calendar, Check } from '@/components/ui/icons';
import { api } from '@/lib/api';
import { useBranch } from '@/lib/hooks/useBranch';
import { Alert, DailyReport, Zone, ApiSuccess, Pagination } from '@/types';

export default function DashboardPage() {
  const { branchId } = useBranch();
  const [revenue, setRevenue]         = useState(0);
  const [members, setMembers]         = useState(0);
  const [alertCount, setAlertCount]   = useState(0);
  const [alerts, setAlerts]           = useState<Alert[]>([]);
  const [activeZones, setActiveZones] = useState(0);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);

      const [membersRes, alertsRes, reportRes, zonesRes] = await Promise.all([
        api.get<unknown[]>('/members?page=1&limit=1'),
        branchId ? api.get<Alert[]>(`/alerts?resolved=false&branchId=${branchId}`) : Promise.resolve(null),
        branchId ? api.get<DailyReport>(`/reports/${today}`) : Promise.resolve(null),
        branchId ? api.get<Zone[]>(`/zones?branchId=${branchId}&active=true`) : Promise.resolve(null),
      ]);

      if (membersRes.status === 'success') {
        const pag = (membersRes as ApiSuccess<unknown[]> & { pagination?: Pagination }).pagination;
        setMembers(pag?.total ?? 0);
      }
      if (alertsRes && alertsRes.status === 'success') {
        const list = (alertsRes as ApiSuccess<Alert[]>).data;
        setAlerts(list.slice(0, 3));
        setAlertCount(list.length);
      }
      if (reportRes && reportRes.status === 'success') {
        const rep = (reportRes as ApiSuccess<DailyReport>).data;
        if (rep) setRevenue(rep.totalRevenue ?? 0);
      }
      if (zonesRes && zonesRes.status === 'success') {
        setActiveZones((zonesRes as ApiSuccess<Zone[]>).data.length);
      }
      setLoading(false);
    }
    load();
  }, [branchId]);

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
        <KpiCard label="Revenue Today"   value={revenue}     prefix="$"  trendLabel="today's earnings"   accent="gold"   col={3} />
        <KpiCard label="Total Members"   value={members}                 trendLabel="registered total"   accent="cyan"   col={3} />
        <KpiCard label="Open Alerts"     value={alertCount}              trendLabel="need attention"     accent="violet" col={3} />
        <KpiCard label="Active Zones"    value={activeZones}             trendLabel="currently active"   accent="violet" col={3} />
      </BentoGrid>

      {/* Main grid */}
      <BentoGrid>
        {/* Alerts panel */}
        <BentoCard col={7} row={2} glow="violet">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Active Alerts
              </p>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                {loading ? '…' : alertCount === 0 ? 'All clear' : `${alertCount} open`}
              </h2>
            </div>
            <Link href="/alerts">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex items-center gap-2 p-4 rounded-[var(--radius-md)]" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>No open alerts — all systems normal</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {alerts.map((a) => (
                <div
                  key={a._id ?? a.id}
                  className="flex items-start gap-3 p-3 rounded-[var(--radius-md)]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}
                >
                  <Bell size={14} style={{
                    color: a.severity === 'critical' ? 'var(--color-danger)' : a.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-info)',
                    flexShrink: 0, marginTop: 2,
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{a.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-secondary)' }}>{a.message}</p>
                  </div>
                  <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'cyan'} className="flex-shrink-0">
                    {a.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </BentoCard>

        {/* Quick actions */}
        <BentoCard col={5} row={2}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Quick Actions
          </p>
          <div className="flex flex-col gap-2 mb-6">
            <Link href="/pos" className="block">
              <Button variant="primary" size="md" className="w-full">
                <ShoppingCart size={15} />
                Open POS
              </Button>
            </Link>
            <Link href="/bookings" className="block">
              <Button variant="secondary" size="md" className="w-full">
                <Calendar size={15} />
                New Booking
              </Button>
            </Link>
            <Link href="/members" className="block">
              <Button variant="secondary" size="md" className="w-full">
                <TrendingUp size={15} />
                View Members
              </Button>
            </Link>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Today&apos;s Summary
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-secondary)' }}>Revenue</span>
              <span className="font-semibold tabular-nums" style={{ color: 'var(--color-gold-light)' }}>
                ${revenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-secondary)' }}>Total members</span>
              <span className="font-semibold tabular-nums" style={{ color: 'var(--color-cyan-light)' }}>
                {members.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-secondary)' }}>Open alerts</span>
              <span className="font-semibold tabular-nums" style={{ color: alertCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {alertCount}
              </span>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
