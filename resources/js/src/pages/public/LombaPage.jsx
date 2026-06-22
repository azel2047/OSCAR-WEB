import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useLombaStore from '@/stores/lombaStore';
import { gsap } from '@/animations/gsapConfig';
import { 
  Code, PenTool, BarChart3, Shield, Sparkles,
  UserPlus, Calendar, UploadCloud, CheckCircle, Tv, Trophy
} from 'lucide-react';

const CABANG_ICONS = {
  'web-development': Code,
  'desain-poster': PenTool,
  'desain-infografis': BarChart3,
  'ctf': Shield,
};

const TIMELINE_EVENTS = [
  { left: '15 JUN - 5 AGUSTUS 2026', right: 'Pendaftaran', icon: UserPlus },
  { left: '8 AGUSTUS 2026', right: 'Pembukaan dan TM', icon: Calendar },
  { left: '1 SEPTEMBER 2026', right: 'Pengumpulan Karya', icon: UploadCloud },
  { left: '5 SEPTEMBER 2026', right: 'Pengumuman Top 10', icon: CheckCircle },
  { left: '6 SEPTEMBER 2026', right: 'Penilaian dan Presentasi', icon: Tv },
  { left: '9 SEPTEMBER 2026', right: 'Acara Puncak', icon: Trophy },
];

function LombaCard({ lomba }) {
  const Icon = CABANG_ICONS[lomba.slug] || Sparkles;

  return (
    <div className="group relative bg-[#18412E]/40 border border-dashed border-[#70C492]/20 p-8 rounded-2xl flex flex-col items-center justify-between h-[340px] transition-all duration-500 hover:border-[#70C492]/50 hover:shadow-[0_20px_50px_rgba(112,196,146,0.12)] hover:-translate-y-1 overflow-hidden">
      
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px'
        }}
      />
      
      <div className="flex flex-col items-center text-center w-full z-10">
        {/* Dashed Border Square Icon Container */}
        <div className="w-20 h-20 rounded-xl border border-dashed border-[#70C492]/35 bg-[#70C492]/[0.02] flex items-center justify-center text-[#70C492] mb-6 group-hover:scale-105 transition-all duration-300">
          <Icon size={28} className="drop-shadow-[0_0_10px_rgba(112,196,146,0.4)]" />
        </div>

        <h3 className="font-cyber font-bold text-white text-lg tracking-wide uppercase leading-tight mb-2 group-hover:text-[#70C492] transition-colors duration-300">
          {lomba.nama}
        </h3>
        
        <p className="font-mono text-[12px] uppercase tracking-widest text-white/40 mb-4">
          OSCAR 3.0 // COMPETITION ARENA
        </p>
      </div>

      <div className="w-full z-10">
        <a 
          href="/booklet-oscar3.pdf" 
          download 
          onClick={(e) => e.stopPropagation()} 
          className="w-full"
        >
          <button className="w-full py-2.5 text-center text-xs font-bold font-cyber text-[#70C492] hover:text-[#112C1E] bg-transparent hover:bg-[#70C492] border border-[#70C492]/40 hover:border-transparent rounded-xl transition-all uppercase tracking-widest">
            Download Booklet
          </button>
        </a>
      </div>
    </div>
  );
}

export default function LombaPage() {
  const { lombaList, isLoading, fetchLomba } = useLombaStore();
  const pageRef = useRef(null);

  useEffect(() => {
    fetchLomba();
  }, []);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      const items = el.querySelectorAll('.animate-in');
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out', stagger: 0.12, delay: 0.1, clearProps: 'filter' }
        );
      }

      // Sections scroll animation
      const sections = el.querySelectorAll('.section-fade-up');
      sections.forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 40 },
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
  }, [isLoading]);

  // Group lombas dynamically
  const mahasiswaLombas = (lombaList ?? []).filter(l => l.kategori === 'mahasiswa');
  const siswaLombas = (lombaList ?? []).filter(l => l.kategori === 'siswa');

  return (
    <div ref={pageRef} className="min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492] bg-[#112C1E]">
      
      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-16 px-6 sm:px-12 overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center relative z-20 flex flex-col items-center gap-4">
          <h1 
            className="animate-in font-cyber font-black text-[#70C492] tracking-tighter leading-none mb-4 uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl" 
            style={{ 
              textShadow: '0 0 35px rgba(112, 196, 146, 0.35)'
            }}
          >
            Arena Inovasi
          </h1>

          <p className="animate-in text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl font-body">
            Masuk medan pembuktian bioluminesens di mana teknologi bertemu kreativitas. Pilih domainmu dan tinggalkan jejak di Rainforest of Innovation.
          </p>
        </div>
      </section>

      {/* ── KATEGORI MAHASISWA SECTION ── */}
      <section className="section-fade-up px-6 sm:px-12 md:px-20 max-w-[1600px] mx-auto mb-20 relative z-10">
        <div className="border-b border-[#70C492]/20 pb-4 mb-10">
          <h2 className="font-cyber font-black text-white text-xl uppercase tracking-wider">
            Kategori Mahasiswa
          </h2>
        </div>

        {/* 1 Card for Mahasiswa CTF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mahasiswaLombas.map((lomba) => (
            <LombaCard key={lomba.id} lomba={lomba} />
          ))}
          {/* Visual fallback if DB lists are empty for CTF */}
          {mahasiswaLombas.length === 0 && (
            <LombaCard 
              lomba={{
                nama: 'CTF (Capture The Flag)',
                slug: 'ctf',
                kategori: 'mahasiswa'
              }} 
            />
          )}
        </div>
      </section>

      {/* ── KATEGORI SISWA SECTION ── */}
      <section className="section-fade-up px-6 sm:px-12 md:px-20 max-w-[1600px] mx-auto mb-32 relative z-10">
        <div className="border-b border-[#70C492]/20 pb-4 mb-10">
          <h2 className="font-cyber font-black text-white text-xl uppercase tracking-wider">
            Kategori Siswa SMA/SMK Sederajat
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siswaLombas.map((lomba) => (
            <LombaCard key={lomba.id} lomba={lomba} />
          ))}
          {/* Visual fallback if DB lists are empty for Siswa */}
          {siswaLombas.length === 0 && (
            <>
              <LombaCard lomba={{ nama: 'Web Development', slug: 'web-development', kategori: 'siswa' }} />
              <LombaCard lomba={{ nama: 'Infografis', slug: 'desain-infografis', kategori: 'siswa' }} />
              <LombaCard lomba={{ nama: 'Poster', slug: 'desain-poster', kategori: 'siswa' }} />
            </>
          )}
        </div>
      </section>

      {/* ── TIMELINE SECTION ── */}
      <section className="section-fade-up px-6 sm:px-12 md:px-20 max-w-[1100px] mx-auto mb-32 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-cyber font-black text-white text-4xl uppercase tracking-widest">
            Timeline
          </h2>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Line */}
          <div
            className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
            style={{ 
              background: 'linear-gradient(180deg, #70C492 0%, #008f75 100%)',
              boxShadow: '0 0 15px rgba(112, 196, 146, 0.2)'
            }}
          />

          <div className="space-y-12">
            {TIMELINE_EVENTS.map((t, i) => {
              const EventIcon = t.icon;
              return (
                <div
                  key={i}
                  className="relative flex items-center sm:justify-between w-full min-h-[50px]"
                >
                  {/* Glowing circle container with icon */}
                  <div
                    className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl border border-[#70C492]/40 z-20 flex-shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(112,196,146,0.25)] bg-[#112C1E]"
                  >
                    <EventIcon size={16} className="text-[#70C492]" />
                  </div>

                  {/* Left Column Text (Desktop: Date) */}
                  <div className="hidden sm:block w-[calc(50%-2.5rem)] text-right">
                    <p className="font-cyber font-bold text-base md:text-lg text-[#70C492] leading-normal uppercase">
                      {t.left}
                    </p>
                  </div>

                  {/* Right Column Text (Desktop: Title) */}
                  <div className="hidden sm:block w-[calc(50%-2.5rem)] text-left">
                    <p className="font-cyber font-bold text-base md:text-lg text-white leading-normal uppercase">
                      {t.right}
                    </p>
                  </div>

                  {/* Mobile Stacked Block (only visible on mobile) */}
                  <div className="sm:hidden ml-16 flex flex-col gap-1 w-[calc(100%-5.5rem)] text-left">
                    <p className="font-cyber font-bold text-sm text-[#70C492] leading-normal uppercase">
                      {t.left}
                    </p>
                    <p className="font-cyber font-bold text-base text-white leading-normal uppercase">
                      {t.right}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
