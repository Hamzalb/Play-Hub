import { cn } from '@/lib/utils';

type BadgeVariant = 'violet' | 'cyan' | 'lime' | 'success' | 'warning' | 'danger' | 'muted';

const variantMap: Record<BadgeVariant, string> = {
  violet:  'bg-[var(--color-violet-glow)] text-[var(--color-violet-light)] border-[var(--color-violet)]',
  cyan:    'bg-[var(--color-cyan-glow)]   text-[var(--color-cyan-light)]   border-[var(--color-cyan)]',
  lime:    'bg-[var(--color-lime-glow)]   text-[var(--color-lime-light)]   border-[var(--color-lime)]',
  success: 'bg-[#22c55e20] text-[var(--color-success)] border-[var(--color-success)]',
  warning: 'bg-[#f59e0b20] text-[var(--color-warning)] border-[var(--color-warning)]',
  danger:  'bg-[#ef444420] text-[var(--color-danger)]  border-[var(--color-danger)]',
  muted:   'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
