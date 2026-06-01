'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import type { Client } from '@/types/clients.types';

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  cpf: z
    .string()
    .optional()
    .refine((v) => !v || cpfRegex.test(v), { message: 'CPF inválido' }),
  birthDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ClientFormProps {
  initial?: Client;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          name: initial.name,
          nickname: initial.nickname ?? '',
          phone: initial.phone ?? '',
          email: initial.email ?? '',
          cpf: initial.cpf ?? '',
          birthDate: initial.birthDate ? initial.birthDate.slice(0, 10) : '',
        }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome <span className="text-red-500">*</span>
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
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
            Apelido
          </label>
          <input
            id="nickname"
            type="text"
            {...register('nickname')}
            className={inputCls}
            placeholder="Como prefere ser chamado(a)"
          />
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data de aniversário
          </label>
          <input
            id="birthDate"
            type="date"
            {...register('birthDate')}
            className={inputCls}
          />
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
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            {...register('cpf')}
            className={inputCls}
            placeholder="000.000.000-00"
            aria-invalid={!!errors.cpf}
          />
          {errors.cpf && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.cpf.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
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
