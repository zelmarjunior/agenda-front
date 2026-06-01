'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { anamnesisService } from './anamnesisService';
import { storage } from '@/utils/storage';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import type { AnamnesisRecord, AnamnesisTemplate, SubmitAnswersRequest } from '@/types/anamnesis.types';

interface ClientAnamnesisPanelProps {
  clientId: string;
}

export function ClientAnamnesisPanel({ clientId }: ClientAnamnesisPanelProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [filling, setFilling] = useState<AnamnesisRecord | null>(null);
  const [applying, setApplying] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: records, isLoading: loadingRecords, mutate } = useSWR(
    ['anamnesis-records', businessId, clientId],
    () => anamnesisService.listClientRecords(businessId, clientId),
  );

  const { data: templates, isLoading: loadingTemplates } = useSWR(
    ['anamnesis-templates', businessId],
    () => anamnesisService.listTemplates(businessId),
  );

  async function handleApply(): Promise<void> {
    if (!selectedTemplateId) return;
    setApplying(true);
    try {
      const record = await anamnesisService.applyTemplate(businessId, clientId, selectedTemplateId);
      mutate();
      setFilling(record);
      setSelectedTemplateId('');
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setApplying(false);
    }
  }

  async function handleSubmit(record: AnamnesisRecord, template: AnamnesisTemplate): Promise<void> {
    setSubmitting(true);
    try {
      const data: SubmitAnswersRequest = {
        answers: template.fields.map((f) => ({
          fieldId: f.id,
          value: answers[f.id] ?? '',
        })),
      };
      await anamnesisService.submitAnswers(businessId, clientId, record.id, data);
      toast('Ficha preenchida!', 'success');
      setFilling(null);
      setAnswers({});
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingRecords) return <div className="py-6 flex justify-center"><Spinner /></div>;

  // If filling a form
  if (filling) {
    const template = templates?.find((t) => t.id === filling.templateId);
    if (!template) return <p className="text-sm text-ocean-secondary">Template não encontrado.</p>;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-ocean-on-surface">{template.name}</h4>
          <button onClick={() => { setFilling(null); setAnswers({}); }} className="text-xs text-ocean-secondary hover:text-ocean-on-surface">
            Cancelar
          </button>
        </div>

        <div className="space-y-3">
          {template.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-semibold text-ocean-secondary mb-1">
                {field.label}{field.required && ' *'}
                {field.isAlert && <span className="ml-1 text-red-500">⚠</span>}
              </label>

              {field.type === 'TEXT' && (
                <textarea
                  rows={2}
                  value={answers[field.id] ?? ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              )}
              {field.type === 'BOOLEAN' && (
                <div className="flex gap-3">
                  {['true', 'false'].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name={field.id}
                        value={v}
                        checked={answers[field.id] === v}
                        onChange={() => setAnswers((prev) => ({ ...prev, [field.id]: v }))}
                      />
                      {v === 'true' ? 'Sim' : 'Não'}
                    </label>
                  ))}
                </div>
              )}
              {(field.type === 'SINGLE' || field.type === 'MULTIPLE') && (
                <div className="flex flex-wrap gap-2">
                  {(field.options ?? []).map((opt) => {
                    const current = answers[field.id] ?? '';
                    const selected = field.type === 'SINGLE' ? current === opt : current.split(',').includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (field.type === 'SINGLE') {
                            setAnswers((prev) => ({ ...prev, [field.id]: opt }));
                          } else {
                            const parts = (current || '').split(',').filter(Boolean);
                            const next = selected ? parts.filter((p) => p !== opt) : [...parts, opt];
                            setAnswers((prev) => ({ ...prev, [field.id]: next.join(',') }));
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${selected ? 'bg-ocean-primary text-white border-ocean-primary' : 'border-gray-200 text-ocean-secondary hover:border-ocean-primary'}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
              {field.type === 'DATE' && (
                <input
                  type="date"
                  value={answers[field.id] ?? ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              )}
              {field.type === 'SIGNATURE' && (
                <p className="text-xs text-ocean-secondary">Assinatura digital não disponível nesta versão.</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <Button type="button" variant="secondary" size="sm" onClick={() => { setFilling(null); setAnswers({}); }}>
            Cancelar
          </Button>
          <Button type="button" size="sm" loading={submitting} onClick={() => handleSubmit(filling, template)}>
            Salvar ficha
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Apply template */}
      <div className="flex gap-2">
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={loadingTemplates || !templates?.length}
        >
          <option value="">{loadingTemplates ? 'Carregando...' : templates?.length ? 'Selecionar template...' : 'Nenhum template cadastrado'}</option>
          {templates?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <Button size="sm" disabled={!selectedTemplateId} loading={applying} onClick={handleApply}>
          Aplicar
        </Button>
      </div>

      {/* Records list */}
      {!records?.length ? (
        <p className="text-sm text-ocean-secondary text-center py-4">Nenhuma ficha registrada.</p>
      ) : (
        <ul className="space-y-2">
          {records.map((rec) => {
            const template = templates?.find((t) => t.id === rec.templateId);
            const alertCount = rec.answers?.filter((a) => a.isAlertTriggered).length ?? 0;
            return (
              <li key={rec.id} className="rounded-xl p-3 flex items-center justify-between gap-3" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.12)' }}>
                <div>
                  <p className="text-sm font-medium text-ocean-on-surface">{template?.name ?? 'Template desativado'}</p>
                  <p className="text-xs text-ocean-secondary mt-0.5">
                    {rec.status === 'COMPLETED' ? (
                      <>✓ Preenchida{rec.filledAt ? ` em ${new Date(rec.filledAt).toLocaleDateString('pt-BR')}` : ''}</>
                    ) : '⏳ Pendente'}
                    {alertCount > 0 && <span className="ml-2 text-red-500 font-semibold">⚠ {alertCount} alerta{alertCount > 1 ? 's' : ''}</span>}
                  </p>
                </div>
                {rec.status === 'PENDING' && (
                  <Button size="sm" variant="secondary" onClick={() => setFilling(rec)}>
                    Preencher
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
