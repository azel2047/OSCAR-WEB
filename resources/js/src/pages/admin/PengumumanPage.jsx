import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Trash2, Megaphone, Bell } from 'lucide-react';

const INPUT_CLASS = "!border-0 !rounded-xl bg-[#18412E]/60 hover:bg-[#18412E]/80 focus:bg-[#18412E] focus:ring-1 focus:ring-[#70C492]/50 focus:shadow-[0_0_15px_rgba(112,196,146,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#7A9A8A]";

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (v && Array.isArray(v.data)) return v.data;
  return [];
}

export default function AdminPengumumanPage() {
  const { data: rawList, isLoading, request } = useApi();
  const list = toArray(rawList);
  const [form,   setForm]   = useState({ judul: '', isi: '', is_published: false });
  const [saving, setSaving] = useState(false);

  const fetchList = () => request(() => api.get('/admin/pengumuman'));
  useEffect(() => { fetchList(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/pengumuman', form);
      setForm({ judul: '', isi: '', is_published: false });
      fetchList();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pengumuman?')) return;
    await api.delete(`/admin/pengumuman/${id}`);
    fetchList();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className="bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 rounded-3xl">
          <h2 className="font-display font-bold text-white text-lg mb-5">Buat Pengumuman</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <Input 
              label="Judul" 
              name="judul" 
              value={form.judul}
              onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))} 
              className={INPUT_CLASS}
              required 
            />
            <Input 
              label="Isi Pengumuman" 
              as="textarea" 
              rows={6} 
              value={form.isi}
              onChange={(e) => setForm((p) => ({ ...p, isi: e.target.value }))} 
              className={INPUT_CLASS}
              required 
            />
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="accent-[#70C492] w-4 h-4 rounded border-white/10"
                checked={form.is_published}
                onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} 
              />
              <span className="text-[#7A9A8A] text-sm font-semibold">Publikasikan langsung</span>
            </label>
            <Button 
              type="submit" 
              variant="solid" 
              className="w-full bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-bold py-3 shadow-[0_0_15px_rgba(112,196,146,0.25)] rounded-xl border-none outline-none" 
              loading={saving} 
              leftIcon={<Plus size={15} />}
            >
              Simpan
            </Button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-display font-bold text-white text-lg">Daftar Pengumuman</h2>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/[0.01] border border-white/[0.04] animate-pulse rounded-2xl" />
          ))
        ) : list.length === 0 ? (
          /* Beautiful Empty State Card */
          <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4 text-[#8B9A7A]">
              <Megaphone size={24} />
            </div>
            <h3 className="font-display font-bold text-white text-base">Belum Ada Pengumuman</h3>
            <p className="text-[#8B9A7A] text-xs max-w-sm mt-1.5 leading-relaxed">
              Daftar pengumuman Anda kosong saat ini. Silakan gunakan formulir di sebelah kiri untuk mempublikasikan pengumuman pertama Anda ke peserta.
            </p>
          </div>
        ) : (
          list.map((p) => (
            <div key={p.id} className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl flex gap-4 hover:border-white/[0.08] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`badge ${p.is_published ? 'badge-teal' : 'badge-amber'} text-[12px]`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="font-mono text-[12px] text-[#8B9A7A]">
                    {new Date(p.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-sm">{p.judul}</h3>
                <p className="text-[#8B9A7A] text-xs mt-1.5 leading-relaxed line-clamp-3">{p.isi}</p>
              </div>
              <button 
                onClick={() => handleDelete(p.id)} 
                className="text-[#ff4f7b] p-2 hover:bg-[#ff4f7b]/10 rounded-xl transition-all self-start"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
