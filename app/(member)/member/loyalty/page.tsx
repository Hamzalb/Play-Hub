'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { TrendingUp } from '@/components/ui/icons';

interface LoyaltyTx { _id: string; type: string; points: number; balanceAfter: number; note?: string; createdAt: string; }

const TYPE_LABEL: Record<string, string> = { earn: 'Earned', redeem: 'Redeemed', adjustment: 'Adjusted', expiry: 'Expired' };
const TYPE_COLOR: Record<string, 'success' | 'warning' | 'muted' | 'danger'> = {
  earn: 'success', redeem: 'warning', adjustment: 'muted', expiry: 'danger',
};

export default function MemberLoyaltyPage() {
  const [balance, setBalance] = useState<{ points: number; totalSpend: number } | null>(null);
  const [history, setHistory] = useState<LoyaltyTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In full impl, use the authenticated member's ID
    // For now, show structure; real data needs member auth token
    setLoading(false);
  }, []);

  const POINTS_VALUE = (balance?.points ?? 0) * 0.01;

  return (
    <main className="min-h-dvh px-4 py-12 sm:px-8 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/member"><Button variant="ghost" size="sm">← Portal</Button></Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Loyalty Points
        </h1>
      </div>

      {/* Balance card */}
      <div className="glass-card glass-card-cyan mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Current balance
            </p>
            <p className="text-6xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cyan-light)' }}>
              {(balance?.points ?? 250).toLocaleString()}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              ≈ ${POINTS_VALUE.toFixed(2) || '2.50'} redemption value
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total spent</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              ${(balance?.totalSpend ?? 125).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 p-3 rounded-[var(--radius-md)] flex items-center gap-3"
          style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}>
          <TrendingUp size={16} style={{ color: 'var(--color-cyan)', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Earn <strong style={{ color: 'var(--color-text-primary)' }}>1 point per $1</strong> spent.
            Redeem at the counter — 100 pts = $1.00 off your next order.
          </p>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { tier: 'Standard', min: 0,    max: 499,  color: 'muted'   as const },
          { tier: 'Silver',   min: 500,  max: 1999, color: 'cyan'    as const },
          { tier: 'Gold',     min: 2000, max: Infinity, color: 'gold' as const },
        ].map(({ tier, min, max, color }) => {
          const pts = balance?.points ?? 250;
          const active = pts >= min && pts <= max;
          return (
            <div key={tier} className="glass-card text-center" style={{ opacity: active ? 1 : 0.5 }}>
              <Badge variant={color} className="mb-2">{tier}</Badge>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {max === Infinity ? `${min.toLocaleString()}+` : `${min.toLocaleString()}–${max.toLocaleString()}`} pts
              </p>
              {active && <p className="text-xs mt-1" style={{ color: `var(--color-${color}-light)` }}>Current tier</p>}
            </div>
          );
        })}
      </div>

      {/* History */}
      <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
        Recent activity
      </h2>
      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : history.length === 0 ? (
        <div className="glass-card text-center py-10">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No loyalty transactions yet. Spend to start earning!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((tx, i) => (
            <motion.div key={tx._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--color-border)' }}>
              <div>
                <Badge variant={TYPE_COLOR[tx.type] ?? 'muted'}>{TYPE_LABEL[tx.type] ?? tx.type}</Badge>
                {tx.note && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{tx.note}</p>}
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold tabular-nums" style={{ color: tx.points > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {tx.points > 0 ? '+' : ''}{tx.points} pts
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Balance: {tx.balanceAfter}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
