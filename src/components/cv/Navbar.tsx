import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Terminal, FolderKanban, Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'CV', icon: User },
  { path: '/blog', label: 'Blog', icon: Terminal },
  { path: '/projects', label: 'Proyectos', icon: FolderKanban },
] as const;

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--cv-border)',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo / Name */}
        <Link
          to="/"
          style={{
            fontFamily: 'var(--cv-font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--cv-text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'var(--cv-accent-dim)',
              border: '1px solid var(--cv-accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontFamily: 'var(--cv-font-mono)',
              color: 'var(--cv-accent)',
              fontWeight: 700,
            }}
          >
            AG
          </span>
          Axel Gonzales
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="nav-desktop"
        >
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  color: isActive ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
                  background: isActive ? 'var(--cv-accent-dim)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--cv-accent-border)' : 'transparent'}`,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--cv-text-secondary)';
                    e.currentTarget.style.background = 'var(--cv-surface-2)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--cv-text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--cv-text-secondary)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            padding: '8px 24px 16px',
            gap: '4px',
            borderTop: '1px solid var(--cv-border)',
          }}
        >
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  color: isActive ? 'var(--cv-accent)' : 'var(--cv-text-secondary)',
                  background: isActive ? 'var(--cv-accent-dim)' : 'transparent',
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
