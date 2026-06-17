import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div
      className="min-h-screen flex relative"
      style={{
        backgroundImage: 'url(/login-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay de gradiente — só no mobile */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(13,11,26,0.60) 0%, rgba(91,108,240,0.32) 40%, rgba(232,95,192,0.25) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Painel esquerdo — imagem (desktop) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between overflow-hidden"
        style={{
          backgroundImage: 'url(/login-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay gradiente sobre a foto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(13,11,26,0.72) 0%, rgba(91,108,240,0.38) 40%, rgba(232,95,192,0.28) 100%)',
          }}
        />

        {/* Conteúdo sobre a imagem */}
        <div className="relative z-10 p-10 flex flex-col h-full justify-between">
          {/* Logo topo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)' }}
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: '1.5rem',
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #A0AAFF 0%, #E85FC0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              GLOWSY
            </span>
          </div>

          {/* Texto de destaque na base */}
          <div>
            <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-4">
              Gestão para estúdios de beleza
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                letterSpacing: '0.04em',
                lineHeight: 0.9,
                color: 'white',
              }}
            >
              BELEZA<br />COM<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #A0AAFF 0%, #E85FC0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PROPÓSITO
              </span>
            </h2>
            <p className="mt-5 text-white/55 text-sm font-light leading-relaxed max-w-xs">
              Agenda, clientes, financeiro e relatórios — tudo em um lugar.
            </p>

            {/* Mini stats */}
            <div className="mt-8 flex gap-6">
              {[
                { n: '+2.400', l: 'estúdios' },
                { n: '80%', l: 'menos faltas' },
                { n: '4.9★', l: 'satisfação' },
              ].map((s) => (
                <div key={s.l}>
                  <p
                    style={{
                      fontFamily: 'var(--font-bebas), sans-serif',
                      fontSize: '1.6rem',
                      letterSpacing: '0.04em',
                      color: 'white',
                      lineHeight: 1,
                    }}
                  >
                    {s.n}
                  </p>
                  <p className="text-[10px] text-white/45 mt-0.5 font-medium">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Painel direito — formulário ── */}
      <main
        id="main-content"
        className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-10 auth-form-panel"
      >
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
