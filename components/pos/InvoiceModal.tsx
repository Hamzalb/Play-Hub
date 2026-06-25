'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { X, Printer, Receipt } from '@/components/ui/icons';

export interface InvoiceOrder {
  _id?: string;
  lines: Array<{ name: string; qty: number; unitPrice: number; total: number; type: string }>;
  subtotal:        number;
  discountAmount?: number;
  loyaltyRedeemed: number;
  taxAmount:       number;
  total:           number;
  paymentStatus:   string;
  createdAt?:      string;
}

interface InvoiceModalProps {
  order:          InvoiceOrder | null;
  branchName:     string;
  branchAddress?: string;
  cashierName:    string;
  onClose:        () => void;
}

// ─── Build a clean printable HTML string ─────────────────────────────────────
function buildPrintHTML(
  order:          InvoiceOrder,
  branchName:     string,
  branchAddress:  string,
  cashierName:    string,
): string {
  const date    = order.createdAt ? new Date(order.createdAt) : new Date();
  const orderId = (order._id ?? '').slice(-8).toUpperCase() || 'N/A';

  const rows = order.lines
    .map(
      (l) => `<tr>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;font-size:11px">${l.name}</td>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;text-align:center;font-size:11px">${l.qty}</td>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;text-align:right;font-size:11px">$${l.unitPrice.toFixed(2)}</td>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;text-align:right;font-size:11px;font-weight:600">$${l.total.toFixed(2)}</td>
      </tr>`,
    )
    .join('');

  const loyaltyRow =
    order.loyaltyRedeemed > 0
      ? `<tr><td colspan="3" style="padding:3px 4px;font-size:11px;color:#059669">Loyalty discount</td>
           <td style="padding:3px 4px;text-align:right;font-size:11px;color:#059669">-$${order.loyaltyRedeemed.toFixed(2)}</td></tr>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>PlayHub Receipt #${orderId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      color: #111;
      background: #fff;
      padding: 24px 20px;
      max-width: 340px;
      margin: 0 auto;
    }
    h1 { font-size: 20px; font-weight: 900; letter-spacing: 0.12em; text-align: center; }
    .sub  { text-align: center; font-size: 12px; color: #555; }
    .addr { text-align: center; font-size: 10px; color: #888; margin-top: 2px; }
    .dash { border: none; border-top: 1px dashed #aaa; margin: 10px 0; }
    .row  { display: flex; justify-content: space-between; font-size: 11px; margin: 2px 0; }
    .row .label { color: #666; }
    table { width: 100%; border-collapse: collapse; }
    th    { text-align: left; border-bottom: 1px solid #ccc; padding: 4px; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; }
    th:not(:first-child) { text-align: right; }
    .total-row td { font-weight: 900; font-size: 14px; padding: 6px 4px 0; }
    .paid  { color: #059669; font-weight: 700; }
    .footer { text-align: center; margin-top: 14px; font-size: 10px; color: #888; }
    @media print { body { padding: 8px; } @page { margin: 8mm; } }
  </style>
</head>
<body>
  <h1>PLAYHUB</h1>
  <p class="sub">${branchName}</p>
  ${branchAddress ? `<p class="addr">${branchAddress}</p>` : ''}

  <hr class="dash"/>

  <div class="row"><span class="label">Order</span><strong>#${orderId}</strong></div>
  <div class="row"><span class="label">Date</span><span>${date.toLocaleDateString()}</span></div>
  <div class="row"><span class="label">Time</span><span>${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
  ${cashierName ? `<div class="row"><span class="label">Cashier</span><span>${cashierName}</span></div>` : ''}

  <hr class="dash"/>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr><td colspan="3" style="padding:3px 4px;font-size:11px;color:#555">Subtotal</td>
          <td style="padding:3px 4px;text-align:right;font-size:11px">$${order.subtotal.toFixed(2)}</td></tr>
      ${loyaltyRow}
      <tr><td colspan="3" style="padding:3px 4px;font-size:11px;color:#555">Tax</td>
          <td style="padding:3px 4px;text-align:right;font-size:11px">$${order.taxAmount.toFixed(2)}</td></tr>
      <tr class="total-row">
        <td colspan="3">TOTAL</td>
        <td style="text-align:right">$${order.total.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <hr class="dash"/>

  <div class="row">
    <span class="label">Payment</span>
    <span class="paid">${order.paymentStatus === 'completed' ? '✓ Paid' : order.paymentStatus}</span>
  </div>

  <div class="footer">
    <p>Thank you for playing!</p>
    <p>Come back soon ✦</p>
  </div>

  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function InvoiceModal({
  order, branchName, branchAddress = '', cashierName, onClose,
}: InvoiceModalProps) {
  if (!order) return null;

  const orderId = (order._id ?? '').slice(-8).toUpperCase() || 'N/A';
  const date    = order.createdAt ? new Date(order.createdAt) : new Date();

  function handlePrint() {
    if (!order) return;
    const html = buildPrintHTML(order, branchName, branchAddress, cashierName);
    const w = window.open('', '_blank', 'width=420,height=650,scrollbars=yes');
    if (!w) { alert('Please allow pop-ups to print receipts.'); return; }
    w.document.write(html);
    w.document.close();
  }

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[300] cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Invoice panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Receipt"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 440, damping: 36 }}
            className="fixed z-[301] inset-x-3 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 top-6 w-auto sm:w-[400px] max-h-[92dvh] overflow-y-auto"
          >
            <div className="glass-card glass-card-violet flex flex-col gap-0" style={{ padding: 0 }}>
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <Receipt size={18} style={{ color: 'var(--color-violet-light)' }} />
                  <h2
                    className="text-base font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                  >
                    Order #{orderId}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer"
                  aria-label="Close receipt"
                >
                  <X size={15} style={{ color: 'var(--color-text-muted)' }} />
                </button>
              </div>

              {/* ── Receipt body — white thermal-paper look ── */}
              <div
                className="mx-4 my-4 rounded-[var(--radius-md)] p-5 overflow-hidden font-mono text-xs"
                style={{ background: '#fff', color: '#111', boxShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              >
                {/* Store */}
                <div className="text-center mb-3">
                  <p className="text-lg font-black tracking-widest">PLAYHUB</p>
                  <p className="text-sm font-semibold">{branchName}</p>
                  {branchAddress && (
                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>{branchAddress}</p>
                  )}
                </div>
                <div className="border-t border-dashed border-gray-300 my-2" />

                {/* Meta */}
                <div className="flex flex-col gap-0.5 text-xs mb-2">
                  {[
                    { label: 'Order',   value: `#${orderId}` },
                    { label: 'Date',    value: date.toLocaleDateString() },
                    { label: 'Time',    value: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    ...(cashierName ? [{ label: 'Cashier', value: cashierName }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span style={{ color: '#777' }}>{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-gray-300 my-2" />

                {/* Lines */}
                <table className="w-full text-xs mb-2" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                      {['Item', 'Qty', 'Total'].map((h, i) => (
                        <th
                          key={h}
                          className="py-1 font-semibold text-xs uppercase tracking-wide"
                          style={{ color: '#555', textAlign: i === 0 ? 'left' : 'right' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {order.lines.map((line, i) => (
                      <tr key={i}>
                        <td className="py-1 pr-2 text-xs">{line.name}</td>
                        <td className="py-1 text-right text-xs">{line.qty}</td>
                        <td className="py-1 text-right text-xs font-medium">${line.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-dashed border-gray-300 my-2" />

                {/* Totals */}
                {[
                  { label: 'Subtotal',         value: `$${order.subtotal.toFixed(2)}`,        color: '#555'    },
                  ...(order.loyaltyRedeemed > 0
                    ? [{ label: 'Loyalty',        value: `-$${order.loyaltyRedeemed.toFixed(2)}`, color: '#059669' }]
                    : []),
                  { label: 'Tax',              value: `$${order.taxAmount.toFixed(2)}`,       color: '#555'    },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between text-xs mb-0.5">
                    <span style={{ color }}>{label}</span>
                    <span style={{ color }}>{value}</span>
                  </div>
                ))}
                <div className="border-t border-gray-400 my-2" />
                <div className="flex justify-between font-black text-sm">
                  <span>TOTAL</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2" />
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#777' }}>Payment</span>
                  <span
                    className="font-bold"
                    style={{ color: order.paymentStatus === 'completed' ? '#059669' : '#d97706' }}
                  >
                    {order.paymentStatus === 'completed' ? '✓ Paid' : order.paymentStatus}
                  </span>
                </div>

                {/* Footer */}
                <div className="text-center mt-3 text-xs" style={{ color: '#aaa' }}>
                  <p>Thank you for playing!</p>
                  <p>Come back soon ✦</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 px-4 pb-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handlePrint}
                >
                  <Printer size={16} />
                  Print receipt
                </Button>
                <Button variant="secondary" size="lg" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
