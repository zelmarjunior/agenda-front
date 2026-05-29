'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { formatDateTime } from '@/utils/formatters';
import type { Appointment } from '@/types/appointments.types';

const schema = z.object({
  scheduledAt: z.string().min(1, 'Selecione o novo horário'),
  reason: z.string().min(3, 'Informe o motivo do reagendamento'),
});

type FormValues = z.infer<typeof schema>;

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface RescheduleFormProps {
  appointment: Appointment;
  onSubmit: (scheduledAt: string, reason: string) => Promise<void>;
  onCancel: () => void;
}

export function RescheduleForm({
  appointment,
  onSubmit,
  onCancel,
}: RescheduleFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scheduledAt: toDatetimeLocal(appointment.scheduledAt),
      reason: '',
    },
  });

  async function onValid(values: FormValues): Promise<void> {
    await onSubmit(new Date(values.scheduledAt).toISOString(), values.reason);
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="space-y-4">
      {/* Current appointment info */}
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)' }}
      >
        <p className="text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1">
          Horário atual
        </p>
        <p className="font-semibold text-ocean-on-surface">
          {formatDateTime(appointment.scheduledAt)}
        </p>
        <p className="text-xs text-ocean-secondary mt-0.5">
          {appointment.service?.name} · {appointment.client?.name}
        </p>
      </div>

      {/* New datetime */}
      <div>
        <label
          htmlFor="scheduledAt"
          className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5"
        >
          Novo horário
        </label>
        <input
          id="scheduledAt"
          type="datetime-local"
          className="ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface"
          {...register('scheduledAt')}
          aria-invalid={!!errors.scheduledAt}
        />
        {errors.scheduledAt && (
          <p role="alert" className="mt-1.5 text-xs text-ocean-error">
            {errors.scheduledAt.message}
          </p>
        )}
      </div>

      {/* Reason */}
      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5"
        >
          Motivo do reagendamento
        </label>
        <textarea
          id="reason"
          rows={3}
          className="ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface placeholder:text-ocean-outline resize-none"
          placeholder="Ex: solicitação do cliente, conflito de agenda..."
          {...register('reason')}
          aria-invalid={!!errors.reason}
        />
        {errors.reason && (
          <p role="alert" className="mt-1.5 text-xs text-ocean-error">
            {errors.reason.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          Reagendar
        </Button>
      </div>
    </form>
  );
}
