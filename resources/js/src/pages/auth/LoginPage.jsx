import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import NebulaBg from '@/components/shared/NebulaBg';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const INPUT_CLASS = "!border-0 !rounded-xl bg-[#18412E]/60 hover:bg-[#18412E]/80 focus:bg-[#18412E] focus:ring-1 focus:ring-[#70C492]/50 focus:shadow-[0_0_15px_rgba(112,196,146,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#7A9A8A]";

export default function LoginPage() {
  const [form,       setForm]       = useState({ email: '', password: '' });
  const [showPass,   setShowPass]   = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const floatShapesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
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
          y: -20,
          duration: 3 + i * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.3
        });
        gsap.to(shape, {
          rotation: i % 2 === 0 ? 10 : -10,
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

  const handleChange = (e) => {
    clearError();
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      if (res.role === 'admin') {
        window.location.href = '/admin';
      } else {
        navigate('/peserta');
      }
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      
      {/* Rainforest Canvas Background */}
      <NebulaBg />

      {/* Background layer */}
      <div className="absolute inset-0 z-[1] bg-[#112C1E]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(112,196,146,0.08)_0%,transparent_60%)] pointer-events-none" />
      </div>

      {/* Floating Glassmorphism Shapes */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div 
          ref={(el) => (floatShapesRef.current[0] = el)}
          className="absolute top-[15%] left-[8%] w-14 h-14 sm:w-24 sm:h-24 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
        />
        <div 
          ref={(el) => (floatShapesRef.current[1] = el)}
          className="absolute bottom-[20%] right-[10%] w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
        />
        <div 
          ref={(el) => (floatShapesRef.current[2] = el)}
          className="absolute top-[50%] right-[25%] w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="animate-in text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl border border-[#70C492]/40 bg-[#70C492]/10 flex items-center justify-center transition-all group-hover:scale-105 shadow-[0_0_15px_rgba(112,196,146,0.15)]">
              <span className="font-display font-bold text-[#70C492]">OC</span>
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-white leading-none">OSCAR 3.0</div>
              <div className="font-mono text-[#70C492] text-[12px] tracking-widest uppercase font-bold mt-1">Season Rainforest</div>
            </div>
          </Link>
          <h1 
            className="font-display text-4xl font-black text-white mt-8 mb-2 uppercase tracking-tight"
            style={{ textShadow: '0 0 20px rgba(112,196,146,0.2)' }}
          >
            Selamat Datang
          </h1>
          <p className="text-[#7A9A8A] text-sm">Masuk untuk mengakses portal pendaftaran & dashboard peserta.</p>
        </div>

        {/* Card */}
        <div className="animate-in bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_30px_rgba(112,196,146,0.04)] p-8 sm:p-10 rounded-2xl relative overflow-hidden">
          {/* Subtle card glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.03)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Alamat Email"
                name="email"
                type="email"
                placeholder="Masukkan Alamat Email"
                leftIcon={<Mail size={16} className="text-[#70C492]" />}
                value={form.email}
                onChange={handleChange}
                className={INPUT_CLASS}
                required
              />
              
              <div className="space-y-1">
                <Input
                  label="Kata Sandi (Password)"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock size={16} className="text-[#70C492]" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="text-[#7A9A8A] hover:text-[#70C492] transition-colors bg-transparent border-none outline-none">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  value={form.password}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                  required
                />
                <div className="flex justify-end pt-1">
                  <Link to="/forgot-password" className="text-xs text-[#7A9A8A] hover:text-[#70C492] transition-colors font-medium">
                    Lupa password Anda?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="solid"
                size="lg"
                className="w-full bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-display font-black uppercase tracking-wider rounded-xl hover:shadow-[0_0_25px_rgba(112,196,146,0.4)] transition-all py-4 border-none outline-none"
                loading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Masuk Akun
              </Button>
            </form>
          </div>
        </div>

        <p className="text-center text-[#7A9A8A] text-sm mt-8">
          Belum bergabung bersama kami?{' '}
          <Link to="/register" className="text-[#70C492] hover:underline hover:decoration-[#70C492] hover:underline-offset-4 font-bold transition-all">
            Daftar Akun Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
