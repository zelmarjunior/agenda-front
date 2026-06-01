'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { storage } from '@/utils/storage';
import { getApiError } from '@/services/api';

export default function TrocarSenhaPage(): JSX.Element {
  const { mustChangePassword, professionalId } = useAuth();
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!mustChangePassword) {
    router.replace('/');
    return <></>;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('A nova senha deve ter pelo menos 6 caracteres.'); return; }
    if (newPassword !== confirm) { setError('As senhas não coincidem.'); return; }

    setLoading(true);
    try {
      await api.patch('/me/password', { oldPassword, newPassword });
      // Redirect to home after successful change
      router.push('/');
      window.location.reload();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0d1b2a' }}>
      <div className="w-full max-w-sm glass-card rounded-2xl p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #0ea5e9, #006591)' }}>
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-ocean-on-surface">Troca de senha obrigatória</h1>
          <p className="text-sm text-ocean-secondary mt-1">Por segurança, defina uma nova senha antes de continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1.5">Senha atual (provisória)</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1.5">Nova senha</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} minLength={6} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ocean-secondary uppercase tracking-wide mb-1.5">Confirmar nova senha</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} minLength={6} required />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #006591)' }}
          >
            {loading ? 'Salvando...' : 'Definir nova senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
