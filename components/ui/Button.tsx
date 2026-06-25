'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-violet-mid)] text-white border border-[rgba(167,139,250,0.3)] ' +
    'hover:bg-[var(--color-violet-light)] hover:text-[var(--color-base)] ' +
    'shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(167,139,250,0.5)]',
  secondary:
    'bg-[rgba(255,255,255,0.05)] text-[var(--color-text-primary)] ' +
    'border border-[var(--color-border)] ' +
    'hover:bg-[rgba(255,255,255,0.09)] hover:border-[var(--color-border-hover)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] border border-transparent ' +
    'hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-text-primary)]',
  danger:
    'bg-[rgba(248,113,113,0.12)] text-[var(--color-danger)] ' +
    'border border-[rgba(248,113,113,0.25)] ' +
    'hover:bg-[rgba(248,113,113,0.2)]',
  gold:
    'bg-[var(--color-gold)] text-[var(--color-base)] border border-transparent font-semibold ' +
    'shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:shadow-[0_0_32px_rgba(245,158,11,0.5)] ' +
    'hover:bg-[var(--color-gold-light)]',
};

const sizes: Record<Size, string> = {
  sm:  'h-8  px-3.5 text-xs  rounded-[var(--radius-md)] gap-1.5',
  md:  'h-10 px-5   text-sm  rounded-[var(--radius-lg)] gap-2',
  lg:  'h-12 px-6   text-sm  rounded-[var(--radius-xl)] gap-2.5',
  xl:  'h-14 px-8   text-base rounded-[var(--radius-xl)] gap-3',
};

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
}

export function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled, className, ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-40',
        'cursor-pointer select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size={size === 'xl' || size === 'lg' ? 'md' : 'sm'} />}
      {children}
    </motion.button>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
type SpinnerSize = 'sm' | 'md' | 'lg';
const spinnerSizes: Record<SpinnerSize, string> = {
  sm: 'h-3.5 w-3.5 border-[1.5px]',
  md: 'h-4.5 w-4.5 border-2',
  lg: 'h-6   w-6   border-2',
};

export function Spinner({ size = 'md', className }: { size?: SpinnerSize; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full',
        'border-[rgba(255,255,255,0.2)] border-t-[var(--color-violet-light)]',
        spinnerSizes[size],
        className
      )}
    />
  );
}
