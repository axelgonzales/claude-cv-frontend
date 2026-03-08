import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Terminal, List } from 'lucide-react';
import { blogApi, type BlogPost } from '../lib/api';
import { blogPosts as localPosts, categoryColors } from '../data/blogPosts';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  const [collapsed, setCollapsed] = useState(false);

  if (items.length === 0) return null;

  return (
    <nav
      style={{
        position: 'sticky',
        top: '72px',
        maxHeight: 'calc(100vh - 88px)',
        overflowY: 'auto',
        paddingRight: '16px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--cv-border) transparent',
      }}
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--cv-font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--cv-text-muted)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '12px',
          padding: 0,
        }}
      >
        <List size={12} />
        Contenido
        <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>{collapsed ? '+' : '-'}</span>
      </button>

      {!collapsed && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {items.map(item => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--cv-font-body)',
                    fontSize: item.level === 2 ? '0.73rem' : '0.67rem',
                    lineHeight: 1.4,
                    color: isActive ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
                    textDecoration: 'none',
                    padding: '4px 0 4px ' + (item.level === 3 ? '14px' : '0'),
                    borderLeft: isActive ? '2px solid var(--cv-accent)' : '2px solid transparent',
                    paddingLeft: item.level === 3 ? '14px' : '8px',
                    transition: 'all 0.15s ease',
                    opacity: isActive ? 1 : 0.75,
                  }}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

function ContentBlock({ text }: { text: string }) {
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

  if (text.startsWith('### ')) {
    const id = text.slice(4).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
      <h4
        id={id}
        style={{
          fontFamily: 'var(--cv-font-heading)',
          fontSize: '0.92rem',
          fontWeight: 600,
          color: 'var(--cv-text-primary)',
          marginTop: '14px',
          marginBottom: '-4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingLeft: '12px',
          borderLeft: '2px solid var(--cv-accent)',
        }}
      >
        {text.slice(4)}
      </h4>
    );
  }

  if (text.startsWith('## ')) {
    const id = text.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
      <h3
        id={id}
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

  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  const hasFormatting = parts.length > 1;

  if (text.startsWith('- ')) {
    return (
      <div style={{ display: 'flex', gap: '10px', paddingLeft: '4px' }}>
        <span style={{ color: 'var(--cv-accent)', fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>-</span>
        <p style={{ fontFamily: 'var(--cv-font-body)', fontSize: '0.86rem', color: 'var(--cv-text-secondary)', lineHeight: 1.8, margin: 0 }}>
          {renderInline(text.slice(2))}
        </p>
      </div>
    );
  }

  return (
    <p style={{ fontFamily: 'var(--cv-font-body)', fontSize: '0.88rem', color: 'var(--cv-text-secondary)', lineHeight: 1.8 }}>
      {hasFormatting ? renderInline(text) : text}
    </p>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--cv-text-primary)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
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

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<{ title: string; excerpt: string; category: string; date: string; readTime: string; content: string[]; tags: string[]; imageUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState('');

  useEffect(() => {
    if (!slug) return;

    blogApi.getBySlug(slug)
      .then((data: BlogPost) => {
        let contentArray: string[];
        try {
          contentArray = JSON.parse(data.content);
        } catch {
          contentArray = data.content ? [data.content] : [];
        }
        setPost({
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          date: data.date,
          readTime: data.readTime,
          content: contentArray,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
          imageUrl: data.imageUrl || `/images/blog/${slug}.png`,
        });
      })
      .catch(() => {
        // Fallback to local data
        const local = localPosts.find(p => p.id === slug);
        if (local) {
          setPost({
            title: local.title,
            excerpt: local.excerpt,
            category: local.category,
            date: local.date,
            readTime: local.readTime,
            content: local.content,
            tags: local.tags,
            imageUrl: `/images/blog/${slug}.png`,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const tocItems = useMemo(() => {
    if (!post) return [];
    return post.content
      .filter(block => block.startsWith('## ') || block.startsWith('### '))
      .map(block => {
        const level = block.startsWith('### ') ? 3 : 2;
        const text = block.slice(level + 1);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id, text, level } as TocItem;
      });
  }, [post]);

  useEffect(() => {
    if (tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveHeadingId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  if (loading) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>Cargando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--cv-font-heading)', fontSize: '1.2rem', color: 'var(--cv-text-primary)' }}>Post no encontrado</p>
        <Link to="/blog" style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', color: 'var(--cv-accent)', textDecoration: 'none' }}>
          Volver al blog
        </Link>
      </div>
    );
  }

  const color = categoryColors[post.category as keyof typeof categoryColors] || 'var(--cv-accent)';

  return (
    <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
      {/* Sticky back button - always visible */}
      <Link
        to="/blog"
        className="blog-back-btn"
        style={{
          position: 'fixed',
          top: '68px',
          left: '24px',
          zIndex: 50,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--cv-font-mono)',
          fontSize: '0.68rem',
          color: 'var(--cv-accent)',
          textDecoration: 'none',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--cv-accent-border)',
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowLeft size={13} /> Blog
      </Link>

      {/* Hero with image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={post.imageUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.25,
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

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* Meta */}
          <div className="cv-animate cv-animate-delay-2" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Terminal size={14} style={{ color: 'var(--cv-accent)' }} />
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
              {new Date(post.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.68rem', color: 'var(--cv-text-muted)' }}>
              <Clock size={11} /> {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1
            className="cv-animate cv-animate-delay-3"
            style={{
              fontFamily: 'var(--cv-font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--cv-text-primary)',
              marginBottom: '16px',
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            className="cv-animate cv-animate-delay-4"
            style={{
              fontFamily: 'var(--cv-font-body)',
              fontSize: '1rem',
              color: 'var(--cv-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '640px',
            }}
          >
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Content with TOC */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Tags */}
        <div style={{ maxWidth: '800px', display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--cv-border)' }}>
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

        <div style={{ display: 'flex', gap: '40px' }}>
          {/* TOC sidebar - hidden on mobile */}
          {tocItems.length > 3 && (
            <aside
              className="blog-toc-sidebar"
              style={{
                width: '220px',
                flexShrink: 0,
                display: 'none',
              }}
            >
              <TableOfContents items={tocItems} activeId={activeHeadingId} />
            </aside>
          )}

          {/* Article content */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: '800px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {post.content.map((block, i) => (
                <ContentBlock key={i} text={block} />
              ))}
            </div>

            {/* Bottom nav */}
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--cv-border)' }}>
              <Link
                to="/blog"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--cv-font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--cv-accent)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--cv-accent-border)',
                  background: 'var(--cv-accent-dim)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px var(--cv-accent-glow)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <ArrowLeft size={14} /> Todos los posts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for responsive TOC and sticky back button */}
      <style>{`
        @media (min-width: 1024px) {
          .blog-toc-sidebar { display: block !important; }
          .blog-back-btn { left: max(24px, calc((100vw - 1100px) / 2 - 100px)) !important; }
        }
        .blog-back-btn:hover {
          box-shadow: 0 0 16px var(--cv-accent-glow);
          border-color: var(--cv-accent) !important;
        }
      `}</style>
    </div>
  );
}
