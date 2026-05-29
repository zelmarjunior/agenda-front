import { describe, it, expect } from 'vitest';
import { getByDate, getDayAppointments } from '../appointmentCalendar';
import type { Appointment } from '@/types/appointments.types';

function makeAppt(
  id: string,
  scheduledAt: string,
  status: Appointment['status'] = 'CONFIRMED',
): Appointment {
  return {
    id,
    scheduledAt,
    status,
    durationMinutes: 60,
    client: { id: 'c1', name: 'Ana', phone: null, email: null, createdAt: '' },
    professional: {
      id: 'p1',
      name: 'Carlos',
      specialty: null,
      userId: 'u1',
      commissionRate: null,
      createdAt: '',
    },
    service: {
      id: 's1',
      name: 'Corte',
      price: 50,
      durationMinutes: 60,
      description: null,
      createdAt: '',
    },
    cancellationReason: null,
    createdAt: '',
  };
}

// Use local ISO strings (no timezone suffix) so tests behave the same regardless of the machine's timezone.
// e.g. "2026-05-28T10:00:00" is treated as local time everywhere.
const LOCAL_MAY_28_10H = '2026-05-28T10:00:00';
const LOCAL_MAY_28_14H = '2026-05-28T14:00:00';
const LOCAL_MAY_29_09H = '2026-05-29T09:00:00';
const LOCAL_JUN_01_09H = '2026-06-01T09:00:00';

describe('getByDate', () => {
  it('groups appointments on the same local day under the same key', () => {
    const appts = [makeAppt('1', LOCAL_MAY_28_10H), makeAppt('2', LOCAL_MAY_28_14H)];
    const map = getByDate(appts, 2026, 4); // May = month 4
    expect(map.get('2026-05-28')).toHaveLength(2);
  });

  it('separates appointments on different days', () => {
    const appts = [makeAppt('1', LOCAL_MAY_28_10H), makeAppt('2', LOCAL_MAY_29_09H)];
    const map = getByDate(appts, 2026, 4);
    expect(map.get('2026-05-28')).toHaveLength(1);
    expect(map.get('2026-05-29')).toHaveLength(1);
  });

  it('excludes appointments from other months', () => {
    const appts = [makeAppt('1', LOCAL_MAY_28_10H), makeAppt('2', LOCAL_JUN_01_09H)];
    const map = getByDate(appts, 2026, 4); // May only
    expect(map.get('2026-05-28')).toHaveLength(1);
    expect(map.has('2026-06-01')).toBe(false);
  });

  it('returns an empty map when there are no appointments', () => {
    const map = getByDate([], 2026, 4);
    expect(map.size).toBe(0);
  });

  it('returns an empty map when no appointments match the month', () => {
    const appts = [makeAppt('1', LOCAL_JUN_01_09H)];
    const map = getByDate(appts, 2026, 4); // May — no match
    expect(map.size).toBe(0);
  });

  it('uses local date as key (YYYY-MM-DD format)', () => {
    const appts = [makeAppt('1', LOCAL_MAY_28_10H)];
    const map = getByDate(appts, 2026, 4);
    const keys = Array.from(map.keys());
    expect(keys[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(keys[0]).toBe('2026-05-28');
  });
});

describe('getDayAppointments', () => {
  it('returns appointments for the specified date', () => {
    const appts = [
      makeAppt('1', LOCAL_MAY_28_10H),
      makeAppt('2', LOCAL_MAY_28_14H),
      makeAppt('3', LOCAL_MAY_29_09H),
    ];
    const result = getDayAppointments(appts, '2026-05-28');
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.id)).toEqual(['1', '2']);
  });

  it('returns an empty array when no appointments match the date', () => {
    const appts = [makeAppt('1', LOCAL_MAY_28_10H)];
    const result = getDayAppointments(appts, '2026-05-30');
    expect(result).toHaveLength(0);
  });

  it('returns appointments sorted by scheduledAt ascending', () => {
    const appts = [makeAppt('2', LOCAL_MAY_28_14H), makeAppt('1', LOCAL_MAY_28_10H)];
    const result = getDayAppointments(appts, '2026-05-28');
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('returns an empty array when the input list is empty', () => {
    const result = getDayAppointments([], '2026-05-28');
    expect(result).toHaveLength(0);
  });
});
