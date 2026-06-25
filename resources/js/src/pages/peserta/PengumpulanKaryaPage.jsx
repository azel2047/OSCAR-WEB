import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import api from '@/api/axios';
import Button from '@/components/ui/Button';
import {
  CheckCircle, ArrowLeft, Upload, Info, AlertCircle,
  Shield, Check, ExternalLink, Github, FileText, Phone, Mail,
  Users, User, Award, Edit3, Eye, Calendar
} from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const INPUT_CLASS = "w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#00ffc8] focus:ring-1 focus:ring-[#00ffc8]/50 focus:shadow-[0_0_15px_rgba(0,255,200,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#8B9A7A] disabled:opacity-50 disabled:cursor-not-allowed";

export default function PengumpulanKaryaPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendaftaran, setPendaftaran] = useState(null);
  const [pengumpulan, setPengumpulan] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAnggota2, setShowAnggota2] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    no_hp: '',
    tema_lomba: '',
    // Web Dev fields
    nama_kelompok: '',
    nama_pendamping: '',
    nama_peserta_1: '',
    nama_peserta_2: '',
    link_github: '',
    folder_proposal: '',
    // Poster / Infografis fields
    nama_peserta: '',
    nama_sekolah: '',
    link_karya_gdrive: ''
  });

  const [buktiInstagram, setBuktiInstagram] = useState(null);
  const [buktiInstagramPreview, setBuktiInstagramPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { data } = await api.get('/pengumpulan/saya');
      const pendaftaranData = data.data?.pendaftaran;
      const pengumpulanData = data.data?.pengumpulan;

      setPendaftaran(pendaftaranData);
      setPengumpulan(pengumpulanData);

      if (pendaftaranData) {
        const lomba = pendaftaranData.lomba;
        const isWebDev = lomba?.slug === 'web-development' || lomba?.nama?.toLowerCase().includes('web');
        const isPosterOrInfo = ['desain-poster', 'desain-infografis'].includes(lomba?.slug) || 
                              lomba?.nama?.toLowerCase().includes('poster') || 
                              lomba?.nama?.toLowerCase().includes('infografis');

        // Set default form values
        if (pengumpulanData) {
          setFormData({
            email: pengumpulanData.email || user?.email || '',
            no_hp: pengumpulanData.no_hp || '',
            tema_lomba: pengumpulanData.tema_lomba || '',
            nama_kelompok: pengumpulanData.data_karya?.nama_kelompok || '',
            nama_pendamping: pengumpulanData.data_karya?.nama_pendamping || '',
            nama_peserta_1: pengumpulanData.data_karya?.nama_peserta_1 || '',
            nama_peserta_2: pengumpulanData.data_karya?.nama_peserta_2 || '',
            link_github: pengumpulanData.data_karya?.link_github || '',
            folder_proposal: pengumpulanData.data_karya?.folder_proposal || '',
            nama_peserta: pengumpulanData.data_karya?.nama_peserta || '',
            nama_sekolah: pengumpulanData.data_karya?.nama_sekolah || '',
            link_karya_gdrive: pengumpulanData.data_karya?.link_karya_gdrive || ''
          });
          if (pengumpulanData.file_screenshot) {
            setBuktiInstagramPreview(pengumpulanData.file_screenshot);
          }
          setIsEditMode(false);
        } else {
          // Pre-fill some registration data
          const regData = pendaftaranData.data_peserta || {};
          setFormData({
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
          setIsEditMode(true);
        }
      }
    } catch (err) {
      setErrorMsg(err.userMessage || 'Gagal memuat data pengumpulan karya.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prefill toggle states when data is loaded
  useEffect(() => {
    if (formData.nama_peserta_2) setShowAnggota2(true);
  }, [formData.nama_peserta_2]);

  // Animations
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.animate-fade'),
        { opacity: 0, y: 25, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.1 }
      );
    }
  }, [isLoading, isEditMode]);

  const handleTextChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setErrorMsg('Ukuran file tidak boleh melebihi 500 KB.');
      e.target.value = '';
      setBuktiInstagram(null);
      setBuktiInstagramPreview(pengumpulan?.file_screenshot || '');
      return;
    }

    setErrorMsg('');
    setBuktiInstagram(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBuktiInstagramPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getTemaOptions = (slug, nama) => {
    const s = slug || '';
    const n = nama?.toLowerCase() || '';

    if (s === 'web-development' || n.includes('web')) {
      return [
        'Teknologi Hijau & Konservasi Alam (Green Tech)',
        'Eco-Tourism & Keanekaragaman Hayati',
        'Manajemen Limbah & Karbon Digital'
      ];
    }
    if (s === 'desain-poster' || n.includes('poster')) {
      return [
        'Restorasi Hutan Tropis & Kehidupan Liar',
        'Dampak Perubahan Iklim di Sekitar Kita',
        'Harmoni Alam dan Teknologi Masa Depan'
      ];
    }
    if (s === 'desain-infografis' || n.includes('infografis')) {
      return [
        'Pentingnya Menjaga Paru-Paru Dunia',
        'Transisi Energi Bersih untuk Kelestarian Hutan',
        'Statistik Deforestasi & Solusi Digital'
      ];
    }
    return [
      'Melestarikan Keanekaragaman Hayati melalui Inovasi Digital',
      'Implementasi Smart Eco-System di Lingkungan Pendidikan',
      'Teknologi Informasi untuk Mitigasi Perubahan Iklim'
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const fd = new FormData();
    fd.append('pendaftaran_id', pendaftaran.id);
    fd.append('email', formData.email);
    fd.append('no_hp', formData.no_hp);
    fd.append('tema_lomba', formData.tema_lomba);

    const isWebDev = pendaftaran.lomba?.slug === 'web-development' || pendaftaran.lomba?.nama?.toLowerCase().includes('web');

    if (isWebDev) {
      fd.append('nama_kelompok', formData.nama_kelompok);
      fd.append('nama_pendamping', formData.nama_pendamping);
      fd.append('nama_peserta_1', formData.nama_peserta_1);
      fd.append('nama_peserta_2', formData.nama_peserta_2);
      fd.append('link_github', formData.link_github);
      fd.append('folder_proposal', formData.folder_proposal);
    } else {
      fd.append('nama_peserta', formData.nama_peserta);
      fd.append('nama_sekolah', formData.nama_sekolah);
      fd.append('link_karya_gdrive', formData.link_karya_gdrive);
      if (buktiInstagram) {
        fd.append('bukti_instagram', buktiInstagram);
      }
    }

    try {
      const { data } = await api.post('/pengumpulan', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(data.message || 'Karya berhasil dikumpulkan!');
      setPengumpulan(data.data);
      setIsEditMode(false);
      // Refresh
      fetchData();
    } catch (err) {
      setErrorMsg(err.userMessage || 'Gagal mengirimkan karya. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-[#00ffc8] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#8B9A7A] text-sm animate-pulse">Menghubungkan ke server...</p>
      </div>
    );
  }

  if (!pendaftaran) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] rounded-3xl p-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="font-display font-black text-white text-xl uppercase">Akses Dibatasi</h2>
          <p className="text-[#8B9A7A] text-sm leading-relaxed max-w-md mx-auto">
            Anda belum memiliki pendaftaran aktif yang telah **Diverifikasi** oleh admin untuk dapat mengumpulkan karya. Silakan selesaikan pendaftaran Anda atau tunggu proses verifikasi.
          </p>
          <Button
            variant="ghost"
            onClick={() => navigate('/peserta')}
            className="border border-white/10 text-white rounded-xl hover:bg-white/5 mx-auto"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const lomba = pendaftaran.lomba;
  const isWebDev = lomba?.slug === 'web-development' || lomba?.nama?.toLowerCase().includes('web');
  const isPosterOrInfo = ['desain-poster', 'desain-infografis'].includes(lomba?.slug) || 
                        lomba?.nama?.toLowerCase().includes('poster') || 
                        lomba?.nama?.toLowerCase().includes('infografis');

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-8 pb-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade">
        <button
          onClick={() => navigate('/peserta')}
          className="flex items-center gap-1.5 text-[#8B9A7A] hover:text-[#00ffc8] text-xs uppercase font-mono tracking-wider transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Dashboard
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00ffc8]/10 border border-[#00ffc8]/30 text-[#00ffc8] w-fit shadow-[0_0_10px_rgba(0,255,200,0.15)]">
          LOMBA: {lomba.nama}
        </span>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-fade shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0 animate-pulse" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#00ffc8] text-xs flex items-start gap-2.5 animate-fade shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* RENDER VIEW MODE */}
      {!isEditMode && pengumpulan && (
        <div className="space-y-6 animate-fade">
          {/* Status Header */}
          <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.7)] rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#00ffc8]/[0.02] blur-[40px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#00ffc8]/10 border border-[#00ffc8]/20 flex items-center justify-center text-[#00ffc8] shadow-[0_0_15px_rgba(0,255,200,0.2)]">
                  <Check size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display font-black text-white text-lg uppercase tracking-tight">Karya Berhasil Dikumpulkan!</h2>
                  <p className="text-[#8B9A7A] text-xs mt-0.5 flex items-center gap-1.5">
                    <Calendar size={12} /> Dikumpulkan pada: {new Date(pengumpulan.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsEditMode(true)}
                className="border border-[#00ffc8]/30 hover:border-[#00ffc8]/70 text-[#00ffc8] hover:bg-[#00ffc8]/5 rounded-xl text-xs font-bold uppercase tracking-wider py-2.5"
              >
                <Edit3 size={14} className="mr-1.5" /> Perbarui Karya
              </Button>
            </div>

            {/* General Submission Info */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B9A7A] uppercase flex items-center gap-1">
                  <Mail size={10} /> Email Pengirim
                </span>
                <p className="text-white text-sm font-semibold">{pengumpulan.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B9A7A] uppercase flex items-center gap-1">
                  <Phone size={10} /> No. HP Peserta
                </span>
                <p className="text-white text-sm font-semibold">{pengumpulan.no_hp}</p>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B9A7A] uppercase flex items-center gap-1">
                  <Award size={10} /> Tema Karya yang Diikuti
                </span>
                <p className="text-white text-sm font-semibold">{pengumpulan.tema_lomba}</p>
              </div>
            </div>
          </div>

          {/* Details Content Box */}
          <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.7)] rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest border-b border-white/5 pb-3">Detail Konten Submission</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {isWebDev && (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><Users size={10} /> Nama Kelompok</span>
                    <p className="text-white text-sm font-semibold">{pengumpulan.data_karya?.nama_kelompok || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><User size={10} /> Nama Pendamping</span>
                    <p className="text-white text-sm font-semibold">{pengumpulan.data_karya?.nama_pendamping || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><User size={10} /> Nama Peserta 1</span>
                    <p className="text-white text-sm font-semibold">{pengumpulan.data_karya?.nama_peserta_1 || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><User size={10} /> Nama Peserta 2</span>
                    <p className="text-white text-sm font-semibold">{pengumpulan.data_karya?.nama_peserta_2 || '-'}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><Github size={10} /> Link Repositori GitHub</span>
                    <a href={pengumpulan.data_karya?.link_github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffc8]/50 hover:bg-white/[0.04] transition-all text-[#00ffc8] text-xs font-semibold select-all">
                      <Github size={14} />
                      <span className="truncate flex-1">{pengumpulan.data_karya?.link_github}</span>
                      <ExternalLink size={12} className="opacity-60" />
                    </a>
                  </div>
                  <div className="sm:col-span-2 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><FileText size={10} /> Folder Proposal Lomba</span>
                    <a href={pengumpulan.data_karya?.folder_proposal} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffc8]/50 hover:bg-white/[0.04] transition-all text-[#00ffc8] text-xs font-semibold select-all">
                      <FileText size={14} />
                      <span className="truncate flex-1">{pengumpulan.data_karya?.folder_proposal}</span>
                      <ExternalLink size={12} className="opacity-60" />
                    </a>
                  </div>
                </>
              )}

              {isPosterOrInfo && (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><User size={10} /> Nama Peserta</span>
                    <p className="text-white text-sm font-semibold">{pengumpulan.data_karya?.nama_peserta || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><FileText size={10} /> Nama Sekolah</span>
                    <p className="text-white text-sm font-semibold">{pengumpulan.data_karya?.nama_sekolah || '-'}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1"><ExternalLink size={10} /> Link Google Drive Karya (JPG/IMG 300dpi + PDF)</span>
                    <a href={pengumpulan.data_karya?.link_karya_gdrive} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffc8]/50 hover:bg-white/[0.04] transition-all text-[#00ffc8] text-xs font-semibold select-all">
                      <FileText size={14} />
                      <span className="truncate flex-1">{pengumpulan.data_karya?.link_karya_gdrive}</span>
                      <ExternalLink size={12} className="opacity-60" />
                    </a>
                  </div>
                  <div className="sm:col-span-2 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-[#8B9A7A] uppercase flex items-center gap-1">Bukti Screenshot Upload Instagram</span>
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
        </div>
      )}

      {/* RENDER FORM EDIT/CREATE MODE */}
      {(isEditMode || !pengumpulan) && (
        <form onSubmit={handleSubmit} className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-8 space-y-8 animate-fade">
          <div>
            <h2 className="font-display font-black text-white text-xl uppercase tracking-tight">Formulir Pengumpulan Karya</h2>
            <p className="text-[#8B9A7A] text-xs mt-1">Lengkapi seluruh data pengumpulan karya/project Anda dengan teliti.</p>
          </div>

          {/* Form Fields */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Alamat Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                placeholder="Masukkan email kelompok/pengirim"
                className={INPUT_CLASS}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nomor HP Peserta</label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleTextChange}
                placeholder="Contoh: 0812XXXXXXXX"
                className={INPUT_CLASS}
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tema Lomba yang Diikuti</label>
              <select
                name="tema_lomba"
                value={formData.tema_lomba}
                onChange={handleTextChange}
                className={INPUT_CLASS}
                required
              >
                <option value="" className="bg-[#0A1A0A] text-[#8B9A7A]">Pilih Tema Karya</option>
                {getTemaOptions(lomba.slug, lomba.nama).map((t, idx) => (
                  <option key={idx} value={t} className="bg-[#0D1E0D] text-white text-xs">{t}</option>
                ))}
              </select>
            </div>

            {/* Web Dev Form */}
            {isWebDev && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Kelompok</label>
                  <input
                    type="text"
                    name="nama_kelompok"
                    value={formData.nama_kelompok}
                    onChange={handleTextChange}
                    placeholder="Masukkan Nama Kelompok"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Pendamping</label>
                  <input
                    type="text"
                    name="nama_pendamping"
                    value={formData.nama_pendamping}
                    onChange={handleTextChange}
                    placeholder="Masukkan Nama Guru/Dosen Pendamping"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Peserta 1 (Ketua)</label>
                  <input
                    type="text"
                    name="nama_peserta_1"
                    value={formData.nama_peserta_1}
                    onChange={handleTextChange}
                    placeholder="Nama lengkap Peserta 1"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                {showAnggota2 ? (
                  <div className="space-y-2 relative">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Peserta 2 (Anggota)</label>
                    <input
                      type="text"
                      name="nama_peserta_2"
                      value={formData.nama_peserta_2}
                      onChange={handleTextChange}
                      placeholder="Nama lengkap Peserta 2"
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
                )}

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tautan (URL) Repositori GitHub</label>
                  <input
                    type="url"
                    name="link_github"
                    value={formData.link_github}
                    onChange={handleTextChange}
                    placeholder="https://github.com/username/project-name"
                    className={INPUT_CLASS}
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tautan (URL) Folder Proposal Lomba</label>
                  <input
                    type="text"
                    name="folder_proposal"
                    value={formData.folder_proposal}
                    onChange={handleTextChange}
                    placeholder="Tautan Google Drive / Cloud storage lainnya berisi file proposal"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
              </>
            )}

            {/* Poster / Infografis Form */}
            {isPosterOrInfo && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Peserta</label>
                  <input
                    type="text"
                    name="nama_peserta"
                    value={formData.nama_peserta}
                    onChange={handleTextChange}
                    placeholder="Masukkan nama lengkap peserta"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Nama Sekolah</label>
                  <input
                    type="text"
                    name="nama_sekolah"
                    value={formData.nama_sekolah}
                    onChange={handleTextChange}
                    placeholder="Nama Asal Sekolah / Institusi"
                    className={INPUT_CLASS}
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Tautan Google Drive Karya (JPG/IMG 300dpi + PDF)</label>
                  <input
                    type="url"
                    name="link_karya_gdrive"
                    value={formData.link_karya_gdrive}
                    onChange={handleTextChange}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className={INPUT_CLASS}
                    required
                  />
                  <p className="text-[10px] text-[#8B9A7A] mt-1 italic leading-relaxed">
                    💡 Pastikan link Google Drive sudah diatur agar **dapat dilihat oleh siapa saja** yang memiliki link (Access: Anyone with link).
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B9A7A]">Bukti Screenshot Upload Instagram</label>
                  
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#00ffc8]/50 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] duration-300 w-full sm:max-w-[260px] h-[150px]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-[#00ffc8] animate-bounce" />
                        <span className="text-white text-xs font-semibold">Pilih Berkas Screenshot</span>
                        <span className="text-[10px] text-[#8B9A7A]">Format JPG/PNG, maks 500 KB</span>
                      </div>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        required={!pengumpulan}
                      />
                    </label>

                    {/* Preview box */}
                    {buktiInstagramPreview && (
                      <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.01] p-2 max-w-[200px]">
                        <img src={buktiInstagramPreview} alt="Screenshot preview" className="w-full max-h-[130px] rounded-xl object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/5">
            {pengumpulan && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditMode(false)}
                className="flex-1 justify-center border border-white/10 text-white rounded-xl hover:bg-white/5 py-3 text-xs uppercase font-bold tracking-wider"
              >
                Batal
              </Button>
            )}
            <Button
              type="submit"
              variant="solid"
              loading={isSubmitting}
              className="flex-1 bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl py-3.5 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.3)] transition-all font-display text-xs uppercase tracking-wider"
            >
              {pengumpulan ? 'Simpan Perubahan' : 'Kumpulkan Karya'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
