'use client';

import { useState, useCallback } from 'react';
import type { AIMessage } from '@/lib/ai/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UseAIChatOptions {
  userApiKey?: string;
  userProvider?: string;
  userModel?: string;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      setError(null);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: content.trim(),
      };

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: '',
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);

      const history: AIMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            userApiKey: options.userApiKey,
            userProvider: options.userProvider,
            userModel: options.userModel,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? 'Erro ao conectar com a IA');
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('Stream não disponível');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: accumulated } : m)),
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, options],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
