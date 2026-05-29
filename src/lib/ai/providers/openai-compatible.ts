import OpenAI from 'openai';
import type { IAIProvider, AIMessage } from '../types';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

export class OpenAICompatibleProvider implements IAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string, baseURL?: string) {
    this.client = new OpenAI({ apiKey, baseURL });
    this.model = model;
  }

  async chat(messages: AIMessage[], systemPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    return response.choices[0]?.message?.content ?? '';
  }

  async *stream(messages: AIMessage[], systemPrompt: string): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 2048,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  static groq(apiKey: string, model: string): OpenAICompatibleProvider {
    return new OpenAICompatibleProvider(apiKey, model, GROQ_BASE_URL);
  }
}
