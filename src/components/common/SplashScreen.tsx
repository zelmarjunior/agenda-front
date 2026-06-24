'use client';

import { useEffect, useState } from 'react';

const SPLASH_DURATION_MS = 2850; // 2200ms delay + 650ms fade

export function SplashScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <>
      <style>{`
        @keyframes splash-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(155,95,224,0.5), 0 0 80px rgba(232,95,192,0.2); }
          50%       { box-shadow: 0 0 60px rgba(155,95,224,0.8), 0 0 120px rgba(232,95,192,0.4); }
        }
        @keyframes logo-in {
          from { opacity: 0; transform: scale(0.7) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes text-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          backgroundColor: '#0D0B1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          animation: 'splash-fade-out 0.65s cubic-bezier(0.4,0,0.2,1) 2.2s forwards',
        }}
      >
        {/* Play icon */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)',
            animation: 'logo-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both, glow-pulse 2.5s ease-in-out 0.6s infinite',
          }}
        >
          <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3l14 9-14 9V3z"
            />
          </svg>
        </div>

        {/* Brand text */}
        <div style={{ textAlign: 'center', animation: 'text-in 0.5s ease 0.35s both' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: '3.8rem',
              letterSpacing: '0.14em',
              background: 'linear-gradient(135deg, #A0AAFF 0%, #E85FC0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
            }}
          >
            GLOWSY
          </span>
          <p
            style={{
              marginTop: '6px',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#A0AAFF',
            }}
          >
            Studio
          </p>
        </div>
      </div>
    </>
  );
}
