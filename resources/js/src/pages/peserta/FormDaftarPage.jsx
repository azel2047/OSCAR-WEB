import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import usePendaftaranStore from '@/stores/pendaftaranStore';
import useLombaStore from '@/stores/lombaStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/api/axios';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Upload, Info, 
  Clock, AlertCircle, Shield, Check, ExternalLink, 
  MessageSquare, ArrowLeft, Trophy, Sparkles, Laptop, Paintbrush, Terminal
} from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const INPUT_CLASS = "!border-0 !rounded-xl bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00ffc8]/50 focus:shadow-[0_0_15px_rgba(0,255,200,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#8B9A7A]";

export default function FormDaftarPage() {
  const { user } = useAuthStore();
  const { 
    daftarList,
    fetchMyPendaftaran,
    isSubmitting, 
    submitError, 
    submitPendaftaran,
    clearError
  } = usePendaftaranStore();
  const { lombaList, fetchLomba } = useLombaStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lombaIdParam = searchParams.get('lomba');
  const containerRef = useRef(null);

  // Form registration state
  const [step, setStep] = useState(1);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [showAnggota2, setShowAnggota2] = useState(false);
  const [showAnggota3, setShowAnggota3] = useState(false);
  const [syaratList, setSyaratList] = useState([]);

  // Form Fields
  const [formData, setFormData] = useState({
    lomba_id: lombaIdParam || '',
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

  useEffect(() => {
    fetchLomba();
    clearError();
    if (user && user.role === 'peserta') {
      fetchMyPendaftaran();
    }
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

  // Redirect if already registered
  useEffect(() => {
    if (daftarList && daftarList.length > 0) {
      navigate('/peserta', { replace: true });
    }
  }, [daftarList]);

  // Prefill toggle states when data is loaded
  useEffect(() => {
    if (formData.nama_peserta_2) setShowAnggota2(true);
    if (formData.nama_peserta_3) setShowAnggota3(true);
  }, [formData.nama_peserta_2, formData.nama_peserta_3]);

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
  }, [step, isSuccessScreen]);

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
        'Keamanan Infrastruktur Cloud & IoT',
        'Eksploitasi & Pertahanan Sistem Hutan Pintar',
        'Kriptografi & Analisis Forensik Digital'
      ];
    }
    if (slug === 'ui-ux-design') {
      return [
        'Desain Antarmuka Platform Edukasi Kehutanan',
        'Solusi UX Transparansi Karbon & Reboisasi',
        'Aplikasi Mobile Pelacak Deforestasi Real-time'
      ];
    }
    return [
      'Inovasi Digital untuk Kelestarian Hutan Tropis',
      'Pemanfaatan IoT/AI dalam Pemantauan Lingkungan',
      'Kampanye Kreatif Kesadaran Perubahan Iklim'
    ];
  };

  const handleTextChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (key, file) => {
    setFiles(p => ({ ...p, [key]: file }));
  };

  const isFormValid = () => {
    if (!files.bukti_transfer) return false;
    for (const syarat of syaratList) {
      if (syarat.is_required && !files[`bukti_${syarat.key}`]) {
        return false;
      }
    }
    return true;
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



  // ==========================================
  // CASE 1: SUCCESS REGISTRATION SCREEN
  // ==========================================
  if (isSuccessScreen) {
    return (
      <div ref={containerRef} className="max-w-md mx-auto space-y-6 animate-fade pb-10">
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl p-8 space-y-6 text-center">
          
          <div className="p-4 bg-[#00ffc8]/10 border border-[#00ffc8]/30 rounded-2xl flex items-center justify-between text-left text-[#00ffc8] text-xs shadow-[0_0_15px_rgba(0,255,200,0.1)]">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} />
              <span>Terima kasih telah mengisi form, harap lihat di status pendaftaran</span>
            </div>
            <button onClick={() => navigate('/peserta')} className="text-white hover:text-[#00ffc8] transition-colors font-bold ml-1">✕</button>
          </div>

          <div className="w-16 h-16 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,255,200,0.3)] my-4">
            <Check className="text-[#00ffc8]" size={28} strokeWidth={2.5} />
          </div>

          <h2 className="font-display text-xl font-bold text-white uppercase tracking-tight">Berhasil Mendaftar</h2>
          <p className="text-[#8B9A7A] text-xs max-w-xs mx-auto leading-relaxed">
            Submisi data formulir Anda telah dikirim dan sekarang masuk antrean validasi dokumen.
          </p>

          <Button 
            variant="solid" 
            onClick={() => navigate('/peserta')}
            className="w-full bg-[#00ffc8] hover:bg-[#00e6b5] text-[#020a06] font-bold rounded-xl py-3.5 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.3)] transition-all mt-4"
          >
            Lihat Status
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 2: FORM REGISTRATION STEPS
  // ==========================================
  return (
    <div ref={containerRef} className="max-w-3xl mx-auto space-y-8 animate-fade pb-10">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
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
          <div className="space-y-6 animate-fade">
            <div>
              <span className="text-[12px] font-mono font-bold tracking-widest text-[#00ffc8] uppercase">Tahap 1: Identitas & Kategori</span>
              <h2 className="font-display font-bold text-white text-base sm:text-lg mt-1">Beri tahu kami siapa Anda dan jalur inovasi mana yang Anda pilih.</h2>
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
                {lombaList
                  .filter((l) => l.status === 'buka')
                  .map((l) => (
                    <option key={l.id} value={l.id} className="bg-[#0D1E0D] text-white">{l.nama}</option>
                  ))}
              </Input>

              {/* Dynamically enabled inputs based on selection */}
              {formData.lomba_id && !isCTF && (
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

              {formData.lomba_id && isCTF && (
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
          <div className="space-y-6 animate-fade">
            <div>
              <span className="text-[12px] font-mono font-bold tracking-widest text-[#00ffc8] uppercase">Tahap 2: Anggota & Detail Tim</span>
              <h2 className="font-display font-bold text-white text-base sm:text-lg mt-1">Lengkapi data kelompok serta topik gagasan yang ingin Anda angkat.</h2>
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
                      placeholder="Khusus Web Dev, CTF"
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
          <div className="space-y-6 animate-fade">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] font-mono font-bold tracking-widest text-[#00ffc8] uppercase">Tahap 3: Unggah Berkas</span>
                <h2 className="font-display font-bold text-white text-base sm:text-lg mt-1">Unggah seluruh dokumen kelayakan untuk menyelesaikan pendaftaran.</h2>
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
                      : <span className="text-[#8B9A7A] text-[12px] block mt-0.5">PDF/JPG/PNG maks 500KB</span>
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
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          {syarat.file_template_url && (
                            <a
                              href={syarat.file_template_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-lg border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center whitespace-nowrap z-10 w-full sm:w-auto"
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
                              className="px-3 py-1.5 rounded-lg border border-[#00ffc8]/30 hover:border-[#00ffc8] text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center whitespace-nowrap z-10 w-full sm:w-auto"
                            >
                              <ExternalLink size={12} /> Kunjungi
                            </a>
                          )}
                        </div>
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
                Pastikan semua data dan berkas pendukung sudah diunggah dengan benar sebelum dikirim.
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
                disabled={!isFormValid()}
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
