import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Entrar — Agenda',
  description: 'Acesse sua conta',
};

export default function LoginPage(): JSX.Element {
  return <LoginForm />;
}
