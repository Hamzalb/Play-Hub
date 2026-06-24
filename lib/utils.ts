// Utility: merge Tailwind class names (lightweight — no clsx dep yet)
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
