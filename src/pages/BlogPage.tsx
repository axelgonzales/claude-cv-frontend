import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, ArrowRight, Terminal } from 'lucide-react';
import { blogApi, type BlogPost } from '../lib/api';
import { blogPosts as localBlogPosts, categoryColors } from '../data/blogPosts';

const categories = ['Todos', 'MCP', 'Skills', 'Agents', 'Commands', 'Architecture', 'Deploy', 'Hooks', 'Config', 'Tokens'] as const;

interface DisplayPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  imageUrl: string;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getAll()
      .then((data: BlogPost[]) => {
        setPosts(data.map(p => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          date: p.date,
          readTime: p.readTime,
          tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [],
          imageUrl: p.imageUrl || `/images/blog/${p.slug}.png`,
        })));
      })
      .catch(() => {
        // Fallback to local data
        setPosts(localBlogPosts.map(p => ({
          slug: p.id,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          date: p.date,
          readTime: p.readTime,
          tags: p.tags,
          imageUrl: `/images/blog/${p.id}.png`,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.category === activeCategory);

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
            {/* Posts grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map((post, idx) => (
                <BlogCard key={post.slug} post={post} index={idx} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>
                  No hay posts en esta categoria aun.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BlogCard({ post, index }: { post: DisplayPost; index: number }) {
  const color = categoryColors[post.category as keyof typeof categoryColors] || 'var(--cv-accent)';
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="cv-animate"
      style={{
        animationDelay: `${0.1 + index * 0.08}s`,
        borderRadius: '16px',
        border: `1px solid ${hovered ? 'var(--cv-border-hover)' : 'var(--cv-border)'}`,
        background: hovered ? 'var(--cv-surface-2)' : 'var(--cv-surface)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        display: 'block',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={post.imageUrl}
          alt={post.title}
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
        {/* Category badge on image */}
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
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
          {post.category}
        </span>
      </div>

      <div style={{ padding: '20px 24px 24px' }}>
        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {post.tags.slice(0, 4).map(tag => (
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

        {/* Read more */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
            Leer articulo <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
