import { useState } from 'react';
import type { Profile } from '../../lib/api';
import { Save } from 'lucide-react';

interface Props { profile: Profile; onSave: (data: Profile) => Promise<void>; }

export default function ProfileForm({ profile, onSave }: Props) {
  const [form, setForm] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (name: keyof Profile, label: string, type = 'text') => (
    <div>
      <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
      <input name={name as string} value={form[name] as string} onChange={handle} type={type}
        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors" />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        {field('name', 'Nombre completo')}
        {field('title', 'Título / Cargo')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Teléfono')}
        {field('location', 'Ubicación')}
        {field('linkedin', 'LinkedIn URL')}
        {field('github', 'GitHub URL')}
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Resumen profesional</label>
        <textarea name="summary" value={form.summary} onChange={handle} rows={4}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" />
      </div>
      <button type="submit" disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
        <Save size={15} />{saved ? 'Guardado!' : saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}
