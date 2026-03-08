import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Terminal } from 'lucide-react';
import { SectionHeader } from './ExperienceSection';
import { blogApi, type BlogPost } from '../../lib/api';
import { categoryColors } from '../../data/blogPosts';

interface PreviewPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<PreviewPost[]>([]);

  useEffect(() => {
    blogApi.getAll()
      .then((data: BlogPost[]) => {
        setPosts(data.slice(0, 3).map(p => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          readTime: p.readTime,
        })));
      })
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="cv-animate py-24" style={{ borderTop: '1px solid var(--cv-border)' }}>
      <SectionHeader number="01" title="Blog" />

      <p
        style={{
          fontFamily: 'var(--cv-font-body)',
          fontSize: '0.88rem',
          color: 'var(--cv-text-secondary)',
          marginTop: '20px',
          marginBottom: '32px',
          maxWidth: '520px',
          lineHeight: 1.7,
        }}
      >
        Aprendizajes construyendo con Claude Code — MCP, Skills, Agents y mas.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map(post => (
          <PreviewCard key={post.slug} post={post} />
        ))}
      </div>

      <Link
        to="/blog"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '28px',
          fontFamily: 'var(--cv-font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          color: 'var(--cv-accent)',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '999px',
          border: '1px solid var(--cv-accent-border)',
          background: 'var(--cv-accent-dim)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 0 20px var(--cv-accent-glow)';
          e.currentTarget.style.background = 'rgba(6,182,212,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = 'var(--cv-accent-dim)';
        }}
      >
        <Terminal size={13} />
        Ver todos los posts
        <ArrowRight size={13} />
      </Link>
    </section>
  );
}

function PreviewCard({ post }: { post: PreviewPost }) {
  const [hovered, setHovered] = useState(false);
  const color = categoryColors[post.category as keyof typeof categoryColors] || 'var(--cv-accent)';

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        textDecoration: 'none',
        display: 'block',
        padding: '18px 22px',
        borderRadius: '12px',
        background: hovered ? 'var(--cv-surface-2)' : 'transparent',
        border: `1px solid ${hovered ? 'var(--cv-border-hover)' : 'transparent'}`,
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: '2px',
            borderRadius: '999px',
            background: color,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--cv-font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: color,
            background: `${color}18`,
            border: `1px solid ${color}33`,
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {post.category}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.62rem', color: 'var(--cv-text-muted)' }}>
          <Clock size={10} /> {post.readTime}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--cv-font-heading)',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--cv-text-primary)',
          marginBottom: '4px',
        }}
      >
        {post.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--cv-font-body)',
          fontSize: '0.8rem',
          color: 'var(--cv-text-secondary)',
          lineHeight: 1.6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {post.excerpt}
      </p>
    </Link>
  );
}
