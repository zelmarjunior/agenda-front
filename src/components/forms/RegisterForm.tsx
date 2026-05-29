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
    ownerIsAlsoProfessional: z.boolean(),
    ownerSpecialty: z.string().max(255).optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })
  .refine((d) => !d.ownerIsAlsoProfessional || !!d.ownerSpecialty?.trim(), {
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
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5"
      >
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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ownerIsAlsoProfessional: false },
  });

  const isOwnerProfessional = useWatch({ control, name: 'ownerIsAlsoProfessional' });

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      await registerUser({
        businessName: values.businessName,
        address: values.address,
        phone: values.phone,
        email: values.email,
        password: values.password,
        ownerIsAlsoProfessional: values.ownerIsAlsoProfessional,
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
      style={{ boxShadow: '0 24px 64px rgba(0,101,145,0.12)' }}
    >
      {/* Brand mark */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #006591)' }}
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-ocean-on-surface tracking-tight">Criar negócio</h1>
          <p className="text-xs font-medium text-ocean-secondary">Configure seu salão ou negócio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field id="businessName" label="Nome do negócio" error={errors.businessName?.message}>
          <input
            id="businessName"
            type="text"
            autoComplete="organization"
            className={inputCls}
            placeholder="Salão da Maria"
            {...register('businessName')}
            aria-invalid={!!errors.businessName}
            aria-describedby={errors.businessName ? 'businessName-error' : undefined}
          />
        </Field>

        <Field id="address" label="Endereço" error={errors.address?.message}>
          <input
            id="address"
            type="text"
            autoComplete="street-address"
            className={inputCls}
            placeholder="Rua das Flores, 123 — São Paulo/SP"
            {...register('address')}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
        </Field>

        <Field id="phone" label="Telefone" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={inputCls}
            placeholder="(11) 99999-9999"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
        </Field>

        <Field id="email" label="E-mail" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputCls}
            placeholder="contato@seusalao.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>

        <Field id="password" label="Senha" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={inputCls}
            placeholder="Mínimo 8 caracteres"
            {...register('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
        </Field>

        <Field id="confirmPassword" label="Confirmar senha" error={errors.confirmPassword?.message}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={inputCls}
            placeholder="Repita a senha"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          />
        </Field>

        <div className="mb-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('ownerIsAlsoProfessional')}
              className="rounded border-ocean-outline-variant text-ocean-primary focus:ring-ocean-accent"
            />
            <span className="text-sm text-ocean-secondary group-hover:text-ocean-on-surface transition-colors">
              Também sou profissional (ex: cabeleireiro)
            </span>
          </label>
        </div>

        {isOwnerProfessional && (
          <Field id="ownerSpecialty" label="Especialidade" error={errors.ownerSpecialty?.message}>
            <input
              id="ownerSpecialty"
              type="text"
              className={inputCls}
              placeholder="Cabeleireiro, Manicure, Barbeiro..."
              {...register('ownerSpecialty')}
              aria-invalid={!!errors.ownerSpecialty}
              aria-describedby={errors.ownerSpecialty ? 'ownerSpecialty-error' : undefined}
            />
          </Field>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-ocean-primary text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#004c6e] focus:outline-none focus:ring-2 focus:ring-ocean-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm shadow-ocean-primary/25"
        >
          {isSubmitting ? 'Criando negócio...' : 'Criar negócio'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ocean-secondary">
        Já tem conta?{' '}
        <a
          href="/login"
          className="text-ocean-primary font-semibold hover:text-ocean-accent transition-colors focus:outline-none focus:underline"
        >
          Entrar
        </a>
      </p>
    </div>
  );
}
