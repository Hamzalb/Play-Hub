'use client';

import { motion } from 'framer-motion';

interface MiniChartProps {
  /** 6-12 data points */
  data: number[];
  color?: 'violet' | 'gold' | 'cyan' | 'success' | 'danger';
  height?: number;
  className?: string;
}

const colorMap = {
  violet:  { stroke: 'var(--color-violet-light)', fill: 'rgba(139,92,246,0.15)' },
  gold:    { stroke: 'var(--color-gold-light)',   fill: 'rgba(245,158,11,0.15)' },
  cyan:    { stroke: 'var(--color-cyan-light)',   fill: 'rgba(6,182,212,0.15)' },
  success: { stroke: 'var(--color-success)',      fill: 'rgba(52,211,153,0.15)' },
  danger:  { stroke: 'var(--color-danger)',       fill: 'rgba(248,113,113,0.15)' },
};

export function MiniChart({ data, color = 'violet', height = 40, className }: MiniChartProps) {
  if (data.length < 2) return null;

  const w = 100;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data, min + 1);
  const pad = 2;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad;
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${points[points.length - 1]!.x.toFixed(1)},${h} L${points[0]!.x.toFixed(1)},${h} Z`;

  const { stroke, fill } = colorMap[color];

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {/* Area fill */}
      <path d={areaD} fill={fill} />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Last point dot */}
      <circle
        cx={points[points.length - 1]!.x}
        cy={points[points.length - 1]!.y}
        r="2.5"
        fill={stroke}
      />
    </svg>
  );
}
