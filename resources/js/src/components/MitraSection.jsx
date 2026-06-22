import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';

const MITRA = [
  { nama: 'HIMATI', logo: '/images/logo/logo%20himati.png' },
  { nama: 'NFCC',   logo: '/images/logo/logo%20nfcc1.png'   },
  { nama: 'MUDENG', logo: '/images/logo/logo%20mudeng.png' },
  { nama: 'GDGOC STTNF', logo: '/images/logo/logo%20gdg.png' },
];

export default function MitraSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const initGsap = () => {
      return gsap.context(() => {
        const cards = gsap.utils.toArray('.mitra-card');
        const total = cards.length;

        // Lusion.co signature physics: initial stacked state with fan rotation and flipped back face (180deg)
        gsap.set(cards, (i) => ({
          x: (i - (total - 1) / 2) * 16,
          y: 120,
          rotation: (i - (total - 1) / 2) * 12,
          rotateY: 180,
          opacity: 0,
          scale: 0.85,
          transformOrigin: 'bottom center',
          zIndex: i
        }));

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            // Phase 1: Fan collect stack (still showing back face)
            gsap.to(cards, {
              x: 0,
              y: 80,
              rotation: (i) => (i - (total - 1) / 2) * 14,
              opacity: 1,
              scale: 0.9,
              duration: 0.45,
              ease: 'power3.out',
              stagger: { amount: 0.15, from: 'center' }
            });

            // Phase 2: Spread out to modern grid & spin reveal front face (rotateY: 0)
            gsap.to(cards, {
              x: 0,
              y: 0,
              rotation: 0,
              rotateY: 0,
              scale: 1,
              duration: 1.1,
              ease: 'expo.out',
              delay: 0.4,
              stagger: { amount: 0.4, from: 'center' }
            });
          }
        });
      }, sectionRef);
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-[120px] bg-[#112C1E] relative z-10 border-t border-[#70C492]/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#70C492]/10 border border-[#70C492]/20 mb-4">
            <span className="text-[#70C492] font-mono text-[12px] tracking-widest uppercase font-bold">
              🤝 ALIANSI TEKNOLOGI
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-white leading-none uppercase tracking-tighter">
            MITRA & <span className="text-[#70C492]" style={{ textShadow: '0 0 20px rgba(112,196,146,0.2)' }}>KOLABORATOR</span>
          </h2>
          <p className="text-[#7A9A8A] text-sm sm:text-base leading-relaxed mt-4">
            OSCAR berkolaborasi dengan jajaran pemangku kebijakan, perusahaan teknologi siber, dan lembaga riset nasional.
          </p>
        </div>

        {/* Card Grid with Perspective Wrappers */}
        <div className="mitra-grid grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto justify-items-center">
          {MITRA.map((mitra, idx) => (
            <div key={idx} className="mitra-flip-wrapper group">
              <div className="mitra-card">
                
                {/* BACK FACE — beautiful circular decorative circuitry pattern */}
                <div className="mitra-card-back">
                  <div className="card-back-pattern relative w-full h-full flex items-center justify-center p-4">
                    <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(112,196,146,0.15)" strokeWidth="1" />
                      <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(112,196,146,0.1)" strokeWidth="1" strokeDasharray="6 4" />
                      <circle cx="100" cy="100" r="54" fill="none" stroke="rgba(112,196,146,0.25)" strokeWidth="1.5" />
                      <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(112,196,146,0.06)" strokeWidth="1" />
                      <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(112,196,146,0.06)" strokeWidth="1" />
                    </svg>
                    <div className="card-back-logo font-display font-black text-xs tracking-[0.2em] text-[#70C492] z-10 select-none" style={{ textShadow: '0 0 10px rgba(112, 196, 146, 0.5)' }}>
                      OSCAR
                    </div>
                  </div>
                </div>

                {/* FRONT FACE — Full image logo centered beautifully in circular card */}
                <div className="mitra-card-front bg-[#18412E] border border-[rgba(112,196,146,0.15)] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:border-[#70C492]/60 group-hover:shadow-[0_0_40px_rgba(112,196,146,0.25)] overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-[#112C1E]/50 rounded-full p-8 transition-all duration-300 group-hover:bg-[#18412E]/40">
                    <img 
                      src={mitra.logo} 
                      alt={mitra.nama} 
                      className="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .mitra-flip-wrapper {
          perspective: 1000px;
          width: 220px;
          height: 220px;
        }

        .mitra-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateY(180deg);
          will-change: transform;
        }

        .mitra-card-back, .mitra-card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 50% !important; /* Isolated circular shape constraints */
        }

        .mitra-card-back {
          transform: rotateY(180deg);
          background: rgba(24, 65, 46, 0.9);
          border: 1px solid rgba(112, 196, 146, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mitra-card-front {
          transform: rotateY(0deg);
          border-radius: 50%;
        }

        @media (max-width: 640px) {
          .mitra-flip-wrapper {
            width: 160px;
            height: 160px;
          }
          .card-back-logo {
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
