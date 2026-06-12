import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(91,108,240,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(232,95,192,0.1) 0%, transparent 55%), #F7F5FF',
      }}
    >
      <div className="text-center max-w-md">
        <p
          className="font-bold leading-none"
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </p>
        <h1 className="mt-2 text-xl font-bold text-ocean-on-surface tracking-tight">
          Página não encontrada
        </h1>
        <p className="mt-2 text-sm text-ocean-secondary leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)' }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
