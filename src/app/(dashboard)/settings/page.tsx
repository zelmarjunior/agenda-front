import type { Metadata } from 'next';
import { SettingsContent } from './SettingsContent';

export const metadata: Metadata = { title: 'Configurações' };

export default function SettingsPage(): JSX.Element {
  return <SettingsContent />;
}
