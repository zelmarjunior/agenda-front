import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = {
  title: 'Criar negócio — Agenda',
  description: 'Registre seu salão ou negócio',
};

export default function RegisterPage(): JSX.Element {
  return <RegisterForm />;
}
