'use client';

import { formatDayFull } from '@/utils/calendar';
import { formatTime } from '@/utils/formatters';
import { getWaTemplate, buildWaMessage, buildWaUrl } from '@/utils/whatsapp';
import { storage } from '@/utils/storage';
import type { Appointment } from '@/types/appointments.types';

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_PX = 60;

/* Ocean Design System — appointment status colors */
const APPT_BG: Record<string, string> = {
  PENDING: 'border-amber-300 text-amber-900',
  CONFIRMED: 'border-ocean-tertiary-container text-ocean-primary',
  COMPLETED: 'border-[#58a1dc] text-ocean-tertiary',
  CANCELLED: 'border-ocean-outline-variant text-ocean-secondary',
  NO_SHOW: 'border-red-300 text-red-700',
};

const APPT_BG_SOLID: Record<string, string> = {
  PENDING: 'rgba(245,158,11,0.10)',
  CONFIRMED: 'rgba(14,165,233,0.10)',
  COMPLETED: 'rgba(0,99,153,0.08)',
  CANCELLED: 'rgba(190,200,210,0.20)',
  NO_SHOW: 'rgba(239,68,68,0.08)',
};

const ACTION_BTN =
  'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 hover:bg-white border border-current/20 transition-colors backdrop-blur-sm';

function buildApptWaUrl(appt: Appointment, dateStr: string): string {
  const businessId = storage.getBusinessId() ?? '';
  const template = getWaTemplate(businessId);
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

interface DayTimelineProps {
  dateStr: string;
  appointments: Appointment[];
  onTimeSlotClick: (isoDatetime: string) => void;
  onEdit: (appt: Appointment) => void;
  onConfirm: (appt: Appointment) => void;
  onCancel: (appt: Appointment) => void;
  onComplete: (appt: Appointment) => void;
  onReschedule: (appt: Appointment) => void;
  onViewClient: (clientId: string) => void;
  onAddService?: (appt: Appointment) => void;
  onNoShow?: (appt: Appointment) => void;
}

function topPx(scheduledAt: string): number {
  const d = new Date(scheduledAt);
  return ((d.getHours() - START_HOUR) * 60 + d.getMinutes()) * (HOUR_PX / 60);
}

function heightPx(durationMinutes: number): number {
  return Math.max(durationMinutes * (HOUR_PX / 60), HOUR_PX * 0.6);
}

const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

export function DayTimeline({
  dateStr,
  appointments,
  onTimeSlotClick,
  onEdit,
  onConfirm,
  onCancel,
  onComplete,
  onReschedule,
  onViewClient,
  onAddService,
  onNoShow,
}: DayTimelineProps): JSX.Element {
  const totalPx = (END_HOUR - START_HOUR) * HOUR_PX;

  function clickSlot(hour: number): void {
    const h = String(hour).padStart(2, '0');
    onTimeSlotClick(new Date(`${dateStr}T${h}:00:00`).toISOString());
  }

  const pending = appointments.filter((a) => a.status === 'PENDING');
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED');
  const completed = appointments.filter((a) => a.status === 'COMPLETED');

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Day header */}
      <div className="px-5 py-3.5 border-b border-ocean-outline-variant/25 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-ocean-on-surface capitalize">
          {formatDayFull(dateStr)}
        </h3>
        <div className="flex gap-3 flex-wrap justify-end">
          {pending.length > 0 && (
            <span className="text-[11px] text-amber-600 font-semibold">
              {pending.length} pendente{pending.length > 1 ? 's' : ''}
            </span>
          )}
          {confirmed.length > 0 && (
            <span className="text-[11px] text-ocean-accent font-semibold">
              {confirmed.length} confirmado{confirmed.length > 1 ? 's' : ''}
            </span>
          )}
          {completed.length > 0 && (
            <span className="text-[11px] text-ocean-tertiary font-semibold">
              {completed.length} concluído{completed.length > 1 ? 's' : ''}
            </span>
          )}
          {appointments.length === 0 && (
            <span className="text-[11px] text-ocean-outline">Nenhum agendamento</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: 480 }}>
        <div className="relative flex" style={{ height: totalPx }}>
          {/* Hour labels */}
          <div className="shrink-0 w-14 border-r border-ocean-outline-variant/20 relative">
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-0 left-0 flex justify-end pr-2.5"
                style={{ top: (h - START_HOUR) * HOUR_PX - 7 }}
              >
                <span className="text-[10px] text-ocean-outline font-medium tabular-nums">
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Slots + appointments */}
          <div className="flex-1 relative">
            {HOURS.map((h) => (
              <div
                key={h}
                role="button"
                tabIndex={0}
                aria-label={`Agendar às ${String(h).padStart(2, '0')}:00`}
                className="absolute left-0 right-0 group cursor-pointer transition-colors"
                style={{ top: (h - START_HOUR) * HOUR_PX, height: HOUR_PX }}
                onClick={() => clickSlot(h)}
                onKeyDown={(e) => e.key === 'Enter' && clickSlot(h)}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(14,165,233,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <div className="absolute inset-x-0 top-0 border-t border-ocean-outline-variant/15" />
                <span className="absolute right-2.5 top-1 text-[10px] text-ocean-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity select-none">
                  + agendar
                </span>
              </div>
            ))}

            {/* Appointment blocks */}
            {appointments.map((appt) => {
              const top = topPx(appt.scheduledAt);
              const height = heightPx(appt.durationMinutes);
              const borderCls = APPT_BG[appt.status] ?? APPT_BG.PENDING;
              const bgColor = APPT_BG_SOLID[appt.status] ?? APPT_BG_SOLID.PENDING;
              const isFuture = new Date(appt.scheduledAt) > new Date();
              const clientPhone = appt.client?.phone ?? null;

              return (
                <div
                  key={appt.id}
                  role="button"
                  tabIndex={0}
                  title="Clique para editar"
                  onClick={() => onEdit(appt)}
                  onKeyDown={(e) => e.key === 'Enter' && onEdit(appt)}
                  className={`absolute left-2 right-2 rounded-xl border px-2.5 py-2 z-10 overflow-hidden backdrop-blur-sm cursor-pointer hover:brightness-95 transition-all ${borderCls}`}
                  style={{ top, height, background: bgColor }}
                >
                  <div className="flex items-start justify-between gap-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (appt.client?.id) onViewClient(appt.client.id);
                          }}
                          className="text-xs font-bold leading-tight truncate text-left hover:underline focus:outline-none flex-1 min-w-0"
                          title="Ver perfil do cliente"
                        >
                          {appt.client?.name ?? '—'}
                        </button>
                        {isFuture && clientPhone && (
                          <a
                            href={buildApptWaUrl(appt, dateStr)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 text-green-600 hover:text-green-700 transition-colors"
                            title={`WhatsApp: ${clientPhone}`}
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] opacity-75 truncate">
                        {appt.service?.name ?? '—'} · {appt.professional?.name ?? '—'}
                      </p>
                      <p className="text-[10px] opacity-60 font-medium tabular-nums">
                        {formatTime(appt.scheduledAt)}
                        {appt.finalPrice != null && (
                          <span className="ml-1.5 font-semibold">
                            · R$ {Number(appt.finalPrice).toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {height >= 60 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {appt.status === 'PENDING' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConfirm(appt);
                          }}
                          className={ACTION_BTN}
                        >
                          Confirmar
                        </button>
                      )}
                      {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReschedule(appt);
                            }}
                            className={ACTION_BTN}
                          >
                            Reagendar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancel(appt);
                            }}
                            className={ACTION_BTN}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onComplete(appt); }}
                          className={ACTION_BTN}
                        >
                          Concluir
                        </button>
                      )}
                      {onNoShow && (appt.status === 'PENDING' || appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onNoShow(appt); }}
                          className={`${ACTION_BTN} text-red-600`}
                          title="Marcar como não atendido"
                        >
                          Não Atendido
                        </button>
                      )}
                      {onAddService && (appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddService(appt); }}
                          className={ACTION_BTN}
                          title="Adicionar serviço"
                        >
                          + Serviço
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
