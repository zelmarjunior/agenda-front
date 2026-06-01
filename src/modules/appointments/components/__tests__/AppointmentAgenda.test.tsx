import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppointmentAgenda } from '../AppointmentAgenda';
import { useAppointments } from '@/modules/appointments/hooks/useAppointments';
import type { Appointment } from '@/types/appointments.types';

vi.mock('@/modules/appointments/hooks/useAppointments');

const makeAppt = (
  id: string,
  scheduledAt: string,
  clientName: string,
  status = 'CONFIRMED',
): Appointment => ({
  id,
  scheduledAt,
  status: status as Appointment['status'],
  client: { id: `c${id}`, name: clientName, phone: null, email: null, notes: null, createdAt: '' },
  professional: {
    id: 'p1',
    name: 'Carlos',
    specialty: null,
    userId: 'u1',
    commissionRate: null,
    phone: null,
    photoUrl: null,
    calendarColor: null,
    createdAt: '',
  },
  service: { id: 's1', name: 'Corte', price: 50, costPrice: null, durationMinutes: 30, description: null, createdAt: '' },
  durationMinutes: 30,
  finalPrice: null,
  paymentMethod: null,
  cancellationReason: null,
  createdAt: '',
});

const defaultReturn = {
  appointments: [
    makeAppt('1', '2099-01-15T10:00:00.000Z', 'Ana Lima'),
    makeAppt('2', '2099-01-15T14:00:00.000Z', 'Bruna Souza', 'PENDING'),
    makeAppt('3', '2099-01-16T09:00:00.000Z', 'Carla Mendes', 'PENDING'),
  ],
  isLoading: false,
  error: null,
  total: 3,
  filters: {},
  setFilters: vi.fn(),
  mutate: vi.fn(),
};

beforeEach(() => {
  vi.mocked(useAppointments).mockReturnValue(defaultReturn);
});

describe('AppointmentAgenda', () => {
  it('renders all client names', () => {
    render(<AppointmentAgenda />);
    expect(screen.getByText('Ana Lima')).toBeDefined();
    expect(screen.getByText('Bruna Souza')).toBeDefined();
    expect(screen.getByText('Carla Mendes')).toBeDefined();
  });

  it('groups into two day sections', () => {
    render(<AppointmentAgenda />);
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBe(2);
  });

  it('shows empty state when no appointments', () => {
    vi.mocked(useAppointments).mockReturnValueOnce({ ...defaultReturn, appointments: [] });
    render(<AppointmentAgenda />);
    expect(screen.getByText('Nenhum agendamento nos próximos 14 dias')).toBeDefined();
  });

  it('shows service and professional info', () => {
    render(<AppointmentAgenda />);
    const items = screen.getAllByText(/Corte · Carlos/);
    expect(items.length).toBeGreaterThan(0);
  });
});
