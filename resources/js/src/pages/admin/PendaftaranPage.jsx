import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Search, Filter, Eye, Download, ChevronDown } from 'lucide-react';

const STATUS_LIST = ['', 'menunggu', 'diterima', 'ditolak', 'finalisasi'];

function StatusBadge({ status }) {
  const map = {
    menunggu:   { cls: 'badge-amber', label: 'Menunggu'   },
    diterima:   { cls: 'badge-teal',  label: 'Diterima'   },
    ditolak:    { cls: 'badge-rose',  label: 'Ditolak'    },
    finalisasi: { cls: 'badge-green', label: 'Finalisasi' },
  };
  const s = map[status] ?? { cls: 'badge-teal', label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export default function AdminPendaftaranPage() {
  const [filters, setFilters] = useState({ search: '', status: '', lomba_id: '', page: 1 });
  const { data, isLoading, request } = useApi();

  const fetchData = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    request(() => api.get(`/admin/pendaftaran?${params}`));
  };

  useEffect(() => { fetchData(); }, [filters.page]);

  const list       = data?.data ?? [];
  const pagination = data ? { current: data.current_page, last: data.last_page, total: data.total } : null;

  const handleExport = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/admin/pendaftaran/export?${new URLSearchParams(filters)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Manajemen Pendaftaran</h1>
          <p className="text-text-muted mt-1">{pagination?.total ?? 0} total pendaftaran</p>
        </div>
        <Button variant="primary" leftIcon={<Download size={15} />} onClick={handleExport}>
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Cari nama tim / nomor..."
          leftIcon={<Search size={15} />}
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          className="flex-1"
        />
        <Input
          as="select"
          value={filters.status}
          onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}
          className="sm:w-44"
        >
          {STATUS_LIST.map((s) => (
            <option key={s} value={s}>{s || 'Semua Status'}</option>
          ))}
        </Input>
        <Button variant="solid" leftIcon={<Filter size={15} />} onClick={fetchData}>Filter</Button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-oscar">
            <thead>
              <tr>
                <th>No. Pendaftaran</th>
                <th>Lomba</th>
                <th>Nama Tim</th>
                <th>Universitas</th>
                <th>Tgl. Daftar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j}><div className="h-4 bg-bg-surface animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                : list.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-text-muted">
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  )
                  : list.map((d) => (
                    <tr key={d.id}>
                      <td className="font-mono text-xs text-neon-teal">{d.nomor}</td>
                      <td className="text-sm text-text-primary font-medium">{d.lomba?.nama}</td>
                      <td className="text-sm">{d.data_peserta?.nama_peserta_1 || '—'}</td>
                      <td className="text-sm">{d.data_peserta?.asal_universitas || d.data_peserta?.asal_sekolah || '—'}</td>
                      <td className="text-xs font-mono text-text-muted">
                        {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td><StatusBadge status={d.status} /></td>
                      <td>
                        <Link
                          to={`/admin/pendaftaran/${d.id}`}
                          className="p-1.5 rounded text-text-muted hover:text-neon-teal transition-colors inline-flex"
                        >
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.last > 1 && (
        <div className="flex justify-center gap-3">
          <Button variant="ghost" size="sm" disabled={filters.page <= 1}
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}>← Prev</Button>
          <span className="flex items-center px-4 py-2 glass-card font-mono text-sm text-text-secondary">
            {pagination.current} / {pagination.last}
          </span>
          <Button variant="ghost" size="sm" disabled={filters.page >= pagination.last}
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}>Next →</Button>
        </div>
      )}
    </div>
  );
}
