'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { financialService } from '@/modules/financial/financialService';
import { storage } from '@/utils/storage';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import { formatCurrency } from '@/utils/formatters';
import type { CreateFixedCostRequest, CreateVariableCostRequest } from '@/types/financial.types';

type Period = 'today' | 'week' | 'month' | 'last_month';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Hoje',
  week: 'Esta semana',
  month: 'Este mês',
  last_month: 'Mês anterior',
};

function getPeriodRange(period: Period): { from: string; to: string } {
  const now = new Date();
  const toStr = (d: Date) => d.toISOString().split('T')[0];

  if (period === 'today') {
    const s = toStr(now);
    return { from: s, to: s };
  }
  if (period === 'week') {
    const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return { from: toStr(mon), to: toStr(sun) };
  }
  if (period === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: toStr(from), to: toStr(to) };
  }
  // last_month
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 0);
  return { from: toStr(from), to: toStr(to) };
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500';

export function FinancialContent(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [period, setPeriod] = useState<Period>('month');
  const { from, to } = useMemo(() => getPeriodRange(period), [period]);

  // Data fetching
  const { data: cashflow, isLoading: loadingCash, mutate: mutateCash } = useSWR(
    ['cashflow', businessId, from, to],
    () => financialService.getCashflow(businessId, from, to),
  );
  const { data: summary } = useSWR(
    ['summary', businessId, from, to],
    () => financialService.getSummary(businessId, from, to),
  );
  const { data: fixedCosts, mutate: mutateFixed } = useSWR(
    ['fixed-costs', businessId],
    () => financialService.listFixedCosts(businessId),
  );
  const { data: varCosts, mutate: mutateVar } = useSWR(
    ['var-costs', businessId, from, to],
    () => financialService.listVariableCosts(businessId, from, to),
  );

  // Fixed cost form
  const [newFixed, setNewFixed] = useState<CreateFixedCostRequest>({
    name: '', amount: 0, recurrence: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0], category: 'outros',
  });
  const [savingFixed, setSavingFixed] = useState(false);

  async function handleCreateFixed(): Promise<void> {
    if (!newFixed.name || !newFixed.amount) return;
    setSavingFixed(true);
    try {
      await financialService.createFixedCost(businessId, newFixed);
      mutateFixed();
      setNewFixed({ name: '', amount: 0, recurrence: 'MONTHLY', startDate: new Date().toISOString().split('T')[0], category: 'outros' });
      toast('Custo fixo cadastrado!', 'success');
    } catch (err) { toast(getApiError(err), 'error'); }
    finally { setSavingFixed(false); }
  }

  async function handleDeleteFixed(id: string): Promise<void> {
    try {
      await financialService.deleteFixedCost(businessId, id);
      mutateFixed();
      toast('Custo fixo removido.', 'success');
    } catch (err) { toast(getApiError(err), 'error'); }
  }

  // Variable cost form
  const [newVar, setNewVar] = useState<CreateVariableCostRequest>({
    name: '', amount: 0, date: new Date().toISOString().split('T')[0], category: 'outros',
  });
  const [savingVar, setSavingVar] = useState(false);

  async function handleCreateVar(): Promise<void> {
    if (!newVar.name || !newVar.amount) return;
    setSavingVar(true);
    try {
      await financialService.createVariableCost(businessId, newVar);
      mutateVar();
      setNewVar({ name: '', amount: 0, date: new Date().toISOString().split('T')[0], category: 'outros' });
      toast('Custo variável registrado!', 'success');
    } catch (err) { toast(getApiError(err), 'error'); }
    finally { setSavingVar(false); }
  }

  async function handleDeleteVar(id: string): Promise<void> {
    try {
      await financialService.deleteVariableCost(businessId, id);
      mutateVar();
    } catch (err) { toast(getApiError(err), 'error'); }
  }

  // AI Insights
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const insightsRef = useRef<HTMLDivElement>(null);

  const handleInsights = useCallback(async () => {
    setInsights('');
    setLoadingInsights(true);
    await financialService.streamInsights(
      businessId, 3,
      (token) => { setInsights((prev) => prev + token); insightsRef.current?.scrollTo(0, insightsRef.current.scrollHeight); },
      () => setLoadingInsights(false),
      (err) => { toast(err, 'error'); setLoadingInsights(false); },
    );
  }, [businessId, toast]);

  const cardCls = 'glass-card rounded-2xl p-5';

  return (
    <div>
      <Header
        title="Financeiro"
        actions={
          <div className="flex gap-2">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none ${period === p ? 'bg-ocean-primary text-white' : 'text-ocean-secondary hover:bg-ocean-surface-container hover:text-ocean-on-surface glass-card'}`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        }
      />

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Receita bruta', value: summary?.revenue.gross, color: '#10b981' },
          { label: 'Custos totais', value: summary?.costs.total, color: '#ef4444' },
          { label: 'Lucro líquido', value: summary?.profit.net, color: summary && summary.profit.net >= 0 ? '#0ea5e9' : '#ef4444' },
          { label: 'Margem', value: summary ? `${summary.profit.margin.toFixed(1)}%` : null, color: '#6366f1', raw: true },
        ].map((m) => (
          <div key={m.label} className={`${cardCls} text-center`}>
            <p className="text-xs text-ocean-secondary uppercase tracking-wide mb-1">{m.label}</p>
            <p className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value == null ? '—' : m.raw ? String(m.value) : formatCurrency(Number(m.value))}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ── Caixa do período ──────────────────────────────────────────── */}
        <div className={cardCls}>
          <h2 className="text-sm font-semibold text-ocean-on-surface mb-3">Caixa do período</h2>
          {loadingCash ? <Spinner /> : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Entradas', value: cashflow?.income ?? 0, color: '#10b981' },
                  { label: 'Saídas', value: cashflow?.expense ?? 0, color: '#ef4444' },
                  { label: 'Saldo', value: cashflow?.net ?? 0, color: (cashflow?.net ?? 0) >= 0 ? '#0ea5e9' : '#ef4444' },
                ].map((m) => (
                  <div key={m.label} className="text-center rounded-xl p-2" style={{ background: `${m.color}12` }}>
                    <p className="text-xs text-ocean-secondary">{m.label}</p>
                    <p className="text-sm font-bold" style={{ color: m.color }}>{formatCurrency(m.value)}</p>
                  </div>
                ))}
              </div>

              {/* Breakdown por pagamento */}
              {cashflow && Object.keys(cashflow.byPaymentMethod).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-ocean-secondary mb-2">Por meio de pagamento</p>
                  <div className="space-y-1">
                    {Object.entries(cashflow.byPaymentMethod).map(([method, amount]) => (
                      <div key={method} className="flex items-center justify-between text-xs">
                        <span className="text-ocean-on-surface-variant">{method}</span>
                        <span className="font-semibold text-ocean-on-surface">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last entries */}
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {(cashflow?.entries ?? []).slice(0, 10).map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-xs py-1 border-b border-ocean-outline-variant/10">
                    <span className="text-ocean-on-surface-variant truncate max-w-[60%]">{e.description}</span>
                    <span className={`font-semibold ${e.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                      {e.type === 'INCOME' ? '+' : '-'}{formatCurrency(e.amount)}
                    </span>
                  </div>
                ))}
                {!cashflow?.entries.length && <p className="text-xs text-ocean-secondary text-center py-2">Nenhum lançamento.</p>}
              </div>
            </>
          )}
        </div>

        {/* ── Insights IA ────────────────────────────────────────────────── */}
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ocean-on-surface">Insights IA</h2>
            <Button size="sm" loading={loadingInsights} onClick={handleInsights}>
              {insights ? 'Analisar novamente' : 'Analisar financeiro'}
            </Button>
          </div>
          {insights ? (
            <div ref={insightsRef} className="text-sm text-ocean-on-surface-variant whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
              {insights}
              {loadingInsights && <span className="inline-block w-2 h-4 bg-ocean-primary animate-pulse ml-1 rounded" />}
            </div>
          ) : (
            <p className="text-sm text-ocean-secondary text-center py-8">
              Clique em "Analisar financeiro" para gerar insights baseados nos seus dados.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Custos fixos ────────────────────────────────────────────────── */}
        <div className={cardCls}>
          <h2 className="text-sm font-semibold text-ocean-on-surface mb-3">Custos fixos</h2>

          {/* Form */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input className={inputCls} placeholder="Nome (ex: Aluguel)" value={newFixed.name}
              onChange={(e) => setNewFixed((p) => ({ ...p, name: e.target.value }))} />
            <input className={inputCls} type="number" placeholder="Valor R$" value={newFixed.amount || ''}
              onChange={(e) => setNewFixed((p) => ({ ...p, amount: Number(e.target.value) }))} />
            <select className={inputCls} value={newFixed.recurrence}
              onChange={(e) => setNewFixed((p) => ({ ...p, recurrence: e.target.value as any }))}>
              <option value="MONTHLY">Mensal</option>
              <option value="WEEKLY">Semanal</option>
              <option value="ANNUAL">Anual</option>
            </select>
            <input className={inputCls} type="date" value={newFixed.startDate}
              onChange={(e) => setNewFixed((p) => ({ ...p, startDate: e.target.value }))} />
          </div>
          <Button size="sm" loading={savingFixed} onClick={handleCreateFixed} className="mb-3 w-full">
            + Adicionar custo fixo
          </Button>

          {/* List */}
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {fixedCosts?.map((fc) => (
              <li key={fc.id} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: 'rgba(14,165,233,0.05)' }}>
                <div>
                  <p className="font-medium text-ocean-on-surface">{fc.name}</p>
                  <p className="text-xs text-ocean-secondary">{fc.recurrence === 'MONTHLY' ? 'Mensal' : fc.recurrence === 'WEEKLY' ? 'Semanal' : 'Anual'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ocean-on-surface">{formatCurrency(fc.amount)}</span>
                  <button onClick={() => handleDeleteFixed(fc.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
              </li>
            ))}
            {!fixedCosts?.length && <p className="text-xs text-ocean-secondary text-center py-2">Nenhum custo fixo.</p>}
          </ul>
        </div>

        {/* ── Custos variáveis ────────────────────────────────────────────── */}
        <div className={cardCls}>
          <h2 className="text-sm font-semibold text-ocean-on-surface mb-3">Custos variáveis</h2>

          {/* Form */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input className={inputCls} placeholder="Nome (ex: Compra produtos)" value={newVar.name}
              onChange={(e) => setNewVar((p) => ({ ...p, name: e.target.value }))} />
            <input className={inputCls} type="number" placeholder="Valor R$" value={newVar.amount || ''}
              onChange={(e) => setNewVar((p) => ({ ...p, amount: Number(e.target.value) }))} />
            <input className={inputCls} type="date" value={newVar.date}
              onChange={(e) => setNewVar((p) => ({ ...p, date: e.target.value }))} />
            <input className={inputCls} placeholder="Categoria" value={newVar.category}
              onChange={(e) => setNewVar((p) => ({ ...p, category: e.target.value }))} />
          </div>
          <Button size="sm" loading={savingVar} onClick={handleCreateVar} className="mb-3 w-full">
            + Registrar custo variável
          </Button>

          {/* List */}
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {varCosts?.map((vc) => (
              <li key={vc.id} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: 'rgba(239,68,68,0.05)' }}>
                <div>
                  <p className="font-medium text-ocean-on-surface">{vc.name}</p>
                  <p className="text-xs text-ocean-secondary">{vc.date} · {vc.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-500">{formatCurrency(vc.amount)}</span>
                  <button onClick={() => handleDeleteVar(vc.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
              </li>
            ))}
            {!varCosts?.length && <p className="text-xs text-ocean-secondary text-center py-2">Nenhum custo variável no período.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
