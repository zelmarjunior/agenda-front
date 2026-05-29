'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AIProviderType } from '@/lib/ai/types';

const STORAGE_KEY = 'agenda:user-ai-config';

interface UserAIConfig {
  apiKey: string;
  provider: AIProviderType;
  model: string;
  useOwnKey: boolean;
}

const DEFAULT: UserAIConfig = {
  apiKey: '',
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  useOwnKey: false,
};

function load(): UserAIConfig {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function useUserAIConfig() {
  const [config, setConfig] = useState<UserAIConfig>(DEFAULT);

  useEffect(() => {
    setConfig(load());
  }, []);

  const save = useCallback((updates: Partial<UserAIConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const activeConfig = config.useOwnKey && config.apiKey
    ? { userApiKey: config.apiKey, userProvider: config.provider, userModel: config.model }
    : {};

  return { config, save, activeConfig };
}
