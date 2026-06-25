'use client';

import { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error:   (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastType, { border: string; icon: string; iconBg: string }> = {
  success: { border: 'rgba(52,211,153,0.3)', icon: 'var(--color-success)', iconBg: 'rgba(52,211,153,0.12)' },
  error:   { border: 'rgba(248,113,113,0.3)', icon: 'var(--color-danger)',  iconBg: 'rgba(248,113,113,0.12)' },
  warning: { border: 'rgba(251,191,36,0.3)',  icon: 'var(--color-warning)', iconBg: 'rgba(251,191,36,0.12)' },
  info:    { border: 'rgba(96,165,250,0.3)',  icon: 'var(--color-info)',    iconBg: 'rgba(96,165,250,0.12)' },
};

type IconCmp = React.FC<{ size?: number; className?: string; style?: React.CSSProperties }>;
const ToastIcon: Record<ToastType, IconCmp> = {
  success: (p) => <Check {...p} />,
  error:   (p) => <AlertCircle {...p} />,
  warning: (p) => <AlertCircle {...p} />,
  info:    (p) => <Info {...p} />,
};

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const style = toastStyles[item.type];
  const Icon = ToastIcon[item.type];

  useEffect(() => {
    const t = setTimeout(() => onRemove(item.id), 4200);
    return () => clearTimeout(t);
  }, [item.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 min-w-[280px] max-w-sm rounded-[var(--radius-lg)] px-4 py-3.5"
      style={{
        background: 'rgba(7,9,15,0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${style.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <div
        className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
        style={{ background: style.iconBg }}
      >
        <Icon size={16} className={cn('flex-shrink-0')} style={{ color: style.icon } as React.CSSProperties} />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        {item.title && (
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
            {item.title}
          </p>
        )}
        <p className="text-sm leading-snug" style={{ color: item.title ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
          {item.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center transition-colors hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X size={14} style={{ color: 'var(--color-text-muted)' }} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = `toast-${++idRef.current}`;
    setToasts((prev) => {
      const next = [...prev, { id, type, message, title }];
      return next.slice(-5); // max 5 toasts
    });
  }, []);

  const ctx: ToastContextValue = {
    toast:   (m, t, title) => add(m, t ?? 'info', title),
    success: (m, title) => add(m, 'success', title),
    error:   (m, title) => add(m, 'error', title),
    warning: (m, title) => add(m, 'warning', title),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem item={t} onRemove={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
