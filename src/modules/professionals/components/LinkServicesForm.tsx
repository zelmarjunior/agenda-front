'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { servicesService } from '@/modules/services/services/servicesService';
import { storage } from '@/utils/storage';
import { formatCurrency, formatDuration } from '@/utils/formatters';

interface LinkServicesFormProps {
  currentServiceIds: string[];
  onSubmit: (serviceIds: string[]) => Promise<void>;
  onCancel: () => void;
}

export function LinkServicesForm({
  currentServiceIds,
  onSubmit,
  onCancel,
}: LinkServicesFormProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [selected, setSelected] = useState<Set<string>>(new Set(currentServiceIds));
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useSWR(['services-all-for-link', businessId], () =>
    servicesService.list(businessId, { limit: 100 }),
  );

  function toggle(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit(): Promise<void> {
    setSaving(true);
    try {
      await onSubmit(Array.from(selected));
    } finally {
      setSaving(false);
    }
  }

  if (isLoading)
    return (
      <div className="py-8">
        <Spinner />
      </div>
    );

  const services = data?.data ?? [];
  const allSelected = services.length > 0 && services.every((s) => selected.has(s.id));

  function toggleAll(): void {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(services.map((s) => s.id)));
    }
  }

  return (
    <div className="space-y-4">
      {services.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Nenhum serviço cadastrado.</p>
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-gray-500">{selected.size} de {services.length} selecionados</span>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
            >
              {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
          </div>
        <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto -mx-2">
          {services.map((s) => (
            <li key={s.id}>
              <label className="flex items-center gap-3 px-2 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selected.has(s.id)}
                  onChange={() => toggle(s.id)}
                  className="rounded"
                />
                <span className="flex-1 text-sm text-gray-900">{s.name}</span>
                <span className="text-xs text-gray-500">{formatDuration(s.durationMinutes)}</span>
                <span className="text-xs font-medium text-gray-700">{formatCurrency(s.price)}</span>
              </label>
            </li>
          ))}
        </ul>
        </>
      )}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" loading={saving} onClick={handleSubmit}>
          Salvar ({selected.size} selecionado{selected.size !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  );
}
