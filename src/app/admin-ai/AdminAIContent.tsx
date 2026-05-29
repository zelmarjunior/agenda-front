'use client';

import { useState, useEffect } from 'react';
import { AI_PROVIDERS_INFO } from '@/lib/ai/types';
import type { AIProviderType, AISystemConfig } from '@/lib/ai/types';

interface Props {
  secret: string;
}

export function AdminAIContent({ secret }: Props): JSX.Element {
  const [config, setConfig] = useState<Partial<AISystemConfig>>({
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    systemApiKey: '',
    allowUserKeys: true,
    dailyLimitFree: 5,
    dailyLimitPaid: 50,
  });
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/ai-config', {
      headers: { Authorization: `Bearer ${secret}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [secret]);

  const selectedProvider = AI_PROVIDERS_INFO.find((p) => p.id === config.provider);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const payload: Partial<AISystemConfig> = { ...config };
    if (newApiKey.trim()) payload.systemApiKey = newApiKey.trim();

    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        setNewApiKey('');
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configurações de IA</h1>
          <p className="text-sm text-gray-500 mt-1">Painel administrativo — não compartilhe esta URL.</p>
        </div>

        <div className="space-y-6">
          {/* Provider */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Provedor de IA</h2>
            <div className="space-y-3">
              {AI_PROVIDERS_INFO.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    config.provider === p.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={p.id}
                    checked={config.provider === p.id}
                    onChange={() =>
                      setConfig((c) => ({ ...c, provider: p.id as AIProviderType, model: p.models[0].id }))
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Model */}
          {selectedProvider && (
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Modelo</h2>
              <select
                value={config.model}
                onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedProvider.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </section>
          )}

          {/* API Key */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Chave de API do Sistema</h2>
            <p className="text-xs text-gray-500 mb-4">
              Usada por todos os usuários quando não têm chave própria.
              {config.systemApiKey === '***configurada***' && (
                <span className="ml-1 text-green-600 font-medium">✓ Chave configurada</span>
              )}
            </p>
            <input
              type="password"
              placeholder={config.systemApiKey === '***configurada***' ? 'Deixe em branco para manter a atual' : 'Cole sua chave de API aqui'}
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedProvider && (
              <p className="text-xs text-gray-400 mt-2">
                Obtenha sua chave em{' '}
                <span className="text-blue-600">{selectedProvider.keyUrl}</span>
              </p>
            )}
          </section>

          {/* User keys */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Chaves de Usuário</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowUserKeys ?? true}
                onChange={(e) => setConfig((c) => ({ ...c, allowUserKeys: e.target.checked }))}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">
                Permitir que usuários configurem sua própria chave de API
              </span>
            </label>
          </section>

          {/* Usage limits */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Limites de Uso Diário</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tier Gratuito (msgs/dia)</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={config.dailyLimitFree ?? 5}
                  onChange={(e) => setConfig((c) => ({ ...c, dailyLimitFree: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tier Pago (msgs/dia)</label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={config.dailyLimitPaid ?? 50}
                  onChange={(e) => setConfig((c) => ({ ...c, dailyLimitPaid: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Usuários com chave própria não são limitados por estes valores.
            </p>
          </section>

          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}
