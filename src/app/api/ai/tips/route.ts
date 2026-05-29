import { NextResponse } from 'next/server';
import { createAIProvider } from '@/lib/ai/factory';
import { getAISystemConfig } from '@/lib/ai/config';
import type { AIConfig, MarketingTip } from '@/lib/ai/types';

const SYSTEM_PROMPT = `Você é um especialista em marketing para negócios de beleza e bem-estar.
Gere dicas práticas e acionáveis em português brasileiro.
Responda SOMENTE com um array JSON válido, sem texto adicional, sem markdown, sem blocos de código.`;

interface TipsRequest {
  category: string;
  businessContext?: {
    businessName?: string;
    services?: string;
    clientCount?: string;
    mainChallenge?: string;
  };
  userApiKey?: string;
  userProvider?: string;
  userModel?: string;
}

function buildPrompt(category: string, ctx?: TipsRequest['businessContext']): string {
  const contextPart = ctx
    ? `
Contexto do negócio:
- Nome: ${ctx.businessName || 'não informado'}
- Serviços: ${ctx.services || 'não informado'}
- Número de clientes: ${ctx.clientCount || 'não informado'}
- Principal desafio: ${ctx.mainChallenge || 'não informado'}`
    : '';

  return `Gere exatamente 5 dicas de marketing para a categoria "${category}" para um negócio de beleza/estética.${contextPart}

Retorne um array JSON com esta estrutura exata (sem texto extra, sem markdown):
[
  {
    "id": "tip-1",
    "title": "Título curto e impactante",
    "description": "Descrição prática de 2-3 frases explicando como implementar.",
    "category": "${category}",
    "difficulty": "facil" | "medio" | "dificil",
    "impact": "alto" | "medio" | "baixo"
  }
]`;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: TipsRequest = await req.json();
    const { category, businessContext, userApiKey, userProvider, userModel } = body;

    if (!category) {
      return NextResponse.json({ error: 'Categoria é obrigatória' }, { status: 400 });
    }

    const sysConfig = await getAISystemConfig();
    const hasUserKey = sysConfig.allowUserKeys && !!userApiKey;
    const effectiveConfig: AIConfig = hasUserKey
      ? {
          provider: (userProvider as AIConfig['provider']) ?? sysConfig.provider,
          model: userModel ?? sysConfig.model,
          apiKey: userApiKey!,
        }
      : {
          provider: sysConfig.provider,
          model: sysConfig.model,
          apiKey: sysConfig.systemApiKey,
        };

    if (!effectiveConfig.apiKey) {
      return NextResponse.json(
        { error: 'IA não configurada. Peça ao administrador para configurar a chave de API.' },
        { status: 503 },
      );
    }

    const provider = createAIProvider(effectiveConfig);
    const prompt = buildPrompt(category, businessContext);
    const raw = await provider.chat([{ role: 'user', content: prompt }], SYSTEM_PROMPT);

    let tips: MarketingTip[];
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      tips = JSON.parse(cleaned) as MarketingTip[];
      tips = tips.map((t, i) => ({ ...t, id: `tip-${Date.now()}-${i}` }));
    } catch {
      return NextResponse.json(
        { error: 'IA retornou formato inválido. Tente novamente.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ tips });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
