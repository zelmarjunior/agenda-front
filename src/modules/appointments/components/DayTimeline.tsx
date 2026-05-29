'use client';

import { formatDayFull } from '@/utils/calendar';
import { formatTime } from '@/utils/formatters';
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
};

const APPT_BG_SOLID: Record<string, string> = {
  PENDING: 'rgba(245,158,11,0.10)',
  CONFIRMED: 'rgba(14,165,233,0.10)',
  COMPLETED: 'rgba(0,99,153,0.08)',
  CANCELLED: 'rgba(190,200,210,0.20)',
};

const ACTION_BTN =
  'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 hover:bg-white border border-current/20 transition-colors backdrop-blur-sm';

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
      <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (appt.client?.id) onViewClient(appt.client.id);
                        }}
                        className="text-xs font-bold leading-tight truncate block w-full text-left hover:underline focus:outline-none"
                        title="Ver perfil do cliente"
                      >
                        {appt.client?.name ?? '—'}
                      </button>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(appt);
                          }}
                          className={ACTION_BTN}
                        >
                          Concluir
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
