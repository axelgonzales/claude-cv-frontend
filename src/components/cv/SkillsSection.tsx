import { SectionHeader } from './ExperienceSection';
import type { SkillGroup } from '../../lib/api';

export default function SkillsSection({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section className="cv-animate py-24" style={{ borderTop: '1px solid var(--cv-border)' }}>
      <SectionHeader number="02" title="Habilidades" />

      <div
        className="mt-14"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1px',
          background: 'var(--cv-border)',
          border: '1px solid var(--cv-border)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {skillGroups.map((group, idx) => (
          <div
            key={group.id ?? idx}
            style={{
              background: 'var(--cv-surface)',
              padding: '24px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--cv-surface-2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--cv-surface)'; }}
          >
            {/* Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '14px',
                  borderRadius: '2px',
                  background: 'var(--cv-accent)',
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--cv-accent)',
                }}
              >
                {group.category}
              </h3>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(group.items ?? '').split(',').filter(s => s.trim()).map(item => (
                <span
                  key={item}
                  style={{
                    fontFamily: 'var(--cv-font-body)',
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--cv-surface-3)',
                    border: '1px solid var(--cv-border)',
                    color: 'var(--cv-text-secondary)',
                    transition: 'all 0.15s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLSpanElement).style.background = 'var(--cv-accent-dim)';
                    (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--cv-accent-border)';
                    (e.currentTarget as HTMLSpanElement).style.color = 'var(--cv-accent)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLSpanElement).style.background = 'var(--cv-surface-3)';
                    (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--cv-border)';
                    (e.currentTarget as HTMLSpanElement).style.color = 'var(--cv-text-secondary)';
                  }}
                >
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
