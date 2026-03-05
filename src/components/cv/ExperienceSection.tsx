import { Briefcase } from 'lucide-react';
import type { Experience } from '../../lib/api';

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
        <Briefcase size={22} className="text-blue-400" />Experiencia
      </h2>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent ml-3" />
        <div className="space-y-10">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-blue-500/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-blue-400 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm text-slate-400 whitespace-nowrap">
                    {exp.startDate} — {exp.isCurrent ? <span className="text-green-400 font-medium">Actualidad</span> : exp.endDate}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.split(',').map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
