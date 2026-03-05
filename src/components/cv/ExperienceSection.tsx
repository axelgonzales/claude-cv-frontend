import { useState } from 'react';
import type { Experience } from '../../lib/api';

function formatPeriod(exp: Experience): string {
  const end = exp.isCurrent ? 'Actualidad' : (exp.endDate ?? '');
  return `${exp.startDate} — ${end}`;
}

function getInitials(company: string) {
  return company.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="cv-animate py-24" style={{ borderTop: '1px solid var(--cv-border)' }}>
      <SectionHeader number="01" title="Experiencia" />

      <div className="mt-14 space-y-3">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id ?? idx}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              padding: '20px 24px',
              borderRadius: '12px',
              background: hovered === idx ? 'var(--cv-surface-2)' : 'transparent',
              border: `1px solid ${hovered === idx ? 'var(--cv-border-hover)' : 'transparent'}`,
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
          >
            {/* Accent left bar on hover */}
            {hovered === idx && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  bottom: '20%',
                  width: '2px',
                  borderRadius: '999px',
                  background: 'var(--cv-accent)',
                  boxShadow: '0 0 8px var(--cv-accent-glow)',
                }}
              />
            )}

            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Company logo */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: hovered === idx ? 'var(--cv-accent-dim)' : 'var(--cv-surface-3)',
                  border: `1px solid ${hovered === idx ? 'var(--cv-accent-border)' : 'var(--cv-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  fontFamily: 'var(--cv-font-mono)',
                  color: hovered === idx ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em',
                }}
              >
                {getInitials(exp.company)}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--cv-font-heading)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--cv-text-primary)',
                        marginBottom: '2px',
                      }}
                    >
                      {exp.role}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--cv-font-body)',
                        fontSize: '0.82rem',
                        color: hovered === idx ? 'var(--cv-accent)' : 'var(--cv-text-secondary)',
                        fontWeight: 500,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {exp.company}
                    </p>
                  </div>

                  {/* Period badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {exp.isCurrent && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--cv-accent)',
                          animation: 'pulse-dot 2s infinite',
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--cv-font-mono)',
                        fontSize: '0.72rem',
                        color: exp.isCurrent ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
                        background: exp.isCurrent ? 'var(--cv-accent-dim)' : 'var(--cv-surface-3)',
                        border: `1px solid ${exp.isCurrent ? 'var(--cv-accent-border)' : 'var(--cv-border)'}`,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatPeriod(exp)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--cv-font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--cv-text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: exp.technologies ? '12px' : 0,
                  }}
                >
                  {exp.description}
                </p>

                {/* Tech tags */}
                {exp.technologies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {exp.technologies.split(',').map(tech => (
                      <span
                        key={tech}
                        style={{
                          fontFamily: 'var(--cv-font-mono)',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'var(--cv-surface-3)',
                          border: '1px solid var(--cv-border)',
                          color: 'var(--cv-text-muted)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span
        style={{
          fontFamily: 'var(--cv-font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'var(--cv-accent)',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <h2
        style={{
          fontFamily: 'var(--cv-font-heading)',
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 700,
          color: 'var(--cv-text-primary)',
          letterSpacing: '-0.02em',
          flexShrink: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, height: '1px', background: 'var(--cv-border)' }} />
    </div>
  );
}
