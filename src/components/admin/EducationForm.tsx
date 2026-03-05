import { useState } from 'react';
import { educationApi } from '../../lib/api';
import type { Education } from '../../lib/api';
import { Plus, Trash2, Save } from 'lucide-react';

const EMPTY: Education = { institution: '', degree: '', field: '', startYear: '', endYear: '', displayOrder: 0 };

export default function EducationForm({ educations, onChange }: { educations: Education[]; onChange: () => void }) {
  const [editing, setEditing] = useState<Education | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await educationApi.update(editing.id, editing);
      else await educationApi.create(editing);
      setEditing(null);
      onChange();
    } catch (err) {
      console.error('Error guardando educación:', err);
      alert('Error al guardar. Revisa la consola.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (confirm('¿Eliminar?')) {
      try {
        await educationApi.delete(id);
        onChange();
      } catch (err) {
        console.error('Error eliminando:', err);
        alert('Error al eliminar.');
      }
    }
  };

  const h = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditing(p => p ? { ...p, [e.target.name]: e.target.value } : null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">Educación</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
          <Plus size={14} />Nueva
        </button>
      </div>

      {editing && (
        <div className="bg-slate-800 rounded-xl p-5 border border-blue-500/40 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[['institution', 'Institución'], ['degree', 'Título / Programa'], ['startYear', 'Año inicio'], ['endYear', 'Año fin']].map(([f, l]) => (
              <div key={f}>
                <label className="text-xs text-slate-400 mb-1 block">{l}</label>
                <input name={f} value={(editing as any)[f]} onChange={h}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
            ))}
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
        {educations.map(edu => (
          <div key={edu.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700">
            <div>
              <p className="text-white text-sm font-medium">{edu.degree}</p>
              <p className="text-slate-500 text-xs">{edu.institution} · {edu.startYear}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(edu)} className="text-slate-400 hover:text-blue-400 text-xs px-2 py-1 transition-colors">Editar</button>
              <button onClick={() => remove(edu.id!)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
