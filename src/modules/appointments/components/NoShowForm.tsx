'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';

const PRESET_REASONS = [
  'Cliente não compareceu sem avisar',
  'Cliente avisou que não viria no dia',
  'Problema de saúde',
  'Esquecimento',
  'Problema de transporte',
];

interface NoShowFormProps {
  onSubmit: (reason: string) => Promise<void>;
  onCancel: () => void;
}

export function NoShowForm({ onSubmit, onCancel }: NoShowFormProps): JSX.Element {
  const [selected, setSelected] = useState<string>('');
  const [custom, setCustom] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOther = selected === '__other__';
  const finalReason = isOther ? custom.trim() : selected;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!finalReason) return;
    setIsSubmitting(true);
    try {
      await onSubmit(finalReason);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">Selecione o motivo do não comparecimento:</p>

      <div className="space-y-2">
        {PRESET_REASONS.map((reason) => (
          <label
            key={reason}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
              selected === reason
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="reason"
              value={reason}
              checked={selected === reason}
              onChange={() => setSelected(reason)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-800">{reason}</span>
          </label>
        ))}

        <label
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
            isOther
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <input
            type="radio"
            name="reason"
            value="__other__"
            checked={isOther}
            onChange={() => setSelected('__other__')}
            className="accent-blue-600"
          />
          <span className="text-sm text-gray-800">Outro</span>
        </label>

        {isOther && (
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Descreva o motivo..."
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            autoFocus
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          variant="danger"
          loading={isSubmitting}
          disabled={!finalReason}
        >
          Marcar como Não Atendido
        </Button>
      </div>
    </form>
  );
}
