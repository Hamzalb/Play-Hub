'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Button, Spinner } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useBranch } from '@/lib/hooks/useBranch';
import { useAuth } from '@/lib/auth';
import { ApiSuccess, Order } from '@/types';
import { ShoppingCart, Package, X } from '@/components/ui/icons';
import { InvoiceModal, type InvoiceOrder } from '@/components/pos/InvoiceModal';

interface CartLine {
  type: 'product';
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
  const [products, setProducts]       = useState<Product[]>([]);
  const [cart, setCart]               = useState<CartLine[]>([]);
  const [preview, setPreview]         = useState<CartPreview | null>(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [loyaltyToRedeem, setLoyalty] = useState('0');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [activeTab, setActiveTab]     = useState<'products' | 'cart'>('products');
  const [invoiceOrder, setInvoiceOrder] = useState<InvoiceOrder | null>(null);
  const { success: toastSuccess, error: toastError } = useToast();
  const { branchId, branchName, branches } = useBranch();
  const { user } = useAuth();
  const branchAddress = branches.find(b => b._id === branchId)?.address ?? '';

  useEffect(() => {
    if (!branchId) return;                // wait until BranchProvider has resolved
    api.get<Product[]>(`/inventory/products?branchId=${branchId}`).then((res) => {
      if (res.status === 'success') {
        setProducts((res as ApiSuccess<Product[]>).data);
      } else {
        toastError('Failed to load products — check your branch selection');
      }
    }).catch(() => toastError('Network error loading products'));
  }, [branchId]);                         // re-fetch whenever the active branch changes

  function addProduct(p: Product) {
    setCart((c) => {
      const existing = c.find((l) => l.refId === p._id);
      if (existing) {
        return c.map((l) =>
          l.refId === p._id
            ? { ...l, qty: l.qty + 1, total: parseFloat(((l.qty + 1) * l.unitPrice).toFixed(2)) }
            : l
        );
      }
      return [...c, { type: 'product', refId: p._id, qty: 1, name: p.name, unitPrice: p.price, total: p.price }];
    });
    // Switch to cart tab on mobile after adding
    if (window.innerWidth < 1024) setActiveTab('cart');
  }

  function removeFromCart(refId: string) {
    setCart((c) => c.filter((l) => l.refId !== refId));
  }

  useEffect(() => {
    if (cart.length === 0) { setPreview(null); return; }
    setPreviewLoading(true);
    api.post<CartPreview>('/pos/preview', {
      branchId,
      lines: cart.map((l) => ({ type: l.type, refId: l.refId, qty: l.qty })),
      loyaltyPointsToRedeem: parseInt(loyaltyToRedeem) || 0,
    }).then((res) => {
      if (res.status === 'success') setPreview((res as ApiSuccess<CartPreview>).data);
    }).finally(() => setPreviewLoading(false));
  }, [cart, loyaltyToRedeem]);

  async function handleCheckout() {
    if (!preview || cart.length === 0) return;
    if (!branchId) { toastError('No branch selected — choose a branch in the sidebar'); return; }
    setCheckoutLoading(true);
    const res = await api.post<{ order: Order }>('/pos/checkout', {
      branchId,
      lines: cart.map((l) => ({ type: l.type, refId: l.refId, qty: l.qty })),
      loyaltyPointsToRedeem: parseInt(loyaltyToRedeem) || 0,
    });
    if (res.status === 'success') {
      const completedOrder = (res as ApiSuccess<{ order: Order }>).data.order as unknown as { _id?: string; paymentStatus: string };
      // Build invoice lines from cart (captured before reset) + preview totals
      const invoiceable: InvoiceOrder = {
        _id:             completedOrder._id,
        lines:           cart.map((l) => ({
          type:      l.type,
          name:      l.name,
          qty:       l.qty,
          unitPrice: l.unitPrice,
          total:     l.total,
        })),
        subtotal:        preview.subtotal,
        loyaltyRedeemed: preview.loyaltyRedeemed,
        taxAmount:       preview.taxAmount,
        total:           preview.total,
        paymentStatus:   'completed',
        createdAt:       new Date().toISOString(),
      };
      setInvoiceOrder(invoiceable);   // ← opens invoice modal
      setCart([]);
      setPreview(null);
      setMemberEmail('');
      setLoyalty('0');
      setActiveTab('products');
    } else {
      toastError('Checkout failed — please retry');
    }
    setCheckoutLoading(false);
  }

  const cartItemCount = cart.reduce((n, l) => n + l.qty, 0);

  // ── Cart panel (shared between mobile+desktop) ─────────────────────────────
  function CartPanel() {
    return (
      <div
        className="flex flex-col h-full"
        style={{ background: 'var(--color-bg-elevated)', borderLeft: '1px solid var(--color-border)' }}
      >
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Cart {cartItemCount > 0 && <span style={{ color: 'var(--color-violet-light)' }}>· {cartItemCount}</span>}
          </p>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          <AnimatePresence>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <ShoppingCart size={24} style={{ color: 'var(--color-text-muted)', marginBottom: 8 }} />
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cart is empty</p>
              </div>
            ) : cart.map((line) => (
              <motion.div
                key={line.refId}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border"
                style={{ background: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{line.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {line.qty} × ${line.unitPrice.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold flex-shrink-0" style={{ color: 'var(--color-cyan-light)' }}>
                  ${line.total.toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(line.refId)}
                  className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-[rgba(248,113,113,0.12)] transition-colors cursor-pointer flex-shrink-0"
                  aria-label={`Remove ${line.name} from cart`}
                >
                  <X size={14} style={{ color: 'var(--color-danger)' }} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loyalty + totals + checkout */}
        <div className="p-4 border-t flex flex-col gap-3" style={{ borderColor: 'var(--color-border)' }}>
          <Input label="Member email (optional)" type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="member@example.com" />
          <Input label="Loyalty points to redeem" type="number" min="0" value={loyaltyToRedeem} onChange={(e) => setLoyalty(e.target.value)} />

          {previewLoading ? (
            <div className="flex justify-center py-2"><Spinner /></div>
          ) : preview && (
            <div className="rounded-[var(--radius-md)] p-3 flex flex-col gap-1" style={{ background: 'var(--color-bg-base)' }}>
              {[
                { label: 'Subtotal', value: `$${preview.subtotal.toFixed(2)}`, muted: true },
                ...(preview.loyaltyRedeemed > 0 ? [{ label: 'Loyalty', value: `-$${preview.loyaltyRedeemed.toFixed(2)}`, muted: false }] : []),
                { label: 'Tax (8%)', value: `$${preview.taxAmount.toFixed(2)}`, muted: true },
              ].map(({ label, value, muted }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                  <span style={{ color: muted ? 'var(--color-text-primary)' : 'var(--color-lime-light)' }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg mt-1 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
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
            Checkout {preview ? `$${preview.total.toFixed(2)}` : ''}
          </Button>
        </div>
      </div>
    );
  }

  const catColor = (c: string): 'cyan' | 'gold' | 'muted' =>
    c === 'drink' ? 'cyan' : c === 'snack' ? 'gold' : 'muted';

  return (
    <div className="flex flex-col h-dvh" style={{ maxHeight: '100dvh' }}>
      {/* ── Invoice modal — opens after checkout ── */}
      <InvoiceModal
        order={invoiceOrder}
        branchName={branchName}
        branchAddress={branchAddress}
        cashierName={user?.name ?? ''}
        onClose={() => setInvoiceOrder(null)}
      />

      {/* ── Mobile tab bar ── */}
      <div className="lg:hidden flex border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { key: 'products' as const, label: 'Products', Icon: Package },
          { key: 'cart' as const, label: `Cart${cartItemCount > 0 ? ` (${cartItemCount})` : ''}`, Icon: ShoppingCart },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer"
            style={{
              borderBottomColor: activeTab === key ? 'var(--color-violet-mid)' : 'transparent',
              color: activeTab === key ? 'var(--color-violet-light)' : 'var(--color-text-muted)',
            }}
            aria-pressed={activeTab === key}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Products panel */}
        <div
          className={`
            flex-1 overflow-y-auto p-4
            ${activeTab === 'cart' ? 'hidden lg:block' : 'block'}
          `}
        >
          <h1 className="text-xl font-bold mb-5 hidden lg:block" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Play<span style={{ color: 'var(--color-violet-light)' }}>Hub</span> POS
          </h1>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-2 px-4">
              <Package size={28} style={{ color: 'var(--color-text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {!branchId ? 'Select a branch in the sidebar first' : 'No products for this branch'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {branchId ? 'Add products in the Inventory page, then come back here.' : ''}
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>Products</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {products.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => addProduct(p)}
                    disabled={p.stock === 0}
                    className="glass-card text-left cursor-pointer hover:glow-violet transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
                    style={{ padding: '0.75rem', minHeight: '80px' }}
                    aria-label={`Add ${p.name} to cart — $${p.price.toFixed(2)}`}
                  >
                    <p className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--color-text-primary)' }}>{p.name}</p>
                    <p className="text-base font-bold" style={{ color: 'var(--color-violet-light)' }}>${p.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <Badge variant={catColor(p.category)}>{p.category}</Badge>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.stock} left</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cart panel — desktop: fixed width; mobile: shown when cart tab active */}
        <div
          className={`
            w-full lg:w-96 flex-shrink-0
            ${activeTab === 'products' ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}
          `}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
