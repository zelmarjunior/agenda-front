'use client';

import { buildCalendarGrid, formatMonthYear, toDateStr } from '@/utils/calendar';
import type { Appointment, AppointmentStatus } from '@/types/appointments.types';

/* Ocean Design System — status dots */
const STATUS_DOT: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-400',
  CONFIRMED: 'bg-ocean-accent',
  COMPLETED: 'bg-ocean-tertiary',
  CANCELLED: 'bg-ocean-outline-variant',
};

const BADGE_CLS: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-[#0ea5e9]/15 text-ocean-primary',
  COMPLETED: 'bg-ocean-surface-container-low text-ocean-tertiary',
  CANCELLED: 'bg-ocean-surface-container text-ocean-secondary',
};

function dominantStatus(appts: Appointment[]): AppointmentStatus {
  if (appts.some((a) => a.status === 'PENDING')) return 'PENDING';
  if (appts.some((a) => a.status === 'CONFIRMED')) return 'CONFIRMED';
  if (appts.some((a) => a.status === 'COMPLETED')) return 'COMPLETED';
  return 'CANCELLED';
}

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

interface MonthCalendarProps {
  year: number;
  month: number;
  byDate: Map<string, Appointment[]>;
  selectedDate: string | null;
  onDaySelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isLoading?: boolean;
}

export function MonthCalendar({
  year,
  month,
  byDate,
  selectedDate,
  onDaySelect,
  onPrevMonth,
  onNextMonth,
  isLoading,
}: MonthCalendarProps): JSX.Element {
  const today = toDateStr(new Date());
  const weeks = buildCalendarGrid(year, month);

  return (
    <div className="glass-card rounded-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-ocean-outline-variant/25">
        <button
          onClick={onPrevMonth}
          className="p-1.5 rounded-xl text-ocean-outline hover:text-ocean-on-surface hover:bg-ocean-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-accent"
          aria-label="Mês anterior"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-ocean-on-surface capitalize">
          {formatMonthYear(year, month)}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-1.5 rounded-xl text-ocean-outline hover:text-ocean-on-surface hover:bg-ocean-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-accent"
          aria-label="Próximo mês"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 border-b border-ocean-outline-variant/15 bg-ocean-surface-container-low/40">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-semibold text-ocean-secondary uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.15s' }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day) => {
              const appts = byDate.get(day.dateStr) ?? [];
              const isSelected = day.dateStr === selectedDate;
              const isToday = day.dateStr === today;

              return (
                <button
                  key={day.dateStr}
                  onClick={() => onDaySelect(day.dateStr)}
                  className={[
                    'flex flex-col items-center gap-1 py-2.5 min-h-[62px]',
                    'border-b border-r border-ocean-outline-variant/15 last:border-r-0',
                    'transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ocean-accent',
                    !day.isCurrentMonth ? 'text-ocean-outline-variant' : 'text-ocean-on-surface',
                    isSelected && !isToday ? 'bg-ocean-surface-container-low' : '',
                    !isSelected ? 'hover:bg-ocean-surface-container-low/50' : '',
                  ].join(' ')}
                  aria-label={`${day.dateStr}${appts.length ? `, ${appts.length} agendamento(s)` : ''}`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={[
                      'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full leading-none',
                      isToday ? 'bg-ocean-primary text-white font-bold' : '',
                      isSelected && !isToday
                        ? 'bg-ocean-accent/15 text-ocean-primary font-semibold'
                        : '',
                    ].join(' ')}
                  >
                    {day.dayOfMonth}
                  </span>

                  {appts.length > 0 && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight ${BADGE_CLS[dominantStatus(appts)]}`}
                      >
                        {appts.length}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {appts.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className={`w-1 h-1 rounded-full ${STATUS_DOT[a.status]}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
