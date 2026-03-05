import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { profileApi, experienceApi, educationApi, skillsApi } from '../lib/api';
import type { Profile, Experience, Education, SkillGroup } from '../lib/api';
import ProfileForm from '../components/admin/ProfileForm';
import ExperienceForm from '../components/admin/ExperienceForm';
import EducationForm from '../components/admin/EducationForm';
import SkillsForm from '../components/admin/SkillsForm';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, Lock } from 'lucide-react';

type Tab = 'profile' | 'experience' | 'education' | 'skills';
const TABS: { key: Tab; label: string }[] = [
  { key: 'profile', label: 'Perfil' },
  { key: 'experience', label: 'Experiencia' },
  { key: 'education', label: 'Educación' },
  { key: 'skills', label: 'Habilidades' },
];

/* ── Login Page ────────────────────────────────────────── */
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cv-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '500px', height: '300px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      {/* Back link */}
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '24px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--cv-font-mono)', fontSize: '0.72rem',
        color: 'var(--cv-text-muted)', textDecoration: 'none',
        letterSpacing: '0.05em', transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cv-accent)'}
        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cv-text-muted)'}
      >
        <ArrowLeft size={13} /> VOLVER AL CV
      </Link>

      {/* Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        background: 'var(--cv-surface)',
        border: '1px solid var(--cv-border)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Top accent line */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--cv-accent), transparent)',
        }} />

        <div style={{ padding: '40px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--cv-accent-dim)', border: '1px solid var(--cv-accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px var(--cv-accent-glow)',
            }}>
              <Lock size={20} color="var(--cv-accent)" />
            </div>
            <h1 style={{
              fontFamily: 'var(--cv-font-heading)', fontSize: '1.4rem',
              fontWeight: 700, color: 'var(--cv-text-primary)', marginBottom: '8px',
            }}>
              Panel Admin
            </h1>
            <p style={{
              fontFamily: 'var(--cv-font-body)', fontSize: '0.82rem',
              color: 'var(--cv-text-muted)',
            }}>
              Acceso restringido — CV de Axel Gonzales
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.1em', color: 'var(--cv-text-muted)', marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com" required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--cv-surface-2)', border: '1px solid var(--cv-border)',
                  borderRadius: '10px', color: 'var(--cv-text-primary)',
                  fontFamily: 'var(--cv-font-body)', fontSize: '0.88rem',
                  outline: 'none', transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--cv-accent-border)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--cv-border)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.1em', color: 'var(--cv-text-muted)', marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Contraseña
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--cv-surface-2)', border: '1px solid var(--cv-border)',
                  borderRadius: '10px', color: 'var(--cv-text-primary)',
                  fontFamily: 'var(--cv-font-body)', fontSize: '0.88rem',
                  outline: 'none', transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--cv-accent-border)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--cv-border)'}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontFamily: 'var(--cv-font-body)', fontSize: '0.8rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: '8px', padding: '13px 24px', borderRadius: '10px',
                background: loading ? 'var(--cv-surface-3)' : 'var(--cv-accent)',
                border: 'none', color: loading ? 'var(--cv-text-muted)' : '#000',
                fontFamily: 'var(--cv-font-heading)', fontSize: '0.9rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                width: '100%', letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#22d3ee'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--cv-accent)'; }}
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Admin Panel ───────────────────────────────────────── */
export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = () => {
    profileApi.get().then(setProfile);
    experienceApi.getAll().then(setExperiences);
    educationApi.getAll().then(setEducations);
    skillsApi.getAll().then(setSkills);
  };

  if (!user) return <LoginPage />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cv-bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--cv-surface)', borderBottom: '1px solid var(--cv-border)',
        padding: '0 32px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'var(--cv-text-muted)', textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cv-accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cv-text-muted)'}
          >
            <ArrowLeft size={16} />
          </Link>
          <span style={{ width: '1px', height: '20px', background: 'var(--cv-border)' }} />
          <span style={{
            fontFamily: 'var(--cv-font-heading)', fontSize: '0.9rem',
            fontWeight: 600, color: 'var(--cv-text-primary)',
          }}>
            Panel Admin
          </span>
          <span style={{
            fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem',
            color: 'var(--cv-accent)', background: 'var(--cv-accent-dim)',
            border: '1px solid var(--cv-accent-border)', padding: '2px 8px', borderRadius: '4px',
          }}>
            {user.email}
          </span>
        </div>

        <button
          onClick={() => signOut(auth)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            background: 'transparent', border: '1px solid var(--cv-border)',
            color: 'var(--cv-text-muted)', fontFamily: 'var(--cv-font-body)',
            fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cv-border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--cv-text-muted)';
          }}
        >
          <LogOut size={14} /> Salir
        </button>
      </header>

      {/* Body */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '32px',
          background: 'var(--cv-surface)', border: '1px solid var(--cv-border)',
          borderRadius: '12px', padding: '4px', width: 'fit-content',
        }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                fontFamily: 'var(--cv-font-body)', fontSize: '0.84rem', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                background: tab === t.key ? 'var(--cv-accent)' : 'transparent',
                color: tab === t.key ? '#000' : 'var(--cv-text-muted)',
              }}
              onMouseEnter={e => { if (tab !== t.key) (e.currentTarget as HTMLButtonElement).style.color = 'var(--cv-text-primary)'; }}
              onMouseLeave={e => { if (tab !== t.key) (e.currentTarget as HTMLButtonElement).style.color = 'var(--cv-text-muted)'; }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: 'var(--cv-surface)', border: '1px solid var(--cv-border)',
          borderRadius: '16px', padding: '28px',
        }}>
          {tab === 'profile' && profile && (
            <ProfileForm profile={profile} onSave={async d => { const p = await profileApi.update(d); setProfile(p); }} />
          )}
          {tab === 'experience' && <ExperienceForm experiences={experiences} onChange={loadData} />}
          {tab === 'education' && <EducationForm educations={educations} onChange={loadData} />}
          {tab === 'skills' && <SkillsForm skillGroups={skills} onChange={loadData} />}
        </div>
      </div>
    </div>
  );
}
