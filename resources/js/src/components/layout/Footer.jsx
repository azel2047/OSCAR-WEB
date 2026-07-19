import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#112C1E] border-t border-[#70C492]/15 py-16 font-body select-none relative z-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Column 1: Brand & Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span 
              className="font-cyber font-black text-2xl tracking-wide text-[#70C492] uppercase"
              style={{ textShadow: '0 0 15px rgba(112, 196, 146, 0.25)' }}
            >
              OSCAR 3.0
            </span>
            <p className="text-white/70 text-base sm:text-base font-medium leading-relaxed max-w-[280px]">
              Siswa dan Mahasiswa SMA/MA/SMK/D3/D4/S1 Sederajat. Wadah inovasi sains & teknologi siber masa depan.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="flex items-center gap-4 text-xs font-bold tracking-wider font-cyber">
            <a 
              href="/documentation" 
              className="text-white/50 hover:text-[#70C492] transition-colors duration-300 uppercase"
            >
              Dokumentasi
            </a>
            <span className="text-white/20">|</span>
            <a 
              href="/contact" 
              className="text-white/50 hover:text-[#70C492] transition-colors duration-300 uppercase"
            >
              Contact Person
            </a>
          </div>

          <p className="text-white/30 text-md font-mono mt-2">
            © 2026 Olimpiade Sains dan Teknologi Terpadu. All Rights Reserved.
          </p>
        </div>

        {/* Column 2: Alamat & Kontak */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[#70C492] text-xl tracking-widest font-extrabold uppercase">
            Lokasi Kampus B
          </span>
          <div className="flex flex-col gap-2">
            <h4 className="font-cyber font-bold text-white text-base tracking-wider uppercase">
              STT Terpadu Nurul Fikri
            </h4>
            <p className="text-white/50 text-base leading-relaxed max-w-[320px]">
              Jl. Raya Lenteng Agung No.20-21, RT.4/RW.1, Srengseng Sawah, Kec. Jagakarsa, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12640.
            </p>
          </div>
          <div className="flex flex-col gap-1 text-base font-mono text-white/40">
            <span>Email: kompetisioscar@gmail.com</span>
            <span>Telp: +62 878-2212-5426</span>
          </div>
        </div>

        {/* Column 3: Google Maps Embed */}
        <div className="flex flex-col gap-4 w-full">
          <span className="font-mono text-[#70C492] text-[12px] tracking-widest font-extrabold uppercase">
             Peta Lokasi
          </span>
          <div className="w-full h-[180px] rounded-2xl border border-white/[0.08] bg-[#18412E]/20 overflow-hidden relative group hover:border-[#70C492]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(112,196,146,0.12)]">
            <iframe 
              src="https://maps.google.com/maps?q=STT%20Terpadu%20Nurul%20Fikri%20Kampus%20B&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ 
                border: 0, 
                filter: 'grayscale(1) invert(0.93) contrast(1.2) brightness(0.75) hue-rotate(130deg)' 
              }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="STT Terpadu Nurul Fikri Kampus B Map"
            />
          </div>
        </div>

      </div>
    </footer>
  );
}
