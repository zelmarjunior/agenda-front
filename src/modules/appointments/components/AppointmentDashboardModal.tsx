'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { AppointmentForm } from './AppointmentForm';
import { appointmentsService } from '../services/appointmentsService';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import { storage } from '@/utils/storage';
import { formatDateTime } from '@/utils/formatters';
import type { Appointment, AppointmentStatus } from '@/types/appointments.types';

const STATUS_BADGE: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PENDING:   { label: 'Pendente',     variant: 'warning' },
  CONFIRMED: { label: 'Confirmado',   variant: 'success' },
  CANCELLED: { label: 'Cancelado',    variant: 'danger'  },
  COMPLETED: { label: 'Atendido',     variant: 'info'    },
  NO_SHOW:   { label: 'Não Atendido', variant: 'danger'  },
};

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
  onMutate: () => void;
}

export function AppointmentDashboardModal({ appointment, onClose, onMutate }: Props): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();

  const [action, setAction] = useState<'cancel' | 'noshow' | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setAction(null);
    setReason('');
    onClose();
  }

  async function run(fn: () => Promise<void>, successMsg: string) {
    setLoading(true);
    try {
      await fn();
      toast(successMsg, 'success');
      onMutate();
      handleClose();
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = useCallback(
    async (
      _: string,
      values: { clientId: string; professionalId: string; serviceId: string; finalPrice?: string; paymentMethod?: string },
    ): Promise<void> => {
      if (!appointment) return;
      await run(
        () => appointmentsService.update(businessId, appointment.id, {
          finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
          paymentMethod: values.paymentMethod || undefined,
        }),
        'Agendamento atualizado!',
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointment, businessId],
  );

  if (!appointment) return <></>;

  const status = STATUS_BADGE[appointment.status];
  const isActionable = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';

  return (
    <Modal open={!!appointment} onClose={handleClose} title="Agendamento" size="md">
      {/* Status + client info */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{appointment.client.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {appointment.service.name} · {formatDateTime(appointment.scheduledAt)}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Status action buttons */}
      {isActionable && !action && (
        <div className="mb-5 flex flex-wrap gap-2">
          {appointment.status === 'PENDING' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => run(
                () => appointmentsService.confirm(businessId, appointment.id),
                'Agendamento confirmado!',
              )}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Confirmar
            </button>
          )}

          {appointment.status === 'CONFIRMED' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => run(
                () => appointmentsService.complete(businessId, appointment.id),
                'Atendimento concluído!',
              )}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Marcar Atendido
            </button>
          )}

          {appointment.status === 'CONFIRMED' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setAction('noshow')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Não Atendeu
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => setAction('cancel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
        </div>
      )}

      {/* Inline reason input for cancel/noshow */}
      {action && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {action === 'cancel' ? 'Cancelar agendamento' : 'Marcar como não atendido'}
          </p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                action === 'cancel'
                  ? run(() => appointmentsService.cancel(businessId, appointment.id, { reason }), 'Agendamento cancelado.')
                  : run(() => appointmentsService.noShow(businessId, appointment.id, reason), 'Marcado como não atendido.')
              }
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? 'Aguarde...' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={() => { setAction(null); setReason(''); }}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Editar agendamento
        </p>
        <AppointmentForm
          initial={appointment}
          onSubmit={handleEdit}
          onCancel={handleClose}
        />
      </div>
    </Modal>
  );
}
