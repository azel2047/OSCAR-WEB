import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';
import Preloader from '@/components/Preloader';
import NebulaBg from '@/components/shared/NebulaBg';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import useAuthStore from '@/stores/authStore';
import {
  ArrowRight, Code, Shield, PenTool, BarChart3, 
  Leaf, Zap, Users, Trophy, Check, Calendar,
  UserPlus, Clock, ClipboardCheck, Megaphone, Sparkles,
  Download
} from 'lucide-react';
import InteractiveSelector from '@/components/ui/interactive-selector';
import Floating, { FloatingElement } from '@/components/ui/parallax-floating';
import { TextRotate } from '@/components/ui/text-rotate';
import { LayoutGroup, motion } from 'framer-motion';
import SmoothScroll from '@/components/ui/smooth-scroll';

const ROADMAP_CARDS = [
  {
    num: '01',
    title: 'Soaring Beyond Expectations',
    deskripsi: 'Awal mula perjalanan digital melahirkan berbagai ekosistem kompetisi.'
  },
  {
    num: '02',
    title: 'Chasing The Horizon',
    deskripsi: 'Menjelajahi batas baru sains dan teknologi serta memperluas kreativitas peserta.'
  },
  {
    num: '03',
    title: 'Rainforest of Innovation',
    deskripsi: 'Ekosistem digital harmonis. Menyatukan teknologi dan alam dalam harmoni inovasi.'
  }
];

const COLLABORATORS_ITEMS = [
  { nama: 'NFCC', logo: '/images/logo/logo nfcc1.png' },
  { nama: 'MUDENG', logo: '/images/logo/logo mudeng.png' },
  { nama: 'GDG', logo: '/images/logo/logo gdg.png' }
];

const getTimelineIcon = (stageName) => {
  const name = stageName.toLowerCase();
  if (name.includes('buka') || (name.includes('daftar') && !name.includes('batas') && !name.includes('tutup'))) {
    return UserPlus;
  }
  if (name.includes('batas') || name.includes('tutup') || name.includes('deadline') || name.includes('akhir')) {
    return Clock;
  }
  if (name.includes('verifikasi') || name.includes('berkas') || name.includes('seleksi') || name.includes('kurasi')) {
    return ClipboardCheck;
  }
  if (name.includes('pengumuman') && name.includes('peserta')) {
    return Megaphone;
  }
  if (name.includes('pelaksanaan') || name.includes('lomba') || name.includes('kompetisi') || name.includes('tanding') || name.includes('mulai')) {
    return Code;
  }
  if (name.includes('pemenang') || name.includes('juara') || name.includes('pengumuman hasil')) {
    return Trophy;
  }
  if (name.includes('awarding') || name.includes('ceremony') || name.includes('penganugerahan') || name.includes('penutupan')) {
    return Sparkles;
  }
  return Calendar;
};

function CountUp({ end, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let cancelled = false;
    
    const step = (timestamp) => {
      if (cancelled) return;
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
    return () => {
      cancelled = true;
    };
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function LandingPage() {
  const [preloaderDone, setPreloaderDone] = useState(() => {
    return sessionStorage.getItem('visited') === 'true';
  });
  
  const { data: rawMitraData, request: fetchMitras } = useApi();
  const { data: rawTimelineData, request: fetchTimeline, isLoading: isLoadingTimeline } = useApi();
  const { data: rawLombaData, request: fetchLombas } = useApi();
  const { token } = useAuthStore();
  const isLoggedIn = !!token;
  const pendaftaranPath = isLoggedIn ? '/peserta/daftar' : '/register';
  const [bookletUrl, setBookletUrl] = useState('');

  useEffect(() => {
    fetchMitras(() => api.get('/mitra'));
    fetchTimeline(() => api.get('/timeline'));
    fetchLombas(() => api.get('/lomba'));

    api.get('/config/booklet_url')
      .then(res => {
        if (res.data?.success && res.data?.data?.value) {
          setBookletUrl(res.data.data.value);
        }
      })
      .catch(() => {});
  }, []);

  const dynamicMitras = React.useMemo(() => {
    if (!rawMitraData) return [];
    if (Array.isArray(rawMitraData)) return rawMitraData;
    if (Array.isArray(rawMitraData.data)) return rawMitraData.data;
    if (rawMitraData.data && Array.isArray(rawMitraData.data.data)) return rawMitraData.data.data;
    return [];
  }, [rawMitraData]);

  const timelineData = React.useMemo(() => {
    if (!rawTimelineData) return [];
    if (Array.isArray(rawTimelineData)) return rawTimelineData;
    if (Array.isArray(rawTimelineData.data)) return rawTimelineData.data;
    if (rawTimelineData.data && Array.isArray(rawTimelineData.data.data)) return rawTimelineData.data.data;
    return [];
  }, [rawTimelineData]);

  const activeTimelineIndex = React.useMemo(() => {
    if (timelineData.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dbActiveIdx = timelineData.findIndex(t => t.is_active);
    if (dbActiveIdx !== -1) return dbActiveIdx;
    
    for (let i = 0; i < timelineData.length; i++) {
      const stageDate = new Date(timelineData[i].tanggal);
      stageDate.setHours(0, 0, 0, 0);
      if (stageDate >= today) {
        return i;
      }
    }
    
    return timelineData.length - 1;
  }, [timelineData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderCard = (stage, idx, isActive, isPassed) => {
    return (
      <div 
        className={`w-full max-w-md p-6 sm:p-8 rounded-2xl border transition-all duration-355 relative bg-opacity-30 backdrop-blur-md group hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(112,196,146,0.06)] ${
          isActive
            ? 'border-[#70C492] bg-[#18412E]/60 shadow-[0_0_30px_rgba(112,196,146,0.18)]'
            : isPassed
              ? 'border-[#70C492]/20 bg-[#18412E]/20 opacity-80 hover:opacity-100 hover:border-[#70C492]/40'
              : 'border-white/[0.06] bg-[#18412E]/10 hover:border-[#70C492]/30'
        }`}
      >
        {/* Decorative Giant Number */}
        <span className="absolute bottom-3 right-6 text-7xl font-cyber font-black text-white/[0.03] select-none pointer-events-none transition-colors group-hover:text-white/[0.06]">
          {String(idx + 1).padStart(2, '0')}
        </span>
        
        {/* Active Label */}
        {isActive && (
          <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-[#70C492] text-[#112C1E] tracking-widest font-mono shadow-[0_0_15px_rgba(112,196,146,0.4)] animate-pulse">
            FASE AKTIF
          </span>
        )}

        {/* Date Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase ${
            isActive 
              ? 'bg-[#70C492]/20 text-[#70C492] border border-[#70C492]/30' 
              : 'bg-white/5 text-white/50 border border-white/10'
          }`}>
            <Calendar className="w-3 h-3" />
            {formatDate(stage.tanggal)}
          </div>
          
          {stage.waktu && (
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
              • {stage.waktu}
            </span>
          )}
        </div>

        {/* Stage Title */}
        <h3 className={`font-cyber font-black text-lg sm:text-xl tracking-wider uppercase leading-snug mb-3 ${isActive ? 'text-[#70C492]' : 'text-white/80 group-hover:text-white transition-colors'}`}>
          {stage.nama}
        </h3>

        {/* Stage Description */}
        {stage.keterangan && (
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed border-t border-white/[0.06] pt-3">
            {stage.keterangan}
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    const onDone = () => {
      setPreloaderDone(true);
      setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('preloader-done', onDone);
    return () => window.removeEventListener('preloader-done', onDone);
  }, []);

  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {
      // 1. Hero fade-up entrance
      gsap.from('.hero-stagger', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out'
      });

      // 2. Section Scroll animations
      document.querySelectorAll('.section-fade-up').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });

      // 3. Scroll Parallax for Hero Logos
      const heroSec = document.querySelector('.hero-section');
      if (heroSec) {
        gsap.to('.parallax-logo-2', {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSec,
            start: 'top top',
            end: 'bottom top',
            scrub: 0
          }
        });
        gsap.to('.parallax-logo-5', {
          yPercent: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSec,
            start: 'top top',
            end: 'bottom top',
            scrub: 0
          }
        });
      }

    }, '.landing-root');

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <div className="landing-root bg-[#112C1E] text-white min-h-screen relative font-body overflow-hidden">
      
      {/* Kunang-kunang Background */}
      <NebulaBg />

      {/* ── NEW HERO SECTION (PARALLAX + TEXT ROTATE) ── */}
      <section className="hero-section w-full min-h-screen flex flex-col items-center justify-center relative pt-24 pb-16 px-6 sm:px-12 md:px-20 z-10 overflow-hidden md:overflow-visible">
        
        {/* Subtle repeating mascot background pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
          style={{
            backgroundImage: "url('/images/logo/maskot.png'), url('/images/logo/maskot.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '160px 160px',
            backgroundPosition: '0 0, 80px 80px',
          }}
        />
        
        {/* Mouse Follow Floating Parallax Logos */}
        <Floating className="absolute inset-0 h-full w-full pointer-events-none hidden md:block z-0 overflow-hidden" sensitivity={1.2}>
          
          <FloatingElement depth={1.0} className="absolute top-[0%] left-[6%] md:top-[4%] md:left-[9%]">
            <div className="parallax-logo-2">
              <motion.img
                src="/images/logo/maskot3.png"
                alt="OSCAR 3.0 Mascot"
                className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-12 drop-shadow-[0_0_25px_rgba(112,196,146,0.2)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              />
            </div>
          </FloatingElement>

          <FloatingElement depth={2.5} className="absolute top-[75%] left-[78%] md:top-[65%] md:left-[80%]">
            <div className="parallax-logo-5">
              <motion.img
                src="/images/logo/maskot2.png"
                alt="OSCAR 3.0 Mascot"
                className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain hover:scale-105 duration-200 cursor-pointer transition-transform drop-shadow-[0_0_35px_rgba(112,196,146,0.3)] rotate-[19deg]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              />
            </div>
          </FloatingElement>

        </Floating>

        {/* Content Box */}
        <div className="flex flex-col justify-center items-center w-full max-w-[850px] z-20 pointer-events-auto text-center">
          
          <div className="hero-stagger mb-3">
            <span className="px-3.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#70C492] border border-[#70C492]/40 bg-[#70C492]/10 rounded-full font-mono">
              RAINFOREST OF INNOVATION
            </span>
          </div>

          <div className="hero-stagger mb-6">
            <span className="text-[12px] font-bold text-white/50 tracking-wider uppercase font-mono">
              DENGAN SEMANGAT DIES NATALIS HIMA TI STT TERPADU NF
            </span>
          </div>

          <motion.h1
            className="font-cyber font-black uppercase text-white tracking-tight leading-[1.1] text-3xl sm:text-5xl md:text-6xl lg:text-7xl flex flex-col items-center justify-center space-y-1 md:space-y-2"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
          >
            <span>OSCAR 3.0: EXPLORE</span>
            <LayoutGroup>
              <motion.span layout className="flex whitespace-pre justify-center items-center">
                <TextRotate
                  texts={[
                    "NATURE",
                    "INNOVATION",
                    "TECHNOLOGY",
                    "THE FUTURE",
                    "CREATIVITY",
                    "HARMONY",
                  ]}
                  mainClassName="overflow-hidden pr-3 text-[#70C492] py-0 pb-1 rounded-xl"
                  staggerDuration={0.03}
                  staggerFrom="last"
                  rotationInterval={3000}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              </motion.span>
            </LayoutGroup>
          </motion.h1>

          <motion.p
            className="text-white/60 text-base md:text-lg leading-relaxed max-w-[620px] mt-6 font-body"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
          >
            Lestarikan alam, berinovasi di dunia digital. Bergabunglah dalam tantangan teknologi bergengsi bagi generasi inovator masa depan.
          </motion.p>

          {/* Quick highlight tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-sm font-semibold text-white/80 hover:border-[#70C492]/40 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_#70C492]" />
              Hadiah Menarik
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-sm font-semibold text-white/80 hover:border-[#70C492]/40 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_#70C492]" />
              Tingkat Nasional
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-sm font-semibold text-white/80 hover:border-[#70C492]/40 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_#70C492]" />
              MAHASISWA STT NF / SMA / SMK / Sederajat
            </div>
          </div>

          <div className="flex flex-row justify-center space-x-4 items-center mt-10">
            <motion.button
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#70C492] text-[#112C1E] font-cyber font-extrabold text-sm tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(112,196,146,0.25)] transition-all"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", damping: 30, stiffness: 400 },
              }}
            >
              <Link to={pendaftaranPath} className="flex items-center gap-2">
                Daftar Sekarang <ArrowRight size={15} />
              </Link>
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#70C492]/40 text-[#70C492] hover:border-[#70C492] hover:bg-[#70C492]/10 font-cyber font-bold text-sm tracking-wider transition-all cursor-pointer"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", damping: 30, stiffness: 400 },
              }}
              onClick={() => {
  if (bookletUrl) {
    let isSameOrigin = false;
    // Tambahkan timestamp agar browser selalu mengambil file paling baru dari server
    const separator = bookletUrl.includes('?') ? '&' : '?';
    const freshBookletUrl = `${bookletUrl}${separator}t=${new Date().getTime()}`;

    try {
      const urlObj = new URL(freshBookletUrl, window.location.origin);
      isSameOrigin = urlObj.origin === window.location.origin;
    } catch (e) {}

    if (isSameOrigin) {
      const link = document.createElement('a');
      link.href = freshBookletUrl;
      link.setAttribute('download', 'Booklet_OSCAR_3.0.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(freshBookletUrl, '_blank');
    }
  } else {
    // Jika masuk ke sini, artinya state bookletUrl dari database/API belum masuk ke komponen ini
    console.warn("Peringatan: bookletUrl kosong, mengunduh file aset bawaan.");
    const link = document.createElement('a');
    link.href = `/booklet-oscar3.pdf?t=${new Date().getTime()}`;
    link.setAttribute('download', 'Booklet_OSCAR_3.0.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}}
            >
              Download Booklet <Download size={15} />
            </motion.button>
          </div>

        </div>
      </section>

      {/* ── KATEGORI PESERTA BANNER ── */}
      <section className="section-fade-up py-8 px-6 sm:px-12 md:px-20 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-[#70C492]/15 bg-[#18412E]/40 shadow-lg">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <span className="font-mono text-[#70C492] text-[16px] tracking-widest font-extrabold uppercase">
                KATEGORI PESERTA
              </span>
              <h2 className="font-display font-bold text-white text-lg md:text-xl uppercase tracking-wider">
                Mahasiswa dan Siswa SMA/SMK Sederajat
              </h2>
            </div>
            <Link 
              to="/lomba"
              className="flex items-center gap-1.5 text-xs font-bold text-[#70C492] hover:text-white transition-colors uppercase font-cyber group"
            >
              Jelajahi Lomba <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── JEJAK INOVASI / ROADMAP PREVIEW ── */}
      <section className="section-fade-up py-20 px-6 sm:px-12 md:px-20 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-cyber font-black uppercase text-white tracking-tight leading-none text-2xl sm:text-3xl md:text-4xl">
                Jejak Inovasi <span className="text-[#70C492]">(Roadmap)</span>
              </h2>
            </div>
            
            <Link to="/roadmap">
              <button className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-[#70C492]/40 text-[#70C492] hover:border-[#70C492] hover:bg-[#70C492]/10 font-cyber font-bold text-xs uppercase tracking-wider transition-all">
                Lihat Roadmap Lengkap <ArrowRight size={12} />
              </button>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAP_CARDS.map((card, i) => (
              <div 
                key={i}
                className="p-8 rounded-2xl border border-[#70C492]/15 bg-[#18412E]/40 flex flex-col justify-between h-[280px] shadow-md relative overflow-hidden group hover:border-[#70C492]/35 transition-all duration-300"
              >
                <div>
                  <span className="font-mono text-[#70C492]/40 font-bold text-sm tracking-wide block mb-4 group-hover:text-[#70C492]/80 transition-colors">
                    {card.num}
                  </span>
                  
                  <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide mb-3 leading-snug">
                    {card.title}
                  </h3>
                  
                  <p className="text-white/50 text-xs leading-relaxed max-w-[280px]">
                    {card.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── EKOSISTEM KOMPETISI SECTION ── */}
      <section className="section-fade-up py-20 px-6 sm:px-12 md:px-20 relative z-10 border-y border-[#70C492]/10 bg-[#153427]/30">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <h2 className="font-cyber font-black uppercase text-white tracking-tight text-3xl sm:text-4xl">
              Ekosistem <span className="text-[#70C492]">Kompetisi</span>
            </h2>
            <p className="text-white/50 text-base sm:text-base max-w-[420px] leading-relaxed">
              Pilih jalur kompetisi digital dalam empat disiplin ilmu kami.
            </p>
            <Link to={pendaftaranPath} className="mt-2">
              <button className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#70C492] text-[#112C1E] hover:brightness-110 font-cyber font-bold text-xs uppercase tracking-wider transition-all">
                Daftarkan Diri Sekarang <ArrowRight size={12} />
              </button>
            </Link>
          </div>

          {/* Interactive Selector */}
          <InteractiveSelector lombas={rawLombaData?.data || rawLombaData} />

        </div>
      </section>

      {/* ── TIMELINE INTERAKTIF (F-01-E) ── */}
      <section className="section-fade-up py-24 px-6 sm:px-12 md:px-20 relative z-10 border-t border-[#70C492]/10 bg-gradient-to-b from-[#112C1E] via-[#153427]/30 to-[#112C1E]">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <span className="font-mono text-[#70C492] text-sm tracking-[0.2em] font-extrabold uppercase bg-[#70C492]/10 px-3 py-1 rounded-full border border-[#70C492]/20">
              JADWAL PENTING
            </span>
            <h2 className="font-cyber font-black uppercase text-white tracking-tight text-3xl sm:text-4xl md:text-5xl">
              Timeline <span className="text-[#70C492]">Interaktif</span>
            </h2>
            <p className="text-white/50 text-base sm:text-base max-w-[500px] leading-relaxed">
              Ikuti setiap tahapan kompetisi OSCAR 3.0 dari pendaftaran hingga penganugerahan pemenang.
            </p>
          </div>

          {/* Timeline Container */}
          {isLoadingTimeline ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-2 border-[#70C492] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative max-w-5xl mx-auto py-12 px-4">
              
              {/* Connector Track Lines */}
              {/* Desktop center line */}
              <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-[3px] bg-white/[0.04] rounded-full z-0">
                <div 
                  className="w-full bg-gradient-to-b from-[#70C492] via-[#70C492]/80 to-[#79C199]/40 shadow-[0_0_12px_#70C492] transition-all duration-1000 rounded-full" 
                  style={{ height: `${timelineData.length > 1 ? (activeTimelineIndex / (timelineData.length - 1)) * 100 : 0}%` }}
                />
              </div>

              {/* Mobile left line */}
              <div className="lg:hidden absolute left-[24px] -translate-x-1/2 top-8 bottom-8 w-[2px] bg-white/[0.04] rounded-full z-0">
                <div 
                  className="w-full bg-[#70C492] shadow-[0_0_8px_#70C492] transition-all duration-1000 rounded-full" 
                  style={{ height: `${timelineData.length > 1 ? Math.max(0, Math.min(100, (activeTimelineIndex / (timelineData.length - 1)) * 100)) : 0}%` }}
                />
              </div>

              {/* Timeline Items */}
              <div className="relative z-10 flex flex-col w-full">
                {timelineData.map((stage, idx) => {
                  const isPassed = idx < activeTimelineIndex;
                  const isActive = idx === activeTimelineIndex;
                  const IconComponent = getTimelineIcon(stage.nama);
                  
                  return (
                    <motion.div 
                      key={stage.id || idx}
                      className="relative flex flex-col lg:flex-row items-center w-full mb-12 lg:mb-16"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                      {/* Left Side (Desktop: Card, Mobile: Card) */}
                      {idx % 2 === 0 ? (
                        <div className="w-full lg:w-1/2 pl-16 pr-4 lg:pl-4 lg:pr-12 flex justify-start lg:justify-end order-2 lg:order-1">
                          {renderCard(stage, idx, isActive, isPassed)}
                        </div>
                      ) : (
                        <div className="hidden lg:block lg:w-1/2 lg:order-1" />
                      )}

                      {/* Central Node */}
                      <div className="absolute left-[24px] lg:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20 order-1 lg:order-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative ${
                          isActive
                            ? 'border-[#70C492] bg-[#112C1E] shadow-[0_0_20px_rgba(112,196,146,0.5)] scale-110'
                            : isPassed
                              ? 'border-[#70C492] bg-[#18412E] shadow-[0_0_10px_rgba(112,196,146,0.15)]'
                              : 'border-white/10 bg-[#112C1E]'
                        }`}>
                          {isActive && (
                            <span className="absolute inset-0 rounded-full border border-[#70C492] animate-ping opacity-75" />
                          )}
                          <IconComponent className={`w-5 h-5 ${isActive || isPassed ? 'text-[#70C492]' : 'text-white/30'}`} />
                        </div>
                      </div>

                      {/* Right Side (Desktop: Card, Mobile: Card) */}
                      {idx % 2 !== 0 ? (
                        <div className="w-full lg:w-1/2 pl-16 pr-4 lg:pl-12 lg:pr-4 flex justify-start order-3">
                          {renderCard(stage, idx, isActive, isPassed)}
                        </div>
                      ) : (
                        <div className="hidden lg:block lg:w-1/2 lg:order-3" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ── AKAR DARI KEUNGGULAN SECTION ── */}
      <section className="section-fade-up py-20 px-6 sm:px-12 md:px-20 relative z-10 max-w-[1600px] mx-auto">
        
        <div className="flex flex-col gap-3 mb-12">
          <span className="font-mono text-[#70C492] text-[14px] tracking-widest font-extrabold uppercase">
            DIES NATALIS 3 HIMA TI
          </span>
          <h2 className="font-cyber font-black uppercase text-white tracking-tight text-3xl sm:text-4xl leading-none">
            Akar dari <span className="text-[#70C492]">Keunggulan</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side */}
          <div className="flex flex-col gap-6">
            {/* Glowing Card "apa itu oscar?" */}
            <div className="p-8 rounded-2xl border border-[#70C492]/15 bg-[#18412E]/40 shadow-md">
              <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase block mb-3 text-center">
                apa itu oscar?
              </span>
              <p className="text-white/60 text-md leading-relaxed text-center font-body">
                Dalam rangka memperingati Dies Natalis Himpunan Mahasiswa Teknik Informatika (HIMA TI) ke-3 dengan bangga mempersembahkan gelaran perlombaan yang diberi nama OSCAR (Olimpiade Sains Dan Teknologi Terpadu). Gelaran yang memiliki tumbuh cahaya baru, menciptakan sebuah wadah untuk mengeksplorasi kemampuan dan semangat untuk berinovasi secara optimal.
              </p>
            </div>

            {/* Description Subtext */}
            <div className="flex flex-col gap-4 mt-2">
              <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase block leading-none">
                Ke-3 Tahun
              </span>
              <p className="text-white/60 text-md leading-relaxed">
                Lomba Oscar ketiga kali ini mengusung tema Rainforest of Innovation untuk mahasiswa, siswa SMA/SMK sederajat untuk mengembangkan kreativitas dan kemampuan mereka dalam dunia sains dan teknologi.
              </p>
              <p className="text-white/60 text-md leading-relaxed">
                Kami berharap dapat membawa tema yang penuh dengan inovasi, menghubungkannya dengan melestarikan alam, menciptakan jaringan dan pengalaman yang bermanfaat bagi perkembangan karir peserta di masa depan.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-6">
            
            {/* Filosofi Card */}
            <div className="p-8 rounded-2xl border border-[#70C492]/15 bg-[#18412E]/40 shadow-md flex flex-col gap-6">
              <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase block text-center">
                FILOSOFI SEBAGAI INOVATOR
              </span>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#70C492]/10 flex items-center justify-center text-[#70C492] flex-shrink-0 mt-0.5">
                    <Leaf size={16} />
                  </div>
                  <div>
                    <h4 className="font-cyber font-bold text-white text-lg tracking-wider uppercase mb-1">
                      Rainforest
                    </h4>
                    <p className="text-white/50 text-md leading-relaxed">
                      Harmonisasi antara teknologi dan alam, merefleksikan kepedulian terhadap kelestarian alam sekitar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#70C492]/10 flex items-center justify-center text-[#70C492] flex-shrink-0 mt-0.5">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h4 className="font-cyber font-bold text-white text-lg tracking-wider uppercase mb-1">
                      Inovasi
                    </h4>
                    <p className="text-white/50 text-md leading-relaxed">
                      Selalu mencari solusi alternatif yang cerdas dan efisien bagi tantangan teknologi di era digital.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistik Card */}
            <div className="p-8 rounded-2xl border border-[#70C492]/15 bg-[#18412E]/40 shadow-md flex flex-col gap-6">
              <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase block text-center">
                STATISTIK PERTAMA
              </span>

              <div className="grid grid-cols-2 gap-6 divide-x divide-[#70C492]/10">
                <div className="flex flex-col items-center justify-center text-center gap-1.5">
                  <span className="font-cyber font-black text-2xl sm:text-2xl text-[#70C492]">200+</span>
                  <p className="text-white/50 text-sm leading-normal max-w-[120px]">
                    Siswa & Mahasiswa berpartisipasi dalam olimpiade tahun lalu.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center text-center gap-1.5 pl-6">
                  <span className="font-cyber font-black text-2xl sm:text-2xl text-[#70C492] uppercase tracking-wide">Uang Tunai</span>
                  <p className="text-white/50 text-md leading-normal max-w-[120px]">
                    Total hadiah pembinaan bernilai puluhan juta rupiah.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>  

      {/* ── PENYELENGGARA ── */}
      <section className="section-fade-up py-16 px-6 sm:px-12 md:px-20 relative z-10 border-t border-white/[0.05]">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-8">
          <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase">
            PENYELENGGARA
          </span>
          
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-sm hover:border-[#70C492]/50 hover:bg-[#70C492]/[0.05] transition-all duration-300 w-full max-w-[360px] h-[160px] sm:h-[180px] shadow-lg relative group hover:shadow-[0_0_35px_rgba(112,196,146,0.18)]">
              {/* Green circular logo badge inside card */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#70C492]/40 bg-[#18412E]/60 flex items-center justify-center p-[3px] shadow-[0_0_20px_rgba(112,196,146,0.25)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300 mr-6 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[#112C1E] flex items-center justify-center p-2">
                  <img 
                    src="/images/logo/logo himati.png" 
                    alt="HIMA TI Logo" 
                    className="max-h-full max-w-full object-contain"
                    onError={e => { e.target.style.display='none' }} 
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-1 z-10">
                <span className="font-mono text-[#70C492] text-[12px] tracking-widest font-extrabold uppercase">
                  HOST ORGANIZER
                </span>
                <h4 className="font-cyber font-black text-white text-xs sm:text-sm uppercase tracking-wider leading-tight">
                  HIMA TI STT TERPADU NF
                </h4>
                <span className="font-mono text-[12px] text-white/40 uppercase">
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KOLABORASI ── */}
      <section className="section-fade-up py-16 px-6 sm:px-12 md:px-20 relative z-10 border-t border-white/[0.05]">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-8">
          <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase">
            KOLABORASI
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center items-center">
            {COLLABORATORS_ITEMS.map((c, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-sm hover:border-[#70C492]/50 hover:bg-[#70C492]/[0.05] transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] h-[140px] sm:h-[160px] shadow-lg relative group hover:shadow-[0_0_35px_rgba(112,196,146,0.18)]"
              >
                <img 
                  src={c.logo} 
                  alt={c.nama} 
                  className="max-h-[90%] max-w-[92%] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  onError={e => { e.target.style.display='none' }} 
                />
                <span className="absolute bottom-3 font-mono text-[12px] text-[#70C492]/80 tracking-wider font-semibold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  {c.nama}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DYNAMIC SPONSOR & MITRA RESMI ── */}
      {dynamicMitras.length > 0 && (
        <section className="section-fade-up py-16 px-6 sm:px-12 md:px-20 relative z-10 border-t border-white/[0.05] bg-[#143124]/30">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-8">
            <div className="flex flex-col items-center text-center gap-1">
              <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase">
                SPONSOR & MITRA RESMI
              </span>
              <p className="text-white/40 text-base sm:text-base font-semibold max-w-md">
                 Klik Gambar Untuk Masuk ke Halaman Sponsor, Jangan Lupa Follow Ya!!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl w-full justify-items-center items-center mt-4">
              {dynamicMitras.map((m) => {
                const CardWrapper = m.website_url ? 'a' : 'div';
                const wrapperProps = m.website_url 
                  ? { href: m.website_url, target: '_blank', rel: 'noopener noreferrer' } 
                  : {};

                return (
                  <CardWrapper
                    key={m.id}
                    {...wrapperProps}
                    className="flex items-center justify-center p-6 sm:p-8 rounded-2xl border border-[#70C492]/20 bg-white/[0.03] backdrop-blur-sm hover:border-[#70C492]/60 hover:bg-[#70C492]/[0.05] transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] h-[140px] sm:h-[160px] shadow-lg relative group hover:shadow-[0_0_35px_rgba(112,196,146,0.18)] cursor-pointer"
                  >
                    <img 
                      src={m.logo_url} 
                      alt={m.nama} 
                      className="max-h-[90%] max-w-[92%] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      onError={e => { e.target.style.display='none' }} 
                    />
                    <span className="absolute bottom-3 font-mono text-[12px] text-[#70C492]/80 tracking-wider font-semibold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      {m.nama}
                    </span>
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
