'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/modules/auth/services/authService';
import { useAuth } from '@/context/AuthContext';
import { getApiError } from '@/services/api';
import { Spinner } from '@/components/common/Spinner';

function VerifyEmailContent(): JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  const { completeAuth } = useAuth();

  const email = params.get('email') ?? '';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) { router.replace('/register'); return; }
    inputRefs.current[0]?.focus();
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const code = digits.join('');
  const isComplete = code.length === 6 && digits.every((d) => d !== '');

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError('');
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? '';
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!isComplete || loading) return;
      setLoading(true);
      setError('');
      try {
        const { token } = await authService.verifyEmail(email, code);
        await completeAuth(token);
      } catch (err) {
        setError(getApiError(err));
        setLoading(false);
      }
    },
    [isComplete, loading, email, code, completeAuth],
  );

  async function handleResend() {
    if (resending || countdown > 0) return;
    setResending(true);
    setResendSuccess(false);
    setError('');
    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
      setCountdown(60);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-14 h-14 rounded-2xl bg-ocean-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-ocean-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white lg:text-ocean-on-surface">Confirme seu e-mail</h1>
        <p className="text-sm text-white/70 lg:text-ocean-on-surface-variant leading-relaxed">
          Enviamos um código de 6 dígitos para<br />
          <span className="font-semibold text-white lg:text-ocean-on-surface">{email}</span>
        </p>
      </div>

      {/* Code input */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none bg-white/10 lg:bg-ocean-surface-container text-white lg:text-ocean-on-surface backdrop-blur-sm
                ${digit ? 'border-ocean-primary' : 'border-white/25 lg:border-ocean-outline-variant/40'}
                focus:border-ocean-primary focus:bg-white/20 lg:focus:bg-ocean-surface-container-high
                ${error ? 'border-red-400' : ''}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}

        {resendSuccess && (
          <p className="text-center text-sm text-green-400">Novo código enviado!</p>
        )}

        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all
            bg-ocean-primary hover:bg-ocean-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-ocean-primary/50"
        >
          {loading ? 'Verificando...' : 'Confirmar e-mail'}
        </button>
      </form>

      {/* Resend */}
      <div className="text-center">
        <p className="text-sm text-white/60 lg:text-ocean-on-surface-variant">
          Não recebeu o código?{' '}
          {countdown > 0 ? (
            <span className="text-white/40 lg:text-ocean-outline">
              Reenviar em {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-ocean-primary hover:underline font-medium disabled:opacity-50"
            >
              {resending ? 'Enviando...' : 'Reenviar código'}
            </button>
          )}
        </p>
      </div>

      {/* Back link */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push('/register')}
          className="text-xs text-white/40 lg:text-ocean-outline hover:text-white/60 lg:hover:text-ocean-on-surface-variant"
        >
          ← Voltar ao cadastro
        </button>
      </div>
    </div>
  );
}

export default function VerificarEmailPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
