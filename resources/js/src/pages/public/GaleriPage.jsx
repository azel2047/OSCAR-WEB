import { useState, useEffect, useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';
import { staggerFadeUp } from '@/animations/textReveal';

import { Sparkles, Camera, ZoomIn } from 'lucide-react';

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  if (value && value.data && Array.isArray(value.data.data)) return value.data.data;
  return [];
}

export default function GaleriPage() {
  const [index, setIndex]       = useState(-1);
  const [selected, setSelected] = useState('all');
  const { data: rawData, isLoading, error, request } = useApi();
  const pageRef = useRef(null);
  const floatShapesRef = useRef([]);

  useEffect(() => {
    request(() => api.get('/galeri'));
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const items = pageRef.current?.querySelectorAll('.animate-in');
      if (items?.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out', stagger: 0.12, delay: 0.1, clearProps: 'filter' }
        );
      }

      // Floating shapes
      floatShapesRef.current.forEach((shape, i) => {
        if (!shape) return;
        gsap.to(shape, {
          y: -25,
          duration: 3 + i * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.3
        });
        gsap.to(shape, {
          rotation: i % 2 === 0 ? 12 : -12,
          duration: 6 + i * 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.2
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const galeriData = toArray(rawData);

  useEffect(() => {
    if (galeriData.length > 0) {
      setTimeout(() => staggerFadeUp('.galeri-item'), 100);
    }
  }, [galeriData.length, selected]);

  const seasons = [
    'all',
    ...new Set(galeriData.map((g) => g.season?.nama ?? 'Season')),
  ];

  const filtered =
    selected === 'all'
      ? galeriData
      : galeriData.filter((g) => g.season?.nama === selected);

  const slides = filtered.map((g) => ({ src: g.url }));

  return (
    <div ref={pageRef} className="min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492]">
      


      {/* Main Content */}
      <div className="relative z-10 bg-[#112C1E]">
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

        {/* ── HERO SECTION ── */}
        <section className="relative pt-36 pb-16 px-6 sm:px-12 overflow-hidden z-10">
          
          {/* Floating shapes */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div 
              ref={(el) => (floatShapesRef.current[0] = el)}
              className="absolute top-[18%] left-[8%] w-14 h-14 sm:w-22 sm:h-22 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
            />
            <div 
              ref={(el) => (floatShapesRef.current[1] = el)}
              className="absolute bottom-[20%] right-[6%] w-18 h-18 sm:w-28 sm:h-28 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
            />
          </div>

          <div className="max-w-[1600px] mx-auto relative z-20">
            {/* Badge */}
            <div className="animate-in mb-6 flex justify-center sm:justify-start">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#70C492]/10 border border-[#70C492]/30 shadow-[0_0_20px_rgba(112,196,146,0.15)]">
                <Camera size={12} className="text-[#70C492]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#70C492] font-bold">
                  MOMEN TERBAIK KAMI
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 
              className="animate-in font-display font-black text-white tracking-tighter leading-none mb-6 uppercase text-center sm:text-left"
              style={{ 
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                filter: 'drop-shadow(0 0 30px rgba(112,196,146,0.25))'
              }}
            >
              GALERI{' '}
              <span className="text-[#70C492]" style={{ textShadow: '0 0 30px rgba(112, 196, 146, 0.25)' }}>KOMPETISI</span>
            </h1>

            <p className="animate-in text-[#7A9A8A] text-sm sm:text-base leading-relaxed max-w-xl text-center sm:text-left">
              Saksikan rangkuman dokumentasi eksklusif, momen juang para delegasi hebat, serta kemeriahan panggung puncak OSCAR di setiap season.
            </p>
          </div>
        </section>

        {/* ── FILTER & GALLERY ── */}
        <section className="px-6 sm:px-12 pb-32 relative z-10 border-t border-[#70C492]/10 pt-12">
          <div className="max-w-[1600px] mx-auto">

            {/* Error state */}
            {error && !isLoading && (
              <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                Gagal memuat galeri. {error}
              </div>
            )}

            {/* Season filter tabs */}
            <div className="animate-in flex flex-wrap gap-3 mb-10">
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={`px-5 py-2.5 rounded-full font-display text-xs sm:text-sm font-bold transition-all duration-300 ${
                    selected === s
                      ? 'bg-[#70C492] text-[#112C1E] shadow-[0_0_20px_rgba(112,196,146,0.35)]'
                      : 'bg-[#18412E]/50 border border-[#70C492]/10 text-[#7A9A8A] hover:text-[#70C492] hover:bg-[#70C492]/10 hover:border-[#70C492]/30'
                  }`}
                >
                  {s === 'all' ? 'Semua Season' : s}
                </button>
              ))}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-[#18412E]/40 border border-[#70C492]/10 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32 bg-[#18412E]/40 border border-[#70C492]/10 rounded-2xl p-10">
                <p className="font-display text-6xl mb-6 opacity-30">📷</p>
                <p className="text-[#7A9A8A] text-base">
                  {galeriData.length === 0
                    ? 'Belum ada foto dokumentasi di galeri.'
                    : 'Tidak ada dokumentasi foto untuk season ini.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((item, i) => (
                  <button
                    key={item.id}
                    className="galeri-item aspect-square relative overflow-hidden rounded-2xl border border-[#70C492]/10 bg-[#18412E]/40 shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-[#70C492]/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(112,196,146,0.15)] transition-all duration-500 group"
                    onClick={() => setIndex(i)}
                  >
                    <img
                      src={item.url}
                      alt={item.keterangan ?? 'Galeri OSCAR'}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#112C1E]/0 group-hover:bg-[#112C1E]/50 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#70C492]/20 border border-[#70C492]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                        <ZoomIn size={20} className="text-[#70C492]" />
                      </div>
                    </div>

                    {item.keterangan && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#112C1E]/90 via-[#112C1E]/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-[#FFFFFF] text-xs font-body truncate font-semibold">{item.keterangan}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        styles={{
          container: { backgroundColor: 'rgba(17, 44, 30, 0.96)' },
        }}
      />
    </div>
  );
}
