import { useState, useEffect, useRef } from 'react';
import useAuthStore from '@/stores/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Phone, Building, Save, Shield, Check } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import gsap from '@/animations/gsapConfig';

const INPUT_CLASS = "";

export default function ProfilPage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ 
    nama: user?.nama || user?.name || '', 
    no_hp: user?.no_hp || '', 
    institusi: user?.institusi || '' 
  });
  const [saved, setSaved] = useState(false);
  const { isLoading, error, request } = useApi();
  const containerRef = useRef(null);

  // Sync form state if user updates
  useEffect(() => {
    if (user) {
      setForm({
        nama: user.nama || user.name || '',
        no_hp: user.no_hp || '',
        institusi: user.institusi || ''
      });
    }
  }, [user]);

  // GSAP entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.animate-fade'),
        { opacity: 0, y: 30, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.1 }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await request(() => api.patch('/user/profile', {
      name: form.nama,
      nama: form.nama,
      no_hp: form.no_hp,
      institusi: form.institusi
    }), {
      onSuccess: (data) => { 
        setUser(data.data || data); 
        setSaved(true); 
        setTimeout(() => setSaved(false), 3000); 
      },
    });
  };

  const displayName = user?.nama || user?.name || 'Inovator';

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto space-y-8 pb-10">
      
      {/* Title */}
      <div className="animate-fade">
        <h1 className="font-display text-3xl font-black text-white uppercase tracking-tight">Profil Saya</h1>
        <p className="text-[#9dd5b8] text-xs sm:text-sm mt-1">Kelola data informasi akun Anda di portal OSCAR 3.0.</p>
      </div>

      {/* Glass Avatar Card */}
      <div className="animate-fade bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.02)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="w-20 h-20 rounded-2xl bg-[#70C492]/10 border border-[#70C492]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(112,196,146,0.15)] group-hover:scale-105 transition-transform duration-300">
          <span className="font-display text-[#70C492] text-3xl font-black">
            {displayName[0]?.toUpperCase() ?? 'U'}
          </span>
        </div>
        
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-white truncate">{displayName}</h2>
          <p className="text-[#7A9A8A] text-xs font-mono mt-0.5 truncate">{user?.email}</p>
          <span className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full text-[12px] font-mono font-bold bg-[#70C492]/10 border border-[#70C492]/30 text-[#70C492] uppercase tracking-wider">
            ● {user?.role || 'Peserta'}
          </span>
        </div>
      </div>

      {/* Main Glass Form Card */}
      <div className="animate-fade bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-8 space-y-6">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
            <Shield size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {saved && (
          <div className="p-4 rounded-xl bg-[#70C492]/10 border border-[#70C492]/30 text-[#70C492] text-xs flex items-start gap-2 shadow-[0_0_15px_rgba(0,255,200,0.1)]">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span>Profil Anda berhasil diperbarui.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <Input
            label="NAMA LENGKAP" 
            name="nama"
            leftIcon={<User size={16} className="text-[#70C492]" />}
            value={form.nama}
            onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
            className={INPUT_CLASS}
            placeholder="Contoh: Ugroseno Dwi"
            required
          />
          
          <div className="space-y-1">
            <Input
              label="EMAIL" 
              name="email" 
              type="email"
              leftIcon={<Mail size={16} className="text-[#7A9A8A]" />}
              value={user?.email ?? ''}
              className={`${INPUT_CLASS} opacity-50`}
              readOnly
              disabled
            />
            <span className="text-[#7A9A8A] text-[12px] font-mono uppercase block pt-0.5">Email utama tidak dapat diubah</span>
          </div>

          <Input
            label="NO. HANDPHONE / WHATSAPP" 
            name="no_hp"
            placeholder="Contoh: 0838086..."
            leftIcon={<Phone size={16} className="text-[#70C492]" />}
            value={form.no_hp}
            onChange={(e) => setForm((p) => ({ ...p, no_hp: e.target.value }))}
            className={INPUT_CLASS}
          />

          <Input
            label="INSTITUSI / UNIVERSITAS / SEKOLAH" 
            name="institusi"
            placeholder="Contoh: Sekolah Tinggi Teknologi Terpadu Nurul Fikri"
            leftIcon={<Building size={16} className="text-[#70C492]" />}
            value={form.institusi}
            onChange={(e) => setForm((p) => ({ ...p, institusi: e.target.value }))}
            className={INPUT_CLASS}
          />

          <div className="flex justify-end pt-4 border-t border-white/[0.04]">
            <Button 
              type="submit" 
              variant="solid" 
              loading={isLoading} 
              leftIcon={<Save size={16} />}
              className="bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-display font-black uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(112,196,146,0.4)] border-none outline-none py-3.5 px-6"
            >
              Simpan Perubahan
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}
