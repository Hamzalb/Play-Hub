'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useBranch } from '@/lib/hooks/useBranch';
import { useToast } from '@/components/ui/Toast';
import { Alert, AlertSeverity, ApiSuccess } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from '@/components/ui/icons';

const SEV_COLOR: Record<AlertSeverity, 'danger' | 'warning' | 'cyan'> = {
  critical: 'danger',
  warning:  'warning',
  info:     'cyan',
};

export default function AlertsPage() {
  return <ProtectedRoute><AlertsContent /></ProtectedRoute>;
}

function AlertsContent() {
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [loading, setLoading]       = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolving, setResolving]   = useState<string | null>(null);
  const { branchId } = useBranch();
  const { success: toastOk } = useToast();

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
    setResolving(id);
    await api.patch(`/alerts/${id}/resolve`, {});
    toastOk('Alert resolved');
    setAlerts((prev) => prev.filter((a) => (a._id ?? a.id) !== id));
    setResolving(null);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
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
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(52,211,153,0.1)' }}>
                <Check size={20} style={{ color: 'var(--color-success)' }} />
              </div>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {showResolved ? 'No resolved alerts.' : 'All clear — no open alerts!'}
              </p>
            </div>
          </BentoCard>
        ) : alerts.map((a) => {
          const id       = a._id ?? a.id ?? a.createdAt;
          const expanded = expandedId === id;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12"
            >
              <div
                className="glass-card cursor-pointer transition-colors"
                style={expanded ? { borderColor: 'rgba(139,92,246,0.25)', background: 'rgba(255,255,255,0.035)' } : undefined}
                onClick={() => toggleExpand(id)}
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpand(id)}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={SEV_COLOR[a.severity]}>{a.severity}</Badge>
                      <Badge variant="muted">{a.type.replace('_', ' ')}</Badge>
                      {a.isAcknowledged && <Badge variant="muted">Acknowledged</Badge>}
                    </div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{a.title}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {!a.isResolved && !a.isAcknowledged && (
                      <Button size="sm" variant="secondary" onClick={() => ack(a._id ?? a.id)}>
                        Acknowledge
                      </Button>
                    )}
                    {!a.isResolved && (
                      <Button
                        size="sm"
                        variant="danger"
                        loading={resolving === id}
                        onClick={() => resolve(a._id ?? a.id)}
                      >
                        Resolve
                      </Button>
                    )}
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded message */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: 'var(--color-border)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          {a.message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </BentoGrid>
    </main>
  );
}
