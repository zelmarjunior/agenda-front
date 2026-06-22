'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Temporariamente desativado — redireciona para home ao acessar esta rota.
export default function TrocarSenhaPage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return <></>;
}
