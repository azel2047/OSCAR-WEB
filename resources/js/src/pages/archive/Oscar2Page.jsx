import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trophy, Calendar, Compass, Shield } from 'lucide-react';
import gsap from '@/animations/gsapConfig';
import { Gallery4 } from '@/components/ui/gallery4';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';

export default function Oscar2Page() {
  const containerRef = useRef(null);
  const { data: rawSeasonData, request: fetchSeason, isLoading } = useApi();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchSeason(() => api.get('/roadmap/oscar-2-0'));
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
        id: 'perluasan',
        title: 'Perluasan Jejaring',
        description: 'Menghubungkan ratusan tim berbakat untuk berkolaborasi dan bersaing dalam panggung nasional yang kompetitif.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'peningkatan',
        title: 'Peningkatan Kualitas',
        description: 'Menghadirkan standar seleksi ketat dan kredibel yang terkalibrasi dengan kebutuhan dunia industri.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'sejarah',
        title: 'Sejarah Kolaborasi',
        description: 'Mewujudkan integrasi sinergi yang solid antar komunitas, pakar riset, dan entitas akademik.',
        image: 'https://images.unsplash.com/photo-1556761175-b813d53a962e?auto=format&fit=crop&w=800&q=80',
      }
    ];
  }, [rawSeasonData]);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      
      // Sunset glow entrance
      gsap.fromTo(el.querySelectorAll('.animate-sunset'),
        { opacity: 0, y: 40, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out', stagger: 0.12 }
      );

      // Float animations for amber lights
      const lights = el.querySelectorAll('.floating-light');
      lights.forEach((light, i) => {
        gsap.to(light, {
          y: i % 2 === 0 ? -20 : 20,
          x: i % 2 === 0 ? 10 : -10,
          duration: 4 + i * 1.0,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.3
        });
      });
    }
  }, []);

  if (isLoading || !rawSeasonData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#112C1E] text-white">
        <div className="w-10 h-10 border-2 border-[#70C492] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen text-white font-body selection:bg-[#70C492]/30 selection:text-[#70C492] relative overflow-hidden bg-[#112C1E]"
    >
      {/* Sunset Horizon Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(112,196,146,0.12)_0%,transparent_60%)] pointer-events-none z-0" />
      
      {/* Sunset Horizon Floating Lights */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="floating-light absolute top-[20%] right-[12%] w-3 h-3 rounded-full bg-[#70C492] blur-[3px]" />
        <div className="floating-light absolute top-[50%] left-[8%] w-4 h-4 rounded-full bg-[#70C492] opacity-20 blur-[2px]" />
        <div className="floating-light absolute bottom-[30%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#70C492]/70 opacity-40 blur-[3px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Back button */}
        <Link 
          to="/roadmap" 
          className="animate-sunset inline-flex items-center gap-2 text-[#70C492]/70 hover:text-[#70C492] text-xs sm:text-sm uppercase tracking-wider font-mono transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={16} /> Kembali Ke Roadmap
        </Link>

        {/* Header Block */}
        <div className="animate-sunset space-y-4 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#70C492]/30 bg-[#70C492]/10 text-[#70C492] text-[12px] font-mono uppercase tracking-widest">
            <Compass size={12} className="animate-spin" style={{ animationDuration: '6s' }} /> Season 2.0 Archive
          </div>
          <h1 
            className="font-cyber font-black uppercase text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-none"
            style={{ textShadow: '0 0 35px rgba(112,196,146,0.4)' }}
          >
            CHASING THE<br />HORIZON
          </h1>
          <p className="text-white/50 max-w-2xl text-sm sm:text-base leading-relaxed mt-4">
            Menatap cakrawala penemuan yang tak berujung. Era kedua di mana kolaborasi antarsiswa-mahasiswa diperluas secara eksponensial guna mengejar batas terjauh sains dan inovasi masa depan.
          </p>
        </div>

        {/* Interactive Gallery */}
        <div className="animate-sunset mb-16">
          <Gallery4 
            title="Sorotan Utama 2.0" 
            description="Milestone penting yang ditorehkan pada edisi kedua OSCAR."
            items={dynamicItems}
          />
        </div>

        {/* Archive Timeline */}
        <div className="animate-sunset bg-[#18412E]/20 border border-[#70C492]/15 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.02)_0%,transparent_70%)] pointer-events-none" />
          <h2 className="font-cyber font-bold text-white text-xl uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sparkles size={18} className="text-[#70C492]" /> Lembar Arsip 2.0
          </h2>
          
          <div className="space-y-6 text-white/60 text-sm sm:text-base leading-relaxed">
            <p>
              Di era kedua ini, OSCAR mengangkat tema "Chasing the Horizon" yang berpusat pada penjelajahan tak kenal lelah untuk melampaui limitasi konvensional. Penekanan diletakkan pada kolaborasi tim yang harmonis guna melahirkan inovasi lintas disiplin.
            </p>
            <p className="italic text-[#70C492] border-l-2 border-[#70C492] pl-4 py-1 bg-[#70C492]/[0.02] rounded-r-md">
              "Kami merintis tapak-tapak baru ke arah cakrawala. Menyatukan asa dan tekad untuk selalu berlari lebih cepat mengejar impian."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
