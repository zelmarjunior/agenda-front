'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import type { Professional } from '@/types/professionals.types';

interface FormValues {
  name: string;
  email?: string;
  password?: string;
  specialty?: string;
  commissionRate?: number;
  phone?: string;
  calendarColor?: string;
}

interface ProfessionalFormProps {
  initial?: Professional;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function ProfessionalForm({
  initial,
  onSubmit,
  onCancel,
}: ProfessionalFormProps): JSX.Element {
  const isCreate = !initial;

  const schema = z.object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: isCreate
      ? z.string().min(1, 'E-mail obrigatório').email('E-mail inválido')
      : z.string().optional(),
    password: isCreate ? z.string().min(6, 'Mínimo 6 caracteres') : z.string().optional(),
    specialty: z.string().optional(),
    commissionRate: z.coerce.number().min(0).max(100).optional(),
    phone: z.string().optional(),
    calendarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional().or(z.literal('')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: initial
      ? {
          name: initial.name,
          specialty: initial.specialty ?? '',
          commissionRate: initial.commissionRate ?? undefined,
          phone: initial.phone ?? '',
          calendarColor: initial.calendarColor ?? '',
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

      {isCreate && (
        <>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={inputCls}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={inputCls}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </>
      )}

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
          Especialidade
        </label>
        <input
          id="specialty"
          type="text"
          {...register('specialty')}
          className={inputCls}
          placeholder="Ex: Manicure, Cabeleireiro"
        />
      </div>

      <div>
        <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-1">
          Comissão (%)
        </label>
        <input
          id="commissionRate"
          type="number"
          step="0.01"
          min="0"
          max="100"
          {...register('commissionRate')}
          className={inputCls}
          placeholder="Ex: 40"
        />
        {errors.commissionRate && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.commissionRate.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className={inputCls}
          placeholder="(11) 99999-9999"
        />
      </div>

      <div>
        <label htmlFor="calendarColor" className="block text-sm font-medium text-gray-700 mb-1">
          Cor no calendário
        </label>
        <div className="flex items-center gap-3">
          <input
            id="calendarColor"
            type="color"
            {...register('calendarColor')}
            className="h-9 w-16 cursor-pointer rounded-lg border border-gray-300 p-0.5"
          />
          <span className="text-xs text-gray-500">Cor usada para identificar o profissional na agenda</span>
        </div>
        {errors.calendarColor && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.calendarColor.message}
          </p>
        )}
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
