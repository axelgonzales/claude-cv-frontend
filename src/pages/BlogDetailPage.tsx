import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Terminal } from 'lucide-react';
import { blogApi, type BlogPost } from '../lib/api';
import { blogPosts as fallbackPosts, categoryColors } from '../data/blogPosts';

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
        // Fallback to hardcoded data
        const fallback = fallbackPosts.find(p => p.id === slug);
        if (fallback) {
          setPost({
            title: fallback.title,
            excerpt: fallback.excerpt,
            category: fallback.category,
            date: fallback.date,
            readTime: fallback.readTime,
            content: fallback.content,
            tags: fallback.tags,
            imageUrl: `/images/blog/${slug}.png`,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

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
          {/* Back link */}
          <Link
            to="/blog"
            className="cv-animate cv-animate-delay-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--cv-font-mono)',
              fontSize: '0.72rem',
              color: 'var(--cv-text-muted)',
              textDecoration: 'none',
              marginBottom: '28px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--cv-accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--cv-text-muted)'; }}
          >
            <ArrowLeft size={14} /> Volver al blog
          </Link>

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

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--cv-border)' }}>
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

        {/* Article content */}
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
  );
}
