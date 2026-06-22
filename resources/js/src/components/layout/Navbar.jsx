import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import gsap from '@/animations/gsapConfig';
import useAuthStore from '@/stores/authStore';
import useNotifStore from '@/stores/notifStore';
import {
  Bell, Menu, X, ChevronDown, LogOut, User,
  LayoutDashboard, ArrowRight, Sparkles,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAV CONFIG
   ───────────────────────────────────────────── */
const NAV_LINKS = [
  { to: '/',         label: 'Beranda',  exact: true  },
  { to: '/lomba',    label: 'Lomba'               },
  { to: '/roadmap',  label: 'Roadmap'             },
  { to: '/tentang',  label: 'Tentang'             },
];

/* ─────────────────────────────────────────────
   MAIN NAVBAR
   ───────────────────────────────────────────── */
export default function Navbar() {
  const navRef    = useRef(null);
  const pillRef   = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const { user, token, logout } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotifStore();

  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  // ── Dynamic Navigation Links
  const dynamicPendaftaranPath = token && user
    ? (user.role === 'admin' ? '/admin' : '/peserta/daftar')
    : '/register';

  const navLinks = [
    { to: '/',         label: 'BERANDA',  exact: true  },
    { to: '/lomba',    label: 'LOMBA'               },
    { to: '/roadmap',  label: 'ROADMAP'             },
    { to: '/tentang',  label: 'TENTANG'             },
    { to: dynamicPendaftaranPath, label: 'PENDAFTARAN' },
  ];

  // ── Notifications
  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  // ── Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out' }
    );
    if (pillRef.current) {
      tl.fromTo(
        pillRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' },
        '-=0.35'
      );
    }
  }, []);

  // ── Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = (e) => {
      if (!e.target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userMenuOpen]);

  // ── Close user menu on route change
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const dashPath = user?.role === 'admin' ? '/admin' : '/peserta';

  return (
    <>
      {/* ────── NAVBAR OUTER WRAPPER ────── */}
      <div
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[200] pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* ── Background bar ── */}
        <div
          className={`
            absolute inset-0 transition-all duration-500 ease-out
            ${scrolled
              ? 'bg-[#112C1E]/95 backdrop-blur-[24px] border-b border-[#70C492]/10 shadow-[0_4px_40px_rgba(0,0,0,0.8)]'
              : 'bg-transparent'
            }
          `}
        />

        {/* ── Content container ── */}
        <div className="relative max-w-[1600px] mx-auto px-6 pointer-events-auto">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* ══ LOGO & BRAND ══ */}
            <Link to="/" className="flex items-center gap-3 group relative z-10 hover:opacity-85 transition-opacity duration-300">
              <img
                src="/images/logo/logo3.png"
                alt="OSCAR 3.0 Logo"
                className="w-10 h-10 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <span style={{fontFamily:'var(--font-cyber)'}} className="font-cyber font-black text-white text-[15px] leading-none block tracking-tight">
                  OSCAR 3.0
                </span>
                <span style={{fontFamily:'var(--font-mono)'}} className="text-[#70C492] text-[11px] tracking-[0.2em] leading-none mt-0.5 block font-bold uppercase">
                  3.0  Rainforest
                </span>
              </div>
            </Link>

            {/* ══ CENTER NAV (Desktop) ══ */}
            <div
              ref={pillRef}
              className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-6 px-1 py-1">
                {navLinks.map(({ to, label, exact }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 text-[13px] font-extrabold tracking-wider transition-all duration-200 select-none ${
                        isActive
                          ? 'text-[#70C492] border-b-2 border-[#70C492]'
                          : 'text-white/60 hover:text-white'
                      }`
                    }
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ══ RIGHT SIDE ══ */}
            <div className="flex items-center gap-3 relative z-10">
              {token && user ? (
                <>
                  {/* ─ Notification bell ─ */}
                  <Link
                    to={dashPath}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#7A9A8A] hover:text-[#70C492] hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <Bell size={17} strokeWidth={1.8} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-[#ff4f7b] text-white text-[12px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(255,79,123,0.5)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* ─ User avatar dropdown ─ */}
                  <div className="relative" data-user-menu>
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className={`
                        flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full transition-all duration-300
                        ${userMenuOpen
                          ? 'bg-white/[0.06] border border-[#70C492]/30'
                          : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                        }
                      `}
                    >
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#70C492] to-[#79C199] p-[1.5px]">
                          <div className="w-full h-full rounded-full bg-[#112C1E] flex items-center justify-center">
                            <span className="font-display text-[#70C492] text-[12px] font-bold">
                              {user.name?.[0]?.toUpperCase() ?? 'U'}
                            </span>
                          </div>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#70C492] border-2 border-[#153427]" />
                      </div>
                      <span className="hidden sm:block text-[13px] text-white/80 font-medium max-w-[90px] truncate">
                        {user.name?.split(' ')[0]}
                      </span>
                      <ChevronDown
                        size={13}
                        className={`text-white/40 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2.5 w-56 origin-top-right animate-in">
                        <div className="bg-[#18412E]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(112,196,146,0.03)] overflow-hidden">
                          <div className="px-4 py-3.5 border-b border-white/[0.04]">
                            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-[#7A9A8A] text-[12px] font-mono mt-0.5 truncate">{user.email}</p>
                          </div>

                          <div className="py-1.5">
                            {user.role === 'admin' ? (
                              <a
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-[#7A9A8A] hover:text-[#70C492] hover:bg-[#70C492]/[0.04] text-[13px] transition-colors"
                              >
                                <LayoutDashboard size={15} /> Dashboard
                              </a>
                            ) : (
                              <Link
                                to="/peserta/profil"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-[#7A9A8A] hover:text-[#70C492] hover:bg-[#70C492]/[0.04] text-[13px] transition-colors"
                              >
                                <User size={15} /> Profil Saya
                              </Link>
                            )}
                          </div>

                          <div className="border-t border-white/[0.04] py-1.5">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[#ff4f7b] hover:bg-[#ff4f7b]/[0.06] text-[13px] transition-colors"
                            >
                              <LogOut size={15} /> Keluar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ─ Auth buttons (Desktop) ─ */
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-white border border-white hover:text-[#70C492] hover:border-[#70C492] rounded-full transition-all duration-200"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 text-[12px] font-black uppercase tracking-wider text-[#112C1E] bg-[#70C492] hover:brightness-110 transition-all duration-200 rounded-full"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    REGIST
                  </Link>
                </div>
              )}

              {/* ─ Mobile menu toggle ─ */}
              <button
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#7A9A8A] hover:text-[#70C492] hover:bg-white/[0.04] transition-all"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ────── MOBILE FULLSCREEN MENU ────── */}
      <MobileMenu
        isOpen={menuOpen}
        links={navLinks}
        user={user}
        token={token}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
        dashPath={dashPath}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   MOBILE MENU — Premium fullscreen overlay
───────────────────────────────────────────── */
function MobileMenu({ isOpen, links, user, token, onClose, onLogout, dashPath }) {
  const panelRef = useRef(null);
  const linksRef = useRef(null);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(panel,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.35, ease: 'power2.out' }
      );
      const items = linksRef.current?.children;
      if (items?.length) {
        gsap.fromTo(items,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.1 }
        );
      }
    } else {
      gsap.to(panel, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          document.body.style.overflow = '';
          gsap.set(panel, { visibility: 'hidden' });
        },
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[199] invisible"
    >
      <div className="absolute inset-0 bg-[#112C1E]/98 backdrop-blur-2xl" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#70C492]/[0.015] blur-[120px] pointer-events-none" />
      
      <div className="relative flex flex-col h-full pt-20 px-6 pb-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#7A9A8A] hover:text-[#70C492] hover:border-[#70C492]/30 transition-all"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <img
            src="/images/logo/logo3.png"
            alt="OSCAR 3.0 Logo"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <div>
            <span className="font-display font-bold text-white text-sm leading-none block">OSCAR 3.0</span>
            <span className="font-mono text-[#7A9A8A] text-[11px] tracking-[0.2em] font-bold uppercase">Rainforest</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav ref={linksRef} className="flex flex-col gap-1 flex-1">
          {links.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-display font-bold transition-all duration-200 ${
                  isActive
                    ? 'text-[#70C492] bg-[#70C492]/[0.06] border border-[#70C492]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.02] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C492] shadow-[0_0_8px_rgba(112,196,146,0.6)] flex-shrink-0" />
                  )}
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.04]">
          {token && user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#70C492] to-[#79C199] p-[2px] flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#112C1E] flex items-center justify-center">
                    <span className="font-display text-[#70C492] text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-[#7A9A8A] text-[12px] font-mono truncate">{user.email}</p>
                </div>
              </div>

              {user.role === 'admin' ? (
                <a href="/admin" onClick={onClose} className="w-full">
                  <button className="w-full px-6 py-3.5 rounded-2xl bg-[#70C492] text-[#112C1E] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(112,196,146,0.2)]">
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                </a>
              ) : (
                <Link to="/peserta/profil" onClick={onClose}>
                  <button className="w-full px-6 py-3.5 rounded-2xl bg-[#70C492] text-[#112C1E] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(112,196,146,0.2)]">
                    <User size={16} /> Profil Saya
                  </button>
                </Link>
              )}
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full px-6 py-3.5 rounded-2xl bg-white/[0.02] border border-[#ff4f7b]/30 text-[#ff4f7b] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ff4f7b]/10 transition-all"
              >
                <LogOut size={16} /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/register" onClick={onClose}>
                <button className="w-full px-6 py-3.5 rounded-2xl bg-[#70C492] text-[#112C1E] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(112,196,146,0.2)]">
                  <Sparkles size={16} /> Daftar Sekarang
                </button>
              </Link>
              <Link to="/login" onClick={onClose}>
                <button className="w-full px-6 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all">
                  Masuk
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
