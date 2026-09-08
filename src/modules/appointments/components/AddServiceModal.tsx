'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { servicesService } from '@/modules/services/services/servicesService';
import { professionalsService } from '@/modules/professionals/services/professionalsService';
import { storage } from '@/utils/storage';
import { getApiError } from '@/services/api';
import { formatCurrency, formatDuration, formatTime } from '@/utils/formatters';
import { toDateStr } from '@/utils/calendar';
import type { Appointment } from '@/types/appointments.types';

interface AddServiceModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (appointmentId: string, serviceId: string) => Promise<void>;
  onConfirmSeparate: (serviceId: string, scheduledAtIso: string) => Promise<void>;
}

export function AddServiceModal({ appointment, onClose, onConfirm, onConfirmSeparate }: AddServiceModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [schedulingSlot, setSchedulingSlot] = useState<string | null>(null);

  useEffect(() => {
    setConflictMessage(null);
  }, [selectedServiceId]);

  const { data: svcData } = useSWR(
    appointment ? ['services-all', businessId] : null,
    () => servicesService.list(businessId, { limit: 100 }),
    { revalidateOnFocus: false },
  );

  const selectedSvc = svcData?.data.find((s) => s.id === selectedServiceId);

  const { data: slotsData, isLoading: loadingSlots } = useSWR(
    conflictMessage && appointment
      ? ['add-service-slots', businessId, appointment.professional.id, appointment.scheduledAt, selectedServiceId]
      : null,
    () =>
      professionalsService.availableSlots(
        businessId,
        appointment!.professional.id,
        toDateStr(new Date(appointment!.scheduledAt)),
        selectedServiceId,
      ),
    { revalidateOnFocus: false },
  );

  async function handleConfirm(): Promise<void> {
    if (!appointment || !selectedServiceId) return;
    setSubmitting(true);
    setConflictMessage(null);
    try {
      await onConfirm(appointment.id, selectedServiceId);
      onClose();
    } catch (err) {
      setConflictMessage(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleScheduleSlot(slotIso: string): Promise<void> {
    if (!selectedServiceId) return;
    setSchedulingSlot(slotIso);
    try {
      await onConfirmSeparate(selectedServiceId, slotIso);
      onClose();
    } catch {
      /* erro já exibido via toast pelo chamador */
    } finally {
      setSchedulingSlot(null);
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

          {selectedSvc && !conflictMessage && (
            <div className="rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-800">
              <p className="font-semibold">A duração do agendamento será estendida</p>
              <p className="text-xs mt-0.5">
                <strong>{selectedSvc.name}</strong> · +{formatDuration(selectedSvc.durationMinutes)} · +{formatCurrency(Number(selectedSvc.price))}
              </p>
              <p className="text-xs mt-1 text-green-700">
                Novo total: {appointment.durationMinutes + selectedSvc.durationMinutes} min, no mesmo horário.
              </p>
            </div>
          )}

          {conflictMessage && (
            <div className="rounded-xl p-3 text-sm bg-amber-50 border border-amber-200 text-amber-900">
              <p className="font-semibold">{conflictMessage}</p>
              <p className="text-xs mt-1">
                Não é possível estender esse horário porque já há outro compromisso logo em seguida. Escolha um horário livre para agendar <strong>{selectedSvc?.name}</strong> separadamente:
              </p>

              <div className="mt-2.5 flex flex-wrap gap-2">
                {loadingSlots && (
                  <span className="text-xs text-amber-700">Carregando horários disponíveis...</span>
                )}
                {!loadingSlots && slotsData?.length === 0 && (
                  <span className="text-xs text-amber-700">Nenhum horário livre nesse dia para esse serviço.</span>
                )}
                {!loadingSlots &&
                  slotsData?.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      disabled={schedulingSlot === slot}
                      onClick={() => handleScheduleSlot(slot)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                    >
                      {schedulingSlot === slot ? '...' : formatTime(slot)}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              {conflictMessage ? 'Fechar' : 'Cancelar'}
            </Button>
            {!conflictMessage && (
              <Button
                type="button"
                size="sm"
                loading={submitting}
                disabled={!selectedServiceId}
                onClick={handleConfirm}
              >
                Adicionar serviço
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
