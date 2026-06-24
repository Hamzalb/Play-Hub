'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[var(--color-violet)] text-white hover:bg-[var(--color-violet-light)] hover:text-[var(--color-bg-base)] shadow-[var(--shadow-glow-violet)]',
  secondary:
    'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-violet)] hover:text-[var(--color-violet-light)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:opacity-90',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-[var(--radius-sm)]',
  md: 'h-10 px-4 text-sm rounded-[var(--radius-md)]',
  lg: 'h-12 px-6 text-base rounded-[var(--radius-lg)]',
};

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150',
        'disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-violet-light)]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size={size === 'lg' ? 'md' : 'sm'} />}
      {children}
    </motion.button>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

type SpinnerSize = 'sm' | 'md' | 'lg';

const spinnerSizeMap: Record<SpinnerSize, string> = {
  sm: 'h-3.5 w-3.5 border-[1.5px]',
  md: 'h-5 w-5 border-2',
  lg: 'h-7 w-7 border-[2.5px]',
};

export function Spinner({ size = 'md', className }: { size?: SpinnerSize; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-[var(--color-border-strong)] border-t-[var(--color-violet-light)]',
        spinnerSizeMap[size],
        className
      )}
    />
  );
}
