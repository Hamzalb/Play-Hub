import { cn } from '@/lib/utils';

interface SkeletonProps { className?: string; }

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-[var(--radius-md)] animate-pulse', className)}
      style={{ background: 'rgba(255,255,255,0.05)' }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card', className)}>
      <Skeleton className="h-3 w-1/4 mb-4" />
      <Skeleton className="h-9 w-1/2 mb-3" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

export function SkeletonRow({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-[var(--radius-md)]', className)}>
      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
