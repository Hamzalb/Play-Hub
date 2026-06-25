'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useBranch } from '@/lib/hooks/useBranch';
import { Alert, AlertSeverity, ApiSuccess } from '@/types';
import { motion } from 'framer-motion';

const SEV_COLOR: Record<AlertSeverity, 'danger' | 'warning' | 'cyan'> = {
  critical: 'danger',
  warning:  'warning',
  info:     'cyan',
};

export default function AlertsPage() {
  return <ProtectedRoute><AlertsContent /></ProtectedRoute>;
}

function AlertsContent() {
  const [alerts, setAlerts]       = useState<Alert[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const { branchId } = useBranch();

  async function load() {
    if (!branchId) { setLoading(false); return; }
    setLoading(true);
    const res = await api.get<Alert[]>(`/alerts?resolved=${showResolved}&branchId=${branchId}`);
    if (res.status === 'success') setAlerts((res as ApiSuccess<Alert[]>).data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [showResolved, branchId]);

  async function ack(id: string) {
    await api.patch(`/alerts/${id}/ack`, {});
    load();
  }

  async function resolve(id: string) {
    await api.patch(`/alerts/${id}/resolve`, {});
    load();
  }

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Alerts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {alerts.length} {showResolved ? 'resolved' : 'open'} alerts
          </p>
        </div>
        <Button
          variant={showResolved ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowResolved((s) => !s)}
        >
          {showResolved ? 'Show open' : 'Show resolved'}
        </Button>
      </div>

      <BentoGrid>
        {loading ? (
          <BentoCard col={12}><p style={{ color: 'var(--color-text-muted)' }}>Loading…</p></BentoCard>
        ) : alerts.length === 0 ? (
          <BentoCard col={12}>
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
              {showResolved ? 'No resolved alerts.' : '✓ No open alerts — all clear!'}
            </p>
          </BentoCard>
        ) : alerts.map((a) => (
          <motion.div key={a._id ?? a.id ?? a.createdAt} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="col-span-12">
            <BentoCard col={12}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={SEV_COLOR[a.severity]}>{a.severity}</Badge>
                    <Badge variant="muted">{a.type.replace('_', ' ')}</Badge>
                    {a.isAcknowledged && <Badge variant="muted">Acknowledged</Badge>}
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{a.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{a.message}</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                {!a.isResolved && (
                  <div className="flex gap-2">
                    {!a.isAcknowledged && (
                      <Button size="sm" variant="secondary" onClick={() => ack(a._id ?? a.id)}>Acknowledge</Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => resolve(a._id ?? a.id)}>Resolve</Button>
                  </div>
                )}
              </div>
            </BentoCard>
          </motion.div>
        ))}
      </BentoGrid>
    </main>
  );
}
