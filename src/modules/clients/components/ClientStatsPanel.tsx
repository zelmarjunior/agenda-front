'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@/components/common/Spinner';
import { reportsService } from '@/modules/reports/services/reportsService';
import { storage } from '@/utils/storage';
import { formatCurrency } from '@/utils/formatters';

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
  const to = now.toISOString().split('T')[0];
  return { from, to };
}

const inputCls =
  'rounded-lg border border-ocean-outline-variant/40 px-2.5 py-1.5 text-xs bg-transparent text-ocean-on-surface focus:outline-none focus:ring-2 focus:ring-ocean-accent';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

function StatCard({ label, value, sub, color = 'text-ocean-on-surface' }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-1">
      <p className="text-[11px] text-ocean-secondary font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold leading-none ${color}`}>{value}</p>
      {sub && <p className="text-xs text-ocean-outline mt-0.5">{sub}</p>}
    </div>
  );
}

export function ClientStatsPanel(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [range, setRange] = useState(defaultRange);

  const { data, isLoading } = useSWR(
    ['client-stats', businessId, range.from, range.to],
    () => reportsService.clientStats(businessId, { from: range.from, to: range.to }),
  );

  return (
    <div className="space-y-5 mb-6">
      {/* Period picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ocean-secondary font-medium">Período:</span>
        <input
          type="date"
          value={range.from}
          onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
          className={inputCls}
        />
        <span className="text-xs text-ocean-outline">até</span>
        <input
          type="date"
          value={range.to}
          onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
          className={inputCls}
        />
      </div>

      {isLoading ? (
        <div className="py-6"><Spinner /></div>
      ) : !data ? null : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Clientes ativos" value={data.summary.totalActiveClients} />
            <StatCard
              label="Atendimentos"
              value={data.summary.totalCompleted}
              sub="concluídos no período"
            />
            <StatCard
              label="Faltas"
              value={data.summary.totalNoShows}
              color={data.summary.totalNoShows > 0 ? 'text-red-500' : 'text-ocean-on-surface'}
            />
            <StatCard
              label="Taxa de falta"
              value={`${data.summary.noShowRate}%`}
              sub="das confirmações"
              color={data.summary.noShowRate >= 20 ? 'text-red-500' : data.summary.noShowRate >= 10 ? 'text-amber-500' : 'text-ocean-on-surface'}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Most frequent */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-ocean-on-surface flex items-center gap-1.5">
                <span className="text-ocean-primary">⭐</span> Mais frequentes
              </h3>
              {data.mostFrequent.length === 0 ? (
                <p className="text-xs text-ocean-outline">Sem dados no período.</p>
              ) : (
                <ol className="space-y-2">
                  {data.mostFrequent.slice(0, 7).map((c, i) => (
                    <li key={c.clientId} className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-bold text-ocean-outline w-4 shrink-0 text-center">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ocean-on-surface truncate">{c.name}</p>
                        <p className="text-[11px] text-ocean-secondary">
                          {c.totalCompleted} visita{c.totalCompleted !== 1 ? 's' : ''} · {formatCurrency(c.totalSpent)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Most no-shows */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-ocean-on-surface flex items-center gap-1.5">
                <span className="text-red-400">✗</span> Mais faltas
              </h3>
              {data.mostNoShows.length === 0 ? (
                <p className="text-xs text-ocean-outline">Nenhuma falta registrada.</p>
              ) : (
                <ol className="space-y-2">
                  {data.mostNoShows.slice(0, 7).map((c, i) => (
                    <li key={c.clientId} className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-bold text-ocean-outline w-4 shrink-0 text-center">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ocean-on-surface truncate">{c.name}</p>
                        <p className="text-[11px] text-red-400">
                          {c.noShowCount} falta{c.noShowCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* No-show reasons */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-ocean-on-surface flex items-center gap-1.5">
                <span className="text-amber-400">!</span> Principais motivos de falta
              </h3>
              {data.noShowReasons.length === 0 ? (
                <p className="text-xs text-ocean-outline">Sem motivos registrados.</p>
              ) : (
                <div className="space-y-2">
                  {data.noShowReasons.map((r, i) => {
                    const total = data.noShowReasons.reduce((s, x) => s + x.count, 0);
                    const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
                    return (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-ocean-on-surface truncate max-w-[75%]">{r.reason}</p>
                          <span className="text-[11px] font-semibold text-ocean-secondary">{r.count}×</span>
                        </div>
                        <div className="h-1.5 bg-ocean-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
