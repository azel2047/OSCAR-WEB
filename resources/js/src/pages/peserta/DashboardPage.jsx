import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import usePendaftaranStore from '@/stores/pendaftaranStore';
import useLombaStore from '@/stores/lombaStore';
import Input from '@/components/ui/Input';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Upload, Info, 
  Clock, AlertCircle, Shield, Check, ExternalLink, 
  MessageSquare, ArrowLeft, Trophy, Sparkles, Laptop, Paintbrush, Terminal,
  Edit3, Users, Award, Github, FileText, Phone, Mail
} from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const extractUrl = (text) => {
  if (!text) return null;
  const match = text.match(/https?:\/\/[^\s]+/g);
  return match ? match[0] : null;
};

const INPUT_CLASS = "!border-0 !rounded-xl bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00ffc8]/50 focus:shadow-[0_0_15px_rgba(0,255,200,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#8B9A7A]";

export default function PesertaDashboardPage() {
  const { user } = useAuthStore();
  const { 
    daftarList, 
    isLoading, 
    isSubmitting, 
    submitError, 
    fetchMyPendaftaran, 
    submitPendaftaran,
    revisi
  } = usePendaftaranStore();
  const { lombaList, fetchLomba } = useLombaStore();
  const containerRef = useRef(null);

  // Active Pendaftaran (Moved to top to prevent Temporal Dead Zone errors)
  const activeRegistration = daftarList[0];

  // Form registration state
  const [step, setStep] = useState(1);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showAnggota2, setShowAnggota2] = useState(false);
  const [showAnggota3, setShowAnggota3] = useState(false);
  const [showKaryaAnggota2, setShowKaryaAnggota2] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    lomba_id: '',
    email: user?.email || '',
    asal_sekolah: '',
    asal_universitas: '',
    nama_peserta_1: user?.nama || user?.name || '',
    nama_peserta_2: '',
    nama_peserta_3: '',
    no_wa: '',
    no_wa_pendamping: '',
    nama_pendamping: '',
    tema: ''
  });

  // Files State
  const [files, setFiles] = useState({
    bukti_transfer: null
  });
  const [syaratList, setSyaratList] = useState([]);

  // Project Submission Inline States
  const [pengumpulan, setPengumpulan] = useState(null);
  const [isEditingKarya, setIsEditingKarya] = useState(false);
  const [isSubmittingKarya, setIsSubmittingKarya] = useState(false);
  const [karyaError, setKaryaError] = useState('');
  const [karyaSuccess, setKaryaSuccess] = useState('');
  const [karyaForm, setKaryaForm] = useState({
    email: '',
    no_hp: '',
    tema_lomba: '',
    nama_kelompok: '',
    nama_pendamping: '',
    nama_peserta_1: '',
    nama_peserta_2: '',
    link_github: '',
    folder_proposal: '',
    nama_peserta: '',
    nama_sekolah: '',
    link_karya_gdrive: ''
  });
  const [buktiInstagram, setBuktiInstagram] = useState(null);
  const [buktiInstagramPreview, setBuktiInstagramPreview] = useState('');

  useEffect(() => {
    fetchMyPendaftaran();
    fetchLomba();
    const fetchSyarat = async () => {
      try {
        const response = await api.get('/syarat-berkas');
        setSyaratList(response.data.data);
      } catch (err) {
        console.error('Error fetching syarat berkas:', err);
      }
    };
    fetchSyarat();
  }, []);

  // Prefill toggle states when data is loaded
  useEffect(() => {
    if (formData.nama_peserta_2) setShowAnggota2(true);
    if (formData.nama_peserta_3) setShowAnggota3(true);
  }, [formData.nama_peserta_2, formData.nama_peserta_3]);

  useEffect(() => {
    if (karyaForm.nama_peserta_2) setShowKaryaAnggota2(true);
  }, [karyaForm.nama_peserta_2]);

  useEffect(() => {
    if (activeRegistration && activeRegistration.status === 'diverifikasi') {
      const fetchSubmission = async () => {
        try {
          const { data } = await api.get(`/pengumpulan/saya?pendaftaran_id=${activeRegistration.id}`);
          const p = data.data?.pengumpulan;
          setPengumpulan(p);
          
          if (p) {
            setKaryaForm({
              email: p.email || '',
              no_hp: p.no_hp || '',
              tema_lomba: p.tema_lomba || '',
              nama_kelompok: p.data_karya?.nama_kelompok || '',
              nama_pendamping: p.data_karya?.nama_pendamping || '',
              nama_peserta_1: p.data_karya?.nama_peserta_1 || '',
              nama_peserta_2: p.data_karya?.nama_peserta_2 || '',
              link_github: p.data_karya?.link_github || '',
              folder_proposal: p.data_karya?.folder_proposal || '',
              nama_peserta: p.data_karya?.nama_peserta || '',
              nama_sekolah: p.data_karya?.nama_sekolah || '',
              link_karya_gdrive: p.data_karya?.link_karya_gdrive || ''
            });
            if (p.file_screenshot) {
              setBuktiInstagramPreview(p.file_screenshot);
            }
            setIsEditingKarya(false);
          } else {
            const regData = activeRegistration.data_peserta || {};
            setKaryaForm({
              email: user?.email || '',
              no_hp: regData.no_wa || '',
              tema_lomba: regData.tema || '',
              nama_kelompok: regData.nama_kelompok || '',
              nama_pendamping: regData.nama_pendamping || '',
              nama_peserta_1: regData.nama_peserta_1 || user?.nama || '',
              nama_peserta_2: regData.nama_peserta_2 || '',
              link_github: '',
              folder_proposal: '',
              nama_peserta: regData.nama_peserta_1 || user?.nama || '',
              nama_sekolah: regData.asal_sekolah || '',
              link_karya_gdrive: ''
            });
            setIsEditingKarya(true);
          }
        } catch (err) {
          // Ignore
        }
      };
      fetchSubmission();
    }
  }, [activeRegistration]);

  const handleKaryaTextChange = (e) => {
    setKaryaForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleKaryaFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setKaryaError('Ukuran file tidak boleh melebihi 500 KB.');
      e.target.value = '';
      setBuktiInstagram(null);
      setBuktiInstagramPreview(pengumpulan?.file_screenshot || '');
      return;
    }

    setKaryaError('');
    setBuktiInstagram(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBuktiInstagramPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleKaryaSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingKarya(true);
    setKaryaError('');
    setKaryaSuccess('');

    const fd = new FormData();
    fd.append('pendaftaran_id', activeRegistration.id);
    fd.append('email', karyaForm.email);
    fd.append('no_hp', karyaForm.no_hp);
    fd.append('tema_lomba', karyaForm.tema_lomba);

    const lomba = activeRegistration.lomba;
    const isWebDev = lomba?.slug === 'web-development' || lomba?.nama?.toLowerCase().includes('web');

    if (isWebDev) {
      fd.append('nama_kelompok', karyaForm.nama_kelompok);
      fd.append('nama_pendamping', karyaForm.nama_pendamping);
      fd.append('nama_peserta_1', karyaForm.nama_peserta_1);
      fd.append('nama_peserta_2', karyaForm.nama_peserta_2);
      fd.append('link_github', karyaForm.link_github);
      fd.append('folder_proposal', karyaForm.folder_proposal);
    } else {
      fd.append('nama_peserta', karyaForm.nama_peserta);
      fd.append('nama_sekolah', karyaForm.nama_sekolah);
      fd.append('link_karya_gdrive', karyaForm.link_karya_gdrive);
      if (buktiInstagram) {
        fd.append('bukti_instagram', buktiInstagram);
      }
    }

    try {
      const { data } = await api.post('/pengumpulan', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setKaryaSuccess(data.message || 'Karya berhasil dikumpulkan!');
      setPengumpulan(data.data);
      setIsEditingKarya(false);
      
      // Refresh submission data
      const { data: refreshed } = await api.get(`/pengumpulan/saya?pendaftaran_id=${activeRegistration.id}`);
      setPengumpulan(refreshed.data?.pengumpulan);
    } catch (err) {
      setKaryaError(err.userMessage || 'Gagal mengirimkan karya. Silakan coba lagi.');
    } finally {
      setIsSubmittingKarya(false);
    }
  };

  // GSAP Entrance Animations
  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const anims = el.querySelectorAll('.animate-fade');
      if (anims.length) {
        gsap.fromTo(anims,
          { opacity: 0, y: 30, filter: 'blur(3px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.1 }
        );
      }
    }
  }, [step, isSuccessScreen, daftarList, showRevisionForm]);

  const selectedLomba = lombaList.find(l => String(l.id) === String(formData.lomba_id));
  const isWebDev = selectedLomba?.slug === 'web-development' || selectedLomba?.nama?.toLowerCase().includes('web');
  const isCTF = selectedLomba?.slug === 'ctf' || selectedLomba?.nama?.toLowerCase().includes('ctf');
  const isPosterOrInfo = selectedLomba?.slug === 'desain-poster' || selectedLomba?.slug === 'desain-infografis' || selectedLomba?.nama?.toLowerCase().includes('poster') || selectedLomba?.nama?.toLowerCase().includes('infografis');


  const getTemaOptions = (slug) => {
    if (slug === 'web-development') {
      return [
        'Teknologi Hijau & Konservasi Alam (Green Tech)',
        'Eco-Tourism & Keanekaragaman Hayati',
        'Manajemen Limbah & Karbon Digital'
      ];
    }
    if (slug === 'desain-poster') {
      return [
        'Restorasi Hutan Tropis & Kehidupan Liar',
        'Dampak Perubahan Iklim di Sekitar Kita',
        'Harmoni Alam dan Teknologi Masa Depan'
      ];
    }
    if (slug === 'desain-infografis') {
      return [
        'Pentingnya Menjaga Paru-Paru Dunia',
        'Transisi Energi Bersih untuk Kelestarian Hutan',
        'Statistik Deforestasi & Solusi Digital'
      ];
    }
    if (slug === 'ctf') {
      return [
        'Cyber Security in the Age of Smart Forestry',
        'Defending Critical Digital Infrastructure',
        'Securing IoT Devices in Biodiversity Monitoring'
      ];
    }
    return [
      'Melestarikan Keanekaragaman Hayati melalui Inovasi Digital',
      'Implementasi Smart Eco-System di Lingkungan Pendidikan',
      'Teknologi Informasi untuk Mitigasi Perubahan Iklim'
    ];
  };

  const handleTextChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (key, file) => {
    setFiles(p => ({ ...p, [key]: file }));
  };

  // Submit Registration
  const handleRegistrationSubmit = async () => {
    const fd = new FormData();
    fd.append('lomba_id', formData.lomba_id);
    fd.append('email', formData.email);
    fd.append('no_wa', formData.no_wa);
    fd.append('tema', formData.tema);

    if (isWebDev) {
      fd.append('asal_sekolah', formData.asal_sekolah);
      fd.append('nama_peserta_1', formData.nama_peserta_1);
      fd.append('nama_peserta_2', formData.nama_peserta_2);
      fd.append('nama_pendamping', formData.nama_pendamping);
    } else if (isCTF) {
      fd.append('asal_universitas', formData.asal_universitas);
      fd.append('nama_peserta_1', formData.nama_peserta_1);
      if (formData.nama_peserta_2) fd.append('nama_peserta_2', formData.nama_peserta_2);
      if (formData.nama_peserta_3) fd.append('nama_peserta_3', formData.nama_peserta_3);
    } else if (isPosterOrInfo) {
      fd.append('asal_sekolah', formData.asal_sekolah);
      fd.append('nama_peserta_1', formData.nama_peserta_1);
    }


    if (files.bukti_transfer) fd.append('bukti_transfer', files.bukti_transfer);


    syaratList.forEach(syarat => {
      const fileKey = `bukti_${syarat.key}`;
      if (files[fileKey]) {
        fd.append(fileKey, files[fileKey]);
      }
    });

    const res = await submitPendaftaran(fd);
    if (res.success) {
      setIsSuccessScreen(true);
    }
  };

  const isRegistrationFilesValid = () => {
    if (!files.bukti_transfer) return false;
    for (const syarat of syaratList) {
      if (syarat.is_required && !files[`bukti_${syarat.key}`]) {
        return false;
      }
    }
    return true;
  };

  const isRevisionFilesValid = () => {
    if (files.bukti_transfer) return true;
    for (const syarat of syaratList) {
      if (files[`bukti_${syarat.key}`]) return true;
    }
    return false;
  };

  // Submit Revision
  const handleRevisionSubmit = async () => {
    const activeRegistration = daftarList[0];
    if (!activeRegistration) return;

    const fd = new FormData();
    if (files.bukti_transfer) fd.append('bukti_transfer', files.bukti_transfer);


    syaratList.forEach(syarat => {
      const fileKey = `bukti_${syarat.key}`;
      if (files[fileKey]) {
        fd.append(fileKey, files[fileKey]);
      }
    });

    const res = await revisi(activeRegistration.id, fd);
    if (res.success) {
      setShowRevisionForm(false);
      fetchMyPendaftaran();
    }
  };

  // Quick select category from bottom cards


  // Switch display based on load & active registrations
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-[#00ffc8] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#8B9A7A] text-sm animate-pulse">Menghubungkan ke server inovasi...</p>
      </div>
    );
  }

  // Active Pendaftaran (Already declared at the top)

  // ==========================================
  // CASE 1: VERIFIED STATE (DIVERIFIKASI)
  // ==========================================
  if (activeRegistration && activeRegistration.status === 'diverifikasi') {
    return (
      <div ref={containerRef} className="max-w-4xl mx-auto space-y-8 animate-fade pb-10">
        {/* Verified Banner */}
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white/[0.01] backdrop-blur-[35px] border border-[#00ffc8]/20 shadow-[0_0_40px_rgba(0,255,200,0.02)] rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,255,200,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full bg-[#00ffc8]/10 border-2 border-[#00ffc8] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,200,0.3)] mb-6 animate-pulse">
            <Check className="text-[#00ffc8]" size={36} strokeWidth={3} />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Selamat Datang, Inovator!
          </h1>
          <p className="text-[#9dd5b8] text-sm mt-2 max-w-md">
            Status akun Anda saat ini: <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00ffc8]/10 border border-[#00ffc8]/30 text-[#00ffc8] ml-1 shadow-[0_0_10px_rgba(0,255,200,0.2)]">DIVERIFIKASI</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Area: Pesan dari Panitia */}
          <div className="lg:col-span-3 bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <Sparkles size={18} className="text-[#00ffc8]" />
              Pesan Dari Panitia
            </h3>
            <div className="space-y-4 text-sm text-[#9dd5b8] leading-relaxed">
              <p>
                Halo Rekan Inovator, selamat bergabung di ekosistem <strong>OSCAR 3.0: Rainforest of Innovation</strong>. Dokumen dan persyaratan pendaftaran Anda telah kami periksa secara menyeluruh.
              </p>
              <p>
                Kami sangat antusias melihat kontribusi yang akan Anda bawa ke dalam kompetisi ini. Sebagai langkah selanjutnya, pastikan Anda bergabung dengan kanal komunikasi resmi kami untuk mendapatkan instruksi teknis dan jadwal kegiatan mendatang.
              </p>
              <p className="italic text-[#00ffc8] font-medium pt-2 border-l-2 border-[#00ffc8] pl-3">
                "Inovasi adalah benih yang tumbuh di tanah kolaborasi."
              </p>
            </div>
            
            <a 
              href={
                extractUrl(activeRegistration?.catatan_admin) || 
                'https://chat.whatsapp.com/DQXpVKrkAeF7lUTMUtnWvz'
              } 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-6"
            >
              <Button 
                variant="solid" 
                size="lg" 
                className="w-full bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(0,255,200,0.4)] transition-all py-4"
                magnetic
              >
                <MessageSquare size={18} />
                Join Whatsapp Group
              </Button>
            </a>
          </div>

          {/* Right Area: Status Persyaratan & Info Penting */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Persyaratan */}
            <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-6 space-y-5">
              <h3 className="font-display font-bold text-white text-sm tracking-wider uppercase">
                Status Persyaratan
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Identitas Diri & Team', status: 'Divalidasi' },
                  { label: 'Bukti Pembayaran', status: 'Pembayaran dikonfirmasi' },
                  { label: 'Social Media Engagement', status: 'Follow tervalidasi' },
                  { label: 'Persyaratan Twibbon', status: 'Sesuai Format' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-[#00ffc8]" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{item.label}</p>
                      <p className="text-[#8B9A7A] text-[12px] mt-0.5">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informasi Penting */}
            <div className="bg-[#00ffc8]/05 border border-[#00ffc8]/20 rounded-3xl p-5 relative overflow-hidden">
              <div className="flex gap-3">
                <Info size={16} className="text-[#00ffc8] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12px] font-mono font-bold uppercase tracking-widest text-[#00ffc8]">INFORMASI PENTING</span>
                  <p className="text-white text-xs mt-1.5 leading-relaxed font-semibold">
                    Harap Segera Bergabung ke Grup Whatsapp yang tersedia untuk koordinasi TM (Technical Meeting).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Pengumpulan Karya Section */}
        {(() => {
          const lomba = activeRegistration.lomba;
          const isWebDev = lomba?.slug === 'web-development' || lomba?.nama?.toLowerCase().includes('web');
          const isPosterOrInfo = ['desain-poster', 'desain-infografis'].includes(lomba?.slug) || 
                                lomba?.nama?.toLowerCase().includes('poster') || 
                                lomba?.nama?.toLowerCase().includes('infografis');

          if (!isWebDev && !isPosterOrInfo) {
            return (
              <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Trophy size={18} className="text-[#00ffc8]" />
                  Pengumpulan Karya / Project
                </h3>
                <p className="text-[#8B9A7A] text-xs leading-relaxed">
                  Cabang lomba Anda (<strong>{lomba?.nama || 'CTF'}</strong>) tidak memerlukan pengumpulan berkas/karya melalui portal web ini. Silakan ikuti instruksi pelaksanaan yang dibagikan di grup koordinasi.
                </p>
              </div>
            );
          }

          return (
            <div className="space-y-6">
              {/* Header Status */}
              <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      <Upload size={18} className="text-[#00ffc8]" />
                      Pengumpulan Karya / Project
                    </h3>
                    <p className="text-[#8B9A7A] text-xs">
                      Lengkapi data karya/project lomba Anda langsung di bawah ini.
                    </p>
                  </div>
                  {pengumpulan ? (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-[#00ffc8] shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1.5 w-fit">
                      <Check size={12} strokeWidth={2.5} /> Selesai Dikumpulkan
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1.5 w-fit animate-pulse">
                      <Clock size={12} /> Menunggu Pengumpulan
                    </span>
                  )}
                </div>

                {karyaError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0 animate-pulse" />
                    <span>{karyaError}</span>
                  </div>
                )}
                {karyaSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#00ffc8] text-xs flex items-start gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{karyaSuccess}</span>
                  </div>
                )}
              </div>

              {/* RENDER VIEW MODE */}
              {!isEditingKarya && pengumpulan && (
                <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.7)] rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest">Detail Karya yang Dikumpulkan</h4>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingKarya(true)}
                      className="border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/5 rounded-xl text-xs py-2 px-4 font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Edit3 size={12} /> Perbarui Karya
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-1">
                      <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><Mail size={10} className="inline mr-1" /> Email Pengirim</span>
                      <span className="text-white font-semibold text-sm">{pengumpulan.email}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><Phone size={10} className="inline mr-1" /> No. HP Peserta</span>
                      <span className="text-white font-semibold text-sm">{pengumpulan.no_hp}</span>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><Award size={10} className="inline mr-1" /> Tema Karya yang Diikuti</span>
                      <span className="text-white font-semibold text-sm">{pengumpulan.tema_lomba}</span>
                    </div>

                    {isWebDev && (
                      <>
                        <div className="space-y-1">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><Users size={10} className="inline mr-1" /> Nama Kelompok</span>
                          <span className="text-white font-semibold text-sm">{pengumpulan.data_karya?.nama_kelompok || '-'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><User size={10} className="inline mr-1" /> Nama Pendamping</span>
                          <span className="text-white font-semibold text-sm">{pengumpulan.data_karya?.nama_pendamping || '-'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><User size={10} className="inline mr-1" /> Nama Peserta 1</span>
                          <span className="text-white font-semibold text-sm">{pengumpulan.data_karya?.nama_peserta_1 || '-'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><User size={10} className="inline mr-1" /> Nama Peserta 2</span>
                          <span className="text-white font-semibold text-sm">{pengumpulan.data_karya?.nama_peserta_2 || '-'}</span>
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><Github size={10} className="inline mr-1" /> Link Repositori GitHub</span>
                          <a href={pengumpulan.data_karya?.link_github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffc8]/50 hover:bg-white/[0.04] transition-all text-[#00ffc8] text-xs font-semibold">
                            <span className="truncate flex-1">{pengumpulan.data_karya?.link_github}</span>
                            <ExternalLink size={12} className="opacity-60 ml-2" />
                          </a>
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><FileText size={10} className="inline mr-1" /> Folder Proposal Lomba</span>
                          <a href={pengumpulan.data_karya?.folder_proposal} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffc8]/50 hover:bg-white/[0.04] transition-all text-[#00ffc8] text-xs font-semibold">
                            <span className="truncate flex-1">{pengumpulan.data_karya?.folder_proposal}</span>
                            <ExternalLink size={12} className="opacity-60 ml-2" />
                          </a>
                        </div>
                      </>
                    )}

                    {isPosterOrInfo && (
                      <>
                        <div className="space-y-1">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><User size={10} className="inline mr-1" /> Nama Peserta</span>
                          <span className="text-white font-semibold text-sm">{pengumpulan.data_karya?.nama_peserta || '-'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><FileText size={10} className="inline mr-1" /> Nama Sekolah</span>
                          <span className="text-white font-semibold text-sm">{pengumpulan.data_karya?.nama_sekolah || '-'}</span>
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]"><ExternalLink size={10} className="inline mr-1" /> Link Google Drive Karya (JPG/IMG 300dpi + PDF)</span>
                          <a href={pengumpulan.data_karya?.link_karya_gdrive} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffc8]/50 hover:bg-white/[0.04] transition-all text-[#00ffc8] text-xs font-semibold">
                            <span className="truncate flex-1">{pengumpulan.data_karya?.link_karya_gdrive}</span>
                            <ExternalLink size={12} className="opacity-60 ml-2" />
                          </a>
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <span className="text-[#8B9A7A] block font-mono uppercase tracking-wider text-[10px]">Bukti Screenshot Upload Instagram</span>
                          {pengumpulan.file_screenshot ? (
                            <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.01] hover:border-white/20 transition-all p-3 max-w-[280px]">
                              <a href={pengumpulan.file_screenshot} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in relative">
                                <img src={pengumpulan.file_screenshot} alt="Screenshot Instagram" className="w-full h-auto rounded-xl object-contain" />
                              </a>
                            </div>
                          ) : (
                            <p className="text-[#8B9A7A] text-xs italic">Belum diunggah</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* RENDER FORM MODE */}
              {isEditingKarya && (
                <form onSubmit={handleKaryaSubmit} className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Alamat Email</label>
                      <input
                        type="email"
                        name="email"
                        value={karyaForm.email}
                        onChange={handleKaryaTextChange}
                        placeholder="Masukkan email kelompok/pengirim"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nomor HP Peserta</label>
                      <input
                        type="text"
                        name="no_hp"
                        value={karyaForm.no_hp}
                        onChange={handleKaryaTextChange}
                        placeholder="Contoh: 0812XXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tema Lomba yang Diikuti</label>
                      <select
                        name="tema_lomba"
                        value={karyaForm.tema_lomba}
                        onChange={handleKaryaTextChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs"
                        required
                      >
                        <option value="" className="bg-[#0A1A0A] text-[#8B9A7A]">Pilih Tema Karya</option>
                        {getTemaOptions(lomba.slug, lomba.nama).map((t, idx) => (
                          <option key={idx} value={t} className="bg-[#0D1E0D] text-white text-xs">{t}</option>
                        ))}
                      </select>
                    </div>

                    {isWebDev && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Kelompok</label>
                          <input
                            type="text"
                            name="nama_kelompok"
                            value={karyaForm.nama_kelompok}
                            onChange={handleKaryaTextChange}
                            placeholder="Masukkan Nama Kelompok"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Pendamping</label>
                          <input
                            type="text"
                            name="nama_pendamping"
                            value={karyaForm.nama_pendamping}
                            onChange={handleKaryaTextChange}
                            placeholder="Nama Pendamping"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Peserta 1 (Ketua)</label>
                          <input
                            type="text"
                            name="nama_peserta_1"
                            value={karyaForm.nama_peserta_1}
                            onChange={handleKaryaTextChange}
                            placeholder="Nama lengkap Ketua"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>
                        {showKaryaAnggota2 ? (
                          <div className="space-y-1 relative">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Peserta 2 (Anggota)</label>
                            <input
                              type="text"
                              name="nama_peserta_2"
                              value={karyaForm.nama_peserta_2}
                              onChange={handleKaryaTextChange}
                              placeholder="Nama lengkap Anggota"
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setShowKaryaAnggota2(false);
                                setKaryaForm(p => ({ ...p, nama_peserta_2: '' }));
                              }}
                              className="absolute right-0 top-0 text-[9px] font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-widest"
                            >
                              [ Hapus ]
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-end">
                            <button
                              type="button"
                              onClick={() => setShowKaryaAnggota2(true)}
                              className="w-full py-3 rounded-xl border border-dashed border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/5 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                            >
                              + Tambah Anggota 2
                            </button>
                          </div>
                        )}

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tautan (URL) Repositori GitHub</label>
                          <input
                            type="url"
                            name="link_github"
                            value={karyaForm.link_github}
                            onChange={handleKaryaTextChange}
                            placeholder="https://github.com/username/project-name"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tautan (URL) Folder Proposal Lomba</label>
                          <input
                            type="text"
                            name="folder_proposal"
                            value={karyaForm.folder_proposal}
                            onChange={handleKaryaTextChange}
                            placeholder="Tautan Google Drive / Cloud storage berisi file proposal"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>
                      </>
                    )}

                    {isPosterOrInfo && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Peserta</label>
                          <input
                            type="text"
                            name="nama_peserta"
                            value={karyaForm.nama_peserta}
                            onChange={handleKaryaTextChange}
                            placeholder="Nama lengkap peserta"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Sekolah</label>
                          <input
                            type="text"
                            name="nama_sekolah"
                            value={karyaForm.nama_sekolah}
                            onChange={handleKaryaTextChange}
                            placeholder="Nama Asal Sekolah / Institusi"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tautan Google Drive Karya (JPG/IMG 300dpi + PDF)</label>
                          <input
                            type="url"
                            name="link_karya_gdrive"
                            value={karyaForm.link_karya_gdrive}
                            onChange={handleKaryaTextChange}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 outline-none text-white text-xs placeholder:text-[#8B9A7A]"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Bukti Screenshot Upload Instagram</label>
                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-[#00ffc8]/50 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] w-full sm:max-w-[220px] h-[120px]">
                              <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                                <Upload size={20} className="text-[#00ffc8] animate-pulse" />
                                <span className="text-white text-[11px] font-semibold">Pilih Berkas Screenshot</span>
                                <span className="text-[9px] text-[#8B9A7A]">Format JPG/PNG, maks 500 KB</span>
                              </div>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleKaryaFileChange}
                                required={!pengumpulan}
                              />
                            </label>

                            {buktiInstagramPreview && (
                              <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-white/[0.01] p-1.5 max-w-[150px]">
                                <img src={buktiInstagramPreview} alt="Preview" className="w-full max-h-[100px] rounded-lg object-contain" />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    {pengumpulan && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditingKarya(false)}
                        className="flex-1 justify-center border border-white/10 text-white rounded-xl hover:bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wider"
                      >
                        Batal
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="solid"
                      loading={isSubmittingKarya}
                      className="flex-1 bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl py-3 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.3)] transition-all text-xs uppercase tracking-wider"
                    >
                      {pengumpulan ? 'Simpan Perubahan' : 'Kumpulkan Karya'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          );
        })()}

        {/* Progress Registrasi */}
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
            <div>
              <p className="text-white font-semibold">Progress Registrasi</p>
              <p className="text-[#8B9A7A] text-[12px] sm:text-xs">Langkah terakhir menuju kompetisi</p>
            </div>
            <span className="font-mono font-black text-[#00ffc8] text-lg">100%</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00ffc8] to-[#9dd5b8] rounded-full shadow-[0_0_10px_rgba(0,255,200,0.5)] transition-all duration-500" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 2: REJECTED STATE (DITOLAK / REVISI)
  // ==========================================
  if (activeRegistration && activeRegistration.status === 'ditolak') {
    return (
      <div ref={containerRef} className="max-w-2xl mx-auto space-y-6 animate-fade pb-10">
        {/* Main Rejected Screen */}
        {!showRevisionForm ? (
          <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.7)] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)] mb-4">
                ● DITOLAK / REVISI DIPERLUKAN
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase">Status Pendaftaran</h2>
            </div>

            {/* Warning Details Box */}
            <div className="bg-red-500/[0.03] border border-red-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex gap-2.5 items-start">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" size={18} />
                <div>
                  <h4 className="text-white text-sm font-bold">⚠️ Tindakan Diperlukan</h4>
                  <p className="text-[#8B9A7A] text-xs mt-1 leading-relaxed">
                    Mohon maaf, data pendaftaran Anda memerlukan perbaikan karena terdapat ketidaksesuaian dengan kriteria yang ditentukan. Silakan tinjau alasan penolakan di bawah ini:
                  </p>
                </div>
              </div>

              {/* Dynamic / Prefilled Rejection list */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Upload size={14} className="text-red-400" />
                  </div>
                  <div>
                    <h5 className="text-white text-xs font-bold">Catatan Penolakan Admin:</h5>
                    <p className="text-[#9dd5b8] text-xs mt-1 leading-relaxed">
                      {activeRegistration.catatan_admin || 'Silakan unggah ulang bukti transfer yang jelas serta screenshot bukti pendukung sosial media yang sesuai dengan ketentuan.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.04]">
              <a 
                href="https://wa.me/628123456789" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-center border border-white/10 text-white rounded-xl hover:bg-white/5 py-3 text-xs uppercase font-bold tracking-wider"
                >
                  Hubungi Support
                </Button>
              </a>
              <Button 
                variant="solid" 
                onClick={() => {
                  const initialFiles = { 
                    bukti_transfer: null,
                  };
                  syaratList.forEach(s => {
                    initialFiles[`bukti_${s.key}`] = null;
                  });
                  setFiles(initialFiles);
                  setShowRevisionForm(true);
                }}
                className="flex-1 bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.2)]"
              >
                Perbaiki Data
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        ) : (
          /* Inline Revision Upload Form */
          <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowRevisionForm(false)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#00ffc8] transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-display font-bold text-white text-lg">Unggah Berkas Revisi</h3>
                <p className="text-[#8B9A7A] text-xs">Pilih berkas baru yang ingin Anda perbaiki.</p>
              </div>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <Shield size={16} className="mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Info Rekening Pembayaran */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00ffc8]/10 border border-[#00ffc8]/20 flex items-center justify-center text-[#00ffc8] flex-shrink-0">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Informasi Pembayaran</h4>
                  <p className="text-[#8B9A7A] text-[12px] mt-0.5 leading-relaxed">
                    Silakan transfer biaya pendaftaran ke rekening SeaBank berikut:
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end justify-center px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] sm:min-w-[240px]">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B9A7A] uppercase">SeaBank</span>
                <span className="text-white text-sm font-mono font-black tracking-wider mt-0.5">901321217198</span>
                <span className="text-[11px] font-medium text-[#9dd5b8] mt-0.5">a.n. Shifa Nur Fauziyyah</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Bukti Transfer */}
              <div className="space-y-2">
                <label className="font-display text-[12px] font-bold tracking-widest uppercase text-[#8B9A7A]">Bukti Pembayaran (Transfer)</label>
                <label className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-white/10 hover:border-[#00ffc8]/50 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#00ffc8]/5 border border-[#00ffc8]/20 flex items-center justify-center flex-shrink-0">
                    <Upload size={18} className="text-[#00ffc8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {files.bukti_transfer
                      ? <span className="text-[#00ffc8] text-sm font-semibold truncate block">{files.bukti_transfer.name}</span>
                      : <span className="text-[#8B9A7A] text-xs block">Format PDF/JPG/PNG, maks 2MB</span>
                    }
                  </div>
                  <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('bukti_transfer', e.target.files?.[0])} />
                </label>
              </div>

              {/* Dynamic Syarat Berkas */}
              {syaratList.map((syarat) => {
                const fileKey = `bukti_${syarat.key}`;
                const file = files[fileKey];
                return (
                  <div key={syarat.id} className="space-y-2">
                    <label className="font-display text-[12px] font-bold tracking-widest uppercase text-[#8B9A7A]">
                      {syarat.nama} {syarat.is_required && <span className="text-red-400">*</span>}
                    </label>
                    <label className="flex items-start sm:items-center gap-4 p-5 rounded-xl border border-dashed border-white/10 hover:border-[#00ffc8]/50 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] duration-300">
                      <div className="w-10 h-10 rounded-xl bg-[#00ffc8]/5 border border-[#00ffc8]/20 flex items-center justify-center flex-shrink-0">
                        <Upload size={18} className="text-[#00ffc8]" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col items-start sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 w-full">
                          {file
                            ? <span className="text-[#00ffc8] text-sm font-semibold truncate block">{file.name}</span>
                            : <span className="text-[#8B9A7A] text-xs block">
                                {syarat.deskripsi || 'Format JPG/PNG/PDF, maks 1MB'}
                              </span>
                          }
                        </div>
                        {(syarat.file_template_url || syarat.url_target) && (
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {syarat.file_template_url && (
                              <a
                                href={syarat.file_template_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-lg border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap z-10 w-fit"
                              >
                                <Upload size={12} className="rotate-180" /> Unduh Template
                              </a>
                            )}
                            {syarat.url_target && (
                              <a
                                href={syarat.url_target}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-lg border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap z-10 w-fit"
                              >
                                <ExternalLink size={12} /> Kunjungi
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(fileKey, e.target.files?.[0])} 
                      />
                    </label>
                  </div>
                );
              })}


            </div>

            <Button 
              variant="solid" 
              onClick={handleRevisionSubmit}
              loading={isSubmitting}
              disabled={!isRevisionFilesValid()}
              className="w-full bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl py-3.5 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.3)] transition-all mt-4"
            >
              Kirim Perbaikan
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // CASE 3: PENDING VERIFICATION STATE
  // ==========================================
  if (activeRegistration && activeRegistration.status === 'pending') {
    return (
      <div ref={containerRef} className="max-w-3xl mx-auto space-y-6 animate-fade pb-10">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1 text-[#8B9A7A] hover:text-[#00ffc8] text-xs uppercase font-mono tracking-wider transition-colors mb-2"
        >
          <ArrowLeft size={12} /> Kembali ke Beranda
        </button>

        {/* Main Status Container */}
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <div>
              <h3 className="font-display font-black text-lg text-white">Status Pendaftaran</h3>
              <p className="text-[#8B9A7A] text-xs mt-1 leading-relaxed max-w-md">
                Data Anda sedang dalam proses peninjauan oleh tim admin. Mohon tunggu proses validasi selesai.
              </p>
            </div>
            
            {/* Status Current Widget */}
            <div className="flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
              <Clock size={16} className="text-amber-500 animate-pulse" />
              <div>
                <span className="text-[12px] font-mono text-[#8B9A7A] tracking-wider block font-bold uppercase leading-none">STATUS SAAT INI</span>
                <span className="font-display text-amber-500 text-xs font-black tracking-tight block mt-1 uppercase">Menunggu Verifikasi</span>
              </div>
            </div>
          </div>

          {/* Validation Checkpoints */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Checkpoint 1: Identitas */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-[#00ffc8]/10 hover:border-[#00ffc8]/20 transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center text-[#00ffc8]">
                  <CheckCircle size={15} />
                </div>
                <h4 className="text-white text-xs font-bold">Verifikasi Identitas</h4>
              </div>
              <p className="text-[#8B9A7A] text-[12px] leading-relaxed">
                Data profil dan identitas peserta telah divalidasi oleh sistem.
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-mono text-[#00ffc8] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ffc8] shadow-[0_0_6px_rgba(0,255,200,0.8)] animate-pulse" />
                Sudah Terverifikasi
              </span>
            </div>

            {/* Checkpoint 2: Admin */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-[#00ffc8]/10 hover:border-[#00ffc8]/20 transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00ffc8]/5 border border-[#00ffc8]/20 flex items-center justify-center text-[#00ffc8]">
                  <Shield size={15} />
                </div>
                <h4 className="text-white text-xs font-bold">Verifikasi Admin</h4>
              </div>
              <p className="text-[#8B9A7A] text-[12px] leading-relaxed">
                Dokumen dan data Anda sedang divalidasi oleh tim penyelenggara.
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-mono text-amber-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-pulse" />
                Sedang Ditinjau
              </span>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="p-5 sm:p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl space-y-4">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-[#00ffc8]" />
              Informasi Verifikasi
            </h4>
            <p className="text-[#8B9A7A] text-xs">
              Proses verifikasi manual biasanya memerlukan waktu kerja untuk memastikan integritas data peserta.
            </p>

            {/* Dynamic steps indicator */}
            <div className="space-y-4 pt-3">
              {[
                { title: 'Data Diterima', desc: 'Sistem telah menerima kelengkapan berkas Anda.', state: 'done' },
                { title: 'Peninjauan Admin', desc: 'Tim sedang memeriksa kecocokan data dengan persyaratan.', state: 'active' },
                { title: 'Aktivasi Akun', desc: 'Status kepesertaan akan diaktifkan sepenuhnya.', state: 'pending' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                  {/* Vertical connecting line */}
                  {i < 2 && (
                    <div className="absolute top-6.5 left-3.5 w-[1px] h-10 bg-white/5" />
                  )}

                  {/* Bullet */}
                  <div className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    step.state === 'done' ? 'bg-[#00ffc8]/10 border-[#00ffc8] text-[#00ffc8] shadow-[0_0_10px_rgba(0,255,200,0.15)]'
                    : step.state === 'active' ? 'bg-[#00ffc8]/5 border-[#00ffc8] text-[#00ffc8] animate-pulse'
                    : 'bg-white/5 border-white/10 text-white/30'
                  }`}>
                    {step.state === 'done' ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <span className="text-[12px] font-bold font-mono">{i + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-none ${step.state === 'pending' ? 'text-white/40' : 'text-white'}`}>
                      {step.title}
                    </p>
                    <p className="text-[#8B9A7A] text-[12px] mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need help support section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <p className="text-[#9dd5b8] text-xs text-center sm:text-left">
              <strong>Butuh Bantuan?</strong> Hubungi tim inovasi kami jika Anda menemui kendala.
            </p>
            <a 
              href="https://wa.me/628123456789" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#00ffc8] font-bold uppercase tracking-wider hover:underline"
            >
              Hubungi Support
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 4: SUCCESS REGISTRATION SCREEN
  // ==========================================
  if (isSuccessScreen) {
    return (
      <div ref={containerRef} className="max-w-md mx-auto space-y-6 animate-fade pb-10">
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-8 space-y-6 text-center">
          
          {/* Centered green banner */}
          <div className="p-4 bg-[#00ffc8]/10 border border-[#00ffc8]/30 rounded-2xl flex items-center justify-between text-left text-[#00ffc8] text-xs shadow-[0_0_15px_rgba(0,255,200,0.1)]">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} />
              <span>Terima kasih telah mengisi form, harap lihat di status pendaftaran</span>
            </div>
            <button onClick={() => setIsSuccessScreen(false)} className="text-white hover:text-[#00ffc8] transition-colors font-bold ml-1">✕</button>
          </div>

          <div className="w-16 h-16 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,255,200,0.3)] my-4">
            <Check className="text-[#00ffc8]" size={28} strokeWidth={2.5} />
          </div>

          <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">Berhasil Mendaftar</h2>
          <p className="text-[#8B9A7A] text-xs max-w-xs mx-auto leading-relaxed">
            Submisi data formulir Anda telah dikirim dan sekarang masuk antrean validasi dokumen.
          </p>

          <Button 
            variant="solid" 
            onClick={() => {
              setIsSuccessScreen(false);
              fetchMyPendaftaran();
            }}
            className="w-full bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl py-3.5 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.3)] transition-all mt-4"
          >
            Lihat Status
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 5: FORM REGISTRATION STEPS
  // ==========================================
  return (
    <div ref={containerRef} className="max-w-3xl mx-auto space-y-8 animate-fade pb-10">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Pendaftaran {selectedLomba ? selectedLomba.nama : 'Tahap ' + step}
        </h1>
        <p className="text-[#9dd5b8] text-xs sm:text-sm mt-1.5">
          {selectedLomba ? `Lengkapi formulir pendaftaran khusus ${selectedLomba.nama}` : 'Isi identitas diri, tim, dan unggah berkas Anda.'}
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="flex items-center justify-between relative bg-white/[0.01] border border-white/[0.04] px-6 py-4 rounded-2xl">
        {[
          { label: 'IDENTITAS', index: 1 },
          { label: 'TIM', index: 2 },
          { label: 'BERKAS', index: 3 },
          { label: 'STATUS', index: 4 }
        ].map((item, i) => {
          const isActive = step === item.index;
          const isDone = step > item.index;
          return (
            <div key={i} className="flex items-center gap-2 relative z-10 select-none">
              <div className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center border transition-all ${
                isDone ? 'bg-[#00ffc8]/10 border-[#00ffc8] text-[#00ffc8] shadow-[0_0_10px_rgba(0,255,200,0.15)]'
                : isActive ? 'bg-[#00ffc8] border-[#00ffc8] text-[#020a06] shadow-[0_0_15px_rgba(0,255,200,0.3)]'
                : 'bg-white/[0.01] border-white/10 text-[#8B9A7A]'
              }`}>
                {isDone ? '✓' : item.index}
              </div>
              <span className={`text-[12px] font-mono font-bold uppercase tracking-wider hidden sm:block ${
                isActive ? 'text-[#00ffc8]' : 'text-[#8B9A7A]'
              }`}>
                {item.label}
              </span>
              
              {/* Dotted connecting line */}
              {i < 3 && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-[60px] md:w-[100px] border-t border-dashed border-white/5 hidden md:block ml-2 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Glass Card Container */}
      <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* TAHAP 1: IDENTITAS & KATEGORI */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-[12px] font-mono font-bold tracking-widest text-[#00ffc8] uppercase">Tahap 1: Identitas & Kategori</span>
              <h2 className="font-display font-black text-white text-base sm:text-lg mt-1">Beri tahu kami siapa Anda dan jalur inovasi mana yang Anda pilih.</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="ALAMAT EMAIL"
                name="email"
                type="email"
                value={formData.email}
                className={`${INPUT_CLASS} opacity-50`}
                readOnly
                disabled
              />

              <Input
                as="select"
                label="CABANG LOMBA"
                name="lomba_id"
                value={formData.lomba_id}
                onChange={handleTextChange}
                className={INPUT_CLASS}
                required
              >
                <option value="" className="bg-[#0A1A0A] text-[#8B9A7A]">Pilih Kategori</option>
                {lombaList.map((l) => (
                  <option key={l.id} value={l.id} className="bg-[#0D1E0D] text-white">{l.nama}</option>
                ))}
              </Input>

              {/* Dynamically enabled inputs based on selection */}
              {!isCTF && (
                <Input
                  label="ASAL SEKOLAH"
                  name="asal_sekolah"
                  placeholder="Nama Sekolah Menengah"
                  value={formData.asal_sekolah}
                  onChange={handleTextChange}
                  className={INPUT_CLASS}
                  required={isWebDev || isPosterOrInfo}
                />
              )}

              {isCTF && (
                <Input
                  label="ASAL UNIVERSITAS"
                  name="asal_universitas"
                  placeholder="Nama Universitas"
                  value={formData.asal_universitas}
                  onChange={handleTextChange}
                  className={INPUT_CLASS}
                  required
                />
              )}
            </div>

            {/* Poster Info Box */}
            {isPosterOrInfo && (
              <div className="p-4 rounded-xl bg-white/[0.01] border-l-2 border-[#00ffc8] bg-[#00ffc8]/[0.02] flex items-start gap-2.5">
                <Info size={15} className="text-[#00ffc8] mt-0.5 flex-shrink-0" />
                <p className="text-white text-xs font-semibold">
                  Perlombaan Infografis & Poster hanya berlaku individu.
                </p>
              </div>
            )}

            {/* Navigation Button */}
            <div className="flex justify-end pt-4 border-t border-white/[0.04]">
              <Button
                variant="solid"
                disabled={!formData.lomba_id || (isCTF && !formData.asal_universitas) || ((isWebDev || isPosterOrInfo) && !formData.asal_sekolah)}
                onClick={() => setStep(2)}
                className="bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl px-6.5 py-3.5 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.2)] hover:shadow-[0_0_20px_rgba(0,255,200,0.3)] transition-all font-mono"
              >
                Tahap Selanjutnya
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* TAHAP 2: DATA TIM */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-[12px] font-mono font-bold tracking-widest text-[#00ffc8] uppercase">Tahap 2: Anggota & Detail Tim</span>
              <h2 className="font-display font-black text-white text-base sm:text-lg mt-1">Lengkapi data kelompok serta topik gagasan yang ingin Anda angkat.</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="NAMA ANGGOTA 1"
                name="nama_peserta_1"
                placeholder="Nama lengkap anggota 1"
                value={formData.nama_peserta_1}
                onChange={handleTextChange}
                className={INPUT_CLASS}
                required
              />

              {!isPosterOrInfo && (
                showAnggota2 ? (
                  <div className="relative">
                    <Input
                      label="NAMA ANGGOTA 2"
                      name="nama_peserta_2"
                      placeholder="Khusus Web Dev, CTF, UI/UX"
                      value={formData.nama_peserta_2}
                      onChange={handleTextChange}
                      className={INPUT_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAnggota2(false);
                        setFormData(p => ({ ...p, nama_peserta_2: '' }));
                      }}
                      className="absolute right-0 top-0 text-[10px] font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-widest"
                    >
                      [ Hapus ]
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAnggota2(true)}
                      className="w-full py-3.5 rounded-xl border border-dashed border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/5 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      + Tambah Anggota 2
                    </button>
                  </div>
                )
              )}

              {isCTF && showAnggota2 && (
                showAnggota3 ? (
                  <div className="relative">
                    <Input
                      label="NAMA ANGGOTA 3"
                      name="nama_peserta_3"
                      placeholder="Khusus CTF (Opsional)"
                      value={formData.nama_peserta_3}
                      onChange={handleTextChange}
                      className={INPUT_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAnggota3(false);
                        setFormData(p => ({ ...p, nama_peserta_3: '' }));
                      }}
                      className="absolute right-0 top-0 text-[10px] font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-widest"
                    >
                      [ Hapus ]
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAnggota3(true)}
                      className="w-full py-3.5 rounded-xl border border-dashed border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/5 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      + Tambah Anggota 3
                    </button>
                  </div>
                )
              )}

              <Input
                label="NO HP PESERTA"
                name="no_wa"
                placeholder="Nomor WhatsApp aktif"
                value={formData.no_wa}
                onChange={handleTextChange}
                className={INPUT_CLASS}
                required
              />

              {isWebDev && (
                <>
                  <Input
                    label="NO HP PENDAMPING"
                    name="no_wa_pendamping"
                    placeholder="WhatsApp number"
                    value={formData.no_wa_pendamping}
                    onChange={handleTextChange}
                    className={INPUT_CLASS}
                    required
                  />
                  <Input
                    label="NAMA PENDAMPING"
                    name="nama_pendamping"
                    placeholder="Khusus Web Dev"
                    value={formData.nama_pendamping}
                    onChange={handleTextChange}
                    className={INPUT_CLASS}
                    required
                  />
                </>
              )}

            </div>

            <div className="space-y-1.5">
              <label className="font-display text-[12px] font-bold tracking-widest uppercase text-[#8B9A7A]">TEMA LOMBA YANG DIIKUTI</label>
              <Input
                as="select"
                name="tema"
                value={formData.tema}
                onChange={handleTextChange}
                className={INPUT_CLASS}
                required
              >
                <option value="" className="bg-[#0A1A0A] text-[#8B9A7A]">-- Pilih Tema Lomba --</option>
                {getTemaOptions(selectedLomba?.slug).map((option) => (
                  <option key={option} value={option} className="bg-[#0D1E0D] text-white">{option}</option>
                ))}
              </Input>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="border border-white/10 text-white hover:bg-white/5 rounded-xl px-5 py-3 font-mono flex items-center gap-1.5"
              >
                <ChevronLeft size={15} />
                Kembali
              </Button>
              <Button
                variant="solid"
                disabled={!formData.nama_peserta_1 || !formData.no_wa || !formData.tema || (isWebDev && ((showAnggota2 && !formData.nama_peserta_2) || !formData.nama_pendamping || !formData.no_wa_pendamping))}
                onClick={() => setStep(3)}
                className="bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl px-6.5 py-3.5 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.2)] transition-all font-mono"
              >
                Tahap Selanjutnya
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* TAHAP 3: UNGGAH BERKAS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] font-mono font-bold tracking-widest text-[#00ffc8] uppercase">Tahap 3: Unggah Berkas</span>
                <h2 className="font-display font-black text-white text-base sm:text-lg mt-1">Unggah seluruh dokumen kelayakan untuk menyelesaikan pendaftaran.</h2>
              </div>
              <span className="px-2.5 py-1 text-[12px] font-mono font-bold rounded-md bg-[#00ffc8]/10 border border-[#00ffc8]/30 text-[#00ffc8] uppercase tracking-wider">
                DOKUMEN WAJIB
              </span>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <Shield size={16} className="mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Info Rekening Pembayaran */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00ffc8]/10 border border-[#00ffc8]/20 flex items-center justify-center text-[#00ffc8] flex-shrink-0">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Informasi Pembayaran</h4>
                  <p className="text-[#8B9A7A] text-[12px] mt-0.5 leading-relaxed">
                    Silakan transfer biaya pendaftaran ke rekening SeaBank berikut:
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end justify-center px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] sm:min-w-[240px]">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B9A7A] uppercase">SeaBank</span>
                <span className="text-white text-sm font-mono font-black tracking-wider mt-0.5">901321217198</span>
                <span className="text-[11px] font-medium text-[#9dd5b8] mt-0.5">a.n. Shifa Nur Fauziyyah</span>
              </div>
            </div>

            {/* Dotted Grid Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Bukti Transaksi */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/10 hover:border-[#00ffc8]/50 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] duration-300">
                  <div className="w-9 h-9 rounded-lg bg-[#00ffc8]/5 border border-[#00ffc8]/20 flex items-center justify-center flex-shrink-0 text-[#00ffc8]">
                    <Upload size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white text-xs font-semibold block truncate">File Bukti Transaksi</span>
                    {files.bukti_transfer
                      ? <span className="text-[#00ffc8] text-[12px] block truncate mt-0.5">{files.bukti_transfer.name}</span>
                      : <span className="text-[#8B9A7A] text-[12px] block mt-0.5">PDF/JPG maks 2MB</span>
                    }
                  </div>
                  <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('bukti_transfer', e.target.files?.[0])} />
                </label>
              </div>

              {/* Dynamic Syarat Berkas */}
              {syaratList.map((syarat) => {
                const fileKey = `bukti_${syarat.key}`;
                const file = files[fileKey];
                return (
                  <div key={syarat.id} className="space-y-2">
                    <label className="flex items-start sm:items-center gap-3 p-4 rounded-xl border border-dashed border-white/10 hover:border-[#00ffc8]/50 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] duration-300">
                      <div className="w-9 h-9 rounded-lg bg-[#00ffc8]/5 border border-[#00ffc8]/20 flex items-center justify-center flex-shrink-0 text-[#00ffc8]">
                        <Upload size={16} />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col items-start sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 w-full">
                          <span className="text-white text-xs font-semibold block truncate">
                            {syarat.nama} {syarat.is_required && <span className="text-red-400">*</span>}
                          </span>
                          {file
                            ? <span className="text-[#00ffc8] text-[12px] block truncate mt-0.5">{file.name}</span>
                            : <span className="text-[#8B9A7A] text-[12px] block mt-0.5">
                                {syarat.deskripsi || 'Format JPG/PNG/PDF, maks 500KB'}
                              </span>
                          }
                        </div>
                        {(syarat.file_template_url || syarat.url_target) && (
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {syarat.file_template_url && (
                              <a
                                href={syarat.file_template_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-lg border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap z-10 w-fit"
                              >
                                <Upload size={12} className="rotate-180" /> Unduh Template
                              </a>
                            )}
                            {syarat.url_target && (
                              <a
                                href={syarat.url_target}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-lg border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap z-10 w-fit"
                              >
                                <ExternalLink size={12} /> Kunjungi
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(fileKey, e.target.files?.[0])} 
                      />
                    </label>
                  </div>
                );
              })}



            </div>

            {/* Validation Info Box */}
            <div className="flex gap-2.5 p-4 rounded-xl bg-white/[0.01] border-l-2 border-[#00ffc8] bg-[#00ffc8]/[0.02]">
              <Info size={15} className="text-[#00ffc8] mt-0.5 flex-shrink-0 animate-pulse" />
              <p className="text-[#8B9A7A] text-xs font-medium">
                Pastikan semua data sudah benar sebelum dikirim.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="border border-white/10 text-white hover:bg-white/5 rounded-xl px-5 py-3 font-mono flex items-center gap-1.5"
              >
                <ChevronLeft size={15} />
                Kembali
              </Button>
              <Button
                variant="solid"
                disabled={!isRegistrationFilesValid()}
                onClick={handleRegistrationSubmit}
                loading={isSubmitting}
                className="bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl px-6.5 py-3.5 flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,255,200,0.4)] transition-all font-mono"
              >
                Submit Pendaftaran
              </Button>
            </div>
          </div>
        )}

      </div>



    </div>
  );
}
