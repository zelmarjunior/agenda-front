import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppointmentStatusBadge } from '../AppointmentStatusBadge';

describe('AppointmentStatusBadge', () => {
  it('shows "Pendente" for PENDING status', () => {
    render(<AppointmentStatusBadge status="PENDING" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('shows "Confirmado" for CONFIRMED status', () => {
    render(<AppointmentStatusBadge status="CONFIRMED" />);
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
  });

  it('shows "Cancelado" for CANCELLED status', () => {
    render(<AppointmentStatusBadge status="CANCELLED" />);
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('shows "Concluído" for COMPLETED status', () => {
    render(<AppointmentStatusBadge status="COMPLETED" />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });
});
