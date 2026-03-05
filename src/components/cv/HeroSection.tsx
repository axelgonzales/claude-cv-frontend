import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import type { Profile, Experience, Education, SkillGroup } from '../../lib/api';
import DownloadCVButton from './DownloadCVButton';

interface HeroProps {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  skills: SkillGroup[];
}

export default function HeroSection({ profile, experiences, educations, skills }: HeroProps) {
  const initials = profile.name.split(' ').slice(0, 2).map(n => n[0]).join('');

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--cv-bg)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-5%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Content container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>

        {/* Eyebrow */}
        <div className="cv-animate cv-animate-delay-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--cv-accent)', animation: 'pulse-dot 2s infinite', flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--cv-font-mono)', fontSize: '0.68rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--cv-accent)',
          }}>
            Curriculum Vitae · {new Date().getFullYear()}
          </span>
        </div>

        {/* Avatar + Name */}
        <div className="cv-animate cv-animate-delay-2" style={{ marginBottom: '20px' }}>
          {/* Avatar */}
          <div style={{
            width: '64px', height: '64px', borderRadius: '14px',
            background: 'var(--cv-surface-2)', border: '1px solid var(--cv-accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--cv-font-heading)',
            color: 'var(--cv-accent)', marginBottom: '20px',
            boxShadow: '0 0 24px var(--cv-accent-glow)',
          }}>
            {initials}
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--cv-font-heading)',
            fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: 'var(--cv-text-primary)',
            margin: 0,
          }}>
            {profile.name}
          </h1>
        </div>

        {/* Title */}
        <div className="cv-animate cv-animate-delay-3" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <span style={{ display: 'block', width: '28px', height: '2px', background: 'var(--cv-accent)', borderRadius: '2px', flexShrink: 0 }} />
          <p style={{
            fontFamily: 'var(--cv-font-heading)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 400, color: 'var(--cv-accent)', letterSpacing: '0.01em', margin: 0,
          }}>
            {profile.title}
          </p>
        </div>

        {/* Summary */}
        <p className="cv-animate cv-animate-delay-4" style={{
          fontFamily: 'var(--cv-font-body)',
          fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
          color: 'var(--cv-text-secondary)', lineHeight: 1.8,
          maxWidth: '580px', marginBottom: '36px',
        }}>
          {profile.summary}
        </p>

        {/* Contact chips */}
        <div className="cv-animate cv-animate-delay-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {profile.email && <Chip href={`mailto:${profile.email}`} icon={<Mail size={13} />}>{profile.email}</Chip>}
          {profile.phone && <Chip icon={<Phone size={13} />}>{profile.phone}</Chip>}
          {profile.location && <Chip icon={<MapPin size={13} />}>{profile.location}</Chip>}
          {profile.linkedin && <Chip href={profile.linkedin} icon={<Linkedin size={13} />} accent>LinkedIn</Chip>}
          {profile.github && <Chip href={profile.github} icon={<Github size={13} />} accent>GitHub</Chip>}
          <DownloadCVButton profile={profile} experiences={experiences} educations={educations} skills={skills} />
        </div>
      </div>

      {/* Bottom separator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--cv-accent-border), transparent)',
      }} />
    </section>
  );
}

function Chip({ href, icon, children, accent = false }: {
  href?: string; icon: React.ReactNode; children: React.ReactNode; accent?: boolean;
}) {
  const style: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '999px', fontSize: '0.78rem',
    fontFamily: 'var(--cv-font-body)', fontWeight: 500, textDecoration: 'none',
    cursor: href ? 'pointer' : 'default', transition: 'all 0.2s ease',
    background: accent ? 'var(--cv-accent-dim)' : 'var(--cv-surface-2)',
    border: `1px solid ${accent ? 'var(--cv-accent-border)' : 'var(--cv-border)'}`,
    color: accent ? 'var(--cv-accent)' : 'var(--cv-text-secondary)',
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!href) return;
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = 'var(--cv-accent-border)';
    el.style.color = 'var(--cv-accent)';
    el.style.background = 'var(--cv-accent-dim)';
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!href) return;
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = accent ? 'var(--cv-accent-border)' : 'var(--cv-border)';
    el.style.color = accent ? 'var(--cv-accent)' : 'var(--cv-text-secondary)';
    el.style.background = accent ? 'var(--cv-accent-dim)' : 'var(--cv-surface-2)';
  };
  if (href) return <a href={href} target="_blank" rel="noreferrer" style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{icon}{children}</a>;
  return <span style={style}>{icon}{children}</span>;
}
