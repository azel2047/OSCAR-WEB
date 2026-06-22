import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Trophy, Save, Plus, Award } from 'lucide-react';

const INPUT_CLASS = "!border-0 !rounded-xl bg-[#18412E]/60 hover:bg-[#18412E]/80 focus:bg-[#18412E] focus:ring-1 focus:ring-[#70C492]/50 focus:shadow-[0_0_15px_rgba(112,196,146,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#7A9A8A]";

/** Normalize any API response shape to a plain array */
function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  if (value && value.data && Array.isArray(value.data.data)) return value.data.data;
  return [];
}

const INITIAL_FORM = { lomba_id: '', season_id: '', nama_tim: '', universitas: '', posisi: 1, karya: '' };

export default function AdminPemenangPage() {
  const { data: rawPemenang,  isLoading, request }       = useApi();
  const { data: rawLomba,     request: fetchLombaReq  }  = useApi();
  const { data: rawSeason,    request: fetchSeasonReq }  = useApi();
  const [form,   setForm]   = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  // Always safe arrays regardless of API response shape
  const pemenangList = toArray(rawPemenang);
  const lombaList    = toArray(rawLomba);
  const seasonList   = toArray(rawSeason);

  const fetchPemenang = () => request(() => api.get('/admin/pemenang'));
  useEffect(() => {
    fetchPemenang();
    fetchLombaReq(()  => api.get('/lomba'));
    fetchSeasonReq(() => api.get('/seasons'));
  }, []);

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/pemenang', form);
      setForm(INITIAL_FORM);
      fetchPemenang();
    } finally {
      setSaving(false);
    }
  };

  const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className="bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 rounded-3xl">
          <h2 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2">
            <Award size={18} className="text-[#70C492]" /> Input Pemenang
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <Input 
              label="Season" 
              name="season_id" 
              as="select" 
              value={form.season_id} 
              onChange={update} 
              className={INPUT_CLASS}
              required
            >
              <option value="" className="bg-[#18412E] text-[#7A9A8A]">-- Season --</option>
              {(seasonList ?? []).map((s) => <option key={s.id} value={s.id} className="bg-[#18412E] text-white">{s.nama}</option>)}
            </Input>
            <Input 
              label="Lomba" 
              name="lomba_id" 
              as="select" 
              value={form.lomba_id} 
              onChange={update} 
              className={INPUT_CLASS}
              required
            >
              <option value="" className="bg-[#18412E] text-[#7A9A8A]">-- Lomba --</option>
              {(lombaList ?? []).map((l) => <option key={l.id} value={l.id} className="bg-[#18412E] text-white">{l.nama}</option>)}
            </Input>
            <Input 
              label="Nama Tim" 
              name="nama_tim" 
              value={form.nama_tim} 
              onChange={update} 
              className={INPUT_CLASS}
              required 
            />
            <Input 
              label="Universitas / Institusi" 
              name="universitas" 
              value={form.universitas} 
              onChange={update} 
              className={INPUT_CLASS}
              required 
            />
            <Input 
              label="Posisi (1/2/3)" 
              name="posisi" 
              type="number" 
              min={1} 
              max={3}
              value={form.posisi} 
              onChange={update} 
              className={INPUT_CLASS}
              required 
            />
            <Input 
              label="Judul Karya" 
              name="karya" 
              value={form.karya} 
              onChange={update} 
              className={INPUT_CLASS}
            />
            <Button 
              type="submit" 
              variant="solid" 
              className="w-full bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-bold py-3 shadow-[0_0_15px_rgba(112,196,146,0.25)] rounded-xl border-none outline-none" 
              loading={saving} 
              leftIcon={<Plus size={15} />}
            >
              Simpan Pemenang
            </Button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-display font-bold text-white text-lg">Daftar Pemenang</h2>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#18412E]/40 border border-[#70C492]/10 animate-pulse rounded-2xl" />
          ))
        ) : pemenangList.length === 0 ? (
          /* Beautiful Empty State Card */
          <div className="bg-[#18412E]/40 border border-[#70C492]/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4 text-[#7A9A8A]">
              <Trophy size={24} className="text-[#70C492]" />
            </div>
            <h3 className="font-display font-bold text-white text-base">Belum Ada Pemenang Terdaftar</h3>
            <p className="text-[#7A9A8A] text-xs max-w-sm mt-1.5 leading-relaxed">
              Belum ada juara yang dimasukkan. Silakan gunakan formulir input di sebelah kiri untuk mencatat pemenang dari setiap cabang lomba dan season.
            </p>
          </div>
        ) : (
          pemenangList.map((p) => (
            <div key={p.id} className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl flex items-center gap-4 hover:border-white/[0.08] transition-all">
              <span className="text-2xl flex-shrink-0">{MEDAL[p.posisi] ?? '🏅'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-white text-sm">{p.nama_tim}</p>
                <p className="text-[#7A9A8A] text-xs mt-1 font-semibold">{p.lomba?.nama} — {p.universitas}</p>
              </div>
              <span className="font-mono text-[#70C492] text-xs font-bold bg-[#70C492]/10 border border-[#70C492]/20 px-2.5 py-1 rounded-lg">{p.season?.nama}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
