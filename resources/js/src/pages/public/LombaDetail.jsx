import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useLombaStore from '@/stores/lombaStore';
import useAuthStore from '@/stores/authStore';
import { staggerFadeUp } from '@/animations/textReveal';
import {
  ArrowLeft, Clock, Users, Trophy, FileText, ChevronDown,
  CheckCircle, AlertCircle, Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';

import useCountdown from '@/hooks/useCountdown';
import { gsap } from '@/animations/gsapConfig';

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#18412E]/50 border border-[#70C492]/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#70C492]/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-display font-bold text-white pr-4">{item.pertanyaan}</span>
        <ChevronDown
          size={18}
          className={`text-[#70C492] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-[#7A9A8A] text-sm leading-relaxed border-t border-[#70C492]/10 pt-4">
          {item.jawaban}
        </div>
      )}
    </div>
  );
}

function CountdownUnit({ value, label }) {
  return (
    <div className="bg-[#18412E]/50 border border-[#70C492]/10 p-4 text-center min-w-[72px] rounded-2xl">
      <div className="font-display text-3xl font-bold text-[#70C492]" style={{ textShadow: '0 0 15px rgba(112,196,146,0.25)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="font-mono text-[12px] text-[#7A9A8A] tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
}

export default function LombaDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lombaDetail, faq, timeline, isLoading, error, fetchLombaDetail, fetchFaq, fetchTimeline, clearDetail } =
    useLombaStore();
  const { user, token } = useAuthStore();
  const pageRef = useRef(null);

  const countdown = useCountdown(lombaDetail?.tanggal_tutup_pendaftaran ?? '2099-01-01');

  useEffect(() => {
    fetchLombaDetail(slug);
    return () => clearDetail();
  }, [slug]);

  useEffect(() => {
    if (lombaDetail?.id) {
      fetchFaq(lombaDetail.id);
      fetchTimeline(lombaDetail.id);
    }
  }, [lombaDetail?.id]);

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        setTimeout(() => staggerFadeUp('.detail-block'), 100);
        const items = pageRef.current?.querySelectorAll('.animate-in');
        if (items?.length) {
          gsap.fromTo(items,
            { opacity: 0, y: 40, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out', stagger: 0.1, delay: 0.1, clearProps: 'filter' }
          );
        }
      }, pageRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen container-oscar">
        <div className="h-10 w-64 bg-[#18412E]/40 border border-[#70C492]/10 animate-pulse mb-6 rounded-lg" />
        <div className="h-48 bg-[#18412E]/40 border border-[#70C492]/10 animate-pulse mb-4 rounded-xl" />
        <div className="h-32 bg-[#18412E]/40 border border-[#70C492]/10 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (error || !lombaDetail) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-center container-oscar">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="font-display text-2xl text-white mb-2">Lomba tidak ditemukan</h2>
        <Button variant="ghost" onClick={() => navigate('/lomba')} leftIcon={<ArrowLeft size={16} />} className="border border-[#70C492]/20 text-[#7A9A8A] hover:text-[#70C492] hover:bg-[#70C492]/10">
          Kembali
        </Button>
      </div>
    );
  }

  const canRegister = lombaDetail.status === 'buka';

  return (
    <div ref={pageRef} className="pt-24 pb-20 min-h-screen text-[#FFFFFF] font-body selection:bg-[#70C492]/30 selection:text-[#70C492] relative overflow-hidden">
      
      {/* Background — layout already has NebulaBg */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[#112C1E]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="container-oscar relative z-10 px-6 max-w-[1600px] mx-auto">
        {/* Back */}
        <Link to="/lomba" className="animate-in inline-flex items-center gap-2 text-[#7A9A8A] hover:text-[#70C492] text-sm mb-8 transition-colors duration-300 font-medium">
          <ArrowLeft size={16} /> Semua Lomba
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="detail-block bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,196,146,0.03)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-mono uppercase tracking-widest font-bold ${canRegister ? 'bg-[#70C492]/10 border-[#70C492]/30 text-[#70C492]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${canRegister ? 'bg-[#70C492] animate-pulse' : 'bg-red-400'}`} />
                    {canRegister ? 'Pendaftaran Buka' : 'Pendaftaran Tutup'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#70C492]/10 border border-[#70C492]/30 text-[12px] font-mono uppercase tracking-widest font-bold text-[#70C492]">
                    {lombaDetail.kategori}
                  </span>
                </div>
                <h1 className="font-display text-3xl lg:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-tight">
                  {lombaDetail.nama}
                </h1>
                <p className="text-[#7A9A8A] leading-relaxed">{lombaDetail.deskripsi}</p>
              </div>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="detail-block bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-8 rounded-2xl">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-[#70C492]" /> Timeline
                </h2>
                <div className="space-y-4 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#70C492] to-[#112C1E]" />
                  {timeline.map((t, i) => (
                    <div key={t.id} className="flex gap-4 items-start">
                      <div className="w-4 h-4 rounded-full border-2 border-[#70C492] bg-[#112C1E] flex-shrink-0 mt-0.5 relative z-10" />
                      <div>
                        <p className="font-display font-bold text-white text-sm">{t.nama}</p>
                        <p className="font-mono text-[#70C492] text-xs mt-0.5">
                          {new Date(t.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
              <div className="detail-block">
                <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-[#70C492]" /> FAQ
                </h2>
                <div className="space-y-3">
                  {faq.map((item) => <FAQItem key={item.id} item={item} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Countdown */}
            {canRegister && !countdown.isExpired && (
              <div className="detail-block bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-6 rounded-2xl">
                <p className="font-mono text-xs text-[#7A9A8A] tracking-widest uppercase mb-4">Pendaftaran Ditutup Dalam</p>
                <div className="flex gap-2 flex-wrap">
                  <CountdownUnit value={countdown.days}    label="Hari" />
                  <CountdownUnit value={countdown.hours}   label="Jam" />
                  <CountdownUnit value={countdown.minutes} label="Menit" />
                  <CountdownUnit value={countdown.seconds} label="Detik" />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="detail-block bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-6 space-y-4 rounded-2xl">
              <h3 className="font-display font-bold text-white">Detail Lomba</h3>
              {[
                { icon: Users,  label: 'Anggota', val: `${lombaDetail.min_anggota}–${lombaDetail.maks_anggota} orang` },
                { icon: Trophy, label: 'Hadiah',  val: lombaDetail.hadiah_total ? `Rp ${Number(lombaDetail.hadiah_total).toLocaleString('id-ID')}` : '-' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-[#70C492]/5 border border-[#70C492]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#70C492]" />
                  </div>
                  <div>
                    <p className="text-[#7A9A8A] text-xs">{label}</p>
                    <p className="text-white font-medium">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="detail-block">
              {!token ? (
                <div className="bg-[#18412E]/50 border border-[#70C492]/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-6 text-center rounded-2xl">
                  <p className="text-[#7A9A8A] text-sm mb-4">Login untuk mendaftar lomba ini</p>
                  <Link to="/login">
                    <Button variant="solid" className="w-full bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-display font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(112,196,146,0.4)] border-none outline-none">
                      Masuk
                    </Button>
                  </Link>
                </div>
              ) : canRegister ? (
                <Link to={`/peserta/daftar?lomba=${lombaDetail.id}`}>
                  <Button variant="solid" size="lg" className="w-full bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-display font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(112,196,146,0.4)] border-none outline-none" rightIcon={<CheckCircle size={18} />}>
                    Daftar Sekarang
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" className="w-full border border-[#70C492]/20 text-[#7A9A8A] rounded-xl" disabled>
                  Pendaftaran Ditutup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
