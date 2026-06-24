import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const base = cn(
    'inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-[var(--color-border)] select-none overflow-hidden',
    sizeMap[size],
    className
  );

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={cn(base, 'object-cover')} />
    );
  }

  return (
    <span
      className={cn(base, 'bg-[var(--color-violet-glow)] text-[var(--color-violet-light)]')}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
