'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Button, Spinner } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { ApiSuccess, Order } from '@/types';

interface CartLine {
  type: 'session' | 'product';
  refId: string;
  qty: number;
  name: string;
  unitPrice: number;
  total: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartPreview {
  lines: CartLine[];
  subtotal: number;
  loyaltyRedeemed: number;
  taxAmount: number;
  total: number;
}

export default function PosPage() {
  return (
    <ProtectedRoute roles={['super_admin', 'branch_manager', 'staff']}>
      <PosContent />
    </ProtectedRoute>
  );
}

function PosContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [preview, setPreview] = useState<CartPreview | null>(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [loyaltyToRedeem, setLoyaltyToRedeem] = useState('0');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    api.get<Product[]>('/inventory/products').then((res) => {
      if (res.status === 'success') setProducts((res as ApiSuccess<Product[]>).data);
    });
  }, []);

  function addProduct(p: Product) {
    setCart((c) => {
      const existing = c.find((l) => l.type === 'product' && l.refId === p._id);
      if (existing) {
        return c.map((l) =>
          l.refId === p._id ? { ...l, qty: l.qty + 1, total: parseFloat(((l.qty + 1) * l.unitPrice).toFixed(2)) } : l
        );
      }
      return [...c, { type: 'product', refId: p._id, qty: 1, name: p.name, unitPrice: p.price, total: p.price }];
    });
  }

  function removeFromCart(refId: string) {
    setCart((c) => c.filter((l) => l.refId !== refId));
  }

  async function refreshPreview() {
    if (cart.length === 0) { setPreview(null); return; }
    setPreviewLoading(true);
    const res = await api.post<CartPreview>('/pos/preview', {
      branchId: 'current', // replaced by branchScope in backend
      lines: cart.map((l) => ({ type: l.type, refId: l.refId, qty: l.qty })),
      loyaltyPointsToRedeem: parseInt(loyaltyToRedeem) || 0,
    });
    if (res.status === 'success') setPreview((res as ApiSuccess<CartPreview>).data);
    setPreviewLoading(false);
  }

  useEffect(() => { refreshPreview(); }, [cart, loyaltyToRedeem]);

  async function handleCheckout() {
    if (!preview || cart.length === 0) return;
    setCheckoutLoading(true);
    const res = await api.post<{ order: Order }>('/pos/checkout', {
      branchId: 'current',
      lines: cart.map((l) => ({ type: l.type, refId: l.refId, qty: l.qty })),
      loyaltyPointsToRedeem: parseInt(loyaltyToRedeem) || 0,
    });
    if (res.status === 'success') {
      setLastOrder((res as ApiSuccess<{ order: Order }>).data.order);
      setCart([]);
      setPreview(null);
      setMemberEmail('');
      setLoyaltyToRedeem('0');
    }
    setCheckoutLoading(false);
  }

  return (
    <main className="min-h-dvh flex flex-col lg:flex-row">
      {/* ── Product panel ── */}
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Play<span style={{ color: 'var(--color-violet-light)' }}>Hub</span> POS
        </h1>

        {/* Last order success banner */}
        <AnimatePresence>
          {lastOrder && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl p-4 border flex items-center justify-between gap-4"
              style={{ background: 'var(--color-lime-glow)', borderColor: 'var(--color-lime)' }}
            >
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-lime-light)' }}>
                  ✓ Order completed — ${(lastOrder as unknown as { total: number }).total?.toFixed(2)}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Payment processed via mock adapter
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setLastOrder(null)}>✕</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products grid */}
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          Products
        </h2>
        {products.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No products found — add some in Inventory.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.map((p) => (
              <button
                key={p._id}
                onClick={() => addProduct(p)}
                disabled={p.stock === 0}
                className="glass-card text-left cursor-pointer hover:glow-violet transition-all disabled:opacity-40"
                style={{ padding: '0.75rem' }}
              >
                <p className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--color-text-primary)' }}>{p.name}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-violet-light)' }}>${p.price.toFixed(2)}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Stock: {p.stock}</p>
                <Badge variant={p.category === 'drink' ? 'cyan' : p.category === 'snack' ? 'gold' : 'muted'} className="mt-2">
                  {p.category}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Cart panel ── */}
      <div
        className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l flex flex-col"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Cart</h2>
        </div>

        {/* Cart lines */}
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
          <AnimatePresence>
            {cart.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Cart is empty — add products from the left
              </p>
            ) : cart.map((line) => (
              <motion.div
                key={line.refId}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border"
                style={{ background: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{line.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {line.qty} × ${line.unitPrice.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold" style={{ color: 'var(--color-cyan-light)' }}>${line.total.toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(line.refId)}
                  className="text-xs px-2 py-1 rounded-md"
                  style={{ color: 'var(--color-danger)', background: 'var(--color-danger)10' }}
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Member + loyalty */}
        <div className="p-4 border-t flex flex-col gap-3" style={{ borderColor: 'var(--color-border)' }}>
          <Input
            label="Member email"
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="Optional"
          />
          <Input
            label="Loyalty points to redeem"
            type="number"
            min="0"
            value={loyaltyToRedeem}
            onChange={(e) => setLoyaltyToRedeem(e.target.value)}
          />

          {/* Totals */}
          {previewLoading ? (
            <div className="flex justify-center py-2"><Spinner /></div>
          ) : preview && (
            <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: 'var(--color-bg-base)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--color-text-primary)' }}>${preview.subtotal.toFixed(2)}</span>
              </div>
              {preview.loyaltyRedeemed > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-lime)' }}>Loyalty</span>
                  <span style={{ color: 'var(--color-lime-light)' }}>-${preview.loyaltyRedeemed.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>Tax (8%)</span>
                <span style={{ color: 'var(--color-text-primary)' }}>${preview.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-1">
                <span style={{ color: 'var(--color-text-primary)' }}>Total</span>
                <span style={{ color: 'var(--color-violet-light)' }}>${preview.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={cart.length === 0}
            loading={checkoutLoading}
            onClick={handleCheckout}
          >
            Checkout ${preview?.total.toFixed(2) ?? '0.00'}
          </Button>
        </div>
      </div>
    </main>
  );
}
