import { Spinner } from '@/components/ui/Button';

export default function GlobalLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
