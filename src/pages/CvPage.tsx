import { useEffect, useState } from 'react';
import { profileApi, experienceApi, educationApi, skillsApi } from '../lib/api';
import type { Profile, Experience, Education, SkillGroup } from '../lib/api';
import HeroSection from '../components/cv/HeroSection';
import ExperienceSection from '../components/cv/ExperienceSection';
import EducationSection from '../components/cv/EducationSection';
import SkillsSection from '../components/cv/SkillsSection';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function CvPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileApi.get(),
      experienceApi.getAll(),
      educationApi.getAll(),
      skillsApi.getAll(),
    ]).then(([p, e, ed, s]) => {
      setProfile(p);
      setExperiences(e);
      setEducations(ed);
      setSkills(s);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-slate-400">
      No se encontró el perfil
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <HeroSection profile={profile} />
      <div className="max-w-5xl mx-auto px-6">
        <ExperienceSection experiences={experiences} />
        <SkillsSection skillGroups={skills} />
        <EducationSection educations={educations} />
        <footer className="py-10 text-center text-slate-600 text-sm border-t border-slate-800 mt-4">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </div>
      <Link to="/admin" className="fixed bottom-6 right-6 p-3 bg-slate-800 rounded-full border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors shadow-xl">
        <Settings size={18} />
      </Link>
    </div>
  );
}
