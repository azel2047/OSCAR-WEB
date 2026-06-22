import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';
import Preloader from '@/components/Preloader';
import NebulaBg from '@/components/shared/NebulaBg';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import {
  ArrowRight, Code, Shield, PenTool, BarChart3, 
  Leaf, Zap, Users, Trophy, Check, Calendar
} from 'lucide-react';
import InteractiveSelector from '@/components/ui/interactive-selector';

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
  const [preloaderDone, setPreloaderDone] = useState(false);
  const heroCardRef = useRef(null);
  
  const { data: rawMitraData, request: fetchMitras } = useApi();
  const { data: rawTimelineData, request: fetchTimeline, isLoading: isLoadingTimeline } = useApi();
  const { data: rawLombaData, request: fetchLombas } = useApi();

  useEffect(() => {
    fetchMitras(() => api.get('/mitra'));
    fetchTimeline(() => api.get('/timeline'));
    fetchLombas(() => api.get('/lomba'));
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

      // 2. Float abstract right container
      if (heroCardRef.current) {
        gsap.to(heroCardRef.current, {
          y: -12,
          duration: 3.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }

      // 3. Section Scroll animations
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

    }, '.landing-root');

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <div className="landing-root bg-[#112C1E] text-white min-h-screen relative font-body overflow-hidden">
      
      {/* Preloader */}
      <Preloader onDone={() => setPreloaderDone(true)} />

      {/* Kunang-kunang Background */}
      <NebulaBg />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 sm:px-12 md:px-20 z-10">
        <div className="max-w-[1300px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col items-start gap-4">
            <div className="hero-stagger">
              <span className="px-3.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#70C492] border border-[#70C492]/40 bg-[#70C492]/10 rounded-full font-mono">
                RAINFOREST OF INNOVATION
              </span>
            </div>

            <div className="hero-stagger mt-1.5">
              <span className="text-[12px] font-bold text-white/50 tracking-wider uppercase font-mono">
                DENGAN SEMANGAT DIES NATALIS HIMA TI STT TERPADU NF
              </span>
            </div>
            
            <div className="hero-stagger mt-1">
              <h1 className="font-cyber font-black uppercase text-white tracking-tight leading-[1.05] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                OSCAR 3.0: Explore Nature, <br />
                <span className="text-[#70C492]" style={{ textShadow: '0 0 25px rgba(112, 196, 146, 0.3)' }}>
                  Create the Future
                </span>
              </h1>
            </div>

            <p className="hero-stagger text-white/60 text-base md:text-base leading-relaxed max-w-[500px] mt-2">
              Lestarikan alam, berinovasi di dunia digital. Bergabunglah dalam tantangan teknologi bergengsi bagi generasi inovator masa depan.
            </p>

            {/* Quick highlight tags to enrich left column (lebih berisi) */}
            <div className="hero-stagger flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-sm font-semibold text-white/80 hover:border-[#70C492]/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_#70C492]" />
                Hadiah Puluhan Juta
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-sm font-semibold text-white/80 hover:border-[#70C492]/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_#70C492]" />
                Tingkat Nasional
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-sm font-semibold text-white/80 hover:border-[#70C492]/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_#70C492]" />
                SMA/MA/SMK/D3/D4/S1 Sederajat
              </div>
            </div>

            <div className="hero-stagger mt-6">
              <Link to="/register">
                <button className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#70C492] text-[#112C1E] font-cyber font-extrabold text-sm tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(112,196,146,0.25)] transition-all">
                  Daftar Sekarang <ArrowRight size={15} />
                </button>
              </Link>
            </div>

            {/* Stats Counter Bar (F-01-A) */}
            <div className="hero-stagger grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-[500px] mt-8 pt-8 border-t border-white/[0.08]">
              <div className="flex flex-col">
                <span className="font-cyber font-black text-2xl text-[#70C492] tracking-wider">
                  <CountUp end={4} />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono mt-1">Cabang Lomba</span>
              </div>
              <div className="flex flex-col">
                <span className="font-cyber font-black text-2xl text-[#70C492] tracking-wider">
                  <CountUp end={500} suffix="+" />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono mt-1">Peserta</span>
              </div>
              <div className="flex flex-col">
                <span className="font-cyber font-black text-2xl text-[#70C492] tracking-wider">
                  <CountUp end={8} />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono mt-1">Mitra Resmi</span>
              </div>
              <div className="flex flex-col">
                <span className="font-cyber font-black text-2xl text-[#70C492] tracking-wider">
                  <CountUp end={3} />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono mt-1">Season</span>
              </div>
            </div>
          </div>

          {/* Right Column - Premium Cyber Rainforest HUD Panel */}
          <div className="flex items-center justify-center lg:justify-end">
            <div 
              ref={heroCardRef}
              className="w-full max-w-[480px] aspect-[4/3.2] rounded-3xl border border-[#70C492]/15 bg-gradient-to-br from-[#18412E]/60 to-[#153427]/30 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(112,196,146,0.02)] flex flex-col items-center justify-center p-8 relative overflow-hidden group hover:border-[#70C492]/45 transition-all duration-500 hover:shadow-[0_0_40px_rgba(112,196,146,0.1)]"
            >
              <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--primary) 1px, transparent 1px),
                    linear-gradient(90deg, var(--primary) 1px, transparent 1px)
                  `,
                  backgroundSize: '35px 35px'
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#70C492]/[0.02] blur-[80px]" />
              
              {/* Glowing decorative circular HUD */}
              <div className="w-36 h-36 rounded-full border border-dashed border-[#70C492]/35 flex items-center justify-center p-3 relative group-hover:scale-105 transition-transform duration-500 mb-6 z-10">
                <div className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full bg-[#70C492]/5 border border-dashed border-[#70C492]/20 flex items-center justify-center">
                  <span className="font-cyber font-black text-[#70C492] text-sm tracking-wider animate-pulse">OSC 3.0</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 flex flex-col gap-0.5 z-10">
                <span className="font-mono text-[12px] text-[#70C492] tracking-[0.2em] font-extrabold uppercase">
                  OSCAR 3.0 CYBER SYSTEM
                </span>
                <span className="font-cyber font-bold text-white/50 text-[12px] tracking-widest uppercase">
                  BIOLUMINESCENT TECH
                </span>
              </div>
            </div>
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
            <Link to="/register" className="mt-2">
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
      <section className="section-fade-up py-20 px-6 sm:px-12 md:px-20 relative z-10 border-t border-[#70C492]/10 bg-[#153427]/20">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <span className="font-mono text-[#70C492] text-[14px] tracking-widest font-extrabold uppercase">
              JADWAL PENTING
            </span>
            <h2 className="font-cyber font-black uppercase text-white tracking-tight text-3xl sm:text-4xl">
              Timeline <span className="text-[#70C492]">Interaktif</span>
            </h2>
            <p className="text-white/50 text-base sm:text-base max-w-[480px] leading-relaxed">
              Ikuti setiap tahapan kompetisi OSCAR 3.0 dari pendaftaran hingga penganugerahan pemenang.
            </p>
          </div>

          {/* Timeline Container */}
          {isLoadingTimeline ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-[#70C492] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative">
              {/* Desktop Horizontal Timeline */}
              <div className="hidden lg:block relative py-12 overflow-x-auto no-scrollbar">
                {/* Horizontal line connector */}
                <div className="absolute top-[84px] left-8 right-8 h-[2px] bg-white/[0.06] z-0" />
                {/* Active progress line connector */}
                <div 
                  className="absolute top-[84px] left-8 h-[2px] bg-[#70C492] shadow-[0_0_8px_#70C492] z-0 transition-all duration-500" 
                  style={{ width: `${timelineData.length > 1 ? Math.max(0, Math.min(100, (activeTimelineIndex / (timelineData.length - 1)) * 100)) : 0}%` }}
                />

                <div className="flex justify-between items-start min-w-[1000px] relative z-10 px-8">
                  {timelineData.map((stage, idx) => {
                    const isPassed = idx < activeTimelineIndex;
                    const isActive = idx === activeTimelineIndex;
                    
                    return (
                      <div key={stage.id || idx} className="flex flex-col items-center text-center w-[130px] group">
                        {/* Node */}
                        <div 
                          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 relative ${
                            isActive 
                              ? 'border-[#70C492] bg-[#112C1E] shadow-[0_0_20px_rgba(112,196,146,0.4)]' 
                              : isPassed 
                                ? 'border-[#70C492]/60 bg-[#70C492]/10 opacity-70' 
                                : 'border-white/10 bg-[#18412E]/40'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute inset-0 rounded-full border border-[#70C492] animate-ping opacity-75" />
                          )}
                          {isPassed ? (
                            <Check size={18} className="text-[#70C492]" />
                          ) : (
                            <span className={`font-cyber font-black text-sm ${isActive ? 'text-[#70C492]' : 'text-white/40'}`}>
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Date & Info */}
                        <span className={`font-mono text-[11px] font-bold tracking-wider mt-4 uppercase ${isActive ? 'text-[#70C492]' : 'text-white/40'}`}>
                          {formatDate(stage.tanggal)}
                        </span>
                        
                        <h4 className={`font-cyber font-black text-sm tracking-wide mt-2 uppercase max-w-[110px] leading-tight ${isActive ? 'text-white' : 'text-white/60'}`}>
                          {stage.nama}
                        </h4>
                        
                        {stage.waktu && (
                          <span className="font-mono text-[10px] text-white/30 mt-1 uppercase">
                            {stage.waktu}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Timeline */}
              <div className="lg:hidden relative pl-8 pr-4 space-y-12">
                {/* Vertical line connector */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/[0.06] z-0" />
                {/* Active progress line connector */}
                <div 
                  className="absolute left-[15px] top-4 w-[2px] bg-[#70C492] shadow-[0_0_8px_#70C492] z-0 transition-all duration-500" 
                  style={{ height: `${timelineData.length > 1 ? Math.max(0, Math.min(100, (activeTimelineIndex / (timelineData.length - 1)) * 100)) : 0}%` }}
                />

                {timelineData.map((stage, idx) => {
                  const isPassed = idx < activeTimelineIndex;
                  const isActive = idx === activeTimelineIndex;

                  return (
                    <div key={stage.id || idx} className="relative flex items-start gap-6 group">
                      {/* Node */}
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 z-10 flex-shrink-0 -ml-[23px] ${
                          isActive 
                            ? 'border-[#70C492] bg-[#112C1E] shadow-[0_0_15px_rgba(112,196,146,0.4)]' 
                            : isPassed 
                              ? 'border-[#70C492]/60 bg-[#70C492]/10 opacity-70' 
                              : 'border-white/10 bg-[#18412E]/40'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute inset-0 rounded-full border border-[#70C492] animate-ping opacity-75" />
                        )}
                        {isPassed ? (
                          <Check size={12} className="text-[#70C492]" />
                        ) : (
                          <span className={`font-cyber font-black text-xs ${isActive ? 'text-[#70C492]' : 'text-white/40'}`}>
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Content block */}
                      <div className="flex flex-col gap-1">
                        <span className={`font-mono text-[11px] font-bold tracking-wider uppercase ${isActive ? 'text-[#70C492]' : 'text-white/40'}`}>
                          {formatDate(stage.tanggal)} {stage.waktu && `• ${stage.waktu}`}
                        </span>
                        
                        <h4 className={`font-cyber font-black text-base tracking-wide uppercase ${isActive ? 'text-white' : 'text-white/70'}`}>
                          {stage.nama}
                        </h4>
                        
                        {stage.keterangan && (
                          <p className="text-[12px] text-white/40 leading-normal max-w-md mt-0.5">
                            {stage.keterangan}
                          </p>
                        )}
                      </div>
                    </div>
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
            DIES NATALIS 10 HIMA TI
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
                Dalam rangka memperingati Dies Natalis mdmpunan Mahasiswa Teknik Informatika (HIMA TI) ke-10 dengan bangga mempersembahkan gelaran perlombaan yang diberi nama OSCAR (Olimpiade Sains Dan Teknologi Terpadu). Gelaran yang memiliki tumbuh cahaya baru, menciptakan sebuah wadah untuk mengeksplorasi kemampuan dan semangat untuk berinovasi secara optimal.
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
                  EST. 2016
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
