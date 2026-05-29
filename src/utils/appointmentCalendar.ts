import { toDateStr } from './calendar';
import type { Appointment } from '@/types/appointments.types';

/** Groups appointments by LOCAL calendar date for the given year/month. */
export function getByDate(
  appointments: Appointment[],
  year: number,
  month: number,
): Map<string, Appointment[]> {
  const map = new Map<string, Appointment[]>();
  for (const a of appointments) {
    const d = new Date(a.scheduledAt);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const key = toDateStr(d);
    map.set(key, [...(map.get(key) ?? []), a]);
  }
  return map;
}

/** Returns appointments on a given LOCAL date string (YYYY-MM-DD), sorted by time. */
export function getDayAppointments(appointments: Appointment[], dateStr: string): Appointment[] {
  return appointments
    .filter((a) => toDateStr(new Date(a.scheduledAt)) === dateStr)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
}
