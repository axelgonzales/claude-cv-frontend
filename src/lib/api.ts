import axios from 'axios';
import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Profile {
  id?: number;
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface Experience {
  id?: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string;
  displayOrder: number;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  displayOrder: number;
}

export interface SkillGroup {
  id?: number;
  category: string;
  items: string;
  displayOrder: number;
}

export const profileApi = {
  get: () => api.get<Profile>('/profile').then(r => r.data),
  update: (data: Profile) => api.put<Profile>('/profile', data).then(r => r.data),
};

export const experienceApi = {
  getAll: () => api.get<Experience[]>('/experience').then(r => r.data),
  create: (data: Experience) => api.post<Experience>('/experience', data).then(r => r.data),
  update: (id: number, data: Experience) => api.put<Experience>(`/experience/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};

export const educationApi = {
  getAll: () => api.get<Education[]>('/education').then(r => r.data),
  create: (data: Education) => api.post<Education>('/education', data).then(r => r.data),
  update: (id: number, data: Education) => api.put<Education>(`/education/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/education/${id}`),
};

export const skillsApi = {
  getAll: () => api.get<SkillGroup[]>('/skills').then(r => r.data),
  create: (data: SkillGroup) => api.post<SkillGroup>('/skills', data).then(r => r.data),
  update: (id: number, data: SkillGroup) => api.put<SkillGroup>(`/skills/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/skills/${id}`),
};

export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
  tags: string;
  imageUrl: string;
  displayOrder: number;
}

export interface Project {
  id?: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string;
  category: string;
  status: string;
  liveUrl: string;
  githubUrl: string;
  highlights: string;
  imageUrl: string;
  displayOrder: number;
}

export const blogApi = {
  getAll: () => api.get<BlogPost[]>('/blog').then(r => r.data),
  getBySlug: (slug: string) => api.get<BlogPost>(`/blog/${slug}`).then(r => r.data),
  create: (data: BlogPost) => api.post<BlogPost>('/blog', data).then(r => r.data),
  update: (id: number, data: BlogPost) => api.put<BlogPost>(`/blog/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/blog/${id}`),
};

export interface LearnModule {
  id?: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  lessonCount: number;
}

export interface LearnLesson {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  moduleSlug: string;
  displayOrder: number;
  readTime: string;
}

export const learnApi = {
  getModules: () => api.get<LearnModule[]>('/learn/modules').then(r => r.data),
  getModule: (slug: string) => api.get<LearnModule>(`/learn/modules/${slug}`).then(r => r.data),
  getLessons: (moduleSlug: string) => api.get<LearnLesson[]>(`/learn/modules/${moduleSlug}/lessons`).then(r => r.data),
  getLesson: (moduleSlug: string, lessonSlug: string) => api.get<LearnLesson>(`/learn/modules/${moduleSlug}/lessons/${lessonSlug}`).then(r => r.data),
};

export const projectApi = {
  getAll: () => api.get<Project[]>('/projects').then(r => r.data),
  getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}`).then(r => r.data),
  create: (data: Project) => api.post<Project>('/projects', data).then(r => r.data),
  update: (id: number, data: Project) => api.put<Project>(`/projects/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};
