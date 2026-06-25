import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';
import { staggerFadeUp } from '@/animations/textReveal';

import { Mail, MapPin, Instagram, Sparkles, BookOpen, Target, Eye } from 'lucide-react';

const FAQ = [
  { q: 'Siapa yang bisa mengikuti kompetisi OSCAR 3.0?', a: 'Seluruh mahasiswa aktif jenjang D3/D4/S1/S2 dari seluruh perguruan tinggi negeri maupun swasta di Indonesia.' },
  { q: 'Apakah ada biaya yang dikenakan dalam pendaftaran?',   a: 'Sama sekali tidak. Seluruh rangkaian pendaftaran cabang kompetisi di OSCAR 3.0 sepenuhnya GRATIS.' },
  { q: 'Bagaimana alur pendaftaran tim di platform?',       a: 'Cukup daftarkan akun baru, login ke portal peserta, pilih lomba, isi susunan tim beserta berkas pendukung, dan submit formulir.' },
  { q: 'Kapan pengumuman hasil pemenang kompetisi?',      a: 'Jadwal penilaian dan pengumuman pemenang tertera rinci pada halaman cabang lomba masing-masing secara berkala.' },
];

export default function TentangPage() {
  const pageRef = useRef(null);
  const floatShapesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
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

      // FAQ items stagger
      const faqItems = document.querySelectorAll('.faq-item');
      if (faqItems.length) {
        gsap.fromTo(faqItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.faq-container',
              start: 'top 80%'
            }
          }
        );
      }

      // Vision/Mission card reveal
      const vmCards = document.querySelectorAll('.vm-card');
      if (vmCards.length) {
        gsap.fromTo(vmCards,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.vm-container',
              start: 'top 80%'
            }
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492]">
      
      {/* Main Content */}
      <div className="relative z-10" style={{ backgroundColor: '#112C1E' }}>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.1)_0%,transparent_60%)] pointer-events-none z-0" />

        {/* ── HERO SECTION ── */}
        <section className="relative pt-36 pb-16 px-6 sm:px-12 overflow-hidden z-10">
          
          {/* Floating shapes */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div 
              ref={(el) => (floatShapesRef.current[0] = el)}
              className="absolute top-[20%] right-[12%] w-14 h-14 sm:w-24 sm:h-24 rounded-full bg-[rgba(112,196,146,0.02)] border border-[rgba(112,196,146,0.08)] backdrop-blur-[20px]"
            />
            <div 
              ref={(el) => (floatShapesRef.current[1] = el)}
              className="absolute bottom-[25%] left-[6%] w-18 h-18 sm:w-28 sm:h-28 rounded-full bg-[rgba(112,196,146,0.02)] border border-[rgba(112,196,146,0.08)] backdrop-blur-[20px]"
            />
            <div 
              ref={(el) => (floatShapesRef.current[2] = el)}
              className="absolute top-[55%] left-[20%] w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[rgba(112,196,146,0.02)] border border-[rgba(112,196,146,0.08)] backdrop-blur-[20px]"
            />
          </div>

          <div className="max-w-[1400px] mx-auto text-center relative z-20 flex flex-col items-center">
            {/* Badge */}
            <div className="animate-in inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[rgba(112,196,146,0.08)] border border-[rgba(112,196,146,0.3)] shadow-[0_0_20px_rgba(112,196,146,0.15)] mb-8">
              <BookOpen size={12} className="text-[#70C492]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#70C492] font-bold">
                MENGENAL PORTAL KAMI
              </span>
            </div>

            {/* Title */}
            <h1 
              className="animate-in font-cyber font-black text-white tracking-tighter leading-none mb-6 uppercase"
              style={{ 
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                filter: 'drop-shadow(0 0 30px rgba(112,196,146,0.3))'
              }}
            >
              MENDORONG POTENSI<br />
              <span className="bg-gradient-to-b from-[#70C492] to-[#79C199] bg-clip-text text-transparent">RISET MAHASISWA</span>
            </h1>

            <p className="animate-in text-[#7A9A8A] max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
              OSCAR (Open Science Competition Annual Race) merupakan ajang kompetisi sains nasional tingkat tahunan yang mewadahi ribuan talenta muda untuk menginspirasi lahirnya riset-riset inventif.
            </p>
          </div>
        </section>

        {/* ── VISION & MISSION ── */}
        <section className="py-20 px-6 sm:px-12 relative z-10 border-t border-[#70C492]/10">
          <div className="max-w-[1600px] mx-auto vm-container grid lg:grid-cols-2 gap-8">
            {[
              { title: 'Visi Agung Kami', icon: Eye, desc: 'Menjadi wadah inkubasi kompetisi ilmiah terdepan di Indonesia yang menstimulasi lahirnya penemu serta ilmuwan muda andal penyelesai masalah masa depan.' },
              { title: 'Misi Utama Kami', icon: Target, desc: 'Menyelenggarakan penilaian kompetisi berstandar integritas tinggi secara jujur, meluaskan jangkauan riset ilmiah ke ranah institusi daerah, dan membangun konektivitas kolaboratif.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title} 
                  className="vm-card bg-[#18412E]/60 backdrop-blur-[25px] border border-[rgba(112,196,146,0.12)] shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-8 sm:p-10 rounded-[24px] transition-all duration-500 hover:border-[#70C492]/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_20px_rgba(112,196,146,0.08)] group relative overflow-hidden"
                >
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.04)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#70C492]/5 border border-[#70C492]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className="text-[#70C492]" />
                    </div>
                    <h2 className="font-cyber text-2xl font-bold text-white mb-4 group-hover:text-[#70C492] transition-colors duration-300">{item.title}</h2>
                    <p className="text-[#7A9A8A] text-sm sm:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-6 sm:px-12 relative z-10 border-t border-[#70C492]/10" id="faq">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col items-center sm:items-start mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(112,196,146,0.08)] border border-[rgba(112,196,146,0.2)] mb-4">
                <Sparkles size={12} className="text-[#70C492]" />
                <span className="text-[#70C492] font-mono text-[12px] tracking-widest uppercase font-bold">PUSAT BANTUAN</span>
              </div>
              <h2 className="font-cyber text-3xl sm:text-5xl font-bold text-white tracking-tight uppercase leading-none">
                Pertanyaan <span className="bg-gradient-to-r from-[#70C492] to-[#79C199] bg-clip-text text-transparent">Umum</span>
              </h2>
            </div>
            
            <div className="space-y-4 max-w-[1100px] faq-container">
              {FAQ.map(({ q, a }) => (
                <div 
                  key={q} 
                  className="faq-item bg-[#18412E]/60 backdrop-blur-[25px] border border-[rgba(112,196,146,0.12)] p-6 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-[#70C492]/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_15px_rgba(112,196,146,0.06)] group"
                >
                  <p className="font-cyber font-bold text-[#70C492] mb-3 text-base group-hover:text-white transition-colors duration-300">{q}</p>
                  <p className="text-[#7A9A8A] text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="kontak" className="py-20 px-6 sm:px-12 relative z-10 border-t border-[#70C492]/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="bg-[#18412E]/60 backdrop-blur-[25px] border border-[rgba(112,196,146,0.12)] shadow-[0_40px_80px_rgba(0,0,0,0.6)] p-12 sm:p-16 rounded-[32px] text-center relative overflow-hidden group">
              
              {/* Glow effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#70C492]/5 blur-[100px] transition-all duration-700 group-hover:bg-[#70C492]/10" />
              </div>

              <div className="relative z-10">
                <h2 className="font-cyber text-3xl sm:text-4xl font-bold text-white mb-6 uppercase tracking-tight">
                  Hubungi <span className="bg-gradient-to-r from-[#70C492] to-[#79C199] bg-clip-text text-transparent">Sekretariat</span>
                </h2>
                <p className="text-[#7A9A8A] max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-10">
                  Ada pertanyaan lebih lanjut mengenai proposal, kerja sama, sponsorship, maupun panduan administrasi? Silakan hubungi kami.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-white text-sm font-mono">
                  <a href="mailto:info@oscar.id" className="flex items-center gap-2 hover:text-[#70C492] transition-colors duration-300">
                    <div className="w-9 h-9 rounded-xl bg-[#70C492]/5 border border-[#70C492]/20 flex items-center justify-center">
                      <Mail size={14} className="text-[#70C492]" />
                    </div>
                    info@oscar.id
                  </a>
                  <span className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#79C199]/5 border border-[#79C199]/20 flex items-center justify-center">
                      <MapPin size={14} className="text-[#79C199]" />
                    </div>
                    Indonesia
                  </span>
                  <a href="#" className="flex items-center gap-2 hover:text-[#70C492] transition-colors duration-300">
                    <div className="w-9 h-9 rounded-xl bg-[#70C492]/5 border border-[#70C492]/20 flex items-center justify-center">
                      <Instagram size={14} className="text-[#70C492]" />
                    </div>
                    @oscar.official
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-10" />
      </div>
    </div>
  );
}
