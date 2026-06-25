import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'violet' | 'gold' | 'cyan'
  | 'success' | 'warning' | 'danger'
  | 'muted' | 'outline';

const variantMap: Record<BadgeVariant, string> = {
  violet:  'bg-[var(--color-violet-dim)]  text-[var(--color-violet-light)] border-[rgba(139,92,246,0.3)]',
  gold:    'bg-[var(--color-gold-dim)]    text-[var(--color-gold-light)]   border-[rgba(245,158,11,0.3)]',
  cyan:    'bg-[var(--color-cyan-dim)]    text-[var(--color-cyan-light)]   border-[rgba(6,182,212,0.3)]',
  success: 'bg-[rgba(52,211,153,0.12)]    text-[var(--color-success)]      border-[rgba(52,211,153,0.3)]',
  warning: 'bg-[rgba(251,191,36,0.12)]    text-[var(--color-warning)]      border-[rgba(251,191,36,0.3)]',
  danger:  'bg-[rgba(248,113,113,0.12)]   text-[var(--color-danger)]       border-[rgba(248,113,113,0.3)]',
  muted:   'bg-[rgba(255,255,255,0.05)]   text-[var(--color-text-muted)]   border-[var(--color-border)]',
  outline: 'bg-transparent               text-[var(--color-text-secondary)] border-[var(--color-border)]',
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
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'text-xs font-medium tracking-wide whitespace-nowrap',
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
