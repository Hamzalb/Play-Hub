'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <motion.div
      className={cn('bento-grid', className)}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
