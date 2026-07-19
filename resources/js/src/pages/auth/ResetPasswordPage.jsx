import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import NebulaBg from '@/components/shared/NebulaBg';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const INPUT_CLASS = "!border-0 !rounded-xl bg-[#18412E]/60 hover:bg-[#18412E]/80 focus:bg-[#18412E] focus:ring-1 focus:ring-[#70C492]/50 focus:shadow-[0_0_15px_rgba(112,196,146,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#7A9A8A]";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [form,     setForm]     = useState({ password: '', password_confirmation: '' });
  const [showPass, setShowPass] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const floatShapesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = pageRef.current?.querySelectorAll('.animate-in');
      if (items?.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out', stagger: 0.12, delay: 0.1, clearProps: 'filter' }
        );
      }

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
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await resetPassword({
      token:                 searchParams.get('token') ?? '',
      email:                 searchParams.get('email') ?? '',
      password:              form.password,
      password_confirmation: form.password_confirmation,
    });
    if (res.success) navigate('/login?reset=1');
  };

  return (
    <div ref={pageRef} className="min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      
      <NebulaBg />

      <div className="absolute inset-0 z-[1] bg-[#112C1E]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(112,196,146,0.08)_0%,transparent_60%)] pointer-events-none" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div 
          ref={(el) => (floatShapesRef.current[0] = el)}
          className="absolute top-[18%] right-[10%] w-14 h-14 sm:w-24 sm:h-24 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
        />
        <div 
          ref={(el) => (floatShapesRef.current[1] = el)}
          className="absolute bottom-[18%] left-[12%] w-18 h-18 sm:w-28 sm:h-28 rounded-full bg-[#70C492]/[0.02] border border-[#70C492]/10 backdrop-blur-[20px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
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
            Reset Password
          </h1>
          <p className="text-[#7A9A8A] text-sm">Masukkan password baru kamu.</p>
        </div>

        <div className="animate-in bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_30px_rgba(112,196,146,0.04)] p-8 sm:p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.03)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Password Baru"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 karakter"
                leftIcon={<Lock size={16} className="text-[#70C492]" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="text-[#7A9A8A] hover:text-[#70C492] transition-colors bg-transparent border-none outline-none">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                value={form.password}
                onChange={(e) => { clearError(); setForm((p) => ({ ...p, password: e.target.value })); }}
                className={INPUT_CLASS}
                required
              />
              <Input
                label="Konfirmasi Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                leftIcon={<Lock size={16} className="text-[#70C492]" />}
                value={form.password_confirmation}
                onChange={(e) => { clearError(); setForm((p) => ({ ...p, password_confirmation: e.target.value })); }}
                className={INPUT_CLASS}
                required
              />
              <Button
                type="submit"
                variant="solid"
                size="lg"
                className="w-full bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-display font-black uppercase tracking-wider rounded-xl hover:shadow-[0_0_25px_rgba(112,196,146,0.4)] transition-all py-4 border-none outline-none"
                loading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Simpan Password Baru
              </Button>
            </form>
          </div>
        </div>

        <p className="text-center text-[#7A9A8A] text-sm mt-8">
          <Link to="/login" className="hover:text-[#70C492] transition-colors">
            ← Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}
