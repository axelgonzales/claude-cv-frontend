import { Cpu } from 'lucide-react';
import type { SkillGroup } from '../../lib/api';

export default function SkillsSection({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section className="py-16 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Cpu size={22} className="text-blue-400" />Habilidades
      </h2>
      <div className="space-y-6">
        {skillGroups.map((group) => (
          <div key={group.id}>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.split(',').map((item) => (
                <span key={item} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg border border-slate-700 hover:border-blue-500/50 hover:text-blue-300 transition-colors">
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
