'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import type { Product, ProductType } from '@/types/inventory.types';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  unit: z.string().min(1, 'Unidade obrigatória'),
  type: z.enum(['SERVICE_USE', 'RETAIL']),
  minimumStock: z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  initial?: Product;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: 'SERVICE_USE', label: 'Uso em serviço' },
  { value: 'RETAIL', label: 'Venda no varejo' },
];

export function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: initial
      ? {
          name: initial.name,
          unit: initial.unit,
          type: initial.type,
          minimumStock: initial.minimumStock,
        }
      : { type: 'SERVICE_USE', minimumStock: 0 },
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unidade
          </label>
          <input
            id="unit"
            type="text"
            {...register('unit')}
            className={inputCls}
            placeholder="ml, g, un"
            aria-invalid={!!errors.unit}
          />
          {errors.unit && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.unit.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select id="type" {...register('type')} className={inputCls}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700 mb-1">
          Estoque mínimo
        </label>
        <input
          id="minimumStock"
          type="number"
          min="0"
          {...register('minimumStock')}
          className={inputCls}
        />
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
