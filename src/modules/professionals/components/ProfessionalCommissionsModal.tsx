'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { professionalsService } from '../services/professionalsService';
import { storage } from '@/utils/storage';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import type { CommissionType, ServiceCommission } from '@/types/professionals.types';

interface ProfessionalCommissionsModalProps {
  professionalId: string | null;
  professionalName: string;
  open: boolean;
  onClose: () => void;
}

export function ProfessionalCommissionsModal({
  professionalId,
  professionalName,
  open,
  onClose,
}: ProfessionalCommissionsModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR(
    open && professionalId ? ['commissions', businessId, professionalId] : null,
    () => professionalsService.getCommissions(businessId, professionalId!),
    { revalidateOnFocus: false },
  );

  async function handleSave(
    item: ServiceCommission,
    commissionType: CommissionType | null,
    commissionValue: number | null,
  ): Promise<void> {
    if (!professionalId) return;
    setSaving(item.serviceId);
    try {
      await professionalsService.setCommission(businessId, professionalId, item.serviceId, {
        commissionType,
        commissionValue,
      });
      mutate((prev) =>
        prev?.map((c) =>
          c.serviceId === item.serviceId ? { ...c, commissionType, commissionValue } : c,
        ),
        false,
      );
      toast('Comissão atualizada!', 'success');
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setSaving(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Comissões — ${professionalName}`}>
      {isLoading ? (
        <div className="py-8"><Spinner /></div>
      ) : !data?.length ? (
        <p className="py-6 text-center text-sm text-ocean-secondary">
          Vincule serviços ao profissional primeiro.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-ocean-secondary">
            Configure a comissão por serviço. Deixe vazio para usar a comissão geral do profissional.
          </p>
          {data.map((item) => (
            <CommissionRow
              key={item.serviceId}
              item={item}
              saving={saving === item.serviceId}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

function CommissionRow({
  item,
  saving,
  onSave,
}: {
  item: ServiceCommission;
  saving: boolean;
  onSave: (item: ServiceCommission, type: CommissionType | null, value: number | null) => void;
}): JSX.Element {
  const [type, setType] = useState<CommissionType | ''>(item.commissionType ?? '');
  const [value, setValue] = useState<string>(item.commissionValue != null ? String(item.commissionValue) : '');

  function handleBlur(): void {
    const commissionType = (type as CommissionType) || null;
    const commissionValue = value !== '' ? Number(value) : null;
    if (commissionType !== item.commissionType || commissionValue !== item.commissionValue) {
      onSave(item, commissionType, commissionValue);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.12)' }}>
      <p className="flex-1 text-sm font-medium text-ocean-on-surface truncate">{item.serviceName}</p>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as CommissionType | '')}
        onBlur={handleBlur}
        disabled={saving}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-28"
      >
        <option value="">Sem comissão</option>
        <option value="PERCENT">Percentual (%)</option>
        <option value="FIXED">Valor fixo (R$)</option>
      </select>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        disabled={saving || !type}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={type === 'PERCENT' ? '0–100' : '0,00'}
        className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
      />
      {saving && <span className="text-[10px] text-ocean-secondary animate-pulse">Salvando...</span>}
    </div>
  );
}
