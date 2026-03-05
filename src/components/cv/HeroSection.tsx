import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import type { Profile } from '../../lib/api';

export default function HeroSection({ profile }: { profile: Profile }) {
  const initials = profile.name.split(' ').slice(0, 2).map(n => n[0]).join('');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_60%)]" />
      <div className="max-w-5xl mx-auto px-6 py-20 relative">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="shrink-0 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-900/30">
            {initials}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{profile.name}</h1>
            <p className="mt-2 text-xl text-blue-400 font-medium">{profile.title}</p>
            <p className="mt-4 text-slate-400 max-w-2xl leading-relaxed">{profile.summary}</p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Mail size={15} />{profile.email}
                </a>
              )}
              {profile.phone && (
                <span className="flex items-center gap-2"><Phone size={15} />{profile.phone}</span>
              )}
              {profile.location && (
                <span className="flex items-center gap-2"><MapPin size={15} />{profile.location}</span>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Linkedin size={15} />LinkedIn
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Github size={15} />GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
