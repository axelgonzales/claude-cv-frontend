import { useEffect, useState } from 'react';
import { profileApi, experienceApi, educationApi, skillsApi } from '../lib/api';
import type { Profile, Experience, Education, SkillGroup } from '../lib/api';
import HeroSection from '../components/cv/HeroSection';
import ExperienceSection from '../components/cv/ExperienceSection';
import EducationSection from '../components/cv/EducationSection';
import SkillsSection from '../components/cv/SkillsSection';
import BlogPreviewSection from '../components/cv/BlogPreviewSection';
import Loader from '../components/cv/Loader';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

function SkeletonHero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 24px', background: 'var(--cv-bg)' }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <div className="cv-shimmer" style={{ width: '120px', height: '10px', marginBottom: '32px', borderRadius: '4px' }} />
        <div className="cv-shimmer" style={{ width: '72px', height: '72px', borderRadius: '16px', marginBottom: '24px' }} />
        <div className="cv-shimmer" style={{ width: '70%', height: '64px', borderRadius: '8px', marginBottom: '16px' }} />
        <div className="cv-shimmer" style={{ width: '40%', height: '24px', borderRadius: '6px', marginBottom: '24px' }} />
        <div className="cv-shimmer" style={{ width: '90%', height: '14px', borderRadius: '4px', marginBottom: '8px' }} />
        <div className="cv-shimmer" style={{ width: '75%', height: '14px', borderRadius: '4px', marginBottom: '8px' }} />
        <div className="cv-shimmer" style={{ width: '55%', height: '14px', borderRadius: '4px', marginBottom: '32px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[160, 90, 110, 80].map(w => (
            <div key={w} className="cv-shimmer" style={{ width: w, height: '32px', borderRadius: '999px' }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonSection() {
  return (
    <div style={{ padding: '80px 0', borderTop: '1px solid var(--cv-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        <div className="cv-shimmer" style={{ width: '24px', height: '10px', borderRadius: '4px' }} />
        <div className="cv-shimmer" style={{ width: '140px', height: '24px', borderRadius: '6px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="cv-shimmer" style={{ height: '90px', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
  );
}

export default function CvPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileApi.get(),
      experienceApi.getAll(),
      educationApi.getAll(),
      skillsApi.getAll(),
    ]).then(([p, e, ed, s]) => {
      setProfile(p);
      setExperiences(e);
      setEducations(ed);
      setSkills(s);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh' }}>
        <Loader />
        <SkeletonHero />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--cv-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <p style={{ fontFamily: 'var(--cv-font-heading)', fontSize: '1.1rem', color: 'var(--cv-text-secondary)' }}>
          No se encontró el perfil
        </p>
        <p style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.72rem', color: 'var(--cv-accent)' }}>
          Verifica que el backend esté en ejecución · localhost:8081
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
      <HeroSection profile={profile} experiences={experiences} educations={educations} skills={skills} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <BlogPreviewSection />
        <ExperienceSection experiences={experiences} />
        <SkillsSection skillGroups={skills} />
        <EducationSection educations={educations} />

        <footer
          style={{
            padding: '40px 0',
            borderTop: '1px solid var(--cv-border)',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.7rem', color: 'var(--cv-text-muted)' }}>
            <span style={{ color: 'var(--cv-accent)' }}>{profile.name}</span>
            {' '}· {new Date().getFullYear()}
          </p>
          <p style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem', color: 'var(--cv-text-muted)', letterSpacing: '0.1em' }}>
            LIMA, PERÚ
          </p>
        </footer>
      </div>

      {/* Botón admin */}
      <Link
        to="/admin"
        title="Panel de administración"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'var(--cv-surface-2)',
          border: '1px solid var(--cv-border)',
          color: 'var(--cv-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'var(--cv-accent-border)';
          el.style.color = 'var(--cv-accent)';
          el.style.boxShadow = '0 0 16px var(--cv-accent-glow)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'var(--cv-border)';
          el.style.color = 'var(--cv-text-muted)';
          el.style.boxShadow = 'none';
        }}
      >
        <Settings size={16} />
      </Link>
    </div>
  );
}
