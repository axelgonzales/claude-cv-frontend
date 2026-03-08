import { Link } from 'react-router-dom';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cv-bg)',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '2rem',
          }}
        >
          <Terminal size={18} style={{ color: 'var(--cv-accent)' }} />
          <span
            style={{
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--cv-accent)',
            }}
          >
            error
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--cv-font-mono)',
            fontSize: 'clamp(4rem, 15vw, 8rem)',
            fontWeight: 700,
            color: 'var(--cv-text)',
            lineHeight: 1,
            marginBottom: '1rem',
            opacity: 0.12,
            userSelect: 'none',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: 'var(--cv-font-serif)',
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
            fontWeight: 600,
            color: 'var(--cv-text)',
            marginBottom: '0.75rem',
            marginTop: '-1rem',
          }}
        >
          Página no encontrada
        </h1>

        <p
          style={{
            fontFamily: 'var(--cv-font-sans)',
            fontSize: '0.9rem',
            color: 'var(--cv-text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          La URL que buscas no existe o fue movida.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--cv-font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--cv-accent)',
            textDecoration: 'none',
            border: '1px solid var(--cv-accent)',
            padding: '10px 20px',
            borderRadius: '2px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cv-accent)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cv-bg)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cv-accent)';
          }}
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
