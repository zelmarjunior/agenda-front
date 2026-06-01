'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { AppointmentDashboardModal } from './AppointmentDashboardModal';
import { useAppointments } from '../hooks/useAppointments';
import { storage } from '@/utils/storage';
import { buildWaUrl, buildWaMessage, getWaTemplate } from '@/utils/whatsapp';
import type { Appointment, AppointmentStatus } from '@/types/appointments.types';

const STATUS_BADGE: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PENDING:    { label: 'Pendente',      variant: 'warning' },
  CONFIRMED:  { label: 'Confirmado',    variant: 'success' },
  CANCELLED:  { label: 'Cancelado',     variant: 'danger'  },
  COMPLETED:  { label: 'Atendido',      variant: 'info'    },
  NO_SHOW:    { label: 'Não Atendido',  variant: 'danger'  },
};


function buildWaHref(appt: Appointment, businessId: string): string {
  const template = getWaTemplate(businessId);
  const scheduled = new Date(appt.scheduledAt);
  const apelido = (appt.client as any).nickname ?? appt.client.name.split(' ')[0];
  const message = buildWaMessage(template, {
    nome: appt.client.name,
    apelido,
    horario: scheduled.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    data: scheduled.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
    servico: appt.service.name,
    profissional: appt.professional.name,
  });
  return buildWaUrl(appt.client.phone!, message);
}

function formatDateHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

interface Props {
  daysCount: number;
}

export function UpcomingAppointmentsPanel({ daysCount }: Props): JSX.Element {
  const businessId = storage.getBusinessId()!;

  const { dateFrom, dateTo } = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() + 1);
    const to = new Date();
    to.setDate(to.getDate() + daysCount);
    return {
      dateFrom: from.toISOString().split('T')[0],
      dateTo: to.toISOString().split('T')[0],
    };
  }, [daysCount]);

  const { appointments, isLoading, mutate } = useAppointments({
    dateFrom,
    dateTo,
    limit: 100,
  });

  const grouped = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appt of appointments) {
      const key = appt.scheduledAt.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), appt]);
    }
    return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }, [appointments]);

  const [editTarget, setEditTarget] = useState<Appointment | null>(null);

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-ocean-outline-variant/30 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ocean-on-surface">
            Próximos {daysCount} dias
          </h2>
          {!isLoading && (
            <span className="text-xs font-medium text-ocean-secondary">
              {appointments.length} agendamento{appointments.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner />
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-10 flex items-center justify-center">
            <p className="text-sm text-ocean-secondary">
              Nenhum agendamento nos próximos {daysCount} dias.
            </p>
          </div>
        ) : (
          <div>
            {[...grouped.entries()].map(([dateKey, appts]) => (
              <div key={dateKey}>
                <div className="px-6 py-2 bg-ocean-surface-container-low/30 border-y border-ocean-outline-variant/20">
                  <p className="text-xs font-semibold text-ocean-secondary capitalize">
                    {formatDateHeader(dateKey)}
                  </p>
                </div>
                <ul className="divide-y divide-ocean-outline-variant/15">
                  {appts.map((appt) => {
                    const status = STATUS_BADGE[appt.status];
                    const time = new Date(appt.scheduledAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    return (
                      <li
                        key={appt.id}
                        onClick={() => setEditTarget(appt)}
                        className="flex items-center gap-3 px-6 py-3 hover:bg-ocean-surface-container-low/50 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ocean-on-surface truncate">
                            {appt.client.name}
                          </p>
                          <p className="text-xs text-ocean-secondary mt-0.5">
                            {time} · {appt.service.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {appt.client.phone && (
                            <a
                              href={buildWaHref(appt, businessId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Enviar WhatsApp"
                              className="text-green-500 hover:text-green-600 shrink-0 transition-colors"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                            </a>
                          )}
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <AppointmentDashboardModal
        appointment={editTarget}
        onClose={() => setEditTarget(null)}
        onMutate={mutate}
      />
    </>
  );
}
