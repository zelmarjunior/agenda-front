import { notFound } from 'next/navigation';
import { AdminAIContent } from '../AdminAIContent';

interface Props {
  params: Promise<{ secret: string }>;
}

export default async function AdminAIPage({ params }: Props): Promise<JSX.Element> {
  const { secret } = await params;
  const adminSecret = process.env.ADMIN_AI_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    notFound();
  }

  return <AdminAIContent secret={secret} />;
}

export const dynamic = 'force-dynamic';
