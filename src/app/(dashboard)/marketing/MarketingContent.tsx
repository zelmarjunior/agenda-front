'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/common/Spinner';
import { useAIChat } from '@/modules/marketing/hooks/useAIChat';
import { useSavedActions } from '@/modules/marketing/hooks/useSavedActions';
import { useUserAIConfig } from '@/modules/marketing/hooks/useUserAIConfig';
import { MARKETING_CATEGORIES, AI_PROVIDERS_INFO } from '@/lib/ai/types';
import type { MarketingTip, SavedAction, AIProviderType } from '@/lib/ai/types';

type Tab = 'dicas' | 'chat' | 'acoes';

const DIFFICULTY_LABELS = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
const IMPACT_LABELS = { alto: 'Alto', medio: 'Médio', baixo: 'Baixo' };
const STATUS_LABELS = {
  pendente: 'Pendente',
  'em-progresso': 'Em progresso',
  concluido: 'Concluído',
};

const DIFFICULTY_COLORS = {
  facil: 'bg-green-100 text-green-700',
  medio: 'bg-yellow-100 text-yellow-700',
  dificil: 'bg-red-100 text-red-700',
};
const IMPACT_COLORS = {
  alto: 'bg-blue-100 text-blue-700',
  medio: 'bg-gray-100 text-gray-700',
  baixo: 'bg-gray-50 text-gray-500',
};

const QUICK_PROMPTS = [
  'Como posso fidelizar meus clientes para voltarem mais vezes?',
  'Dê ideias de promoções para aumentar as vendas no mês fraco',
  'Como usar o Instagram para atrair mais clientes locais?',
  'Que estratégias posso usar para aumentar o ticket médio?',
];

export function MarketingContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('dicas');

  // Tips state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [useContext, setUseContext] = useState(false);
  const [context, setContext] = useState({
    businessName: '',
    services: '',
    clientCount: '',
    mainChallenge: '',
  });
  const [tips, setTips] = useState<MarketingTip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // User AI config
  const { config: userConfig, save: saveUserConfig, activeConfig } = useUserAIConfig();
  const [showKeyPanel, setShowKeyPanel] = useState(false);

  const { messages, isLoading: chatLoading, error: chatError, sendMessage, clearMessages } =
    useAIChat(activeConfig);

  const { actions, saveAction, updateStatus, removeAction } = useSavedActions();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleGenerateTips() {
    if (!selectedCategory) return;
    setTipsLoading(true);
    setTipsError('');
    setTips([]);

    try {
      const res = await fetch('/api/ai/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          businessContext: useContext ? context : undefined,
          ...activeConfig,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTips(data.tips);
      setSavedIds(new Set());
    } catch (err) {
      setTipsError(err instanceof Error ? err.message : 'Erro ao gerar dicas');
    } finally {
      setTipsLoading(false);
    }
  }

  function handleSaveTip(tip: MarketingTip) {
    saveAction(tip);
    setSavedIds((prev) => new Set([...prev, tip.id]));
  }

  async function handleSendChat() {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    await sendMessage(msg);
  }

  const pendingCount = actions.filter((a) => a.status === 'pendente').length;
  const inProgressCount = actions.filter((a) => a.status === 'em-progresso').length;

  return (
    <div>
      <Header
        title="Marketing IA"
        actions={
          <button
            onClick={() => setShowKeyPanel((v) => !v)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {userConfig.useOwnKey ? 'Chave própria ativa' : 'Usar minha chave'}
          </button>
        }
      />

      {/* User API Key Panel */}
      {showKeyPanel && (
        <UserKeyPanel config={userConfig} onSave={saveUserConfig} onClose={() => setShowKeyPanel(false)} />
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {([
          { id: 'dicas' as Tab, label: 'Gerar Dicas' },
          { id: 'chat' as Tab, label: 'Chat IA' },
          {
            id: 'acoes' as Tab,
            label: `Minhas Ações${actions.length > 0 ? ` (${actions.length})` : ''}`,
          },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Gerar Dicas */}
      {activeTab === 'dicas' && (
        <div className="space-y-5">
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Escolha uma categoria</h2>
            <div className="flex flex-wrap gap-2">
              {MARKETING_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={useContext}
                onChange={(e) => setUseContext(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-900">
                Personalizar com dados do meu negócio
              </span>
            </label>

            {useContext && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Nome do negócio</label>
                  <input
                    type="text"
                    placeholder="Ex: Salão da Maria"
                    value={context.businessName}
                    onChange={(e) => setContext((c) => ({ ...c, businessName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Número de clientes</label>
                  <input
                    type="text"
                    placeholder="Ex: 80 clientes ativos"
                    value={context.clientCount}
                    onChange={(e) => setContext((c) => ({ ...c, clientCount: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Principais serviços</label>
                  <input
                    type="text"
                    placeholder="Ex: corte, coloração, escova"
                    value={context.services}
                    onChange={(e) => setContext((c) => ({ ...c, services: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Principal desafio atual</label>
                  <input
                    type="text"
                    placeholder="Ex: reter clientes, atrair novos"
                    value={context.mainChallenge}
                    onChange={(e) => setContext((c) => ({ ...c, mainChallenge: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </section>

          <button
            onClick={handleGenerateTips}
            disabled={!selectedCategory || tipsLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
          >
            {tipsLoading ? (
              <>
                <Spinner />
                Gerando dicas...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Gerar Dicas
              </>
            )}
          </button>

          {tipsError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {tipsError}
            </div>
          )}

          {tips.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {tips.length} dicas geradas — salve as que deseja implementar
              </p>
              {tips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  saved={savedIds.has(tip.id)}
                  onSave={() => handleSaveTip(tip)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Chat IA */}
      {activeTab === 'chat' && (
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-3">Sugestões para começar:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full px-3 py-1.5 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 min-h-64 max-h-[480px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1 items-center opacity-60">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            {chatError && (
              <div className="text-xs text-red-600 text-center">{chatError}</div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Pergunte algo sobre marketing do seu negócio..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
              disabled={chatLoading}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={handleSendChat}
              disabled={chatLoading || !chatInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="text-gray-400 hover:text-gray-600 rounded-xl px-3 border border-gray-200 hover:border-gray-300 transition-colors"
                title="Limpar conversa"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab: Minhas Ações */}
      {activeTab === 'acoes' && (
        <div className="space-y-4">
          {actions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <svg className="h-10 w-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-gray-500">Nenhuma ação salva ainda.</p>
              <p className="text-xs text-gray-400 mt-1">Gere dicas e salve as que quiser implementar.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{pendingCount} pendentes</span>
                <span>{inProgressCount} em progresso</span>
                <span>{actions.filter((a) => a.status === 'concluido').length} concluídas</span>
              </div>
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onStatusChange={(status) => updateStatus(action.id, status)}
                  onRemove={() => removeAction(action.id)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TipCard({ tip, saved, onSave }: { tip: MarketingTip; saved: boolean; onSave: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{tip.title}</h3>
        <button
          onClick={onSave}
          disabled={saved}
          className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            saved
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          {saved ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salva
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Salvar como ação
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-gray-600">{tip.description}</p>
      <div className="flex gap-2 mt-1">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[tip.difficulty]}`}>
          {DIFFICULTY_LABELS[tip.difficulty]}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${IMPACT_COLORS[tip.impact]}`}>
          Impacto {IMPACT_LABELS[tip.impact]}
        </span>
      </div>
    </div>
  );
}

function ActionCard({
  action,
  onStatusChange,
  onRemove,
}: {
  action: SavedAction;
  onStatusChange: (s: SavedAction['status']) => void;
  onRemove: () => void;
}) {
  const statusOptions: SavedAction['status'][] = ['pendente', 'em-progresso', 'concluido'];
  return (
    <div className={`bg-white rounded-xl border p-4 ${action.status === 'concluido' ? 'border-green-200 opacity-75' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${action.status === 'concluido' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {action.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{action.description}</p>
          <div className="flex gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[action.difficulty]}`}>
              {DIFFICULTY_LABELS[action.difficulty]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${IMPACT_COLORS[action.impact]}`}>
              Impacto {IMPACT_LABELS[action.impact]}
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1"
          title="Remover"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex gap-1 mt-3">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              action.status === s
                ? s === 'concluido'
                  ? 'bg-green-600 text-white'
                  : s === 'em-progresso'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}

interface UserKeyPanelProps {
  config: { apiKey: string; provider: AIProviderType; model: string; useOwnKey: boolean };
  onSave: (updates: Partial<{ apiKey: string; provider: AIProviderType; model: string; useOwnKey: boolean }>) => void;
  onClose: () => void;
}

function UserKeyPanel({ config, onSave, onClose }: UserKeyPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const selectedProvider = AI_PROVIDERS_INFO.find((p) => p.id === localConfig.provider);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-blue-400 hover:text-blue-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h3 className="text-sm font-semibold text-blue-900 mb-3">Sua chave de API pessoal</h3>
      <p className="text-xs text-blue-700 mb-4">
        Use sua própria chave para ter limites maiores e controle total do uso.
        A chave fica salva apenas no seu navegador.
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-blue-700 block mb-1">Provedor</label>
          <select
            value={localConfig.provider}
            onChange={(e) => {
              const p = AI_PROVIDERS_INFO.find((x) => x.id === e.target.value);
              setLocalConfig((c) => ({
                ...c,
                provider: e.target.value as AIProviderType,
                model: p?.models[0].id ?? c.model,
              }));
            }}
            className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AI_PROVIDERS_INFO.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {selectedProvider && (
          <div>
            <label className="text-xs text-blue-700 block mb-1">Modelo</label>
            <select
              value={localConfig.model}
              onChange={(e) => setLocalConfig((c) => ({ ...c, model: e.target.value }))}
              className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedProvider.models.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-blue-700 block mb-1">Chave de API</label>
          <input
            type="password"
            placeholder="Cole sua chave aqui..."
            value={localConfig.apiKey}
            onChange={(e) => setLocalConfig((c) => ({ ...c, apiKey: e.target.value }))}
            className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localConfig.useOwnKey}
            onChange={(e) => setLocalConfig((c) => ({ ...c, useOwnKey: e.target.checked }))}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-blue-800">Usar minha chave (em vez da chave do sistema)</span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => { onSave(localConfig); onClose(); }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
