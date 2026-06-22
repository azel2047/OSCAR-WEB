import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trophy, Calendar, Globe, Rocket } from 'lucide-react';
import gsap from '@/animations/gsapConfig';
import { Gallery4 } from '@/components/ui/gallery4';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';

export default function Oscar1Page() {
  const containerRef = useRef(null);
  const { data: rawSeasonData, request: fetchSeason } = useApi();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchSeason(() => api.get('/roadmap/oscar-1-0'));
  }, []);

  const dynamicItems = useMemo(() => {
    const season = rawSeasonData?.data || rawSeasonData;
    if (season?.galeri && season.galeri.length > 0) {
      return season.galeri.map((g) => ({
        id: g.id.toString(),
        title: g.caption || '',
        description: '',
        image: g.url,
      }));
    }
    // Fallback Unsplash images
    return [
      {
        id: 'inisiasi',
        title: 'Inisiasi Perdana',
        description: 'Meluncurkan platform kompetisi sains terpadu yang diikuti oleh ratusan inovator muda se-Indonesia.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'trophy',
        title: 'Trophy Kejayaan',
        description: 'Melahirkan juara-juara tangguh dalam pilar inovasi sains terapan dan rekayasa teknologi.',
        image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'lintasan',
        title: 'Lintasan Sejarah',
        description: 'Diselenggarakan dengan komitmen penuh dedikasi sebagai peletak batu pertama ekosistem OSCAR.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      }
    ];
  }, [rawSeasonData]);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      
      // Cosmic glow entrance
      gsap.fromTo(el.querySelectorAll('.animate-cosmic'),
        { opacity: 0, y: 40, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out', stagger: 0.12 }
      );

      // Orbit animation for decorations
      const stars = el.querySelectorAll('.floating-star');
      stars.forEach((star, i) => {
        gsap.to(star, {
          y: i % 2 === 0 ? -15 : 15,
          duration: 3 + i * 0.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.2
        });
      });
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen text-white font-body selection:bg-[#70C492]/30 selection:text-[#70C492] relative overflow-hidden bg-[#112C1E]"
    >
      {/* Deep Space Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(112,196,146,0.12)_0%,transparent_60%)] pointer-events-none z-0" />
      
      {/* Galactic Floating Stars */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="floating-star absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-[#70C492] blur-[2px]" />
        <div className="floating-star absolute top-[40%] right-[15%] w-3.5 h-3.5 rounded-full bg-[#70C492] opacity-30 blur-[1px]" />
        <div className="floating-star absolute bottom-[25%] left-[20%] w-2.5 h-2.5 rounded-full bg-[#70C492]/70 opacity-40 blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Back button */}
        <Link 
          to="/roadmap" 
          className="animate-cosmic inline-flex items-center gap-2 text-[#70C492]/70 hover:text-[#70C492] text-xs sm:text-sm uppercase tracking-wider font-mono transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={16} /> Kembali Ke Roadmap
        </Link>

        {/* Header Block */}
        <div className="animate-cosmic space-y-4 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#70C492]/30 bg-[#70C492]/10 text-[#70C492] text-[12px] font-mono uppercase tracking-widest">
            <Rocket size={12} className="animate-bounce" /> Season 1.0 Archive
          </div>
          <h1 
            className="font-cyber font-black uppercase text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-none"
            style={{ textShadow: '0 0 35px rgba(112,196,146,0.4)' }}
          >
            SOARING BEYOND<br />EXPECTATIONS
          </h1>
          <p className="text-white/50 max-w-2xl text-sm sm:text-base leading-relaxed mt-4">
            Mengenang awal mula perjalanan gemilang olimpiade sains terpadu. Era perdana di mana gagasan sains dikombinasikan dengan ambisi tanpa batas untuk meluncur melampaui segala ekspektasi awal.
          </p>
        </div>

        {/* Interactive Gallery */}
        <div className="animate-cosmic mb-16">
          <Gallery4 
            title="Sorotan Utama 1.0" 
            description="Milestone penting yang ditorehkan pada edisi pertama OSCAR."
            items={dynamicItems}
          />
        </div>

        {/* Archive Timeline */}
        <div className="animate-cosmic bg-[#18412E]/20 border border-[#70C492]/15 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.02)_0%,transparent_70%)] pointer-events-none" />
          <h2 className="font-cyber font-bold text-white text-xl uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sparkles size={18} className="text-[#70C492]" /> Lembar Arsip 1.0
          </h2>
          
          <div className="space-y-6 text-white/60 text-sm sm:text-base leading-relaxed">
            <p>
              Pada musim perdana ini, OSCAR mengusung tema cosmic-futuristic yang mengeksplorasi batas-batas potensi sains teoritis dan praktis di kalangan pelajar. Menghubungkan tantangan global nyata dengan solusi teknologi masa depan yang inovatif.
            </p>
            <p className="italic text-[#70C492] border-l-2 border-[#70C492] pl-4 py-1 bg-[#70C492]/[0.02] rounded-r-md">
              "Di sinilah segalanya dimulai. Langkah berani pertama di mana mimpi-mimpi sains kita mulai menemukan sayapnya untuk melayang tinggi."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
