'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@/components/common/Spinner';
import { reportsService } from '@/modules/reports/services/reportsService';
import { storage } from '@/utils/storage';
import { formatCurrency } from '@/utils/formatters';

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const to = now.toISOString().split('T')[0];
  return { from, to };
}

const QUICK_RANGES = [
  { label: 'Este mês', getRange: () => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    };
  }},
  { label: 'Mês anterior', getRange: () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: first.toISOString().split('T')[0], to: last.toISOString().split('T')[0] };
  }},
  { label: 'Últimos 3 meses', getRange: () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
    return { from, to: now.toISOString().split('T')[0] };
  }},
  { label: 'Este ano', getRange: () => {
    const now = new Date();
    return {
      from: `${now.getFullYear()}-01-01`,
      to: now.toISOString().split('T')[0],
    };
  }},
];

const inputCls =
  'rounded-lg border border-ocean-outline-variant/40 px-2.5 py-1.5 text-xs bg-transparent text-ocean-on-surface focus:outline-none focus:ring-2 focus:ring-ocean-accent';

function bar(pct: number, color: string) {
  return (
    <div className="h-1.5 bg-ocean-surface-container rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

export function ProfessionalStatsPanel(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [range, setRange] = useState(defaultRange);
  const [activeQuick, setActiveQuick] = useState('Este mês');

  const { data: fin, isLoading: loadingFin } = useSWR(
    ['prof-financial', businessId, range.from, range.to],
    () => reportsService.financial(businessId, { from: range.from, to: range.to }),
  );

  const { data: appts, isLoading: loadingAppts } = useSWR(
    ['prof-appts', businessId, range.from, range.to],
    () => reportsService.appointments(businessId, { from: range.from, to: range.to }),
  );

  const isLoading = loadingFin || loadingAppts;

  const merged = (appts?.byProfessional ?? []).map((row) => {
    const finRow = fin?.byProfessional.find((f) => f.professional.id === row.professional.id);
    return {
      ...row,
      revenue: finRow?.revenue ?? 0,
      commission: finRow?.commission ?? 0,
    };
  });
  merged.sort((a, b) => b.totalCompleted - a.totalCompleted);

  const maxOccupancy = merged.length > 0 ? Math.max(...merged.map((r) => r.occupancyRate)) : 1;

  const totalCompleted = merged.reduce((s, r) => s + r.totalCompleted, 0);
  const totalRevenue = fin?.totalRevenue ?? 0;
  const avgTicket = totalCompleted > 0 ? totalRevenue / totalCompleted : 0;
  const avgOccupancy =
    merged.length > 0
      ? merged.reduce((s, r) => s + r.occupancyRate, 0) / merged.length
      : 0;

  function applyQuick(label: string, getRange: () => { from: string; to: string }) {
    setActiveQuick(label);
    setRange(getRange());
  }

  const bigNumbers = [
    {
      label: 'Receita no período',
      value: isLoading ? '—' : formatCurrency(totalRevenue),
      iconBg: 'rgba(34,197,94,0.12)',
      iconColor: '#16a34a',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Atendimentos concluídos',
      value: isLoading ? '—' : totalCompleted,
      iconBg: 'rgba(14,165,233,0.12)',
      iconColor: '#0284c7',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Ticket médio',
      value: isLoading ? '—' : formatCurrency(avgTicket),
      iconBg: 'rgba(139,92,246,0.12)',
      iconColor: '#7c3aed',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      label: 'Ocupação média',
      value: isLoading ? '—' : `${avgOccupancy.toFixed(0)}%`,
      iconBg: 'rgba(245,158,11,0.12)',
      iconColor: '#d97706',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Period filter */}
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_RANGES.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => applyQuick(q.label, q.getRange)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeQuick === q.label
                ? 'bg-ocean-primary text-white border-ocean-primary'
                : 'bg-white text-ocean-secondary border-gray-200 hover:border-ocean-primary/40'
            }`}
          >
            {q.label}
          </button>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <input
            type="date"
            value={range.from}
            onChange={(e) => { setRange((r) => ({ ...r, from: e.target.value })); setActiveQuick(''); }}
            className={inputCls}
          />
          <span className="text-xs text-ocean-outline">até</span>
          <input
            type="date"
            value={range.to}
            onChange={(e) => { setRange((r) => ({ ...r, to: e.target.value })); setActiveQuick(''); }}
            className={inputCls}
          />
        </div>
      </div>

      {/* Big numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {bigNumbers.map((s) => (
          <div
            key={s.label}
            className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col gap-2"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: s.iconBg, color: s.iconColor }}
            >
              {s.icon}
            </div>
            <p className="text-xs font-medium text-ocean-on-surface-variant leading-tight">
              {s.label}
            </p>
            <p className="text-2xl font-bold text-ocean-on-surface leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per-professional breakdown */}
      {isLoading ? (
        <div className="py-6"><Spinner /></div>
      ) : merged.length === 0 ? null : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ocean-outline-variant/25">
            <h3 className="text-sm font-semibold text-ocean-on-surface">Desempenho por profissional</h3>
          </div>

          <div className="divide-y divide-ocean-outline-variant/15">
            {merged.map((row) => (
              <div key={row.professional.id} className="px-5 py-4 space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-ocean-on-surface">{row.professional.name}</p>
                  <span className="text-sm font-bold text-ocean-primary shrink-0">
                    {formatCurrency(row.revenue)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-xs text-ocean-secondary">Agend.</p>
                    <p className="text-sm font-bold text-ocean-on-surface">{row.totalScheduled}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ocean-secondary">Concluídos</p>
                    <p className="text-sm font-bold text-green-600">{row.totalCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ocean-secondary">Cancelados</p>
                    <p className="text-sm font-bold text-red-500">{row.totalCancelled}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ocean-secondary">Comissão</p>
                    <p className="text-sm font-bold text-ocean-tertiary">{formatCurrency(row.commission)}</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-ocean-secondary">Ocupação</span>
                    <span className="font-semibold text-ocean-on-surface">
                      {row.occupancyRate.toFixed(0)}%
                    </span>
                  </div>
                  {bar((row.occupancyRate / Math.max(maxOccupancy, 1)) * 100, 'bg-ocean-accent')}
                </div>
              </div>
            ))}
          </div>

          {appts && appts.topServices.length > 0 && (
            <div className="px-5 py-4 border-t border-ocean-outline-variant/25">
              <p className="text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-2">
                Serviços mais agendados no período
              </p>
              <div className="flex flex-wrap gap-2">
                {appts.topServices.slice(0, 6).map((s) => (
                  <span
                    key={s.service.id}
                    className="text-xs bg-ocean-primary/10 text-ocean-primary rounded-full px-3 py-1 font-medium"
                  >
                    {s.service.name} ({s.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
