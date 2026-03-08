import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Terminal, FileText, Plug, Slash, BookOpen, Bot, Zap, Brain, Cpu, ChevronRight, GraduationCap, CheckCircle, Lock, Circle, ChevronDown } from 'lucide-react';
import { learnApi, type LearnModule } from '../lib/api';
import { learnModules as localModules } from '../data/learnContent';
import { getCompletedLessons, isLessonComplete } from '../lib/learnProgress';

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={16} />,
  FileText: <FileText size={16} />,
  Plug: <Plug size={16} />,
  Slash: <Slash size={16} />,
  BookOpen: <BookOpen size={16} />,
  Bot: <Bot size={16} />,
  Zap: <Zap size={16} />,
  Brain: <Brain size={16} />,
  Cpu: <Cpu size={16} />,
};

type DisplayModule = LearnModule;

export default function LearnPage() {
  const [modules, setModules] = useState<DisplayModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setAuthed(!!user);
    });
    return unsub;
  }, []);

  // Refresh completed lessons on focus (user may return from a lesson)
  useEffect(() => {
    setCompletedLessons(getCompletedLessons());
    const onFocus = () => setCompletedLessons(getCompletedLessons());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    if (authed === false) return;

    // Single API call — backend now returns modules with lesson summaries included
    learnApi.getModules()
      .then(setModules)
      .catch(() => {
        setModules(localModules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => ({ slug: l.slug, title: l.title, excerpt: l.excerpt, readTime: l.readTime })),
        })));
      })
      .finally(() => setLoading(false));
  }, [authed]);

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalCompleted = modules.reduce((sum, m) => sum + m.lessons.filter(l => isLessonComplete(m.slug, l.slug)).length, 0);
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const getModuleProgress = (mod: DisplayModule) => {
    const completed = mod.lessons.filter(l => isLessonComplete(mod.slug, l.slug)).length;
    return { completed, total: mod.lessons.length, isComplete: completed >= mod.lessons.length && mod.lessons.length > 0 };
  };

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
            Inicia sesion para acceder a la guia progresiva de Claude Code.
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

  return (
    <div style={{ background: 'var(--cv-bg)', minHeight: '100vh', paddingTop: '56px' }}>
      {/* Hero */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 32px' }}>
        <div className="cv-animate cv-animate-delay-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <GraduationCap size={16} style={{ color: 'var(--cv-accent)' }} />
          <span style={{
            fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cv-accent)',
          }}>
            Aprende Claude Code
          </span>
        </div>

        <h1 className="cv-animate cv-animate-delay-2" style={{
          fontFamily: 'var(--cv-font-heading)', fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em',
          color: 'var(--cv-text-primary)', marginBottom: '16px',
        }}>
          Guia progresiva de
          <br />
          <span style={{ color: 'var(--cv-accent)' }}>Claude Code</span>
        </h1>

        <p className="cv-animate cv-animate-delay-3" style={{
          fontFamily: 'var(--cv-font-body)', fontSize: '1rem',
          color: 'var(--cv-text-secondary)', maxWidth: '560px', lineHeight: 1.7,
        }}>
          De cero a avanzado. Cada modulo construye sobre el anterior.
          Empieza por los fundamentos y llega hasta crear tus propios agentes y hooks.
        </p>

        {/* Overall progress card */}
        {!loading && totalLessons > 0 && (
          <div className="cv-animate cv-animate-delay-4" style={{
            marginTop: '28px', padding: '20px 24px', borderRadius: '14px',
            background: 'var(--cv-surface)', border: '1px solid var(--cv-border)',
            maxWidth: '560px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.7rem', color: 'var(--cv-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Progreso general
              </span>
              <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.82rem', fontWeight: 700, color: overallPercent === 100 ? '#059669' : 'var(--cv-accent)' }}>
                {totalCompleted}/{totalLessons} lecciones · {overallPercent}%
              </span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'var(--cv-border)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                width: `${overallPercent}%`,
                background: overallPercent === 100 ? '#059669' : 'var(--cv-accent)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Modules with expanded lessons */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="cv-shimmer" style={{ height: '160px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {modules.map((mod, idx) => (
              <ModuleCard key={mod.slug} module={mod} index={idx} progress={getModuleProgress(mod)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleCard({ module, index, progress }: { module: DisplayModule; index: number; progress: { completed: number; total: number; isComplete: boolean } }) {
  const [collapsed, setCollapsed] = useState(false);
  const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div
      className="cv-animate"
      style={{
        animationDelay: `${0.1 + index * 0.06}s`,
        borderRadius: '14px',
        border: `1px solid ${progress.isComplete ? 'rgba(5,150,105,0.3)' : 'var(--cv-border)'}`,
        background: 'var(--cv-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Module header — clickable to collapse/expand */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: '100%', border: 'none', cursor: 'pointer',
          background: 'transparent', padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: '16px',
          textAlign: 'left',
        }}
      >
        {/* Icon circle */}
        <div style={{
          flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%',
          background: progress.isComplete ? '#059669' : 'var(--cv-surface-2)',
          border: `2px solid ${progress.isComplete ? '#059669' : 'var(--cv-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: progress.isComplete ? '#fff' : 'var(--cv-text-muted)',
          transition: 'all 0.2s ease',
        }}>
          {progress.isComplete
            ? <CheckCircle size={18} />
            : iconMap[module.icon] || <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>{index + 1}</span>
          }
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
            <h3 style={{
              fontFamily: 'var(--cv-font-heading)', fontSize: '1rem',
              fontWeight: 600, color: 'var(--cv-text-primary)', margin: 0,
            }}>
              {module.title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--cv-font-mono)', fontSize: '0.6rem',
              color: progress.isComplete ? '#059669' : 'var(--cv-text-muted)',
            }}>
              {progress.completed}/{progress.total} lecciones
            </span>
            {/* Mini progress bar inline */}
            <div style={{ flex: 1, maxWidth: '120px', height: '3px', borderRadius: '2px', background: 'var(--cv-border)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: `${percent}%`,
                background: progress.isComplete ? '#059669' : 'var(--cv-accent)',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--cv-font-mono)', fontSize: '0.58rem',
              color: progress.isComplete ? '#059669' : 'var(--cv-text-muted)',
              fontWeight: 600,
            }}>
              {percent}%
            </span>
          </div>
        </div>

        {/* Collapse chevron */}
        <ChevronDown
          size={18}
          style={{
            color: 'var(--cv-text-muted)', flexShrink: 0,
            transition: 'transform 0.2s ease',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Lesson list — always visible unless collapsed */}
      {!collapsed && (
        <div style={{ padding: '0 24px 16px', paddingLeft: '80px' }}>
          {module.lessons.map((lesson, lIdx) => {
            const completed = isLessonComplete(module.slug, lesson.slug);
            return (
              <LessonRow
                key={lesson.slug}
                lesson={lesson}
                moduleSlug={module.slug}
                index={lIdx}
                completed={completed}
                isLast={lIdx === module.lessons.length - 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson, moduleSlug, index: _index, completed, isLast }: {
  lesson: import('../lib/api').LearnLessonSummary;
  moduleSlug: string; index: number; completed: boolean; isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/learn/${moduleSlug}/${lesson.slug}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 12px', marginLeft: '-12px', marginRight: '-12px',
        borderRadius: '8px', textDecoration: 'none',
        background: hovered ? 'var(--cv-surface-2)' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid var(--cv-border)',
        borderBottomLeftRadius: isLast ? '8px' : 0,
        borderBottomRightRadius: isLast ? '8px' : 0,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status icon */}
      {completed ? (
        <CheckCircle size={16} style={{ color: '#059669', flexShrink: 0 }} />
      ) : (
        <Circle size={16} style={{ color: 'var(--cv-border)', flexShrink: 0 }} />
      )}

      {/* Lesson info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--cv-font-body)', fontSize: '0.84rem',
          color: completed ? 'var(--cv-text-muted)' : 'var(--cv-text-primary)',
          textDecoration: completed ? 'none' : 'none',
          fontWeight: completed ? 400 : 500,
        }}>
          {lesson.title}
        </span>
      </div>

      {/* Read time + arrow */}
      <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.62rem', color: 'var(--cv-text-muted)', flexShrink: 0 }}>
        {lesson.readTime}
      </span>
      <ChevronRight size={14} style={{ color: hovered ? 'var(--cv-accent)' : 'var(--cv-text-muted)', flexShrink: 0, transition: 'color 0.15s' }} />
    </Link>
  );
}
