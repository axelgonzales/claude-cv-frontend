import { useEffect, useState } from 'react';
import { ExternalLink, Github, ChevronRight, FolderKanban, CheckCircle } from 'lucide-react';
import { projectApi, type Project as ApiProject } from '../lib/api';
import { projects as fallbackProjects, categoryColors, statusLabels } from '../data/projects';

const categories = ['Todos', 'Full-Stack', 'Backend', 'Frontend', 'DevOps', 'AI'] as const;

interface DisplayProject {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  status: string;
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
  imageUrl: string;
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.getAll()
      .then((data: ApiProject[]) => {
        setProjects(data.map(p => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          longDescription: p.longDescription,
          technologies: p.technologies ? p.technologies.split(',').map(t => t.trim()) : [],
          category: p.category,
          status: p.status,
          liveUrl: p.liveUrl || undefined,
          githubUrl: p.githubUrl || undefined,
          highlights: p.highlights ? p.highlights.split('|||').map(h => h.trim()) : [],
          imageUrl: p.imageUrl || `/images/projects/${p.slug}.png`,
        })));
      })
      .catch(() => {
        setProjects(fallbackProjects.map(p => ({
          slug: p.id,
          title: p.title,
          description: p.description,
          longDescription: p.longDescription,
          technologies: p.technologies,
          category: p.category,
          status: p.status,
          liveUrl: p.links.live,
          githubUrl: p.links.github,
          highlights: p.highlights,
          imageUrl: `/images/projects/${p.id}.png`,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
      {/* Hero header */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
          <div className="cv-animate cv-animate-delay-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FolderKanban size={16} style={{ color: 'var(--cv-accent)' }} />
            <span
              style={{
                fontFamily: 'var(--cv-font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--cv-accent)',
              }}
            >
              Proyectos
            </span>
          </div>

          <h1
            className="cv-animate cv-animate-delay-2"
            style={{
              fontFamily: 'var(--cv-font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--cv-text-primary)',
              marginBottom: '16px',
            }}
          >
            Proyectos en los que
            <br />
            <span style={{ color: 'var(--cv-accent)' }}>he trabajado</span>
          </h1>

          <p
            className="cv-animate cv-animate-delay-3"
            style={{
              fontFamily: 'var(--cv-font-body)',
              fontSize: '1rem',
              color: 'var(--cv-text-secondary)',
              maxWidth: '560px',
              lineHeight: 1.7,
            }}
          >
            Desde aplicaciones full-stack hasta toolkits de IA — cada proyecto
            representa un aprendizaje y un desafio superado.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Category filters */}
        <div
          className="cv-animate cv-animate-delay-4"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '48px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--cv-border)',
          }}
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const color = cat === 'Todos' ? 'var(--cv-accent)' : categoryColors[cat as keyof typeof categoryColors];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? color : 'var(--cv-border)'}`,
                  background: isActive ? `${color}22` : 'transparent',
                  color: isActive ? color : 'var(--cv-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="cv-shimmer" style={{ height: '200px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : (
          <>
            {/* Projects grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map((project, idx) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={idx}
                  isExpanded={expandedProject === project.slug}
                  onToggle={() => setExpandedProject(expandedProject === project.slug ? null : project.slug)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>
                  No hay proyectos en esta categoria aun.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, isExpanded, onToggle }: {
  project: DisplayProject;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const color = categoryColors[project.category as keyof typeof categoryColors] || 'var(--cv-accent)';
  const status = statusLabels[project.status as keyof typeof statusLabels] || { label: project.status, color: '#888' };
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="cv-animate"
      style={{
        animationDelay: `${0.1 + index * 0.08}s`,
        borderRadius: '16px',
        border: `1px solid ${hovered ? 'var(--cv-border-hover)' : 'var(--cv-border)'}`,
        background: hovered ? 'var(--cv-surface-2)' : 'var(--cv-surface)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={project.imageUrl}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--cv-surface) 0%, transparent 60%)',
          }}
        />
        {/* Badges on image */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#fff',
              background: color,
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            {project.category}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.62rem',
              color: '#fff',
              background: status.color,
              padding: '4px 10px',
              borderRadius: '6px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#fff',
                ...(project.status === 'production' ? { animation: 'pulse-dot 2s infinite' } : {}),
              }}
            />
            {status.label}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 24px 24px' }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--cv-font-heading)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--cv-text-primary)',
            marginBottom: '8px',
            lineHeight: 1.4,
          }}
        >
          {project.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--cv-font-body)',
            fontSize: '0.85rem',
            color: 'var(--cv-text-secondary)',
            lineHeight: 1.7,
            marginBottom: '14px',
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: isExpanded ? '20px' : '0' }}>
          {project.technologies.map(tech => (
            <span
              key={tech}
              style={{
                fontFamily: 'var(--cv-font-mono)',
                fontSize: '0.65rem',
                color: 'var(--cv-text-muted)',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--cv-surface-3)',
                border: '1px solid var(--cv-border)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div
            style={{
              borderTop: '1px solid var(--cv-border)',
              paddingTop: '20px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--cv-font-body)',
                fontSize: '0.88rem',
                color: 'var(--cv-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '20px',
              }}
            >
              {project.longDescription}
            </p>

            {/* Highlights */}
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--cv-accent)',
                  marginBottom: '12px',
                }}
              >
                Highlights
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.highlights.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontFamily: 'var(--cv-font-body)',
                      fontSize: '0.82rem',
                      color: 'var(--cv-text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    <CheckCircle size={14} style={{ color: 'var(--cv-accent)', flexShrink: 0, marginTop: '3px' }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {(project.liveUrl || project.githubUrl) && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--cv-font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--cv-accent)',
                      background: 'var(--cv-accent-dim)',
                      border: '1px solid var(--cv-accent-border)',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px var(--cv-accent-glow)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <ExternalLink size={13} /> Ver en vivo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--cv-font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--cv-text-secondary)',
                      background: 'var(--cv-surface-3)',
                      border: '1px solid var(--cv-border)',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--cv-border-hover)';
                      e.currentTarget.style.color = 'var(--cv-text-primary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--cv-border)';
                      e.currentTarget.style.color = 'var(--cv-text-secondary)';
                    }}
                  >
                    <Github size={13} /> GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Expand indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '12px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.65rem',
              color: 'var(--cv-accent)',
            }}
          >
            {isExpanded ? 'Cerrar' : 'Ver mas'}
            <ChevronRight
              size={12}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </span>
        </div>
      </div>
    </article>
  );
}
