import type { AIConfig, IAIProvider } from './types';
import { AnthropicProvider } from './providers/anthropic';
import { OpenAICompatibleProvider } from './providers/openai-compatible';

export function createAIProvider(config: AIConfig): IAIProvider {
  switch (config.provider) {
    case 'anthropic':
      return new AnthropicProvider(config.apiKey, config.model);
    case 'openai':
      return new OpenAICompatibleProvider(config.apiKey, config.model);
    case 'groq':
      return OpenAICompatibleProvider.groq(config.apiKey, config.model);
    default:
      throw new Error(`Provider não suportado: ${config.provider}`);
  }
}
