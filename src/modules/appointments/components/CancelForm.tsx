'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';

const schema = z.object({ reason: z.string().min(3, 'Informe o motivo do cancelamento') });
type FormValues = z.infer<typeof schema>;

interface CancelFormProps {
  onSubmit: (reason: string) => Promise<void>;
  onCancel: () => void;
}

export function CancelForm({ onSubmit, onCancel }: CancelFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v.reason))} noValidate className="space-y-4">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Motivo do cancelamento
        </label>
        <textarea
          id="reason"
          rows={3}
          {...register('reason')}
          aria-invalid={!!errors.reason}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Ex: cliente desmarcou por motivo pessoal"
        />
        {errors.reason && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.reason.message}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Voltar
        </Button>
        <Button type="submit" variant="danger" size="sm" loading={isSubmitting}>
          Cancelar agendamento
        </Button>
      </div>
    </form>
  );
}
