import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePendaftaranStore from '@/stores/pendaftaranStore';
import { CheckCircle, Clock, AlertCircle, Eye, Trophy } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    menunggu: { cls: 'badge-amber', label: 'Menunggu'  },
    diterima: { cls: 'badge-teal',  label: 'Diterima'  },
    ditolak:  { cls: 'badge-rose',  label: 'Ditolak'   },
    finalisasi: { cls: 'badge-green', label: 'Finalisasi' },
  };
  const s = map[status] ?? { cls: 'badge-teal', label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export default function RiwayatPage() {
  const { daftarList, isLoading, fetchMyPendaftaran } = usePendaftaranStore();

  useEffect(() => { fetchMyPendaftaran(); }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">Riwayat Pendaftaran</h1>
        <p className="text-text-muted mt-1">Pantau status semua pendaftaranmu.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 glass-card animate-pulse rounded-xl" />)}
        </div>
      ) : daftarList.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
          <h2 className="font-display text-xl text-text-primary mb-2">Belum Ada Pendaftaran</h2>
          <p className="text-text-muted text-sm mb-6">Kamu belum mendaftar lomba manapun.</p>
          <Link to="/lomba" className="btn btn-solid">Cari Lomba</Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="table-oscar">
            <thead>
              <tr>
                <th>No. Pendaftaran</th>
                <th>Lomba</th>
                <th>Tim</th>
                <th>Tgl. Daftar</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {daftarList.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs text-neon-teal">{d.nomor_pendaftaran}</td>
                  <td className="font-medium text-text-primary text-sm">{d.lomba?.nama}</td>
                  <td className="text-sm">{d.nama_tim}</td>
                  <td className="text-xs font-mono">
                    {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td><StatusBadge status={d.status} /></td>
                  <td>
                    <button className="p-1.5 rounded text-text-muted hover:text-neon-teal transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
