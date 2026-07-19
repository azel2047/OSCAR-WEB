import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';

export default function GallerySection({ activeGalleryData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!activeGalleryData || activeGalleryData.length === 0) return;

    const initGsap = () => {
      return gsap.context(() => {
        const cards = gsap.utils.toArray('.gallery-flip-card');
        const total = cards.length;

        // Initial state: bertumpuk, rotasi fan
        gsap.set(cards, (i) => ({
          x: (i - (total - 1) / 2) * 12,
          y: 100,
          rotation: (i - (total - 1) / 2) * 5,
          opacity: 0,
          scale: 0.88,
          transformOrigin: 'bottom center',
          zIndex: i
        }));

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 72%',
          once: true,
          onEnter: () => {
            // Phase 1: kumpul di tengah dulu (0.5s)
            gsap.to(cards, {
              x: 0,
              y: 60,
              rotation: (i) => (i - (total - 1) / 2) * 9,
              opacity: 1,
              scale: 0.92,
              duration: 0.5,
              ease: 'power3.out',
              stagger: { amount: 0.2, from: 'center' }
            });

             // Phase 2: spread ke grid
             gsap.to(cards, {
               x: 0,
               y: 0,
               rotation: 0,
               rotateY: 0,
               scale: 1,
               duration: 1.0,
               ease: 'expo.out',
               delay: 0.4,
               stagger: { amount: 0.5, from: 'center' }
             });
          }
        });
      }, containerRef);
    };

    let ctx = initGsap();

    const handleDone = () => {
      if (ctx) ctx.revert();
      ctx = initGsap();
      ScrollTrigger.refresh();
    };

    window.addEventListener('preloader-done', handleDone);

    return () => {
      if (ctx) ctx.revert();
      window.removeEventListener('preloader-done', handleDone);
    };
  }, [activeGalleryData]);

  return (
    <section
      ref={containerRef}
      className="py-[120px] relative bg-[#112C1E]/40 z-10 border-t border-[#70C492]/10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header with clipPath reveal */}
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <span className="font-mono text-[#7A9A8A] text-xs tracking-[0.4em] uppercase font-bold block mb-4">
            📸 GALERI KEGIATAN
          </span>
          <h2 className="gallery-heading font-display text-4xl sm:text-6xl font-black text-white leading-none uppercase tracking-tighter">
            MOMEN <span className="text-[#70C492]" style={{ textShadow: '0 0 20px rgba(112,196,146,0.2)' }}>OSCAR</span>
          </h2>
        </div>

        {/* Grid layout */}
        <div className="gallery-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {activeGalleryData.map((item, idx) => (
            <div key={item.id || idx} className="gallery-flip-wrapper">
              <div className="gallery-flip-card">
                
                {/* BACK FACE — decorative pattern */}
                <div className="card-back">
                  <div className="card-back-pattern relative w-full h-full flex items-center justify-center p-6">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="20" width="260" height="360" fill="none" stroke="rgba(112,196,146,0.2)" strokeWidth="1" rx="8" />
                      <circle cx="150" cy="200" r="60" fill="none" stroke="rgba(112,196,146,0.3)" strokeWidth="1.5" />
                      <circle cx="150" cy="200" r="40" fill="none" stroke="rgba(112,196,146,0.2)" strokeWidth="1" />
                      <polygon points="150,60 220,200 150,340 80,200" fill="none" stroke="rgba(112,196,146,0.15)" strokeWidth="1" />
                      <rect x="30" y="30" width="20" height="20" fill="rgba(112,196,146,0.05)" rx="3" />
                      <rect x="250" y="30" width="20" height="20" fill="rgba(112,196,146,0.05)" rx="3" />
                      <rect x="30" y="350" width="20" height="20" fill="rgba(112,196,146,0.05)" rx="3" />
                      <rect x="250" y="350" width="20" height="20" fill="rgba(112,196,146,0.05)" rx="3" />
                    </svg>
                    <div className="card-back-logo font-display font-black text-2xl tracking-[0.2em] text-[#70C492] z-10 select-none" style={{ textShadow: '0 0 15px rgba(112, 196, 146, 0.6)' }}>
                      OSCAR
                    </div>
                  </div>
                </div>

                {/* FRONT FACE — konten gallery */}
                <div className="card-front bg-[#112C1E] border border-[rgba(112,196,146,0.15)] flex flex-col justify-between h-full group hover:border-[#70C492]/60 hover:shadow-[0_0_30px_rgba(112,196,146,0.25)] transition-all duration-300">
                  <div className="relative w-full overflow-hidden flex-1" style={{ height: '240px' }}>
                    {item.img ? (
                      <>
                        <img
                          src={item.img}
                          alt={item.judul}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#112C1E] via-transparent to-transparent opacity-90" />
                      </>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '240px',
                        background: 'linear-gradient(135deg, #18412E 0%, #70C492 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'rgba(112, 196, 146, 0.5)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.1em',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        {item.judul} — {item.tahun}
                      </div>
                    )}
                  </div>
                  <div className="p-6 relative z-10 bg-[#112C1E]">
                    <span className="font-mono text-[#70C492] text-[12px] uppercase tracking-wider block mb-2">
                      EVENT GALLERY
                    </span>
                    <h3 className="font-display font-bold text-white text-lg uppercase leading-snug mb-2">
                      {item.judul}
                    </h3>
                    <span className="font-mono text-xs text-[#7A9A8A]">
                      {item.tahun}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .gallery-flip-wrapper {
          perspective: 1000px;
          width: 380px;
          height: 480px;
        }

        .gallery-flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateY(180deg);
          will-change: transform;
        }

        .card-back, .card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .card-back {
          transform: rotateY(180deg);
          background: rgba(24, 65, 46, 0.9);
          border: 1px solid rgba(112, 196, 146, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-front {
          transform: rotateY(0deg);
          border-radius: 16px;
          overflow: hidden;
        }

        @media (max-width: 480px) {
          .gallery-flip-wrapper {
            width: 100%;
            height: 420px;
          }
        }
      `}</style>
    </section>
  );
}
