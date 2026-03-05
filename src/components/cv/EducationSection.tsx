import { SectionHeader } from './ExperienceSection';
import type { Education } from '../../lib/api';

export default function EducationSection({ educations }: { educations: Education[] }) {
  return (
    <section className="cv-animate py-24" style={{ borderTop: '1px solid var(--cv-border)' }}>
      <SectionHeader number="03" title="Educación" />

      <div className="mt-14 grid md:grid-cols-2 gap-4">
        {educations.map((edu, idx) => (
          <div
            key={edu.id ?? idx}
            style={{
              position: 'relative',
              padding: '22px 24px',
              borderRadius: '12px',
              background: 'var(--cv-surface)',
              border: '1px solid var(--cv-border)',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--cv-border-hover)';
              el.style.background = 'var(--cv-surface-2)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--cv-border)';
              el.style.background = 'var(--cv-surface)';
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '24px',
                right: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, var(--cv-accent), transparent)',
              }}
            />

            <h3
              style={{
                fontFamily: 'var(--cv-font-heading)',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--cv-text-primary)',
                marginBottom: '6px',
                lineHeight: 1.4,
              }}
            >
              {edu.degree}
              {edu.field && (
                <span style={{ color: 'var(--cv-text-muted)', fontWeight: 400 }}> · {edu.field}</span>
              )}
            </h3>

            <p
              style={{
                fontFamily: 'var(--cv-font-body)',
                fontSize: '0.82rem',
                color: 'var(--cv-accent)',
                fontWeight: 500,
                marginBottom: '10px',
              }}
            >
              {edu.institution}
            </p>

            {edu.startYear && (
              <span
                style={{
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--cv-text-muted)',
                  background: 'var(--cv-surface-3)',
                  border: '1px solid var(--cv-border)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                {edu.startYear}{edu.endYear && edu.endYear !== edu.startYear ? ` — ${edu.endYear}` : ''}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
