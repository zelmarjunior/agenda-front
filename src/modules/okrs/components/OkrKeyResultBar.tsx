'use client';

import type { KeyResult } from '@/types/okrs.types';

interface Props {
  kr: KeyResult;
  onUpdateProgress?: (kr: KeyResult) => void;
  onSyncRevenue?: (kr: KeyResult) => void;
  onSyncNewClients?: (kr: KeyResult) => void;
  onSyncRetention?: (kr: KeyResult) => void;
  syncing?: string | null;
}

function formatValue(value: number, unit: string): string {
  if (unit === 'BRL') {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return `${value.toLocaleString('pt-BR')} ${unit}`;
}

export function OkrKeyResultBar({ kr, onUpdateProgress, onSyncRevenue, onSyncNewClients, onSyncRetention, syncing }: Props) {
  const range = kr.targetValue - kr.initialValue;
  const progress = range <= 0 ? 100 : Math.min(100, Math.max(0, ((kr.currentValue - kr.initialValue) / range) * 100));
  const isSyncing = syncing === kr.id;

  const barColor =
    progress >= 100 ? '#22c55e' :
    progress >= 60 ? '#0ea5e9' :
    progress >= 30 ? '#f59e0b' :
    '#ef4444';

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-ocean-on-surface leading-snug">{kr.title}</p>
        <span className="text-xs font-bold whitespace-nowrap" style={{ color: barColor }}>
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-ocean-surface-container-low overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </div>

      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] text-ocean-secondary">
          {formatValue(kr.currentValue, kr.unit)} / {formatValue(kr.targetValue, kr.unit)}
        </span>

        <div className="flex items-center gap-1">
          {onUpdateProgress && (
            <button
              onClick={() => onUpdateProgress(kr)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-ocean-surface-container-low hover:bg-ocean-primary/10 text-ocean-primary font-medium transition-colors"
            >
              Atualizar
            </button>
          )}
          {onSyncRevenue && (
            <button
              disabled={isSyncing}
              onClick={() => onSyncRevenue(kr)}
              title="Sincronizar com faturamento real"
              className="text-[10px] px-2 py-0.5 rounded-md bg-green-50 hover:bg-green-100 text-green-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSyncing ? '...' : 'R$ Auto'}
            </button>
          )}
          {onSyncNewClients && (
            <button
              disabled={isSyncing}
              onClick={() => onSyncNewClients(kr)}
              title="Sincronizar com novos clientes"
              className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSyncing ? '...' : 'Clientes Auto'}
            </button>
          )}
          {onSyncRetention && (
            <button
              disabled={isSyncing}
              onClick={() => onSyncRetention(kr)}
              title="Sincronizar com retenção"
              className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSyncing ? '...' : 'Retenção Auto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
