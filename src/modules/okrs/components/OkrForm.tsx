'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import type { Objective, OkrPeriodType, CreateObjectiveRequest, CreateKeyResultRequest } from '@/types/okrs.types';

interface Props {
  initial?: Objective;
  onSubmit: (data: CreateObjectiveRequest) => Promise<void>;
  onCancel: () => void;
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const QUARTER_DATES: Record<string, { start: string; end: string }> = {
  Q1: { start: '01-01', end: '03-31' },
  Q2: { start: '04-01', end: '06-30' },
  Q3: { start: '07-01', end: '09-30' },
  Q4: { start: '10-01', end: '12-31' },
};

const currentYear = new Date().getFullYear();

function emptyKr(): CreateKeyResultRequest {
  return { title: '', targetValue: 0, unit: 'BRL', initialValue: 0, currentValue: 0 };
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-ocean-secondary mb-1';

export function OkrForm({ initial, onSubmit, onCancel }: Props) {
  const [periodType, setPeriodType] = useState<OkrPeriodType>(initial?.periodType ?? 'QUARTERLY');
  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState('Q3');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate?.slice(0, 10) ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate?.slice(0, 10) ?? '');
  const [keyResults, setKeyResults] = useState<CreateKeyResultRequest[]>(
    initial?.keyResults.map((kr) => ({
      title: kr.title,
      initialValue: kr.initialValue,
      targetValue: kr.targetValue,
      currentValue: kr.currentValue,
      unit: kr.unit,
    })) ?? [emptyKr()],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function buildPeriodName(): string {
    if (periodType === 'QUARTERLY') return `${year}-${quarter}`;
    return `${year}-M${month}`;
  }

  function buildDates(): { startDate: string; endDate: string } {
    if (periodType === 'QUARTERLY') {
      const d = QUARTER_DATES[quarter];
      return { startDate: `${year}-${d.start}`, endDate: `${year}-${d.end}` };
    }
    const lastDay = new Date(year, Number(month), 0).getDate();
    return { startDate: `${year}-${month}-01`, endDate: `${year}-${month}-${lastDay}` };
  }

  function addKr() {
    setKeyResults((prev) => [...prev, emptyKr()]);
  }

  function removeKr(index: number) {
    setKeyResults((prev) => prev.filter((_, i) => i !== index));
  }

  function updateKr(index: number, field: keyof CreateKeyResultRequest, value: string | number) {
    setKeyResults((prev) => prev.map((kr, i) => (i === index ? { ...kr, [field]: value } : kr)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) { setError('Título é obrigatório'); return; }
    if (keyResults.some((kr) => !kr.title.trim())) { setError('Todos os resultados-chave precisam de título'); return; }
    if (keyResults.some((kr) => kr.targetValue <= 0)) { setError('Meta (targetValue) deve ser maior que zero'); return; }

    const { startDate: sd, endDate: ed } = buildDates();

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        periodType,
        periodName: buildPeriodName(),
        startDate: sd,
        endDate: ed,
        keyResults,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Period type selector */}
      <div>
        <label className={labelCls}>Tipo de período</label>
        <div className="flex gap-2">
          {(['QUARTERLY', 'MONTHLY'] as OkrPeriodType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPeriodType(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                periodType === t
                  ? 'bg-ocean-primary text-white border-ocean-primary'
                  : 'bg-white text-ocean-secondary border-gray-200 hover:border-ocean-primary/40'
              }`}
            >
              {t === 'QUARTERLY' ? 'Trimestral (Q)' : 'Mensal'}
            </button>
          ))}
        </div>
      </div>

      {/* Year + period */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelCls}>Ano</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={inputCls}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          {periodType === 'QUARTERLY' ? (
            <>
              <label className={labelCls}>Trimestre</label>
              <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className={inputCls}>
                {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </>
          ) : (
            <>
              <label className={labelCls}>Mês</label>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls}>
                {Array.from({ length: 12 }, (_, i) => {
                  const m = String(i + 1).padStart(2, '0');
                  const label = new Date(2000, i).toLocaleString('pt-BR', { month: 'long' });
                  return <option key={m} value={m}>{label.charAt(0).toUpperCase() + label.slice(1)}</option>;
                })}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelCls}>Título do objetivo *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          placeholder="Ex: Dominar o mercado de cílios no Q3"
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Descrição (opcional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls}
          rows={2}
          placeholder="Contexto adicional sobre este objetivo..."
        />
      </div>

      {/* Key Results */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls + ' mb-0'}>Resultados-Chave *</label>
          <button
            type="button"
            onClick={addKr}
            className="text-xs font-semibold text-ocean-primary hover:underline"
          >
            + Adicionar KR
          </button>
        </div>

        <div className="space-y-3">
          {keyResults.map((kr, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-2 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ocean-secondary">KR {i + 1}</span>
                {keyResults.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKr(i)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remover
                  </button>
                )}
              </div>
              <input
                type="text"
                value={kr.title}
                onChange={(e) => updateKr(i, 'title', e.target.value)}
                className={inputCls}
                placeholder="Ex: Atingir R$ 20.000 em faturamento"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelCls}>Meta</label>
                  <input
                    type="number"
                    value={kr.targetValue}
                    onChange={(e) => updateKr(i, 'targetValue', parseFloat(e.target.value) || 0)}
                    className={inputCls}
                    min={0}
                    step="any"
                  />
                </div>
                <div className="w-32">
                  <label className={labelCls}>Unidade</label>
                  <input
                    type="text"
                    value={kr.unit}
                    onChange={(e) => updateKr(i, 'unit', e.target.value)}
                    className={inputCls}
                    placeholder="BRL, clientes..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={saving} className="flex-1">
          {initial ? 'Salvar' : 'Criar Objetivo'}
        </Button>
      </div>
    </form>
  );
}
