import type { Metadata } from 'next';
import { OkrsContent } from '@/modules/okrs/components/OkrsContent';

export const metadata: Metadata = { title: 'OKRs' };

export default function OkrsPage(): JSX.Element {
  return <OkrsContent />;
}
