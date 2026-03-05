import { useState } from 'react';
import { experienceApi } from '../../lib/api';
import type { Experience } from '../../lib/api';
import { Plus, Trash2, Save } from 'lucide-react';

const EMPTY: Experience = { company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '', technologies: '', displayOrder: 0 };

export default function ExperienceForm({ experiences, onChange }: { experiences: Experience[]; onChange: () => void }) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await experienceApi.update(editing.id, editing);
      else await experienceApi.create(editing);
      setEditing(null);
      onChange();
    } catch (err) {
      console.error('Error guardando experiencia:', err);
      alert('Error al guardar. Revisa la consola.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (confirm('¿Eliminar esta experiencia?')) {
      try {
        await experienceApi.delete(id);
        onChange();
      } catch (err) {
        console.error('Error eliminando:', err);
        alert('Error al eliminar.');
      }
    }
  };

  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">Experiencia laboral</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
          <Plus size={14} />Nueva
        </button>
      </div>

      {editing && (
        <div className="bg-slate-800 rounded-xl p-5 border border-blue-500/40 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {['company', 'role', 'startDate', 'endDate'].map(f => (
              <div key={f}>
                <label className="text-xs text-slate-400 mb-1 block capitalize">{f === 'company' ? 'Empresa' : f === 'role' ? 'Cargo' : f === 'startDate' ? 'Inicio' : 'Fin'}</label>
                <input name={f} value={(editing as any)[f]} onChange={h}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={editing.isCurrent} onChange={e => setEditing(p => p ? { ...p, isCurrent: e.target.checked } : null)} className="accent-blue-500" />
            Trabajo actual
          </label>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Descripción</label>
            <textarea name="description" value={editing.description} onChange={h} rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tecnologías (separadas por coma)</label>
            <input name="technologies" value={editing.technologies} onChange={h}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
              <Save size={13} />{saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {experiences.map(exp => (
          <div key={exp.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700 hover:border-slate-600 transition-colors">
            <div>
              <p className="text-white text-sm font-medium">{exp.role} — <span className="text-blue-400">{exp.company}</span></p>
              <p className="text-slate-500 text-xs">{exp.startDate} – {exp.isCurrent ? 'Actualidad' : exp.endDate}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(exp)} className="text-slate-400 hover:text-blue-400 text-xs px-2 py-1 transition-colors">Editar</button>
              <button onClick={() => remove(exp.id!)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
