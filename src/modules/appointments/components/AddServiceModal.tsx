'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { servicesService } from '@/modules/services/services/servicesService';
import { storage } from '@/utils/storage';
import { formatCurrency, formatDuration } from '@/utils/formatters';
import type { Appointment } from '@/types/appointments.types';

interface AddServiceModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (appointmentId: string, serviceId: string) => Promise<void>;
}

export function AddServiceModal({ appointment, onClose, onConfirm }: AddServiceModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: svcData } = useSWR(
    appointment ? ['services-all', businessId] : null,
    () => servicesService.list(businessId, { limit: 100 }),
    { revalidateOnFocus: false },
  );

  const selectedSvc = svcData?.data.find((s) => s.id === selectedServiceId);

  async function handleConfirm(): Promise<void> {
    if (!appointment || !selectedServiceId) return;
    setSubmitting(true);
    try {
      await onConfirm(appointment.id, selectedServiceId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={!!appointment} onClose={onClose} title="Adicionar serviço" size="sm">
      {appointment && (
        <div className="space-y-4">
          <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.15)' }}>
            <p className="font-semibold text-ocean-on-surface">{appointment.client?.name}</p>
            <p className="text-xs text-ocean-secondary mt-0.5">
              {appointment.service?.name} · {appointment.durationMinutes} min atualmente
            </p>
          </div>

          <div>
            <label htmlFor="add-service-select" className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1.5">
              Serviço a adicionar
            </label>
            <select
              id="add-service-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecionar serviço...</option>
              {svcData?.data.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {formatDuration(s.durationMinutes)} · {formatCurrency(s.price)}
                </option>
              ))}
            </select>
          </div>

          {selectedSvc && (
            <div className="rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-800">
              <p className="font-semibold">Nova duração total</p>
              <p className="text-xs mt-0.5">
                {appointment.durationMinutes} + {selectedSvc.durationMinutes} = <strong>{appointment.durationMinutes + selectedSvc.durationMinutes} min</strong>
              </p>
              <p className="text-xs mt-0.5">
                Valor adicional: <strong>{formatCurrency(Number(selectedSvc.price))}</strong>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              loading={submitting}
              disabled={!selectedServiceId}
              onClick={handleConfirm}
            >
              Adicionar serviço
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
