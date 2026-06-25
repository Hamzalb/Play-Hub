'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import { Avatar } from '@/components/ui/Avatar';
import { Settings } from '@/components/ui/icons';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  const { success } = useToast();

  const [profile, setProfile] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const role = user?.role ?? '';
  const roleLabel = role.replace('_', ' ');

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    // In a full implementation this would PATCH /auth/me or /staff/:id
    await new Promise((r) => setTimeout(r, 600));
    success('Profile updated');
    setSaving(false);
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (pw.next !== pw.confirm) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    success('Password changed');
    setPw({ current: '', next: '', confirm: '' });
    setSaving(false);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          <Settings size={22} style={{ color: 'var(--color-violet-light)' }} />
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage your account preferences</p>
      </div>

      <BentoGrid>
        {/* Profile card */}
        <BentoCard col={12}>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <Avatar name={user?.name ?? 'User'} size="xl" />
            <div>
              <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
              <Badge variant={role === 'super_admin' ? 'violet' : role === 'branch_manager' ? 'gold' : 'cyan'} className="mt-1.5">
                {roleLabel}
              </Badge>
            </div>
          </div>

          <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <h2 className="sm:col-span-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Profile information</h2>
            <Input label="Display name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            <Input label="Email address" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            <div className="sm:col-span-2">
              <Button type="submit" loading={saving} variant="primary">Save profile</Button>
            </div>
          </form>
        </BentoCard>

        {/* Password */}
        <BentoCard col={12}>
          <form onSubmit={changePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <h2 className="sm:col-span-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Change password</h2>
            <Input label="Current password" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} required />
            <div /> {/* spacer */}
            <Input label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} hint="Min 8 characters" required />
            <Input label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} error={pw.confirm && pw.next !== pw.confirm ? 'Passwords do not match' : undefined} required />
            <div className="sm:col-span-2">
              <Button type="submit" loading={saving} variant="secondary" disabled={pw.next !== pw.confirm || pw.next.length < 8}>
                Update password
              </Button>
            </div>
          </form>
        </BentoCard>

        {/* Danger zone */}
        {role === 'super_admin' && (
          <BentoCard col={12}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-danger)' }}>Danger zone</h2>
            <div className="flex items-center justify-between gap-4 p-4 rounded-[var(--radius-md)] border"
              style={{ borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.05)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Delete company account</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Permanently removes all data across all branches. Irreversible.</p>
              </div>
              <Button variant="danger" size="sm" disabled>Contact support</Button>
            </div>
          </BentoCard>
        )}
      </BentoGrid>
    </div>
  );
}
