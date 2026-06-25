'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from '@/components/ui/icons';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open, title, message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm, onCancel, loading = false,
}: ConfirmDialogProps) {
  // Focus the cancel button when opened (safer default for destructive dialogs)
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const cancel = dialog?.querySelector<HTMLButtonElement>('[data-cancel]');
        cancel?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Dismiss on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-sm"
          >
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              {/* Icon + title */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="flex-shrink-0 h-10 w-10 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{
                    background: destructive ? 'rgba(248,113,113,0.12)' : 'rgba(139,92,246,0.12)',
                  }}
                  aria-hidden="true"
                >
                  <AlertCircle
                    size={20}
                    style={{ color: destructive ? 'var(--color-danger)' : 'var(--color-violet-light)' }}
                  />
                </div>
                <div>
                  <h2
                    id="confirm-title"
                    className="text-base font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                  >
                    {title}
                  </h2>
                  <p
                    id="confirm-message"
                    className="text-sm mt-1 leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-6">
                <Button
                  data-cancel
                  variant="secondary"
                  size="sm"
                  onClick={onCancel}
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={destructive ? 'danger' : 'primary'}
                  size="sm"
                  loading={loading}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
