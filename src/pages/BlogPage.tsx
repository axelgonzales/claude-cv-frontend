import { useState } from 'react';
import { Clock, Tag, ChevronRight, Terminal } from 'lucide-react';
import { blogPosts, categoryColors, type BlogPost } from '../data/blogPosts';

const categories = ['Todos', 'MCP', 'Skills', 'Agents', 'Commands', 'Architecture', 'Deploy', 'Hooks', 'Config', 'Tokens'] as const;

function ContentBlock({ text }: { text: string }) {
  // Code block
  if (text.startsWith('```')) {
    const lines = text.split('\n');
    const lang = lines[0].replace('```', '').trim();
    const code = lines.slice(1, lines[lines.length - 1] === '```' ? -1 : undefined).join('\n');
    return (
      <div style={{ position: 'relative', marginTop: '4px', marginBottom: '4px' }}>
        {lang && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--cv-text-muted)',
              opacity: 0.6,
            }}
          >
            {lang}
          </span>
        )}
        <pre
          style={{
            fontFamily: 'var(--cv-font-mono)',
            fontSize: '0.78rem',
            lineHeight: 1.7,
            color: 'var(--cv-accent)',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--cv-border)',
            borderRadius: '10px',
            padding: '16px 18px',
            overflowX: 'auto',
            whiteSpace: 'pre',
            margin: 0,
          }}
        >
          {code}
        </pre>
      </div>
    );
  }

  // Subheading (## )
  if (text.startsWith('## ')) {
    return (
      <h3
        style={{
          fontFamily: 'var(--cv-font-heading)',
          fontSize: '1.05rem',
          fontWeight: 600,
          color: 'var(--cv-text-primary)',
          marginTop: '16px',
          marginBottom: '-4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ color: 'var(--cv-accent)', fontSize: '0.7rem', fontFamily: 'var(--cv-font-mono)' }}>#</span>
        {text.slice(3)}
      </h3>
    );
  }

  // Bold text (**text**)
  const parts = text.split(/(\*\*.*?\*\*)/g);
  const hasFormatting = parts.length > 1;

  // List items starting with -
  if (text.startsWith('- ')) {
    return (
      <div style={{ display: 'flex', gap: '10px', paddingLeft: '4px' }}>
        <span style={{ color: 'var(--cv-accent)', fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>-</span>
        <p
          style={{
            fontFamily: 'var(--cv-font-body)',
            fontSize: '0.86rem',
            color: 'var(--cv-text-secondary)',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {renderInline(text.slice(2))}
        </p>
      </div>
    );
  }

  return (
    <p
      style={{
        fontFamily: 'var(--cv-font-body)',
        fontSize: '0.88rem',
        color: 'var(--cv-text-secondary)',
        lineHeight: 1.8,
      }}
    >
      {hasFormatting ? renderInline(text) : text}
    </p>
  );
}

function renderInline(text: string) {
  // Handle **bold** and `code` inline
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--cv-text-primary)', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            fontFamily: 'var(--cv-font-mono)',
            fontSize: '0.82em',
            color: 'var(--cv-accent)',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.2)',
            padding: '1px 6px',
            borderRadius: '4px',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filtered = activeCategory === 'Todos'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
      {/* Hero header */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="/images/blog-header.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 0%, var(--cv-bg) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
          <div className="cv-animate cv-animate-delay-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Terminal size={16} style={{ color: 'var(--cv-accent)' }} />
            <span
              style={{
                fontFamily: 'var(--cv-font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--cv-accent)',
              }}
            >
              Blog / Claude Code
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
            Lo que aprendi construyendo
            <br />
            <span style={{ color: 'var(--cv-accent)' }}>con Claude Code</span>
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
            Notas, aprendizajes y patrones descubiertos mientras construia este CV full-stack
            usando MCP, Skills, Agents y mas.
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
            const color = cat === 'Todos' ? 'var(--cv-accent)' : categoryColors[cat as BlogPost['category']];
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

        {/* Posts grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((post, idx) => (
            <BlogCard
              key={post.id}
              post={post}
              index={idx}
              isExpanded={expandedPost === post.id}
              onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>
              No hay posts en esta categoria aun.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BlogCard({ post, index, isExpanded, onToggle }: {
  post: BlogPost;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const color = categoryColors[post.category];
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
      {/* Top accent */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div style={{ padding: '24px 28px' }}>
        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: color,
              background: `${color}18`,
              border: `1px solid ${color}33`,
              padding: '3px 10px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            {post.category}
          </span>
          <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.68rem', color: 'var(--cv-text-muted)' }}>
            {new Date(post.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.68rem', color: 'var(--cv-text-muted)' }}>
            <Clock size={11} /> {post.readTime}
          </span>
        </div>

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
          {post.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: 'var(--cv-font-body)',
            fontSize: '0.85rem',
            color: 'var(--cv-text-secondary)',
            lineHeight: 1.7,
            marginBottom: '14px',
          }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: isExpanded ? '20px' : '0' }}>
          {post.tags.map(tag => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--cv-font-mono)',
                fontSize: '0.65rem',
                color: 'var(--cv-text-muted)',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--cv-surface-3)',
                border: '1px solid var(--cv-border)',
              }}
            >
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              borderTop: '1px solid var(--cv-border)',
              paddingTop: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              cursor: 'default',
            }}
          >
            {post.content.map((block, i) => (
              <ContentBlock key={i} text={block} />
            ))}
          </div>
        )}

        {/* Expand indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '12px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.65rem',
              color: 'var(--cv-accent)',
              transition: 'transform 0.2s',
            }}
          >
            {isExpanded ? 'Cerrar' : 'Leer mas'}
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
