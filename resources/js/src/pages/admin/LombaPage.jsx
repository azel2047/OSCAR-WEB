import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (v && Array.isArray(v.data)) return v.data;
  return [];
}

export default function AdminLombaPage() {
  const { data: rawLomba, isLoading, request } = useApi();
  const lombaList = toArray(rawLomba);

  const fetchLomba = () => request(() => api.get('/admin/lomba'));

  useEffect(() => { fetchLomba(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Hapus lomba ini?')) return;
    await api.delete(`/admin/lomba/${id}`);
    fetchLomba();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Manajemen Lomba</h1>
          <p className="text-text-muted mt-1">{lombaList.length} lomba terdaftar</p>
        </div>
        <Link to="/admin/lomba/buat">
          <Button variant="solid" leftIcon={<Plus size={16} />} magnetic>Tambah Lomba</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? [...Array(6)].map((_, i) => <div key={i} className="h-44 glass-card animate-pulse rounded-xl" />)
          : lombaList.map((lomba) => (
            <div key={lomba.id} className="glass-card p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-bold text-text-primary text-base leading-tight flex-1">{lomba.nama}</h3>
                <span className={`badge ${lomba.status === 'buka' ? 'badge-teal' : 'badge-rose'} flex-shrink-0`}>
                  {lomba.status}
                </span>
              </div>
              <p className="text-text-muted text-sm line-clamp-2">{lomba.deskripsi_singkat}</p>
              <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                <Users size={12} /> {lomba.terdaftar_count ?? 0} tim terdaftar
              </div>
              <div className="flex gap-2 mt-auto pt-3 border-t border-border-subtle">
                <Link to={`/admin/lomba/${lomba.id}/edit`} className="flex-1">
                  <Button variant="ghost" size="sm" leftIcon={<Edit size={14} />} className="w-full">Edit</Button>
                </Link>
                <Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />} onClick={() => handleDelete(lomba.id)}>
                  Hapus
                </Button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
