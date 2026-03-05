import { GraduationCap } from 'lucide-react';
import type { Education } from '../../lib/api';

export default function EducationSection({ educations }: { educations: Education[] }) {
  return (
    <section className="py-16 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <GraduationCap size={22} className="text-blue-400" />Educación
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {educations.map((edu) => (
          <div key={edu.id} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-blue-500/40 transition-colors">
            <h3 className="font-semibold text-white">{edu.degree}</h3>
            <p className="text-blue-400 text-sm mt-1">{edu.institution}</p>
            <p className="text-slate-500 text-sm mt-2">{edu.startYear}{edu.endYear !== edu.startYear ? ` — ${edu.endYear}` : ''}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
