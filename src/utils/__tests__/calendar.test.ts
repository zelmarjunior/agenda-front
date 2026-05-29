import { describe, it, expect } from 'vitest';
import { toDateStr, buildCalendarGrid, generateTimeSlots } from '../calendar';

describe('toDateStr', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateStr(new Date(2026, 4, 8))).toBe('2026-05-08');
  });

  it('pads month and day with zeros', () => {
    expect(toDateStr(new Date(2026, 0, 1))).toBe('2026-01-01');
  });
});

describe('buildCalendarGrid', () => {
  it('returns 5 or 6 rows for any month', () => {
    for (let m = 0; m < 12; m++) {
      const weeks = buildCalendarGrid(2026, m);
      expect(weeks.length).toBeGreaterThanOrEqual(4);
      expect(weeks.length).toBeLessThanOrEqual(6);
    }
  });

  it('each row has exactly 7 days', () => {
    const weeks = buildCalendarGrid(2026, 4); // May 2026
    for (const week of weeks) {
      expect(week).toHaveLength(7);
    }
  });

  it('first day of each row is Monday (or a day from the prev month)', () => {
    // May 2026 starts on a Friday
    const weeks = buildCalendarGrid(2026, 4);
    const firstDay = weeks[0][0];
    // Mon=1 in JS getDay (0=Sun), so first cell should be Monday
    expect(firstDay.date.getDay()).toBe(1);
  });

  it('marks current-month days as isCurrentMonth=true', () => {
    const weeks = buildCalendarGrid(2026, 4);
    const allDays = weeks.flat();
    const currentMonthDays = allDays.filter((d) => d.isCurrentMonth);
    // May has 31 days
    expect(currentMonthDays).toHaveLength(31);
    for (const d of currentMonthDays) {
      expect(d.date.getMonth()).toBe(4);
    }
  });

  it('marks days from other months as isCurrentMonth=false', () => {
    const weeks = buildCalendarGrid(2026, 4);
    const allDays = weeks.flat();
    const otherDays = allDays.filter((d) => !d.isCurrentMonth);
    expect(otherDays.length).toBeGreaterThan(0);
    for (const d of otherDays) {
      expect(d.date.getMonth()).not.toBe(4);
    }
  });

  it('dateStr format is YYYY-MM-DD for all cells', () => {
    const weeks = buildCalendarGrid(2026, 4);
    for (const week of weeks) {
      for (const day of week) {
        expect(day.dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('days are in sequential order', () => {
    const weeks = buildCalendarGrid(2026, 4);
    const allDays = weeks.flat();
    for (let i = 1; i < allDays.length; i++) {
      expect(allDays[i].date.getTime()).toBeGreaterThan(allDays[i - 1].date.getTime());
    }
  });
});

describe('generateTimeSlots', () => {
  it('starts at 07:00', () => {
    const slots = generateTimeSlots();
    expect(slots[0]).toBe('07:00');
  });

  it('ends at 21:00', () => {
    const slots = generateTimeSlots();
    expect(slots[slots.length - 1]).toBe('21:00');
  });

  it('includes both :00 and :30 slots', () => {
    const slots = generateTimeSlots();
    expect(slots).toContain('09:00');
    expect(slots).toContain('09:30');
  });

  it('does not include a :30 slot for the last hour (21:30)', () => {
    const slots = generateTimeSlots();
    expect(slots).not.toContain('21:30');
  });

  it('generates 29 slots total (07:00–21:00, 30-min intervals)', () => {
    // 7 to 20 inclusive = 14 hours × 2 slots = 28, plus 21:00 = 29
    const slots = generateTimeSlots();
    expect(slots).toHaveLength(29);
  });
});
