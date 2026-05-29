'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import type { Service } from '@/types/services.types';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Valor deve ser positivo'),
  durationMinutes: z.coerce.number().int().min(5, 'Mínimo 5 minutos'),
});

type FormValues = z.infer<typeof schema>;

interface ServiceFormProps {
  initial?: Service;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function ServiceForm({ initial, onSubmit, onCancel }: ServiceFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description ?? '',
          price: initial.price,
          durationMinutes: initial.durationMinutes,
        }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={inputCls}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          rows={2}
          {...register('description')}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register('price')}
            className={inputCls}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.price.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
            Duração (min)
          </label>
          <input
            id="durationMinutes"
            type="number"
            min="5"
            step="5"
            {...register('durationMinutes')}
            className={inputCls}
            aria-invalid={!!errors.durationMinutes}
          />
          {errors.durationMinutes && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.durationMinutes.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" loading={isSubmitting}>
          {initial ? 'Salvar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}
