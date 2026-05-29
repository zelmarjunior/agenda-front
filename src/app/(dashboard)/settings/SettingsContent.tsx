'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/common/Spinner';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { businessService } from '@/modules/business/services/businessService';
import { getApiError } from '@/services/api';
import { storage } from '@/utils/storage';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  address: z.string().optional(),
  phone: z.string().optional(),
  allowSelfScheduling: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function SettingsContent(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();

  const {
    data: business,
    isLoading,
    error,
    mutate,
  } = useSWR(businessId ? ['business', businessId] : null, () => businessService.get(businessId));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', address: '', phone: '', allowSelfScheduling: false },
  });

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        address: business.address ?? '',
        phone: business.phone ?? '',
        allowSelfScheduling: business.allowSelfScheduling,
      });
    }
  }, [business, reset]);

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      await businessService.update(businessId, {
        name: values.name,
        address: values.address || undefined,
        phone: values.phone || undefined,
        allowSelfScheduling: values.allowSelfScheduling,
      });
      toast('Configurações salvas!', 'success');
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  return (
    <div>
      <Header title="Configurações" />

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : (
        <div className="max-w-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
          >
            <h2 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
              Dados do negócio
            </h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do negócio
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
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={inputCls}
                placeholder="Rua, número, bairro, cidade"
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

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-agendamento</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Permitir que clientes agendem diretamente pelo link público
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('allowSelfScheduling')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" loading={isSubmitting} disabled={!isDirty}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
