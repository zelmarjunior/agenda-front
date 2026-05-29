'use client';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps): JSX.Element {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-ocean-on-surface tracking-tight">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
