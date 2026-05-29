import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import LazyServiceList from './_lazy';

export const metadata: Metadata = { title: 'Serviços' };

export default function ServicesPage(): JSX.Element {
  return (
    <div>
      <Header title="Serviços" />
      <LazyServiceList />
    </div>
  );
}
