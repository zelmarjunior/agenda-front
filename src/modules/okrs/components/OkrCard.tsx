'use client';

import { useState } from 'react';
import { storage } from '@/utils/storage';
import { okrsService } from '../okrsService';
import { OkrKeyResultBar } from './OkrKeyResultBar';
import type { Objective, KeyResult } from '@/types/okrs.types';

interface Props {
  objective: Objective;
  onEdit: (o: Objective) => void;
  onDelete: (o: Objective) => void;
  onUpdated: () => void;
}

function periodLabel(periodName: string): string {
  if (periodName.includes('-Q')) {
    const [year, q] = periodName.split('-');
    return `${q} · ${year}`;
  }
  // YYYY-M06
  const [year, m] = periodName.split('-M');
  const month = new Date(Number(year), Number(m) - 1).toLocaleString('pt-BR', { month: 'long' });
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

const ringColor = (p: number) =>
  p >= 100 ? '#22c55e' : p >= 60 ? '#0ea5e9' : p >= 30 ? '#f59e0b' : '#ef4444';

export function OkrCard({ objective, onEdit, onDelete, onUpdated }: Props) {
  const businessId = storage.getBusinessId()!;
  const [syncing, setSyncing] = useState<string | null>(null);
  const [editingKr, setEditingKr] = useState<KeyResult | null>(null);
  const [newValue, setNewValue] = useState('');
  const [savingKr, setSavingKr] = useState(false);

  const color = ringColor(objective.completionPercent);

  async function handleSync(kr: KeyResult, type: 'revenue' | 'new-clients' | 'retention') {
    setSyncing(kr.id);
    try {
      if (type === 'revenue') await okrsService.syncRevenue(businessId, objective.id, kr.id);
      else if (type === 'new-clients') await okrsService.syncNewClients(businessId, objective.id, kr.id);
      else await okrsService.syncRetention(businessId, objective.id, kr.id);
      onUpdated();
    } finally {
      setSyncing(null);
    }
  }

  async function handleSaveKrProgress() {
    if (!editingKr) return;
    const v = parseFloat(newValue.replace(',', '.'));
    if (isNaN(v)) return;
    setSavingKr(true);
    try {
      await okrsService.updateKeyResult(businessId, objective.id, editingKr.id, { currentValue: v });
      setEditingKr(null);
      setNewValue('');
      onUpdated();
    } finally {
      setSavingKr(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Progress ring */}
          <div className="relative shrink-0 w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={color} strokeWidth="3"
                strokeDasharray={`${objective.completionPercent} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color }}>
              {objective.completionPercent}%
            </span>
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-ocean-on-surface leading-tight">{objective.title}</p>
            {objective.description && (
              <p className="text-xs text-ocean-secondary mt-0.5 line-clamp-2">{objective.description}</p>
            )}
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-ocean-primary/10 text-ocean-primary">
              {objective.periodType === 'QUARTERLY' ? '◆' : '◉'} {periodLabel(objective.periodName)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(objective)}
            className="p-1.5 rounded-lg text-ocean-secondary hover:text-ocean-primary hover:bg-ocean-primary/10 transition-colors"
            title="Editar objetivo"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(objective)}
            className="p-1.5 rounded-lg text-ocean-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Excluir objetivo"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Key Results */}
      {objective.keyResults.length > 0 && (
        <div className="space-y-3 border-t border-ocean-outline-variant/20 pt-3">
          {objective.keyResults.map((kr) => (
            <OkrKeyResultBar
              key={kr.id}
              kr={kr}
              syncing={syncing}
              onUpdateProgress={(k) => { setEditingKr(k); setNewValue(String(k.currentValue)); }}
              onSyncRevenue={kr.unit === 'BRL' ? (k) => handleSync(k, 'revenue') : undefined}
              onSyncNewClients={kr.unit === 'clientes' ? (k) => handleSync(k, 'new-clients') : undefined}
              onSyncRetention={kr.unit === 'recorrentes' ? (k) => handleSync(k, 'retention') : undefined}
            />
          ))}
        </div>
      )}

      {/* Inline progress editor */}
      {editingKr && (
        <div className="flex items-center gap-2 border-t border-ocean-outline-variant/20 pt-3">
          <p className="text-xs text-ocean-secondary flex-1 truncate">
            Novo valor para: <span className="font-medium text-ocean-on-surface">{editingKr.title}</span>
          </p>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-28 rounded-xl border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
            step="any"
          />
          <button
            disabled={savingKr}
            onClick={handleSaveKrProgress}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-ocean-primary text-white hover:bg-ocean-primary/90 disabled:opacity-50 transition-colors"
          >
            {savingKr ? '...' : 'OK'}
          </button>
          <button
            onClick={() => setEditingKr(null)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
