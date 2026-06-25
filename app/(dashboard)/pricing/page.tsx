'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface PricingRule {
  _id: string;
  name: string;
  multiplier: number;
  daysOfWeek: number[];
  timeWindows: Array<{ startHour: number; startMinute: number; endHour: number; endMinute: number }>;
  isHoliday: boolean;
  isActive: boolean;
  priority: number;
}

export default function PricingPage() {
  return (
    <ProtectedRoute roles={['super_admin', 'branch_manager']}>
      <PricingContent />
    </ProtectedRoute>
  );
}

function PricingContent() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    multiplier: '1.5',
    daysOfWeek: [] as number[],
    startHour: '18',
    endHour: '22',
    isHoliday: false,
    priority: '0',
  });

  async function loadRules() {
    setLoading(true);
    const res = await api.get<PricingRule[]>('/pricing/rules');
    if (res.status === 'success') {
      setRules((res as ApiSuccess<PricingRule[]>).data);
    }
    setLoading(false);
  }

  useEffect(() => { loadRules(); }, []);

  function toggleDay(d: number) {
    setForm((f) => ({
      ...f,
      daysOfWeek: f.daysOfWeek.includes(d) ? f.daysOfWeek.filter((x) => x !== d) : [...f.daysOfWeek, d],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const dto = {
      name: form.name,
      multiplier: parseFloat(form.multiplier),
      daysOfWeek: form.daysOfWeek,
      timeWindows: form.startHour !== '' ? [{
        startHour: parseInt(form.startHour),
        startMinute: 0,
        endHour: parseInt(form.endHour),
        endMinute: 0,
      }] : [],
      isHoliday: form.isHoliday,
      priority: parseInt(form.priority),
    };
    await api.post('/pricing/rules', dto);
    setShowForm(false);
    setForm({ name: '', multiplier: '1.5', daysOfWeek: [], startHour: '18', endHour: '22', isHoliday: false, priority: '0' });
    loadRules();
  }

  async function toggleActive(rule: PricingRule) {
    await api.patch(`/pricing/rules/${rule._id}`, { isActive: !rule.isActive });
    loadRules();
  }

  async function deleteRule(id: string) {
    await api.delete(`/pricing/rules/${id}`);
    loadRules();
  }

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Pricing Rules</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Peak / off-peak multipliers applied at checkout</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Rule'}
        </Button>
      </div>

      <BentoGrid>
        {/* ── New rule form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="col-span-12"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <BentoCard col={12} glow="violet">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  Create Pricing Rule
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="col-span-2">
                    <Input
                      label="Rule name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Weekend Peak"
                      required
                    />
                  </div>
                  <Input
                    label="Multiplier (e.g. 1.5)"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={form.multiplier}
                    onChange={(e) => setForm((f) => ({ ...f, multiplier: e.target.value }))}
                  />
                  <Input
                    label="Priority"
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    hint="Higher = takes precedence"
                  />

                  <div className="col-span-2">
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Days of week</p>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleDay(i)}
                          className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                          style={{
                            background: form.daysOfWeek.includes(i) ? 'var(--color-violet-glow)' : 'var(--color-bg-subtle)',
                            color: form.daysOfWeek.includes(i) ? 'var(--color-violet-light)' : 'var(--color-text-muted)',
                            borderColor: form.daysOfWeek.includes(i) ? 'var(--color-violet)' : 'var(--color-border)',
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Start hour (24h)"
                    type="number"
                    min="0" max="23"
                    value={form.startHour}
                    onChange={(e) => setForm((f) => ({ ...f, startHour: e.target.value }))}
                  />
                  <Input
                    label="End hour (24h)"
                    type="number"
                    min="0" max="23"
                    value={form.endHour}
                    onChange={(e) => setForm((f) => ({ ...f, endHour: e.target.value }))}
                  />

                  <div className="col-span-4 flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isHoliday}
                        onChange={(e) => setForm((f) => ({ ...f, isHoliday: e.target.checked }))}
                        className="h-4 w-4 accent-violet-500"
                      />
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Holiday override (highest priority)</span>
                    </label>
                    <Button type="submit" variant="primary">Create Rule</Button>
                  </div>
                </form>
              </BentoCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Rules list ── */}
        {loading ? (
          <BentoCard col={12}>
            <p style={{ color: 'var(--color-text-muted)' }}>Loading rules…</p>
          </BentoCard>
        ) : rules.length === 0 ? (
          <BentoCard col={12}>
            <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              No pricing rules yet. Create one to add peak/off-peak pricing.
            </p>
          </BentoCard>
        ) : rules.map((rule) => (
          <BentoCard key={rule._id} col={6}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{rule.name}</h3>
                  {rule.isHoliday && <Badge variant="danger">Holiday</Badge>}
                  <Badge variant={rule.isActive ? 'success' : 'muted'}>{rule.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-2xl font-bold mb-2" style={{ color: 'var(--color-cyan-light)' }}>
                  ×{rule.multiplier}
                </p>
                {rule.daysOfWeek.length > 0 && (
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Days: {rule.daysOfWeek.map((d) => DAYS[d]).join(', ')}
                  </p>
                )}
                {rule.timeWindows.map((w, i) => (
                  <p key={i} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Time: {w.startHour.toString().padStart(2, '0')}:00 – {w.endHour.toString().padStart(2, '0')}:00
                  </p>
                ))}
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Priority: {rule.priority}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={() => toggleActive(rule)}>
                  {rule.isActive ? 'Disable' : 'Enable'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteRule(rule._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </BentoCard>
        ))}
      </BentoGrid>
    </main>
  );
}
