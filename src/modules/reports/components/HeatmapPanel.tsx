'use client';

import useSWR from 'swr';
import { reportsService } from '../services/reportsService';
import { storage } from '@/utils/storage';
import { Spinner } from '@/components/common/Spinner';

// MySQL DAYOFWEEK: 1=Dom, 2=Seg, ..., 7=Sáb → reordenar para Seg-Dom
const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
// MySQL dayOfWeek → display index (0-6, Seg=0)
const MYSQL_TO_DISPLAY: Record<number, number> = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 1: 6 };

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7h–20h

function heatColor(count: number, max: number): string {
  if (count === 0 || max === 0) return 'rgba(14,165,233,0.05)';
  const intensity = count / max;
  return `rgba(14,165,233,${(0.12 + intensity * 0.75).toFixed(2)})`;
}

export function HeatmapPanel(): JSX.Element {
  const businessId = storage.getBusinessId()!;

  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 89); // last 90 days
  const fromStr = from.toISOString().split('T')[0];
  const toStr = today.toISOString().split('T')[0];

  const { data, isLoading } = useSWR(
    ['heatmap', businessId, fromStr, toStr],
    () => reportsService.heatmap(businessId, { from: fromStr, to: toStr }),
    { refreshInterval: 60 * 60 * 1000 }, // refresh hourly
  );

  // Build 7×14 matrix (day × hour)
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(14).fill(0));
  if (data) {
    for (const cell of data.matrix) {
      const displayDay = MYSQL_TO_DISPLAY[cell.dayOfWeek];
      const hourIdx = cell.hour - 7;
      if (displayDay !== undefined && hourIdx >= 0 && hourIdx < 14) {
        matrix[displayDay][hourIdx] = cell.count;
      }
    }
  }

  const max = data?.maxCount ?? 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-ocean-outline-variant/25 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ocean-on-surface">Mapa de horários</h2>
        <span className="text-[11px] text-ocean-secondary">Últimos 90 dias</span>
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center"><Spinner /></div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-[10px] border-separate" style={{ borderSpacing: 2 }}>
            <thead>
              <tr>
                <th className="w-8 text-right pr-2 text-ocean-secondary font-medium" />
                {HOURS.map((h) => (
                  <th key={h} className="text-center text-ocean-outline font-normal w-6">
                    {h}h
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAY_LABELS.map((day, di) => (
                <tr key={day}>
                  <td className="text-right pr-2 text-ocean-secondary font-medium whitespace-nowrap">
                    {day}
                  </td>
                  {HOURS.map((_, hi) => {
                    const count = matrix[di][hi];
                    return (
                      <td
                        key={hi}
                        title={count > 0 ? `${count} agendamento${count !== 1 ? 's' : ''}` : undefined}
                        className="rounded"
                        style={{
                          background: heatColor(count, max),
                          width: 20,
                          height: 20,
                          minWidth: 20,
                        }}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="text-[10px] text-ocean-outline">Menos</span>
            {[0.05, 0.25, 0.5, 0.75, 1].map((v) => (
              <span
                key={v}
                className="w-3.5 h-3.5 rounded"
                style={{ background: `rgba(14,165,233,${(0.12 + v * 0.75).toFixed(2)})` }}
              />
            ))}
            <span className="text-[10px] text-ocean-outline">Mais</span>
          </div>
        </div>
      )}
    </div>
  );
}
