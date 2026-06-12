'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { storage } from '@/utils/storage';
import { getApiError } from '@/services/api';

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function LoginForm(): JSX.Element {
  const { login } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmailVal] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleContinuar(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setEmailError('E-mail inválido');
      return;
    }
    setEmailError('');
    setStep(2);
  }

  async function handleEntrar(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      let businessId = storage.getLastBusiness()?.businessId ?? null;

      if (!businessId) {
        const { authService } = await import('@/modules/auth/services/authService');
        const businesses = await authService.lookupBusinesses(email);
        if (!businesses.length) {
          toast('Nenhum negócio encontrado para este e-mail.', 'error');
          return;
        }
        businessId = businesses[0].id;
        storage.setLastBusiness({ businessId: businesses[0].id, businessName: businesses[0].name });
      }

      await login({ email, password, businessId });
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface placeholder:text-ocean-outline';

  const btnCls =
    'w-full text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm';

  return (
    <div
      className="glass-card rounded-2xl p-8"
      style={{ boxShadow: '0 24px 64px rgba(155,95,224,0.14)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8">
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
              fontSize: '1.6rem',
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GLOWSY
          </h1>
          <p className="text-xs font-medium text-ocean-secondary">
            {step === 1 ? 'Informe seu e-mail para continuar' : `Entrando como ${email}`}
          </p>
        </div>
      </div>

      {/* Step bar */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="h-1.5 flex-1 rounded-full"
          style={{ background: 'linear-gradient(90deg, #5B6CF0, #9B5FE0)' }}
        />
        <div
          className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{
            background:
              step === 2
                ? 'linear-gradient(90deg, #9B5FE0, #E85FC0)'
                : '#C9C0E0',
          }}
        />
      </div>

      {step === 1 && (
        <form onSubmit={handleContinuar} noValidate>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              className={inputCls}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmailVal(e.target.value); setEmailError(''); }}
              aria-invalid={!!emailError}
            />
            {emailError && (
              <p role="alert" className="mt-1.5 text-xs text-ocean-error">{emailError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={btnCls}
            style={{ background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)' }}
          >
            Continuar →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleEntrar} noValidate>
          {storage.getLastBusiness() && (
            <div
              className="mb-5 rounded-xl px-4 py-3 border"
              style={{ background: 'rgba(155,95,224,0.07)', borderColor: 'rgba(155,95,224,0.25)' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9B5FE0' }}>
                Negócio
              </p>
              <p className="text-sm font-bold text-ocean-on-surface mt-0.5">
                {storage.getLastBusiness()?.businessName}
              </p>
            </div>
          )}
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-semibold text-ocean-on-surface-variant mb-1.5">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className={inputCls}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={btnCls}
            style={{ background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
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
          className="font-semibold transition-colors focus:outline-none focus:underline"
          style={{ color: '#9B5FE0' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#5B6CF0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9B5FE0')}
        >
          Criar conta
        </a>
      </p>
    </div>
  );
}
