'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@/components/common/Spinner';
import { reportsService } from '@/modules/reports/services/reportsService';
import { storage } from '@/utils/storage';
import { formatCurrency, formatDuration } from '@/utils/formatters';
import type { ServiceStatItem } from '@/types/reports.types';

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
  const to = now.toISOString().split('T')[0];
  return { from, to };
}

const inputCls =
  'rounded-lg border border-ocean-outline-variant/40 px-2.5 py-1.5 text-xs bg-transparent text-ocean-on-surface focus:outline-none focus:ring-2 focus:ring-ocean-accent';

function StatCard({
  label,
  value,
  sub,
  color = 'text-ocean-on-surface',
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-1">
      <p className="text-[11px] text-ocean-secondary font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold leading-none ${color}`}>{value}</p>
      {sub && <p className="text-xs text-ocean-outline mt-0.5">{sub}</p>}
    </div>
  );
}

function MarginBar({ margin }: { margin: number | null }) {
  if (margin === null) return <span className="text-ocean-outline text-xs">—</span>;
  const color = margin >= 60 ? 'bg-green-500' : margin >= 30 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-ocean-surface-container rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${margin}%` }} />
      </div>
      <span className="text-xs font-semibold text-ocean-secondary w-9 text-right">{margin}%</span>
    </div>
  );
}

type SortKey = 'totalCompleted' | 'totalRevenue' | 'cancellationRate' | 'margin';

export function ServiceStatsPanel(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [range, setRange] = useState(defaultRange);
  const [sort, setSort] = useState<SortKey>('totalCompleted');

  const { data, isLoading } = useSWR(
    ['service-stats', businessId, range.from, range.to],
    () => reportsService.serviceStats(businessId, { from: range.from, to: range.to }),
  );

  const sorted = data
    ? [...data.services].sort((a, b) => {
        if (sort === 'totalCompleted') return b.totalCompleted - a.totalCompleted;
        if (sort === 'totalRevenue') return b.totalRevenue - a.totalRevenue;
        if (sort === 'cancellationRate') return b.cancellationRate - a.cancellationRate;
        if (sort === 'margin') return (b.margin ?? -1) - (a.margin ?? -1);
        return 0;
      })
    : [];

  const maxRevenue = sorted.length > 0 ? Math.max(...sorted.map((s) => s.totalRevenue), 1) : 1;
  const maxCompleted = sorted.length > 0 ? Math.max(...sorted.map((s) => s.totalCompleted), 1) : 1;

  return (
    <div className="space-y-5 mb-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-ocean-secondary">Ordenar:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-ocean-outline-variant/40 px-2.5 py-1.5 text-xs bg-transparent text-ocean-on-surface focus:outline-none"
          >
            <option value="totalCompleted">Mais agendados</option>
            <option value="totalRevenue">Maior receita</option>
            <option value="cancellationRate">Mais cancelamentos</option>
            <option value="margin">Maior margem</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-6"><Spinner /></div>
      ) : !data ? null : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <StatCard label="Serviços" value={data.summary.totalServices} />
            <StatCard
              label="Atendimentos"
              value={data.summary.totalCompleted}
              sub="concluídos no período"
            />
            <StatCard
              label="Receita total"
              value={formatCurrency(data.summary.totalRevenue)}
              color="text-green-600"
            />
            <StatCard
              label="Ticket médio"
              value={formatCurrency(data.summary.avgPrice)}
              sub="preço médio dos serviços"
            />
            {data.summary.avgMargin !== null && (
              <StatCard
                label="Margem média"
                value={`${data.summary.avgMargin}%`}
                sub="preço − custo"
                color={
                  data.summary.avgMargin >= 60
                    ? 'text-green-600'
                    : data.summary.avgMargin >= 30
                    ? 'text-amber-500'
                    : 'text-red-500'
                }
              />
            )}
          </div>

          {/* Services table */}
          {sorted.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-ocean-surface-container-low/50 border-b border-ocean-outline-variant/25">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                        Agend.
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                        Concluídos
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                        Faltas
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                        Cancel.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                        Receita
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-ocean-secondary uppercase tracking-wider min-w-[110px]">
                        Margem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ocean-outline-variant/15">
                    {sorted.map((s, i) => (
                      <tr
                        key={s.serviceId}
                        className="hover:bg-ocean-surface-container-low/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {/* Ranking dot */}
                            <span className="text-[11px] font-bold text-ocean-outline w-4 shrink-0 text-center">
                              {i + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-ocean-on-surface">{s.name}</p>
                              <p className="text-[11px] text-ocean-secondary">
                                {formatCurrency(s.price)} · {formatDuration(s.durationMinutes)}
                              </p>
                            </div>
                          </div>
                          {/* Mini revenue bar */}
                          <div className="ml-6 mt-1.5 h-1 bg-ocean-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full bg-ocean-accent/60 rounded-full"
                              style={{ width: `${(s.totalRevenue / maxRevenue) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-bold text-ocean-on-surface">
                              {s.totalScheduled}
                            </span>
                            <div className="h-1 w-10 bg-ocean-surface-container rounded-full overflow-hidden">
                              <div
                                className="h-full bg-ocean-primary/50 rounded-full"
                                style={{
                                  width: `${(s.totalCompleted / Math.max(maxCompleted, 1)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                          {s.totalCompleted}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-ocean-secondary">
                          {s.totalNoShows > 0 ? (
                            <span className="text-red-400 font-semibold">{s.totalNoShows}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.totalCancelled > 0 ? (
                            <span className="text-xs font-semibold text-amber-500">
                              {s.totalCancelled} ({s.cancellationRate}%)
                            </span>
                          ) : (
                            <span className="text-ocean-outline text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-ocean-on-surface">
                          {s.totalRevenue > 0 ? formatCurrency(s.totalRevenue) : (
                            <span className="text-ocean-outline font-normal text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 min-w-[110px]">
                          <MarginBar margin={s.margin} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
