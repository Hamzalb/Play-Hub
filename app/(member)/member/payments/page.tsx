'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { DollarSign } from '@/components/ui/icons';

interface Order {
  _id: string; total: number; subtotal: number;
  paymentStatus: string; lines: Array<{ name: string; qty: number; total: number }>;
  createdAt: string;
}

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'danger' | 'muted'> = {
  completed: 'success', pending: 'warning', failed: 'danger', refunded: 'muted',
};

export default function MemberPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Order[]>('/pos/orders').then((res) => {
      if (res.status === 'success') setOrders((res as ApiSuccess<Order[]>).data);
    }).finally(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((s, o) => s + (o.paymentStatus === 'completed' ? o.total : 0), 0);

  return (
    <main className="min-h-dvh px-4 py-12 sm:px-8 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/member"><Button variant="ghost" size="sm">← Portal</Button></Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Payment History
        </h1>
      </div>

      {/* Summary */}
      <div className="glass-card mb-6 flex items-center gap-5">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-violet-dim)' }} aria-hidden="true">
          <DollarSign size={22} style={{ color: 'var(--color-violet-light)' }} />
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total spent</p>
          <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-violet-light)' }}>
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Orders</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{orders.length}</p>
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3].map((i) => <SkeletonRow key={i} />)}</div>
      ) : orders.length === 0 ? (
        <div className="glass-card text-center py-12">
          <DollarSign size={30} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>No orders yet</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Your purchase history will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                    {' at '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_COLOR[order.paymentStatus] ?? 'muted'}>{order.paymentStatus}</Badge>
                  <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
              {order.lines.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {order.lines.map((line, j) => (
                    <li key={j} className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{line.name}{line.qty > 1 ? ` ×${line.qty}` : ''}</span>
                      <span>${line.total.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
