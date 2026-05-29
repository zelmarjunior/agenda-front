'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { storage } from '@/utils/storage';
import { getApiError } from '@/services/api';

const step1Schema = z.object({
  email: z.string().email('E-mail inválido'),
});

const step2Schema = z.object({
  password: z.string().min(1, 'Senha obrigatória'),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

export function LoginForm(): JSX.Element {
  const { login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [storedBusiness, setStoredBusiness] = useState<{
    businessId: string;
    businessName: string;
  } | null>(null);

  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Values>({ resolver: zodResolver(step2Schema) });

  function handleStep1(values: Step1Values): void {
    const last = storage.getLastBusiness();
    setEmail(values.email);
    setStoredBusiness(last);
    setStep(2);
  }

  async function handleStep2(values: Step2Values): Promise<void> {
    if (!storedBusiness) {
      toast('Negócio não encontrado. Faça o registro primeiro.', 'error');
      setStep(1);
      return;
    }
    try {
      await login({ email, password: values.password, businessId: storedBusiness.businessId });
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
      <div className="flex items-center gap-3 mb-8">
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
          <h1 className="text-xl font-bold text-ocean-on-surface tracking-tight">Agenda</h1>
          <p className="text-xs font-medium text-ocean-secondary">
            {step === 1 ? 'Informe seu e-mail para continuar' : `Entrando como ${email}`}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{ background: '#0ea5e9' }}
        />
        <div
          className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{ background: step === 2 ? '#0ea5e9' : '#bec8d2' }}
        />
      </div>

      {step === 1 && (
        <form onSubmit={form1.handleSubmit(handleStep1)} noValidate>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              className="ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface placeholder:text-ocean-outline"
              placeholder="seu@email.com"
              {...form1.register('email')}
              aria-invalid={!!form1.formState.errors.email}
              aria-describedby={form1.formState.errors.email ? 'email-error' : undefined}
            />
            {form1.formState.errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs text-ocean-error">
                {form1.formState.errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={form1.formState.isSubmitting}
            className="w-full bg-ocean-primary text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#004c6e] focus:outline-none focus:ring-2 focus:ring-ocean-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm shadow-ocean-primary/25"
          >
            Continuar →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={form2.handleSubmit(handleStep2)} noValidate>
          {storedBusiness && (
            <div
              className="mb-5 rounded-xl px-4 py-3 border"
              style={{
                background: 'rgba(14,165,233,0.08)',
                borderColor: 'rgba(14,165,233,0.25)',
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ocean-primary">
                Negócio
              </p>
              <p className="text-sm font-bold text-ocean-on-surface mt-0.5">
                {storedBusiness.businessName}
              </p>
            </div>
          )}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface placeholder:text-ocean-outline"
              placeholder="••••••••"
              {...form2.register('password')}
              aria-invalid={!!form2.formState.errors.password}
              aria-describedby={form2.formState.errors.password ? 'password-error' : undefined}
            />
            {form2.formState.errors.password && (
              <p id="password-error" role="alert" className="mt-1.5 text-xs text-ocean-error">
                {form2.formState.errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={form2.formState.isSubmitting}
            className="w-full bg-ocean-primary text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#004c6e] focus:outline-none focus:ring-2 focus:ring-ocean-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm shadow-ocean-primary/25"
          >
            {form2.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-3 w-full text-sm text-ocean-secondary hover:text-ocean-on-surface focus:outline-none transition-colors"
          >
            ← Trocar e-mail
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ocean-secondary">
        Novo negócio?{' '}
        <a
          href="/register"
          className="text-ocean-primary font-semibold hover:text-ocean-accent transition-colors focus:outline-none focus:underline"
        >
          Criar conta
        </a>
      </p>
    </div>
  );
}
