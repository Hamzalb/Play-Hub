'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { Member, ApiSuccess } from '@/types';
import { motion } from 'framer-motion';

export default function MembersPage() {
  return <ProtectedRoute><MembersContent /></ProtectedRoute>;
}

function MembersContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    const res = await api.get<Member[]>('/members');
    if (res.status === 'success') setMembers((res as ApiSuccess<Member[]>).data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await api.post('/members', form);
    setShowForm(false);
    setForm({ name: '', email: '', phone: '' });
    load();
    setSaving(false);
  }

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Members</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{members.length} total members</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
            {showForm ? 'Cancel' : '+ Add Member'}
          </Button>
        </div>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="violet">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>New Member</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-3 gap-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <div className="col-span-3"><Button type="submit" loading={saving}>Create Member</Button></div>
            </form>
          </BentoCard>
        )}

        <BentoCard col={12}>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)' }}>
                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Member</th>
                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Email</th>
                    <th className="text-right py-3 px-4 font-semibold uppercase text-xs tracking-widest">Points</th>
                    <th className="text-right py-3 px-4 font-semibold uppercase text-xs tracking-widest">Spent</th>
                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.name} size="sm" />
                          <span style={{ color: 'var(--color-text-primary)' }}>{m.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>{m.email}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="violet">{m.loyaltyPoints} pts</Badge>
                      </td>
                      <td className="py-3 px-4 text-right" style={{ color: 'var(--color-cyan-light)' }}>
                        ${m.totalSpend.toFixed(2)}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(m.memberSince).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
