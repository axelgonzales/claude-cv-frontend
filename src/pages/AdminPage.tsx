import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { profileApi, experienceApi, educationApi, skillsApi } from '../lib/api';
import type { Profile, Experience, Education, SkillGroup } from '../lib/api';
import ProfileForm from '../components/admin/ProfileForm';
import ExperienceForm from '../components/admin/ExperienceForm';
import EducationForm from '../components/admin/EducationForm';
import SkillsForm from '../components/admin/SkillsForm';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, User as UserIcon } from 'lucide-react';

type Tab = 'profile' | 'experience' | 'education' | 'skills';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = () => {
    profileApi.get().then(setProfile);
    experienceApi.getAll().then(setExperiences);
    educationApi.getAll().then(setEducations);
    skillsApi.getAll().then(setSkills);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError('Credenciales incorrectas');
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-700 p-8">
        <div className="flex items-center gap-3 mb-8">
          <UserIcon size={20} className="text-blue-400" />
          <h1 className="text-xl font-bold text-white">Admin — CV</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña" required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
          {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
            Ingresar
          </button>
        </form>
        <Link to="/" className="mt-4 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors">
          <ArrowLeft size={14} />Volver al CV
        </Link>
      </div>
    </div>
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Perfil' },
    { key: 'experience', label: 'Experiencia' },
    { key: 'education', label: 'Educación' },
    { key: 'skills', label: 'Habilidades' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft size={18} /></Link>
          <h1 className="text-lg font-bold text-white">Panel Admin</h1>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors">
          <LogOut size={15} />Salir
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-700 w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && profile && (
          <ProfileForm profile={profile} onSave={async (data) => { const p = await profileApi.update(data); setProfile(p); }} />
        )}
        {tab === 'experience' && (
          <ExperienceForm experiences={experiences} onChange={loadData} />
        )}
        {tab === 'education' && (
          <EducationForm educations={educations} onChange={loadData} />
        )}
        {tab === 'skills' && (
          <SkillsForm skillGroups={skills} onChange={loadData} />
        )}
      </div>
    </div>
  );
}
