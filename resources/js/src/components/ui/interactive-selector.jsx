import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Code, BarChart3, PenTool, Shield, Layout } from 'lucide-react';
import useAuthStore from '@/stores/authStore';

const InteractiveSelector = ({ lombas = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState([]);
  const { token } = useAuthStore();
  const isLoggedIn = !!token;
  
  const options = useMemo(() => {
    const defaultOptions = [
      {
        slug: "web-development",
        title: "Web Development",
        category: "Siswa SMA/SMK",
        description: "Rancang & bangun aplikasi web inovatif bertema lingkungan.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        icon: <Code size={20} className="text-[#70C492]" />,
        link: "/lomba/web-development"
      },
      {
        slug: "desain-infografis",
        title: "Infografis",
        category: "Siswa SMA/SMK",
        description: "Visualisasikan data sains dan lingkungan lewat desain informatif.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        icon: <BarChart3 size={20} className="text-[#70C492]" />,
        link: "/lomba/desain-infografis"
      },
      {
        slug: "desain-poster",
        title: "Poster Digital",
        category: "Siswa SMA/SMK",
        description: "Ekspresikan kampanye hijau melestarikan bumi lewat seni poster digital.",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
        icon: <PenTool size={20} className="text-[#70C492]" />,
        link: "/lomba/desain-poster"
      },
      {
        slug: "ctf",
        title: "Capture The Flag (CTF)",
        category: "Siswa SMA/SMK",
        description: "Pecahkan berbagai tantangan cyber security & hacking bergengsi.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        icon: <Shield size={20} className="text-[#70C492]" />,
        link: "/lomba/ctf"
      },
      {
        slug: "desain-ui-ux",
        title: "Desain UI/UX",
        category: "Mahasiswa",
        description: "Rancang antarmuka pengguna yang estetik, intuitif, dan solutif.",
        image: "https://images.unsplash.com/photo-1581291518655-9523c932ded7?q=80&w=800&auto=format&fit=crop",
        icon: <Layout size={20} className="text-[#70C492]" />,
        link: "/lomba/desain-ui-ux"
      }
    ];

    if (!lombas || lombas.length === 0) {
      return defaultOptions;
    }

    return defaultOptions.map(opt => {
      const dbLomba = lombas.find(l => l.slug === opt.slug);
      if (dbLomba) {
        return {
          ...opt,
          id: dbLomba.id,
          title: dbLomba.nama || opt.title,
          description: dbLomba.deskripsi ? (dbLomba.deskripsi.substring(0, 70) + '...') : opt.description,
          image: dbLomba.banner_url || opt.image,
          link: `/lomba/${dbLomba.slug}`
        };
      }
      return opt;
    });
  }, [lombas]);

  const handleOptionClick = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers = [];
    
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [options]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full text-white">
      {/* Options Container */}
      <div className="options flex w-full max-w-[1200px] min-h-[350px] md:h-[420px] mx-auto items-stretch overflow-hidden relative rounded-2xl border border-[#70C492]/10 bg-[#18412E]/10">
        {options.map((option, index) => (
          <div
            key={index}
            className={`
              option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'active' : ''}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backfaceVisibility: 'hidden',
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-40px)',
              minWidth: '50px',
              minHeight: '280px',
              margin: 0,
              cursor: 'pointer',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(0,0,0,0.60)' 
                : '0 10px 30px rgba(0,0,0,0.30)',
              flex: activeIndex === index ? '6 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
              borderLeft: index > 0 ? '1px solid rgba(112, 196, 146, 0.15)' : 'none',
              willChange: 'flex-grow, box-shadow, background-size, background-position'
            }}
            onClick={() => handleOptionClick(index)}
          >
            {/* Shadow effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-[#112C1E] via-transparent to-transparent pointer-events-none transition-opacity duration-500"
              style={{
                opacity: activeIndex === index ? 0.95 : 0.6
              }}
            />
            
            {/* Label with icon and info */}
            <div className="absolute left-0 right-0 bottom-4 flex flex-col sm:flex-row items-start sm:items-center justify-between z-10 px-4 md:px-6 w-full gap-3 pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="icon min-w-[38px] max-w-[38px] h-[38px] sm:min-w-[44px] sm:max-w-[44px] sm:h-[44px] flex items-center justify-center rounded-full bg-[rgba(17,44,30,0.85)] backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.18)] border border-[#70C492]/30 flex-shrink-0 flex-grow-0 transition-transform duration-300 group-hover:scale-105">
                  {option.icon}
                </div>
                
                {/* Text elements */}
                <div className="info text-white relative">
                  <span className="font-mono text-[#70C492] text-[9px] sm:text-[10px] tracking-widest font-extrabold uppercase block mb-0.5">
                    {option.category}
                  </span>
                  <div 
                    className="main font-cyber font-black text-sm sm:text-base md:text-lg transition-all duration-700 ease-in-out uppercase tracking-wider"
                    style={{
                      opacity: activeIndex === index ? 1 : 0,
                      transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                    }}
                  >
                    {option.title}
                  </div>
                  
                  {/* Hide description on mobile if not active, or let transition handle it */}
                  <div 
                    className="sub text-[10px] sm:text-xs text-white/70 transition-all duration-700 ease-in-out max-w-[180px] sm:max-w-xs md:max-w-md line-clamp-1"
                    style={{
                      opacity: activeIndex === index ? 1 : 0,
                      transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                    }}
                  >
                    {option.description}
                  </div>
                </div>
              </div>

              {/* Register Button - only visible/interactive if active */}
              <div 
                className="pointer-events-auto shrink-0 w-full sm:w-auto transition-all duration-500"
                style={{
                  opacity: activeIndex === index ? 1 : 0,
                  transform: activeIndex === index ? 'translateY(0)' : 'translateY(15px)',
                  display: activeIndex === index ? 'block' : 'none'
                }}
              >
                <Link 
                  to={isLoggedIn ? `/peserta/daftar?lomba=${option.id || ''}` : '/register'} 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#70C492] text-[#112C1E] font-cyber font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(112,196,146,0.3)] transition-all">
                    Daftar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom animations */}
      <style>{`
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InteractiveSelector;
