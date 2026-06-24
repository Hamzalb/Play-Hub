import { redirect } from 'next/navigation';

// Root → marketing landing (Phase 2 will build the full landing page)
export default function RootPage() {
  redirect('/home');
}
