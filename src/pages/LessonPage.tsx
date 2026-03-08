import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ArrowLeft, Clock, ChevronRight, GraduationCap, List, CheckCircle, Lock } from 'lucide-react';
import { learnApi, type LearnLesson } from '../lib/api';
import { learnModules as localModules } from '../data/learnContent';
import { markLessonComplete, isLessonComplete } from '../lib/learnProgress';

interface TocItem { id: string; text: string; level: 2 | 3; }

export default function LessonPage() {
  const { moduleSlug, lessonSlug } = useParams<{ moduleSlug: string; lessonSlug?: string }>();
  const [lessons, setLessons] = useState<{ slug: string; title: string; excerpt: string; readTime: string; content: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonContent, setLessonContent] = useState<string[]>([]);
  const [moduleTitle, setModuleTitle] = useState('');
  const [authed, setAuthed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setAuthed(!!user));
    return unsub;
  }, []);

  // Scroll to top on lesson/module change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [moduleSlug, lessonSlug]);

  // Mark lesson as complete when viewing
  useEffect(() => {
    if (moduleSlug && lessonSlug) {
      markLessonComplete(moduleSlug, lessonSlug);
    }
  }, [moduleSlug, lessonSlug]);

  useEffect(() => {
    if (!moduleSlug || authed !== true) return;

    setLoading(true);
    learnApi.getLessons(moduleSlug)
      .then((data: LearnLesson[]) => {
        setLessons(data.map(l => ({
          slug: l.slug,
          title: l.title,
          excerpt: l.excerpt,
          readTime: l.readTime,
          content: [],
        })));
        return learnApi.getModule(moduleSlug);
      })
      .then(mod => setModuleTitle(mod.title))
      .catch(() => {
        const local = localModules.find(m => m.slug === moduleSlug);
        if (local) {
          setModuleTitle(local.title);
          setLessons(local.lessons.map(l => ({
            slug: l.slug,
            title: l.title,
            excerpt: l.excerpt,
            readTime: l.readTime,
            content: l.content,
          })));
        }
      })
      .finally(() => setLoading(false));
  }, [moduleSlug, authed]);

  // Fetch full lesson content when lessonSlug changes
  useEffect(() => {
    if (!moduleSlug || !lessonSlug || authed !== true) return;

    learnApi.getLesson(moduleSlug, lessonSlug)
      .then(lesson => {
        setLessonContent(Array.isArray(lesson.content) ? lesson.content : []);
      })
      .catch(() => {
        const local = localModules.find(m => m.slug === moduleSlug);
        const localLesson = local?.lessons.find(l => l.slug === lessonSlug);
        if (localLesson) setLessonContent(localLesson.content);
        else setLessonContent([]);
      });
  }, [moduleSlug, lessonSlug, authed]);

  const currentLesson = lessonSlug
    ? lessons.find(l => l.slug === lessonSlug)
    : lessons[0];

  const currentIndex = currentLesson ? lessons.findIndex(l => l.slug === currentLesson.slug) : 0;
  const nextLesson = lessons[currentIndex + 1];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const tocItems = useMemo<TocItem[]>(() => {
    return lessonContent
      .filter(b => b.startsWith('## ') || b.startsWith('### '))
      .map(b => {
        const level = b.startsWith('### ') ? 3 : 2;
        const text = b.slice(level === 2 ? 3 : 4);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id, text, level };
      });
  }, [lessonContent]);

  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
    }, { rootMargin: '-80px 0px -60% 0px' });
    tocItems.forEach(t => { const el = document.getElementById(t.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [tocItems]);

  // Auth loading
  if (authed === null) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px' }}>
          <div className="cv-shimmer" style={{ height: '200px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (authed === false) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--cv-surface-2)', border: '2px solid var(--cv-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Lock size={24} style={{ color: 'var(--cv-text-muted)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--cv-font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--cv-text-primary)', marginBottom: '8px' }}>
            Contenido exclusivo
          </h2>
          <p style={{ fontFamily: 'var(--cv-font-body)', fontSize: '0.88rem', color: 'var(--cv-text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
            Inicia sesion para acceder a las lecciones.
          </p>
          <button
            onClick={() => navigate('/admin')}
            style={{
              fontFamily: 'var(--cv-font-mono)', fontSize: '0.78rem',
              padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
              background: 'var(--cv-accent)', color: '#fff', border: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Iniciar sesion
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px' }}>
          <div className="cv-shimmer" style={{ height: '40px', width: '200px', borderRadius: '8px', marginBottom: '20px' }} />
          <div className="cv-shimmer" style={{ height: '300px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  // If no lessonSlug, show lesson list for this module
  if (!lessonSlug) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
          <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.72rem', color: 'var(--cv-text-muted)', textDecoration: 'none', marginBottom: '24px' }}>
            <ArrowLeft size={14} /> Volver a modulos
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <GraduationCap size={16} style={{ color: 'var(--cv-accent)' }} />
            <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cv-accent)' }}>
              Modulo
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--cv-font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--cv-text-primary)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
            {moduleTitle}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lessons.map((lesson, idx) => (
              <LessonCard key={lesson.slug} lesson={lesson} moduleSlug={moduleSlug!} index={idx} completed={isLessonComplete(moduleSlug!, lesson.slug)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--cv-text-muted)', fontFamily: 'var(--cv-font-mono)' }}>Leccion no encontrada.</p>
          <Link to={`/learn/${moduleSlug}`} style={{ color: 'var(--cv-accent)', fontFamily: 'var(--cv-font-mono)', fontSize: '0.8rem' }}>Volver al modulo</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px', display: 'flex', gap: '48px' }}>
        {/* TOC sidebar */}
        {tocItems.length > 0 && (
          <aside style={{ width: '200px', flexShrink: 0, display: 'none' }} className="learn-toc-sidebar">
            <style>{`.learn-toc-sidebar { display: none !important; } @media (min-width: 900px) { .learn-toc-sidebar { display: block !important; } }`}</style>
            <nav style={{ position: 'sticky', top: '72px', maxHeight: 'calc(100vh - 88px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cv-text-muted)', marginBottom: '12px' }}>
                <List size={12} /> Contenido
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                      style={{
                        display: 'block', fontFamily: 'var(--cv-font-body)',
                        fontSize: item.level === 2 ? '0.73rem' : '0.67rem', lineHeight: 1.4,
                        color: activeId === item.id ? 'var(--cv-accent)' : 'var(--cv-text-muted)',
                        textDecoration: 'none', padding: '4px 0 4px 8px',
                        paddingLeft: item.level === 3 ? '14px' : '8px',
                        borderLeft: activeId === item.id ? '2px solid var(--cv-accent)' : '2px solid transparent',
                        transition: 'all 0.15s ease', opacity: activeId === item.id ? 1 : 0.75,
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/learn/${moduleSlug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.72rem', color: 'var(--cv-text-muted)', textDecoration: 'none', marginBottom: '20px' }}>
            <ArrowLeft size={14} /> {moduleTitle}
          </Link>

          <h1 style={{ fontFamily: 'var(--cv-font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--cv-text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {currentLesson.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.68rem', color: 'var(--cv-text-muted)' }}>
              <Clock size={11} /> {currentLesson.readTime}
            </span>
            <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.68rem', color: 'var(--cv-text-muted)' }}>
              Leccion {currentIndex + 1} de {lessons.length}
            </span>
          </div>

          {/* Content blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {lessonContent.map((block, i) => (
              <ContentBlock key={i} text={block} />
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--cv-border)' }}>
            {prevLesson ? (
              <Link to={`/learn/${moduleSlug}/${prevLesson.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.75rem', color: 'var(--cv-text-muted)', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> {prevLesson.title}
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link to={`/learn/${moduleSlug}/${nextLesson.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.75rem', color: 'var(--cv-accent)', textDecoration: 'none' }}>
                {nextLesson.title} <ChevronRight size={14} />
              </Link>
            ) : (
              <Link to="/learn" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.75rem', color: 'var(--cv-accent)', textDecoration: 'none' }}>
                Volver a modulos <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function LessonCard({ lesson, moduleSlug, index, completed }: { lesson: { slug: string; title: string; excerpt: string; readTime: string }; moduleSlug: string; index: number; completed: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/learn/${moduleSlug}/${lesson.slug}`}
      className="cv-animate"
      style={{
        animationDelay: `${0.1 + index * 0.08}s`,
        display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 22px',
        borderRadius: '12px', textDecoration: 'none',
        border: `1px solid ${completed ? 'rgba(5,150,105,0.3)' : hovered ? 'var(--cv-border-hover)' : 'var(--cv-border)'}`,
        background: hovered ? 'var(--cv-surface-2)' : 'var(--cv-surface)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%',
        background: completed ? '#059669' : hovered ? 'var(--cv-accent)' : 'var(--cv-surface-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--cv-font-mono)', fontSize: '0.72rem', fontWeight: 700,
        color: completed || hovered ? '#fff' : 'var(--cv-text-muted)', transition: 'all 0.2s ease',
      }}>
        {completed ? <CheckCircle size={16} /> : index + 1}
      </span>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--cv-font-heading)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--cv-text-primary)', marginBottom: '2px' }}>
          {lesson.title}
        </h3>
        <p style={{ fontFamily: 'var(--cv-font-body)', fontSize: '0.78rem', color: 'var(--cv-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {lesson.excerpt}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem', color: 'var(--cv-text-muted)' }}>
          <Clock size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />{lesson.readTime}
        </span>
        <ChevronRight size={14} style={{ color: hovered ? 'var(--cv-accent)' : 'var(--cv-text-muted)' }} />
      </div>
    </Link>
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
          <span style={{ position: 'absolute', top: '8px', right: '12px', fontFamily: 'var(--cv-font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cv-text-muted)', opacity: 0.6 }}>
            {lang}
          </span>
        )}
        <pre style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.78rem', lineHeight: 1.7, color: 'var(--cv-accent)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--cv-border)', borderRadius: '10px', padding: '16px 18px', overflowX: 'auto', whiteSpace: 'pre', margin: 0 }}>
          {code}
        </pre>
      </div>
    );
  }

  if (text.startsWith('### ')) {
    const id = text.slice(4).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
      <h4 id={id} style={{ fontFamily: 'var(--cv-font-heading)', fontSize: '0.92rem', fontWeight: 600, color: 'var(--cv-text-primary)', marginTop: '14px', marginBottom: '-4px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: '2px solid var(--cv-accent)' }}>
        {text.slice(4)}
      </h4>
    );
  }

  if (text.startsWith('## ')) {
    const id = text.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
      <h3 id={id} style={{ fontFamily: 'var(--cv-font-heading)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--cv-text-primary)', marginTop: '16px', marginBottom: '-4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--cv-accent)', fontSize: '0.7rem', fontFamily: 'var(--cv-font-mono)' }}>#</span>
        {text.slice(3)}
      </h3>
    );
  }

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

  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  const hasFormatting = parts.length > 1;

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
        <code key={i} style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.82em', color: 'var(--cv-accent)', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '1px 6px', borderRadius: '4px' }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
