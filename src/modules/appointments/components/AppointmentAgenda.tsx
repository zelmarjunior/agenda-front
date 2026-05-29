'use client';

import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { useAppointments } from '../hooks/useAppointments';
import { formatDate, formatTime } from '@/utils/formatters';
import type { Appointment } from '@/types/appointments.types';

function groupByDay(appointments: Appointment[]): Map<string, Appointment[]> {
  const map = new Map<string, Appointment[]>();
  for (const appt of appointments) {
    const day = appt.scheduledAt.split('T')[0];
    const group = map.get(day) ?? [];
    group.push(appt);
    map.set(day, group);
  }
  return map;
}

function nextDays(n: number): { from: string; to: string } {
  const today = new Date();
  const to = new Date(today);
  to.setDate(today.getDate() + n - 1);
  return {
    from: today.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

export function AppointmentAgenda(): JSX.Element {
  const { from, to } = nextDays(14);
  const { appointments, isLoading } = useAppointments({ dateFrom: from, dateTo: to, limit: 100 });

  const grouped = groupByDay(appointments);
  const days = Array.from(grouped.keys()).sort();

  if (isLoading)
    return (
      <div className="py-16">
        <Spinner />
      </div>
    );

  if (days.length === 0) {
    return (
      <EmptyState
        title="Nenhum agendamento nos próximos 14 dias"
        description="Crie um novo agendamento para vê-lo aqui."
      />
    );
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const appts = grouped.get(day)!;
        const dateLabel = formatDate(new Date(day + 'T12:00:00'));
        return (
          <section key={day} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">{dateLabel}</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {appts.map((appt) => (
                <li key={appt.id} className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-blue-600 shrink-0 w-12">
                      {formatTime(appt.scheduledAt)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {appt.client.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {appt.service.name} · {appt.professional.name}
                      </p>
                    </div>
                  </div>
                  <AppointmentStatusBadge status={appt.status} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
