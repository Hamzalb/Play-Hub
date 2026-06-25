'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonTable } from '@/components/ui/SkeletonTable';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Member, ApiSuccess, Pagination as PaginationMeta } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search } from '@/components/ui/icons';

const PAGE_SIZE = 20;

export default function MembersPage() {
  return <ProtectedRoute><MembersContent /></ProtectedRoute>;
}

function MembersContent() {
  const router = useRouter();
  const [members, setMembers]   = useState<Member[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const { success: toastOk, error: toastErr } = useToast();

  const load = useCallback(async (p: number) => {
    setLoading(true);
    const res = await api.get<Member[]>(`/members?page=${p}&limit=${PAGE_SIZE}`);
    if (res.status === 'success') {
      setMembers((res as ApiSuccess<Member[]>).data);
      const meta = (res as ApiSuccess<Member[]> & { pagination?: PaginationMeta }).pagination;
      if (meta) setPagination(meta);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  // Client-side search filters the current page only; reset to page 1 on new search
  useEffect(() => { setPage(1); }, [search]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/members', form);
      if (res.status === 'success') {
        toastOk(`Member "${form.name}" created`);
        setShowForm(false);
        setForm({ name: '', email: '', phone: '' });
        load(1);
        setPage(1);
      } else {
        toastErr((res as { message: string }).message || 'Failed to create member');
      }
    } catch {
      toastErr('Network error — is the backend running?');
    } finally {
      setSaving(false);
    }
  }

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const thead = (
    <thead>
      <tr style={{ color: 'var(--color-text-muted)' }}>
        <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Member</th>
        <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Email</th>
        <th className="text-right py-3 px-4 font-semibold uppercase text-xs tracking-widest">Points</th>
        <th className="text-right py-3 px-4 font-semibold uppercase text-xs tracking-widest">Spent</th>
        <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-widest">Since</th>
      </tr>
    </thead>
  );

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Members</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {pagination ? `${pagination.total} total members` : `${members.length} members`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <Input
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 pl-9"
              aria-label="Search members"
            />
          </div>
          <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
            {showForm ? 'Cancel' : '+ Add Member'}
          </Button>
        </div>
      </div>

      <BentoGrid>
        {showForm && (
          <BentoCard col={12} glow="violet">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>New Member</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <div className="col-span-3"><Button type="submit" loading={saving}>Create Member</Button></div>
            </form>
          </BentoCard>
        )}

        <BentoCard col={12}>
          {loading ? (
            <div className="table-scroll">
              <table className="w-full text-sm" style={{ minWidth: '560px' }}>
                {thead}
                <SkeletonTable rows={PAGE_SIZE} cols={5} />
              </table>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>No members found.</p>
          ) : (
            <>
              <div className="table-scroll">
                <table className="w-full text-sm" style={{ minWidth: '560px' }}>
                  {thead}
                  <tbody>
                    {filtered.map((m) => (
                      <motion.tr
                        key={m._id ?? m.id ?? m.email}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => router.push(`/members/${m._id ?? m.id}`)}
                        className="border-t cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <td className="py-3 px-4">
                          <Link
                            href={`/members/${m._id ?? m.id}`}
                            className="flex items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Avatar name={m.name} size="sm" />
                            <span style={{ color: 'var(--color-text-primary)' }}>{m.name}</span>
                          </Link>
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
              {pagination && (
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              )}
            </>
          )}
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
