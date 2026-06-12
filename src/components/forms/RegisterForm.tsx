'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';

const schema = z
  .object({
    businessName: z.string().min(2, 'Nome do negócio muito curto').max(255),
    address: z.string().min(5, 'Endereço muito curto').max(500),
    phone: z.string().min(10, 'Telefone inválido').max(20),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirmPassword: z.string(),
    soloMode: z.boolean(),
    ownerSpecialty: z.string().max(255).optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })
  .refine((d) => !d.soloMode || !!d.ownerSpecialty?.trim(), {
    message: 'Informe sua especialidade',
    path: ['ownerSpecialty'],
  });

type FormValues = z.infer<typeof schema>;

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps): JSX.Element {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-ocean-error">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  'ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface placeholder:text-ocean-outline';

export function RegisterForm(): JSX.Element {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { soloMode: true },
  });

  const soloMode = useWatch({ control, name: 'soloMode' });

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      await registerUser({
        businessName: values.businessName,
        address: values.address,
        phone: values.phone,
        email: values.email,
        password: values.password,
        soloMode: values.soloMode,
        ownerIsAlsoProfessional: values.soloMode ? true : false,
        ownerSpecialty: values.ownerSpecialty,
      });
      toast('Negócio criado com sucesso!', 'success');
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  return (
    <div
      className="glass-card rounded-2xl p-8"
      style={{ boxShadow: '0 24px 64px rgba(155,95,224,0.14)' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow shrink-0"
          style={{ background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)' }}
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
        <div>
          <h1
            className="font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: '1.4rem',
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GLOWSY
          </h1>
          <p className="text-xs font-medium text-ocean-secondary">Configure seu estúdio ou negócio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Modo de operação */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-ocean-on-surface-variant mb-2">Modo de operação</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('soloMode', true, { shouldValidate: true })}
              className="rounded-xl border-2 p-3.5 text-left transition-all focus:outline-none"
              style={{
                borderColor: soloMode ? '#9B5FE0' : '#C9C0E0',
                background: soloMode ? 'rgba(155,95,224,0.06)' : 'transparent',
              }}
            >
              <p
                className="text-sm font-bold"
                style={{ color: soloMode ? '#9B5FE0' : '#0D0B1A' }}
              >
                Solo
              </p>
              <p className="text-[11px] text-ocean-secondary mt-0.5 leading-tight">
                Só eu atendo — sem seleção de profissional
              </p>
            </button>
            <button
              type="button"
              onClick={() => setValue('soloMode', false, { shouldValidate: true })}
              className="rounded-xl border-2 p-3.5 text-left transition-all focus:outline-none"
              style={{
                borderColor: !soloMode ? '#9B5FE0' : '#C9C0E0',
                background: !soloMode ? 'rgba(155,95,224,0.06)' : 'transparent',
              }}
            >
              <p
                className="text-sm font-bold"
                style={{ color: !soloMode ? '#9B5FE0' : '#0D0B1A' }}
              >
                Com equipe
              </p>
              <p className="text-[11px] text-ocean-secondary mt-0.5 leading-tight">
                Tenho outros profissionais
              </p>
            </button>
          </div>
        </div>

        {soloMode && (
          <Field id="ownerSpecialty" label="Sua especialidade" error={errors.ownerSpecialty?.message}>
            <input
              id="ownerSpecialty"
              type="text"
              className={inputCls}
              placeholder="Manicure, Cabeleireiro, Barbeiro..."
              {...register('ownerSpecialty')}
              aria-invalid={!!errors.ownerSpecialty}
              aria-describedby={errors.ownerSpecialty ? 'ownerSpecialty-error' : undefined}
            />
          </Field>
        )}

        <Field id="businessName" label="Nome do negócio" error={errors.businessName?.message}>
          <input id="businessName" type="text" autoComplete="organization" className={inputCls}
            placeholder="Salão da Maria" {...register('businessName')}
            aria-invalid={!!errors.businessName} />
        </Field>

        <Field id="address" label="Endereço" error={errors.address?.message}>
          <input id="address" type="text" autoComplete="street-address" className={inputCls}
            placeholder="Rua das Flores, 123 — São Paulo/SP" {...register('address')}
            aria-invalid={!!errors.address} />
        </Field>

        <Field id="phone" label="Telefone" error={errors.phone?.message}>
          <input id="phone" type="tel" autoComplete="tel" className={inputCls}
            placeholder="(11) 99999-9999" {...register('phone')}
            aria-invalid={!!errors.phone} />
        </Field>

        <Field id="email" label="E-mail" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={inputCls}
            placeholder="contato@seusalao.com" {...register('email')}
            aria-invalid={!!errors.email} />
        </Field>

        <Field id="password" label="Senha" error={errors.password?.message}>
          <input id="password" type="password" autoComplete="new-password" className={inputCls}
            placeholder="Mínimo 8 caracteres" {...register('password')}
            aria-invalid={!!errors.password} />
        </Field>

        <Field id="confirmPassword" label="Confirmar senha" error={errors.confirmPassword?.message}>
          <input id="confirmPassword" type="password" autoComplete="new-password" className={inputCls}
            placeholder="Repita a senha" {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword} />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm"
          style={{ background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)' }}
        >
          {isSubmitting ? 'Criando negócio...' : 'Criar negócio'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ocean-secondary">
        Já tem conta?{' '}
        <a
          href="/login"
          className="font-semibold transition-colors focus:outline-none focus:underline"
          style={{ color: '#9B5FE0' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#5B6CF0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9B5FE0')}
        >
          Entrar
        </a>
      </p>
    </div>
  );
}
