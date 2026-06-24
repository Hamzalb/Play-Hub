'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type RowSpan = 1 | 2 | 3;
type Glow = 'violet' | 'cyan' | 'lime' | 'none';

interface BentoCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  col?: ColSpan;
  row?: RowSpan;
  glow?: Glow;
  className?: string;
}

const glowMap: Record<Glow, string> = {
  violet: 'glow-violet',
  cyan:   'glow-cyan',
  lime:   'glow-lime',
  none:   '',
};

export function BentoCard({
  children,
  col = 4,
  row = 1,
  glow = 'none',
  className,
  ...props
}: BentoCardProps) {
  return (
    <motion.div
      className={cn(
        'glass-card',
        `col-span-${col}`,
        `row-span-${row}`,
        glow !== 'none' && glowMap[glow],
        className
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
