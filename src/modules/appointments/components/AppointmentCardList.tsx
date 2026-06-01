'use client';

import { formatTime } from '@/utils/formatters';
import { formatDayFull, toDateStr } from '@/utils/calendar';
import { getWaTemplate, buildWaMessage, buildWaUrl } from '@/utils/whatsapp';
import { storage } from '@/utils/storage';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import type { Appointment } from '@/types/appointments.types';

function buildApptWaUrl(appt: Appointment): string {
  const businessId = storage.getBusinessId() ?? '';
  const template = getWaTemplate(businessId);
  const dateStr = toDateStr(new Date(appt.scheduledAt));
  const message = buildWaMessage(template, {
    nome: appt.client?.name ?? '',
    apelido: (appt.client?.name ?? '').split(' ')[0],
    horario: formatTime(appt.scheduledAt),
    data: formatDayFull(dateStr),
    servico: appt.service?.name ?? '',
    profissional: appt.professional?.name ?? '',
  });
  return buildWaUrl(appt.client?.phone ?? '', message);
}

const BTN =
  'text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors focus:outline-none';
const BTN_DEFAULT = `${BTN} border-gray-200 text-gray-600 hover:bg-gray-50`;
const BTN_DANGER = `${BTN} border-red-200 text-red-600 hover:bg-red-50`;
const BTN_PRIMARY = `${BTN} border-ocean-primary/30 text-ocean-primary hover:bg-ocean-primary/5`;

interface AppointmentCardListProps {
  appointments: Appointment[];
  onEdit: (appt: Appointment) => void;
  onConfirm: (appt: Appointment) => void;
  onCancel: (appt: Appointment) => void;
  onComplete: (appt: Appointment) => void;
  onReschedule: (appt: Appointment) => void;
  onViewClient: (clientId: string) => void;
  onNoShow?: (appt: Appointment) => void;
  onAddService?: (appt: Appointment) => void;
  onNewAppointment?: () => void;
}

export function AppointmentCardList({
  appointments,
  onEdit,
  onConfirm,
  onCancel,
  onComplete,
  onReschedule,
  onViewClient,
  onNoShow,
  onAddService,
  onNewAppointment,
}: AppointmentCardListProps): JSX.Element {
  if (appointments.length === 0) {
    return (
      <div className="glass-card rounded-2xl px-5 py-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ocean-secondary">Nenhum agendamento neste dia.</p>
        {onNewAppointment && (
          <button
            onClick={onNewAppointment}
            className="text-xs font-semibold text-ocean-primary hover:underline focus:outline-none"
          >
            + Novo agendamento
          </button>
        )}
      </div>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );

  return (
    <div className="space-y-2">
      {sorted.map((appt) => {
        const isFuture = new Date(appt.scheduledAt) > new Date();
        const clientPhone = appt.client?.phone ?? null;

        return (
          <div
            key={appt.id}
            className="glass-card rounded-2xl px-4 py-3 flex flex-col gap-2"
          >
            {/* Top row: time + client + whatsapp + status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm font-bold text-ocean-primary shrink-0 tabular-nums">
                  {formatTime(appt.scheduledAt)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <button
                      onClick={() => appt.client?.id && onViewClient(appt.client.id)}
                      className="text-sm font-semibold text-ocean-on-surface truncate hover:underline focus:outline-none text-left"
                    >
                      {appt.client?.name ?? '—'}
                    </button>
                    {isFuture && clientPhone && (
                      <a
                        href={buildApptWaUrl(appt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-green-600 hover:text-green-700 transition-colors"
                        title={`WhatsApp: ${clientPhone}`}
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-ocean-secondary truncate">
                    {appt.service?.name ?? '—'} · {appt.professional?.name ?? '—'}
                    {appt.finalPrice != null && (
                      <span className="ml-1 font-semibold text-ocean-on-surface">
                        · R$ {Number(appt.finalPrice).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <AppointmentStatusBadge status={appt.status} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-1.5 border-t border-ocean-outline-variant/15 pt-2">
              <button onClick={() => onEdit(appt)} className={BTN_DEFAULT}>
                Editar
              </button>
              {appt.status === 'PENDING' && (
                <button onClick={() => onConfirm(appt)} className={BTN_PRIMARY}>
                  Confirmar
                </button>
              )}
              {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                <>
                  <button onClick={() => onReschedule(appt)} className={BTN_DEFAULT}>
                    Reagendar
                  </button>
                  <button onClick={() => onCancel(appt)} className={BTN_DANGER}>
                    Cancelar
                  </button>
                </>
              )}
              {appt.status === 'CONFIRMED' && (
                <button onClick={() => onComplete(appt)} className={BTN_PRIMARY}>
                  Concluir
                </button>
              )}
              {onNoShow && (appt.status === 'PENDING' || appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') && (
                <button onClick={() => onNoShow(appt)} className={BTN_DANGER}>
                  Não Atendido
                </button>
              )}
              {onAddService && (appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                <button onClick={() => onAddService(appt)} className={BTN_DEFAULT}>
                  + Serviço
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
