import { useState, useEffect } from 'react';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import { Shield, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import useAuthStore from '@/stores/authStore';

const ROLES = [
  { key: 'po', label: 'Project Officer (PO)' },
  { key: 'sc', label: 'Steering Committee (SC)' },
  { key: 'event', label: 'Divisi Acara (Event)' },
  { key: 'humas', label: 'Divisi Humas' },
  { key: 'bendahara', label: 'Bendahara' },
  { key: 'sekretaris', label: 'Sekretaris' }
];

const MODULES = [
  { key: 'lomba', label: 'Manajemen Lomba' },
  { key: 'pendaftaran', label: 'Verifikasi Pendaftaran' },
  { key: 'mitra', label: 'Manajemen Mitra/Sponsor' },
  { key: 'timeline', label: 'Manajemen Timeline' },
  { key: 'season', label: 'Manajemen Season/Galeri' },
  { key: 'pengumuman', label: 'Pengiriman Pengumuman' },
  { key: 'pengguna', label: 'Data Pengguna' }
];

const ACTIONS = [
  { key: 'view', label: 'Lihat (Read)' },
  { key: 'create', label: 'Tambah (Create)' },
  { key: 'update', label: 'Ubah (Update)' },
  { key: 'delete', label: 'Hapus (Delete)' }
];

export default function RolePermissionsPage() {
  const { user } = useAuthStore();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/config');
      const data = res.data?.data || [];
      const permConfig = data.find(c => c.key === 'role_permissions');
      if (permConfig && permConfig.value) {
        setPermissions(JSON.parse(permConfig.value));
      } else {
        // Fallback default structure
        const defaultState = {};
        ROLES.forEach(r => {
          defaultState[r.key] = {};
          MODULES.forEach(m => {
            defaultState[r.key][m.key] = [];
          });
        });
        setPermissions(defaultState);
      }
    } catch (err) {
      console.error('Gagal mengambil data hak akses', err);
      setMessage({ type: 'error', text: 'Gagal mengambil data dari server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleCheckboxChange = (role, module, action) => {
    setPermissions(prev => {
      const rolePerms = prev[role] || {};
      const modulePerms = rolePerms[module] || [];
      
      let newModulePerms;
      if (modulePerms.includes(action)) {
        newModulePerms = modulePerms.filter(a => a !== action);
      } else {
        newModulePerms = [...modulePerms, action];
      }

      return {
        ...prev,
        [role]: {
          ...rolePerms,
          [module]: newModulePerms
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await api.put('/admin/config/role_permissions', {
        value: JSON.stringify(permissions),
        keterangan: 'Pengaturan Hak Akses Divisi (Permissions)'
      });
      setMessage({ type: 'success', text: 'Hak akses berhasil diperbarui!' });
      
      // Auto-reload to apply permissions on page after 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error('Gagal menyimpan hak akses', err);
      setMessage({ type: 'error', text: 'Gagal menyimpan perubahan ke server.' });
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h1 className="text-xl font-bold text-text-primary">Akses Ditolak</h1>
        <p className="text-text-muted mt-2 max-w-sm">Hanya Super Admin yang diizinkan untuk mengelola hak akses divisi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary flex items-center gap-3">
            <Shield className="text-[#70C492]" size={28} />
            Pengaturan Hak Akses Divisi
          </h1>
          <p className="text-text-muted mt-1">Kelola apa saja tindakan yang dapat dilakukan oleh tiap divisi kepanitiaan.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="md" 
            leftIcon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />} 
            onClick={fetchPermissions}
            disabled={loading || saving}
          >
            Segarkan
          </Button>
          <Button 
            variant="solid" 
            size="md" 
            leftIcon={<Save size={16} />} 
            onClick={handleSave} 
            disabled={loading || saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="h-64 glass-card animate-pulse rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {ROLES.map(role => {
            const roleKey = role.key;
            return (
              <div 
                key={roleKey} 
                className="glass-card overflow-hidden border border-white/[0.04] bg-white/[0.01] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.04] flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#70C492]" />
                  <h3 className="font-display font-bold text-text-primary text-base">{role.label}</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.02]">
                        <th className="px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Modul / Fitur</th>
                        {ACTIONS.map(action => (
                          <th key={action.key} className="px-6 py-3.5 text-center text-xs font-mono uppercase tracking-wider text-text-muted">
                            {action.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MODULES.map(module => {
                        const moduleKey = module.key;
                        const roleModulePerms = permissions[roleKey]?.[moduleKey] || [];

                        return (
                          <tr key={moduleKey} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                            <td className="px-6 py-4 font-body text-sm font-medium text-text-primary">
                              {module.label}
                            </td>
                            {ACTIONS.map(action => {
                              const actionKey = action.key;
                              const isChecked = roleModulePerms.includes(actionKey);
                              return (
                                <td key={actionKey} className="px-6 py-4 text-center">
                                  <label className="inline-flex items-center justify-center cursor-pointer group">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer"
                                      checked={isChecked}
                                      onChange={() => handleCheckboxChange(roleKey, moduleKey, actionKey)}
                                    />
                                    <div className="
                                      w-5 h-5 rounded border border-white/20 bg-transparent
                                      flex items-center justify-center
                                      peer-checked:bg-[#70C492] peer-checked:border-[#70C492]
                                      peer-focus:ring-2 peer-focus:ring-[#70C492]/20
                                      transition-all duration-200
                                      group-hover:border-[#70C492]/50
                                    ">
                                      {isChecked && (
                                        <svg className="w-3 h-3 text-[#112C1E] stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                      )}
                                    </div>
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
