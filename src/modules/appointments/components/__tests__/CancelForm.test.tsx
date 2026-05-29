import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CancelForm } from '../CancelForm';

describe('CancelForm', () => {
  it('shows validation error when submitting empty reason', async () => {
    render(<CancelForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar agendamento' }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('shows validation error for reason shorter than 3 chars', async () => {
    render(<CancelForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), 'ab');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar agendamento' }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with reason when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CancelForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), 'Cliente cancelou por motivo pessoal');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar agendamento' }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Cliente cancelou por motivo pessoal');
    });
  });

  it('calls onCancel when Voltar is clicked', async () => {
    const onCancel = vi.fn();
    render(<CancelForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
