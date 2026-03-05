import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({ baseURL: '/api' });

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
