import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import LazyProfessionalList from './_lazy';

export const metadata: Metadata = { title: 'Profissionais' };

export default function ProfessionalsPage(): JSX.Element {
  return (
    <div>
      <Header title="Profissionais" />
      <LazyProfessionalList />
    </div>
  );
}
