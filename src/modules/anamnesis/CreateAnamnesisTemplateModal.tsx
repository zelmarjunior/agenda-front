'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { anamnesisService } from './anamnesisService';
import { storage } from '@/utils/storage';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import type { FieldType, AnamnesisTemplate } from '@/types/anamnesis.types';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'TEXT', label: 'Texto livre' },
  { value: 'SINGLE', label: 'Escolha única' },
  { value: 'MULTIPLE', label: 'Múltipla escolha' },
  { value: 'BOOLEAN', label: 'Sim/Não' },
  { value: 'DATE', label: 'Data' },
  { value: 'SIGNATURE', label: 'Assinatura' },
];

interface DraftField {
  label: string;
  type: FieldType;
  optionsText: string;
  isAlert: boolean;
  required: boolean;
}

function newField(): DraftField {
  return { label: '', type: 'TEXT', optionsText: '', isAlert: false, required: false };
}

interface CreateAnamnesisTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (template: AnamnesisTemplate) => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';

export function CreateAnamnesisTemplateModal({
  open,
  onClose,
  onCreated,
}: CreateAnamnesisTemplateModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredBeforeFirst, setRequiredBeforeFirst] = useState(false);
  const [fields, setFields] = useState<DraftField[]>([newField()]);
  const [submitting, setSubmitting] = useState(false);

  function reset(): void {
    setName('');
    setDescription('');
    setRequiredBeforeFirst(false);
    setFields([newField()]);
  }

  function updateField(index: number, patch: Partial<DraftField>): void {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeField(index: number): void {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  const canSubmit = name.trim().length > 0 && fields.length > 0 && fields.every((f) => f.label.trim().length > 0);

  async function handleSubmit(): Promise<void> {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const template = await anamnesisService.createTemplate(businessId, {
        name: name.trim(),
        description: description.trim() || undefined,
        requiredBeforeFirst,
        fields: fields.map((f, i) => ({
          label: f.label.trim(),
          type: f.type,
          options:
            f.type === 'SINGLE' || f.type === 'MULTIPLE'
              ? f.optionsText.split(',').map((o) => o.trim()).filter(Boolean)
              : undefined,
          isAlert: f.isAlert,
          required: f.required,
          sortOrder: i,
        })),
      });
      toast('Template de anamnese criado!', 'success');
      onCreated(template);
      reset();
      onClose();
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo template de anamnese" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1.5">
            Nome do template
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Ficha de avaliação capilar"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1.5">
            Descrição (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={requiredBeforeFirst}
            onChange={(e) => setRequiredBeforeFirst(e.target.checked)}
          />
          Obrigatória antes do primeiro atendimento
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide">
              Perguntas
            </label>
            <button
              type="button"
              onClick={() => setFields((prev) => [...prev, newField()])}
              className="text-xs font-semibold text-ocean-primary hover:underline"
            >
              + Adicionar pergunta
            </button>
          </div>

          {fields.map((field, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  value={field.label}
                  onChange={(e) => updateField(i, { label: e.target.value })}
                  placeholder={`Pergunta ${i + 1}`}
                  className={`${inputCls} flex-1`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="shrink-0 px-2 text-red-400 hover:text-red-600"
                    aria-label="Remover pergunta"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={field.type}
                  onChange={(e) => updateField(i, { type: e.target.value as FieldType })}
                  className={`${inputCls} w-auto`}
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-ocean-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(i, { required: e.target.checked })}
                  />
                  Obrigatória
                </label>

                <label className="flex items-center gap-1.5 text-xs text-ocean-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.isAlert}
                    onChange={(e) => updateField(i, { isAlert: e.target.checked })}
                  />
                  Gera alerta ⚠
                </label>
              </div>

              {(field.type === 'SINGLE' || field.type === 'MULTIPLE') && (
                <input
                  value={field.optionsText}
                  onChange={(e) => updateField(i, { optionsText: e.target.value })}
                  placeholder="Opções separadas por vírgula (ex: Leve, Moderado, Grave)"
                  className={inputCls}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" size="sm" loading={submitting} disabled={!canSubmit} onClick={handleSubmit}>
            Criar template
          </Button>
        </div>
      </div>
    </Modal>
  );
}
