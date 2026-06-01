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

  const { data: fin, isLoading: loadingFin } = useSWR(
    ['prof-financial', businessId, range.from, range.to],
    () => reportsService.financial(businessId, { from: range.from, to: range.to }),
  );

  const { data: appts, isLoading: loadingAppts } = useSWR(
    ['prof-appts', businessId, range.from, range.to],
    () => reportsService.appointments(businessId, { from: range.from, to: range.to }),
  );

  const isLoading = loadingFin || loadingAppts;

  // merge by professional id
  const merged = (appts?.byProfessional ?? []).map((row) => {
    const finRow = fin?.byProfessional.find((f) => f.professional.id === row.professional.id);
    return {
      ...row,
      revenue: finRow?.revenue ?? 0,
      commission: finRow?.commission ?? 0,
    };
  });

  // sort by totalCompleted desc
  merged.sort((a, b) => b.totalCompleted - a.totalCompleted);

  const maxOccupancy = merged.length > 0
    ? Math.max(...merged.map((r) => r.occupancyRate))
    : 1;

  return (
    <div className="space-y-4 mb-6">
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

                {/* Stats row */}
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

                {/* Occupancy bar */}
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

          {/* Top services */}
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
