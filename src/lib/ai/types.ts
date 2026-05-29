export type AIProviderType = 'anthropic' | 'openai' | 'groq';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIConfig {
  provider: AIProviderType;
  model: string;
  apiKey: string;
}

export interface AISystemConfig {
  provider: AIProviderType;
  model: string;
  systemApiKey: string;
  allowUserKeys: boolean;
  dailyLimitFree: number;
  dailyLimitPaid: number;
}

export interface IAIProvider {
  chat(messages: AIMessage[], systemPrompt: string): Promise<string>;
  stream(messages: AIMessage[], systemPrompt: string): AsyncGenerator<string>;
}

export interface MarketingTip {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  impact: 'alto' | 'medio' | 'baixo';
}

export interface SavedAction {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  impact: 'alto' | 'medio' | 'baixo';
  status: 'pendente' | 'em-progresso' | 'concluido';
  savedAt: string;
}

export const MARKETING_CATEGORIES = [
  { id: 'redes-sociais', label: 'Redes Sociais' },
  { id: 'fidelizacao', label: 'Fidelização de Clientes' },
  { id: 'promocoes', label: 'Promoções e Descontos' },
  { id: 'captacao', label: 'Captação de Novos Clientes' },
  { id: 'atendimento', label: 'Qualidade do Atendimento' },
  { id: 'online', label: 'Presença Online' },
] as const;

export const AI_PROVIDERS_INFO = [
  {
    id: 'groq' as AIProviderType,
    label: 'Groq (Gratuito)',
    description: 'Acesso gratuito ao Llama 3 e Mixtral via console.groq.com',
    keyUrl: 'https://console.groq.com',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Recomendado — Gratuito)' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Mais rápido — Gratuito)' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (Gratuito)' },
    ],
  },
  {
    id: 'anthropic' as AIProviderType,
    label: 'Anthropic Claude (Pago)',
    description: 'Claude Haiku, Sonnet e Opus via console.anthropic.com',
    keyUrl: 'https://console.anthropic.com',
    models: [
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (Mais barato)' },
      { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (Equilibrado)' },
      { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 (Melhor qualidade)' },
    ],
  },
  {
    id: 'openai' as AIProviderType,
    label: 'OpenAI GPT (Pago)',
    description: 'GPT-4o e GPT-4o Mini via platform.openai.com',
    keyUrl: 'https://platform.openai.com',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Mais barato)' },
      { id: 'gpt-4o', label: 'GPT-4o (Melhor qualidade)' },
    ],
  },
] as const;
