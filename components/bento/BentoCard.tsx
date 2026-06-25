'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type RowSpan = 1 | 2 | 3;
type Accent = 'violet' | 'gold' | 'cyan' | 'none';

interface BentoCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  col?: ColSpan;
  row?: RowSpan;
  glow?: Accent;
  accent?: Accent;
  className?: string;
}

const glowClass: Record<Accent, string> = {
  violet: 'glow-violet glass-card-violet',
  gold:   'glow-gold glass-card-gold',
  cyan:   'glow-cyan glass-card-cyan',
  none:   '',
};

export function BentoCard({
  children, col = 4, row = 1, glow = 'none', accent, className, ...props
}: BentoCardProps) {
  const resolvedAccent = glow !== 'none' ? glow : (accent ?? 'none');

  return (
    <motion.div
      className={cn(
        'glass-card',
        `col-span-${col}`,
        `row-span-${row}`,
        resolvedAccent !== 'none' && glowClass[resolvedAccent],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
