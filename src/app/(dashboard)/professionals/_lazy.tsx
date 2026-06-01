'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ProfessionalsContent = dynamic(
  () =>
    import('@/modules/professionals/components/ProfessionalsContent').then((m) => m.ProfessionalsContent),
  {
    loading: () => (
      <div className="py-16">
        <Spinner />
      </div>
    ),
    ssr: false,
  },
);

export default function LazyProfessionalList(): JSX.Element {
  return <ProfessionalsContent />;
}
