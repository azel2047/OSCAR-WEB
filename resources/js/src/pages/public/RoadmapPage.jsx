import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '@/animations/gsapConfig';
import { Sparkles, Calendar, ChevronRight, ArrowRight, Eye } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';

const COLLABORATORS = [
  { name: 'MUDENG', logo: '/images/logo/logo mudeng.png' },
  { name: 'NFCC', logo: '/images/logo/logo nfcc1.png' },
  { name: 'GDG', logo: '/images/logo/logo gdg.png' }
];

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  if (value && value.data && Array.isArray(value.data.data)) return value.data.data;
  return [];
}

export default function RoadmapPage() {
  const pageRef = useRef(null);
  const { data: rawData, isLoading, request } = useApi();

  useEffect(() => {
    request(() => api.get('/roadmap'));
  }, []);

  const seasonsData = toArray(rawData);

  const milestones = seasonsData.map(s => {
    const isCurrent = s.slug === 'oscar-3-0';
    return {
      tag: s.nama,
      title: s.tema,
      desc: s.deskripsi,
      foto_utama_url: s.foto_utama_url,
      buttonText: isCurrent ? '' : `Jelajahi ${s.nama} ↗`,
      link: isCurrent ? '#' : (s.slug === 'oscar-1-0' ? '/archive/oscar-1' : '/archive/oscar-2'),
    };
  });

  useEffect(() => {
    if (isLoading || milestones.length === 0) return;

    const el = pageRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      const items = el.querySelectorAll('.animate-in');
      if (items?.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out', stagger: 0.12, delay: 0.1, clearProps: 'filter' }
        );
      }

      // Roadmap sections scroll
      const roadmapItems = el.querySelectorAll('.roadmap-step');
      roadmapItems.forEach((item, index) => {
        const textPart = item.querySelector('.step-text');
        const visualPart = item.querySelector('.step-visual');

        if (textPart) {
          gsap.fromTo(textPart,
            { opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (visualPart) {
          gsap.fromTo(visualPart,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });

      // Penyelenggara & Kolaborasi entrance
      const footerSections = el.querySelectorAll('.scroll-section');
      footerSections.forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

    }, pageRef);

    return () => ctx.revert();
  }, [isLoading, milestones.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#112C1E] text-white">
        <div className="w-10 h-10 border-2 border-[#70C492] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492] bg-[#112C1E]">
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-16 px-6 sm:px-12 overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center relative z-20 flex flex-col items-center">
          {/* Title */}
          <h1 
            className="animate-in font-cyber font-black text-[#70C492] tracking-tighter leading-none mb-6 uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ 
              textShadow: '0 0 30px rgba(112, 196, 146, 0.35)'
            }}
          >
            RAINFOREST OF INNOVATION
          </h1>

          <p className="animate-in text-white/50 max-w-2xl mx-auto text-base sm:text-base leading-relaxed font-body">
            Menelusuri evolusi OSCAR dari tunas digital perdana hingga menjadi kanopi bioluminesens inovasi masa kini. Jelajahi memori arsip kami dan jalur yang telah kami rintis.
          </p>
        </div>
      </section>

      {/* ── TIMELINE ALTERNATING STEPS ── */}
      <section className="py-20 px-6 sm:px-12 md:px-20 relative z-10 max-w-[1200px] mx-auto flex flex-col gap-24">
        {milestones.map((m, i) => (
          <div 
            key={i}
            className={`roadmap-step flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
              i % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Text Part */}
            <div className="step-text flex flex-col items-start gap-4 w-full lg:w-1/2">
              <span className="px-3.5 py-1 text-[12px] font-extrabold uppercase tracking-widest text-[#70C492] border border-[#70C492]/40 bg-[#70C492]/10 rounded-full font-mono leading-none">
                {m.tag}
              </span>
              
              <h2 className="font-cyber font-black text-white text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide leading-tight">
                {m.title}
              </h2>
              
              <div 
                className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-md font-body"
                dangerouslySetInnerHTML={{ __html: m.desc }}
              />

              {m.buttonText && (
                <Link to={m.link}>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#70C492] text-[#112C1E] font-extrabold font-cyber text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(112,196,146,0.2)] transition-all mt-2 animate-pulse">
                    {m.buttonText}
                  </button>
                </Link>
              )}
            </div>

            {/* Visual Part - Premium Illustrative Tech Cards */}
            <div className="step-visual w-full lg:w-1/2 flex items-center justify-center">
              <div className="w-full max-w-[420px] aspect-[16/10] rounded-2xl border border-dashed border-[#70C492]/20 bg-[#18412E]/20 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#70C492]/40 hover:bg-[#70C492]/[0.02] transition-all duration-300">
                <div className="absolute inset-0 bg-[#70C492]/[0.01] blur-2xl pointer-events-none" />
                
                {m.foto_utama_url ? (
                  <img 
                    src={m.foto_utama_url} 
                    alt={m.title} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center">
                    {m.tag === 'OSCAR 1.0' && (
                      <div className="flex flex-col gap-3 items-center z-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#70C492]/10 border border-[#70C492]/20 flex items-center justify-center text-[#70C492] mb-1 group-hover:scale-110 transition-transform duration-300">
                          <Sparkles size={22} className="animate-pulse" />
                        </div>
                        <span className="font-cyber font-black text-white text-base tracking-widest uppercase">OSCAR 1.0</span>
                        <div className="font-mono text-[12px] text-white/40 flex flex-col gap-0.5 items-center mt-1">
                          <span className="text-[#70C492] font-semibold">SOARING BEYOND LIMITS</span>
                          <span>FOTO</span>
                        </div>
                      </div>
                    )}

                    {m.tag === 'OSCAR 2.0' && (
                      <div className="flex flex-col gap-3 items-center z-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#70C492]/10 border border-[#70C492]/20 flex items-center justify-center text-[#70C492] mb-1 group-hover:scale-110 transition-transform duration-300">
                          <Calendar size={22} className="animate-pulse" />
                        </div>
                        <span className="font-cyber font-black text-white text-base tracking-widest uppercase">OSCAR 2.0</span>
                        <div className="font-mono text-[12px] text-white/40 flex flex-col gap-0.5 items-center mt-1">
                          <span className="text-[#70C492] font-semibold">HORIZON_EXPANSION</span>
                          <span>FOTO</span>
                        </div>
                      </div>
                    )}

                    {m.tag === 'OSCAR 3.0' && (
                      <div className="flex flex-col gap-3 items-center z-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#70C492]/15 border border-[#70C492]/40 flex items-center justify-center text-[#70C492] mb-1 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(112,196,146,0.25)]">
                          <Sparkles size={22} className="animate-spin-slow" />
                        </div>
                        <span className="font-cyber font-black text-[#70C492] text-base tracking-widest uppercase" style={{ textShadow: '0 0 15px rgba(112,196,146,0.2)' }}>OSCAR 3.0</span>
                        <div className="font-mono text-[12px] text-white/50 flex flex-col gap-0.5 items-center mt-1">
                          <span className="text-[#70C492] font-semibold">RAINFOREST</span>
                          <span>FOTO</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── PENYELENGGARA ── */}
      <section className="scroll-section py-16 px-6 sm:px-12 relative z-10 border-t border-white/[0.05]">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-8">
          <span className="font-mono text-[#70C492] text-[16px] tracking-widest font-extrabold uppercase">
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
      <section className="scroll-section py-16 px-6 sm:px-12 relative z-10 border-t border-white/[0.05]">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-8">
          <span className="font-mono text-[#70C492] text-[16px] tracking-widest font-extrabold uppercase">
            KOLABORASI
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center items-center">
            {COLLABORATORS.map((c, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-sm hover:border-[#70C492]/50 hover:bg-[#70C492]/[0.05] transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] h-[140px] sm:h-[160px] shadow-lg relative group hover:shadow-[0_0_35px_rgba(112,196,146,0.18)]"
              >
                <img 
                  src={c.logo} 
                  alt={c.name} 
                  className="max-h-[90%] max-w-[92%] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  onError={e => { e.target.style.display='none' }} 
                />
                <span className="absolute bottom-3 font-mono text-[12px] text-[#70C492]/80 tracking-wider font-semibold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
}
