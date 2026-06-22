import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, FileText, Users, ExternalLink, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

const STATUS_MAP = {
  pending:      { label: 'Menunggu',   cls: 'badge-amber' },
  diverifikasi: { label: 'Diterima',   cls: 'badge-teal'  },
  ditolak:      { label: 'Ditolak',    cls: 'badge-rose'  },
};

const ACTION_OPTIONS = [
  { value: 'terima', label: 'Terima / Verifikasi' },
  { value: 'tolak',  label: 'Tolak / Perlu Revisi' },
];

export default function PendaftaranDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, request } = useApi();
  
  const [action, setAction] = useState('terima');
  const [catatan, setCatatan] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDetail = () => {
    request(() => api.get(`/admin/pendaftaran/${id}`), {
      onSuccess: (res) => { 
        const d = res.data ?? res;
        setAction(d.status === 'ditolak' ? 'tolak' : 'terima'); 
        setCatatan(d.catatan_admin ?? ''); 
      },
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await api.put(`/admin/pendaftaran/${id}/verifikasi`, { 
        action: action, 
        catatan: catatan 
      });
      if (res.data?.success || res.success) {
        fetchDetail();
      }
    } catch (err) {
      setErrorMsg(err.userMessage || 'Gagal memperbarui status pendaftaran.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-4 max-w-5xl">
        <div className="h-8 w-48 glass-card animate-pulse rounded" />
        <div className="h-64 glass-card animate-pulse rounded-xl" />
      </div>
    );
  }

  // Support direct or envelope access
  const d = data.data ?? data;
  const dataPeserta = d.data_peserta ?? {};

  // Build members list dynamically from JSONB data_peserta
  const anggota = [];
  if (dataPeserta.nama_peserta_1) {
    anggota.push({ 
      nama: dataPeserta.nama_peserta_1, 
      nim: dataPeserta.no_wa || '—', 
      jabatan: 'Ketua / Peserta 1', 
      email: dataPeserta.email || '—' 
    });
  }
  if (dataPeserta.nama_peserta_2) {
    anggota.push({ 
      nama: dataPeserta.nama_peserta_2, 
      nim: '—', 
      jabatan: 'Anggota 2', 
      email: '—' 
    });
  }
  if (dataPeserta.nama_peserta_3) {
    anggota.push({ 
      nama: dataPeserta.nama_peserta_3, 
      nim: '—', 
      jabatan: 'Anggota 3', 
      email: '—' 
    });
  }
  if (dataPeserta.nama_pendamping) {
    anggota.push({ 
      nama: dataPeserta.nama_pendamping, 
      nim: dataPeserta.no_wa_pendamping || '—', 
      jabatan: 'Pendamping', 
      email: '—' 
    });
  }

  const badgeConfig = STATUS_MAP[d.status] ?? { label: d.status, cls: 'badge-teal' };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back */}
      <Link to="/admin/pendaftaran" className="inline-flex items-center gap-2 text-text-muted hover:text-neon-teal text-sm transition-colors">
        <ArrowLeft size={15} /> Kembali
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">{dataPeserta.nama_peserta_1 || 'Pendaftaran Oscar'}</h1>
          <p className="font-mono text-neon-teal text-sm mt-1">{d.nomor}</p>
          <p className="text-text-muted text-sm mt-0.5">{d.lomba?.nama}</p>
        </div>
        <span className={`badge ${badgeConfig.cls} text-sm`}>
          {badgeConfig.label}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: detail */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Anggota */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-text-primary flex items-center gap-2 mb-4">
              <Users size={16} className="text-neon-teal" /> Anggota Tim
            </h2>
            <div className="space-y-3">
              {anggota.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface">
                  <div className="w-8 h-8 rounded-full bg-neon-teal/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-neon-teal text-xs font-bold">{a.nama?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium">{a.nama}</p>
                    <p className="text-text-muted text-xs font-mono">{a.nim} — {a.jabatan}</p>
                  </div>
                  <p className="text-text-muted text-xs">{a.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Berkas */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-text-primary flex items-center gap-2 mb-4">
              <FileText size={16} className="text-neon-teal" /> Berkas
            </h2>
            <div className="space-y-2">
              {(d.berkas ?? []).map((b) => (
                <a
                  key={b.id}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface hover:bg-neon-teal/5 border border-border-subtle hover:border-neon-teal/30 transition-all group"
                >
                  <FileText size={16} className="text-neon-teal" />
                  <span className="flex-1 text-sm text-text-primary uppercase">{b.jenis} — {b.nama_asli}</span>
                  <ExternalLink size={14} className="text-text-muted group-hover:text-neon-teal transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Status history */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-text-primary flex items-center gap-2 mb-4">
              <Clock size={16} className="text-neon-teal" /> Riwayat Status
            </h2>
            <div className="space-y-3">
              {(d.status_history ?? []).map((h, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-neon-teal mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-text-primary font-medium uppercase">{h.status}</span>
                    {h.keterangan && <p className="text-text-muted text-xs mt-0.5">{h.keterangan}</p>}
                    <p className="font-mono text-[#7A9A8A] text-[12px] mt-0.5">
                      Pengubah: {h.changed_by} | {h.created_at ? new Date(h.created_at).toLocaleString('id-ID') : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display font-bold text-text-primary">Update Status</h2>
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                ⚠️ {errorMsg}
              </div>
            )}

            <Input
              as="select"
              label="Tindakan Verifikasi"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={d.status !== 'pending'}
            >
              {ACTION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Input>

            <Input
              as="textarea"
              label="Catatan Admin"
              placeholder="Catatan untuk peserta / alasan penolakan (wajib jika ditolak)"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              disabled={d.status !== 'pending'}
            />

            {d.status === 'pending' ? (
              <Button
                variant="solid"
                className="w-full bg-[#70C492] text-[#112C1E] font-bold border-none outline-none"
                onClick={handleUpdateStatus}
                loading={saving}
                leftIcon={action === 'terima' ? <CheckCircle size={16} /> : <XCircle size={16} />}
              >
                Simpan Status
              </Button>
            ) : (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[#7A9A8A] text-xs text-center font-semibold">
                Status Sudah Final ({badgeConfig.label})
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="glass-card p-6 space-y-3 text-sm">
            <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Info Pendaftaran</p>
            {[
              { label: 'Universitas / Sekolah', val: dataPeserta.asal_universitas || dataPeserta.asal_sekolah || '—' },
              { label: 'Tgl. Daftar', val: d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              { label: 'Jumlah Anggota', val: `${anggota.length} orang` },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-text-muted">{label}</span>
                <span className="text-text-primary font-medium text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
