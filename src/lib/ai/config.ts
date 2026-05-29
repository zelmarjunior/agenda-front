import fs from 'fs/promises';
import path from 'path';
import type { AISystemConfig } from './types';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'ai-config.json');

const DEFAULT_CONFIG: AISystemConfig = {
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  systemApiKey: '',
  allowUserKeys: true,
  dailyLimitFree: 5,
  dailyLimitPaid: 50,
};

export async function getAISystemConfig(): Promise<AISystemConfig> {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export async function saveAISystemConfig(updates: Partial<AISystemConfig>): Promise<void> {
  const current = await getAISystemConfig();
  const updated = { ...current, ...updates };
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
}
