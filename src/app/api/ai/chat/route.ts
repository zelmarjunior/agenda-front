import { NextResponse } from 'next/server';
import { createAIProvider } from '@/lib/ai/factory';
import { getAISystemConfig } from '@/lib/ai/config';
import type { AIMessage, AIConfig } from '@/lib/ai/types';

const SYSTEM_PROMPT = `Você é um assistente especialista em marketing para negócios de beleza e bem-estar (salões de beleza, barbearias, estúdios de estética, spas).
Seu objetivo é ajudar o proprietário a crescer seu negócio com dicas práticas, criativas e aplicáveis.
Responda sempre em português brasileiro, de forma direta e motivadora.
Quando gerar listas de dicas, use formatação clara com títulos em negrito.`;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { messages, userApiKey, userProvider, userModel } = body as {
      messages: AIMessage[];
      userApiKey?: string;
      userProvider?: string;
      userModel?: string;
    };

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

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of provider.stream(messages, SYSTEM_PROMPT)) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erro desconhecido';
          controller.enqueue(new TextEncoder().encode(`\n\n[Erro: ${message}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
