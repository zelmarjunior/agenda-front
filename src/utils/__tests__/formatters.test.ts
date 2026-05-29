import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDuration, formatPhone, formatTime } from '../formatters';

describe('formatCurrency', () => {
  it('formats a number as BRL currency', () => {
    expect(formatCurrency(1500)).toContain('1.500');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toContain('0');
  });
});

describe('formatPhone', () => {
  it('formats 11-digit mobile number', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formats 10-digit landline number', () => {
    expect(formatPhone('1132145678')).toBe('(11) 3214-5678');
  });

  it('returns original if not 10 or 11 digits', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('formatTime', () => {
  it('returns only time portion', () => {
    const result = formatTime('2024-06-15T14:30:00');
    expect(result).toContain('14:30');
  });

  it('accepts a Date object', () => {
    const d = new Date('2024-06-15T09:05:00');
    const result = formatTime(d);
    expect(result).toContain('09:05');
  });
});

describe('formatDuration', () => {
  it('shows minutes when under 60', () => {
    expect(formatDuration(45)).toBe('45min');
  });

  it('shows hours when exactly 60', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  it('shows hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30min');
  });
});
