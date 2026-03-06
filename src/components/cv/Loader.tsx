import { useEffect, useState } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShow(false), 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--cv-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        transition: 'opacity 0.4s ease',
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? 'none' : 'all',
      }}
    >
      {/* Logo animation */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {/* Outer ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid var(--cv-border)',
            borderTopColor: 'var(--cv-accent)',
            animation: 'spin 1s linear infinite',
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '2px solid var(--cv-border)',
            borderBottomColor: 'var(--cv-accent)',
            animation: 'spin 1.5s linear infinite reverse',
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            inset: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--cv-accent)',
            boxShadow: '0 0 20px var(--cv-accent-glow), 0 0 40px var(--cv-accent-glow)',
            animation: 'pulse-dot 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--cv-font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--cv-accent)',
            marginBottom: '16px',
          }}
        >
          Loading Portfolio
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'var(--cv-surface-3)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              background: 'var(--cv-accent)',
              boxShadow: '0 0 8px var(--cv-accent-glow)',
              borderRadius: '2px',
              transition: 'width 0.15s ease',
            }}
          />
        </div>

        <p
          style={{
            fontFamily: 'var(--cv-font-mono)',
            fontSize: '0.6rem',
            color: 'var(--cv-text-muted)',
            marginTop: '10px',
            letterSpacing: '0.1em',
          }}
        >
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </div>
  );
}
