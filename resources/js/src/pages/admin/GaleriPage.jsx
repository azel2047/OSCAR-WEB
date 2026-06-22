import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import { Upload, Trash2 } from 'lucide-react';

/** Normalize any API response shape to a plain array */
function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  if (value && value.data && Array.isArray(value.data.data)) return value.data.data;
  return [];
}

export default function AdminGaleriPage() {
  const { data: rawGaleri, isLoading, request } = useApi();
  const [uploading, setUploading] = useState(false);
  const [seasons,   setSeasons]   = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const fileRef = useRef(null);

  // Normalize galeri data — always an array
  const galeri = toArray(rawGaleri);

  const fetchGaleri = () => request(() => api.get('/admin/galeri'));
  const fetchSeasons = async () => {
    try {
      const { data } = await api.get('/seasons');
      // Normalize — could be array or { data: [] }
      setSeasons(toArray(data));
    } catch (_) {
      setSeasons([]);
    }
  };

  useEffect(() => { fetchGaleri(); fetchSeasons(); }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !selectedSeason) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('season_id', selectedSeason);
      files.forEach((f) => fd.append('foto[]', f));
      await api.post('/admin/galeri', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchGaleri();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus foto?')) return;
    await api.delete(`/admin/galeri/${id}`);
    fetchGaleri();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-text-primary">Manajemen Galeri</h1>
      </div>

      {/* Upload */}
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-56">
          <label className="font-display text-xs text-text-muted tracking-widest uppercase block mb-2">Season</label>
          <select
            className="input-oscar"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            <option value="">-- Pilih Season --</option>
            {seasons.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
          </select>
        </div>
        <label className={`btn btn-primary cursor-pointer ${!selectedSeason && 'opacity-50 pointer-events-none'}`}>
          <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Foto'}
          <input ref={fileRef} type="file" className="sr-only" multiple accept="image/*" onChange={handleUpload} />
        </label>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => <div key={i} className="aspect-square glass-card animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {galeri.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted">
              Belum ada foto. Upload foto di atas.
            </div>
          )}
          {galeri.map((g) => (
            <div key={g.id} className="relative group aspect-square rounded-xl overflow-hidden border border-border-subtle">
              <img src={g.url} alt={g.keterangan} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-bg-void/0 group-hover:bg-bg-void/50 transition-colors flex items-center justify-center">
                <button
                  onClick={() => handleDelete(g.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-neon-rose text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
