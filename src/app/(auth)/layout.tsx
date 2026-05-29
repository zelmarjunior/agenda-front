import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(14,165,233,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(0,101,145,0.12) 0%, transparent 55%), #f8f9ff',
      }}
    >
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
