import { useState } from 'react';
import { skillsApi } from '../../lib/api';
import type { SkillGroup } from '../../lib/api';
import { Plus, Trash2, Save } from 'lucide-react';

const EMPTY: SkillGroup = { category: '', items: '', displayOrder: 0 };

export default function SkillsForm({ skillGroups, onChange }: { skillGroups: SkillGroup[]; onChange: () => void }) {
  const [editing, setEditing] = useState<SkillGroup | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await skillsApi.update(editing.id, editing);
      else await skillsApi.create(editing);
      setEditing(null);
      onChange();
    } catch (err) {
      console.error('Error guardando habilidad:', err);
      alert('Error al guardar. Revisa la consola.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (confirm('¿Eliminar?')) {
      try {
        await skillsApi.delete(id);
        onChange();
      } catch (err) {
        console.error('Error eliminando:', err);
        alert('Error al eliminar.');
      }
    }
  };

  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing(p => p ? { ...p, [e.target.name]: e.target.value } : null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">Grupos de habilidades</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
          <Plus size={14} />Nuevo grupo
        </button>
      </div>

      {editing && (
        <div className="bg-slate-800 rounded-xl p-5 border border-blue-500/40 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Categoría</label>
            <input name="category" value={editing.category} onChange={h}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Habilidades (separadas por coma)</label>
            <textarea name="items" value={editing.items} onChange={h} rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {(editing.items ?? '').split(',').filter(Boolean).map(i => (
              <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20">{i.trim()}</span>
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
        {skillGroups.map(g => (
          <div key={g.id} className="flex items-start justify-between bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700">
            <div>
              <p className="text-white text-sm font-medium">{g.category}</p>
              <p className="text-slate-500 text-xs mt-1 line-clamp-1">{g.items}</p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button onClick={() => setEditing(g)} className="text-slate-400 hover:text-blue-400 text-xs px-2 py-1 transition-colors">Editar</button>
              <button onClick={() => remove(g.id!)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
