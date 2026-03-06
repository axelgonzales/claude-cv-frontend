export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: 'Full-Stack' | 'Backend' | 'Frontend' | 'DevOps' | 'AI';
  status: 'production' | 'development' | 'completed';
  links: {
    live?: string;
    github?: string;
  };
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 'cv-fullstack',
    title: 'CV Web App — Full Stack',
    description: 'Aplicacion full-stack para mi CV profesional con panel de administracion protegido por Firebase Auth.',
    longDescription: 'Construido enteramente con Claude Code como copiloto de desarrollo. Backend en Spring Boot con arquitectura layered, frontend en React + Vite con diseno dark minimal. Desplegado en Railway (backend + PostgreSQL) y Vercel (frontend).',
    technologies: ['Java 21', 'Spring Boot', 'PostgreSQL', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Firebase Auth', 'Railway', 'Vercel'],
    category: 'Full-Stack',
    status: 'production',
    links: {
      live: 'https://axelgonzales.vercel.app',
      github: 'https://github.com/axelgonzales',
    },
    highlights: [
      'API REST con endpoints publicos y protegidos via Firebase Admin SDK',
      'Panel admin con autenticacion Firebase y CRUD completo',
      'Generacion de PDF del CV desde el frontend',
      'CI/CD automatizado con Railway y Vercel',
    ],
  },
  {
    id: 'claude-code-blog',
    title: 'Blog — Claude Code Learnings',
    description: 'Blog tecnico documentando aprendizajes construyendo con Claude Code: MCP, Skills, Agents, Commands y Deploy.',
    longDescription: 'Una seccion integrada que documenta patrones, lecciones y mejores practicas descubiertas durante el desarrollo con Claude Code. Incluye categorias como MCP, Skills, Agents, Commands y Deploy.',
    technologies: ['React', 'TypeScript', 'Claude Code', 'MCP', 'Markdown'],
    category: 'Frontend',
    status: 'production',
    links: {
      live: 'https://axelgonzales.vercel.app/blog',
    },
    highlights: [
      'Documentacion de 6 areas clave de Claude Code',
      'Filtrado por categorias con animaciones fluidas',
      'Cards expandibles con contenido detallado',
    ],
  },
  {
    id: 'mcp-integrations',
    title: 'MCP Server Integrations',
    description: 'Configuracion e integracion de multiples servidores MCP para automatizar flujos de desarrollo.',
    longDescription: 'Investigacion, configuracion y uso practico de servidores MCP (Model Context Protocol) para conectar Claude Code con GitHub, Supabase, Railway, Puppeteer y nano-banana. Cada integracion probada en flujos reales de desarrollo.',
    technologies: ['MCP', 'GitHub API', 'Supabase', 'Railway', 'Puppeteer', 'Node.js'],
    category: 'DevOps',
    status: 'completed',
    links: {
      github: 'https://github.com/axelgonzales',
    },
    highlights: [
      'GitHub MCP para gestion de repos, PRs y branches',
      'Railway MCP para deploys automatizados',
      'Supabase MCP para manejo de base de datos',
      'Puppeteer MCP para testing visual',
    ],
  },
  {
    id: 'claude-toolkit',
    title: 'Claude Code Toolkit',
    description: 'Coleccion de Commands, Agents y Skills personalizados para Claude Code enfocados en arquitectura Java.',
    longDescription: 'Un toolkit completo de herramientas para Claude Code que incluye slash commands para migracion hexagonal, generacion de Swagger, user stories, y code review. Incluye agentes especializados en Spring Boot, logging y documentacion.',
    technologies: ['Claude Code', 'Markdown', 'YAML', 'Java', 'Spring Boot', 'Hexagonal Architecture'],
    category: 'AI',
    status: 'development',
    links: {},
    highlights: [
      '/java-hex-architect — Migracion a arquitectura hexagonal',
      '/swagger — Generacion automatica de OpenAPI docs',
      '/hu-generator + /hu-reviewer — Ciclo completo de user stories',
      'Agentes: refactor, code-review, swagger-expert, logger-expert',
    ],
  },
  {
    id: 'magic-board',
    title: 'Magic Board — Whiteboard Colaborativo',
    description: 'Clon funcional de Excalidraw con herramientas de dibujo, zoom, edicion avanzada y soporte para multiples paginas, Mermaid y Markdown.',
    longDescription: 'Aplicacion de dibujo colaborativo construida con HTML5 Canvas y JavaScript vanilla. Incluye herramientas completas de dibujo (rectangulos, circulos, flechas, texto, lapiz), personalizacion de estilos, zoom/pan, deshacer/rehacer, agrupacion, y exportacion. Desplegada en Vercel.',
    technologies: ['HTML5 Canvas', 'JavaScript', 'CSS3', 'Mermaid', 'Markdown', 'Vercel'],
    category: 'Frontend',
    status: 'production',
    links: {
      live: 'https://magic-board-app.vercel.app',
    },
    highlights: [
      'Herramientas completas: seleccion, formas, flechas, texto, lapiz, borrador, frames',
      'Soporte para multiples paginas, diagramas Mermaid y Markdown interactivo',
      'Zoom, pan, deshacer/rehacer, copiar/pegar, agrupar/desagrupar',
      'Personalizacion de colores, grosor, estilos de linea, relleno y opacidad',
    ],
  },
  {
    id: 'niubiz-qr-internacional',
    title: 'Niubiz QR Internacional — Pagos Cross-Border',
    description: 'Sistema de pagos QR internacionales en POS Niubiz que permite a extranjeros en Peru pagar con billeteras digitales de su pais.',
    longDescription: 'Proyecto liderado como Tech Lead para Niubiz. Integracion con el proveedor DePay para habilitar pagos QR cross-border en terminales POS Android. Extranjeros de Argentina y Brasil pueden pagar en comercios peruanos usando sus billeteras locales. Piloto en produccion desde marzo 2026, con expansion planificada a Colombia.',
    technologies: ['Java', 'Spring Boot', 'AWS', 'DePay API', 'Android POS', 'QR Payments'],
    category: 'Backend',
    status: 'production',
    links: {},
    highlights: [
      'Integracion cross-border con billeteras de Argentina y Brasil via DePay',
      'Desplegado en terminales POS Android de Niubiz a nivel nacional',
      'Piloto en produccion desde marzo 2026 — liderado como Tech Lead',
      'Expansion planificada a billeteras de Colombia',
    ],
  },
];

export const categoryColors: Record<Project['category'], string> = {
  'Full-Stack': '#06b6d4',
  Backend: '#10b981',
  Frontend: '#8b5cf6',
  DevOps: '#f59e0b',
  AI: '#ec4899',
};

export const statusLabels: Record<Project['status'], { label: string; color: string }> = {
  production: { label: 'En produccion', color: '#10b981' },
  development: { label: 'En desarrollo', color: '#f59e0b' },
  completed: { label: 'Completado', color: '#3b82f6' },
};
