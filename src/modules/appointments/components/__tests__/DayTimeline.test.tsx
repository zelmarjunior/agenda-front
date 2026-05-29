import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DayTimeline } from '../DayTimeline';
import type { Appointment } from '@/types/appointments.types';

function makeAppt(
  id: string,
  scheduledAt: string,
  status: Appointment['status'] = 'CONFIRMED',
  durationMinutes = 60,
): Appointment {
  return {
    id,
    scheduledAt,
    status,
    durationMinutes,
    client: { id: 'c1', name: 'Ana Lima', phone: null, email: null, createdAt: '' },
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
      durationMinutes,
      description: null,
      createdAt: '',
    },
    cancellationReason: null,
    createdAt: '',
  };
}

const noop = vi.fn();
const defaultProps = {
  dateStr: '2026-05-28',
  appointments: [],
  onTimeSlotClick: noop,
  onConfirm: noop,
  onCancel: noop,
  onComplete: noop,
};

describe('DayTimeline', () => {
  it('renders "Nenhum agendamento" when appointments list is empty', () => {
    render(<DayTimeline {...defaultProps} />);
    expect(screen.getByText('Nenhum agendamento')).toBeInTheDocument();
  });

  it('shows client name for each appointment', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00'), makeAppt('2', '2026-05-28T14:00:00')];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getAllByText('Ana Lima')).toHaveLength(2);
  });

  it('shows service and professional name inside each block', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00')];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText(/Corte · Carlos/)).toBeInTheDocument();
  });

  it('shows pending count in header', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'PENDING')];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText('1 pendente')).toBeInTheDocument();
  });

  it('shows confirmed count in header', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'CONFIRMED')];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText('1 confirmado')).toBeInTheDocument();
  });

  it('shows completed count in header', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'COMPLETED')];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText('1 concluído')).toBeInTheDocument();
  });

  it('shows "Confirmar" button for PENDING appointment with 60min duration', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'PENDING', 60)];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('shows "Concluir" button for CONFIRMED appointment with 60min duration', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'CONFIRMED', 60)];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText('Concluir')).toBeInTheDocument();
  });

  it('shows "Cancelar" button for PENDING appointment with 60min duration', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'PENDING', 60)];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('calls onConfirm when "Confirmar" is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'PENDING', 60)];
    render(<DayTimeline {...defaultProps} appointments={appts} onConfirm={onConfirm} />);
    await user.click(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalledWith(appts[0]);
  });

  it('calls onCancel when "Cancelar" is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'PENDING', 60)];
    render(<DayTimeline {...defaultProps} appointments={appts} onCancel={onCancel} />);
    await user.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledWith(appts[0]);
  });

  it('calls onComplete when "Concluir" is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'CONFIRMED', 60)];
    render(<DayTimeline {...defaultProps} appointments={appts} onComplete={onComplete} />);
    await user.click(screen.getByText('Concluir'));
    expect(onComplete).toHaveBeenCalledWith(appts[0]);
  });

  it('calls onTimeSlotClick when an hour slot is clicked', async () => {
    const user = userEvent.setup();
    const onTimeSlotClick = vi.fn();
    render(<DayTimeline {...defaultProps} onTimeSlotClick={onTimeSlotClick} />);
    const slot = screen.getByRole('button', { name: /Agendar às 09:00/ });
    await user.click(slot);
    expect(onTimeSlotClick).toHaveBeenCalledOnce();
    const arg: string = onTimeSlotClick.mock.calls[0][0];
    expect(arg).toContain('2026-05-28');
  });

  it('does not show action buttons for CANCELLED appointments', () => {
    const appts = [makeAppt('1', '2026-05-28T10:00:00', 'CANCELLED', 90)];
    render(<DayTimeline {...defaultProps} appointments={appts} />);
    expect(screen.queryByText('Confirmar')).toBeNull();
    expect(screen.queryByText('Cancelar')).toBeNull();
    expect(screen.queryByText('Concluir')).toBeNull();
  });
});
