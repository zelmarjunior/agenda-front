import { NextResponse } from 'next/server';
import { getAISystemConfig, saveAISystemConfig } from '@/lib/ai/config';

function isAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_AI_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const config = await getAISystemConfig();
  const safeConfig = { ...config, systemApiKey: config.systemApiKey ? '***configurada***' : '' };
  return NextResponse.json(safeConfig);
}

export async function POST(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const updates = await req.json();
    await saveAISystemConfig(updates);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 });
  }
}
