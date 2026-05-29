'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import type { Product } from '@/types/inventory.types';

const schema = z.object({
  quantityChange: z.coerce.number().refine((v) => v !== 0, 'Quantidade não pode ser zero'),
  reason: z.string().min(3, 'Informe o motivo'),
});

type FormValues = z.infer<typeof schema>;

interface StockAdjustmentFormProps {
  product: Product;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function StockAdjustmentForm({
  product,
  onSubmit,
  onCancel,
}: StockAdjustmentFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { quantityChange: 0 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="text-sm text-gray-600">
        Estoque atual de <strong>{product.name}</strong>:{' '}
        <strong>
          {product.currentStock} {product.unit}
        </strong>
      </p>

      <div>
        <label htmlFor="quantityChange" className="block text-sm font-medium text-gray-700 mb-1">
          Ajuste (use negativo para retirada)
        </label>
        <input
          id="quantityChange"
          type="number"
          {...register('quantityChange')}
          className={inputCls}
          aria-invalid={!!errors.quantityChange}
          placeholder="Ex: 10 ou -5"
        />
        {errors.quantityChange && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.quantityChange.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Motivo
        </label>
        <input
          id="reason"
          type="text"
          {...register('reason')}
          className={inputCls}
          aria-invalid={!!errors.reason}
          placeholder="Ex: Compra de fornecedor"
        />
        {errors.reason && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.reason.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" loading={isSubmitting}>
          Ajustar estoque
        </Button>
      </div>
    </form>
  );
}
