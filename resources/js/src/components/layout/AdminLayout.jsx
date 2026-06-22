import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import PageTransition from './PageTransition';
import {
  LayoutDashboard, ClipboardList, Trophy, Megaphone,
  Image, Award, LogOut, Menu, X, ChevronRight, Shield,
} from 'lucide-react';

const NAV = [
  { to: '/admin',               label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { to: '/admin/pendaftaran',   label: 'Pendaftaran',    icon: ClipboardList },
  { to: '/admin/lomba',         label: 'Lomba',          icon: Trophy },
  { to: '/admin/pengumuman',    label: 'Pengumuman',     icon: Megaphone },
  { to: '/admin/galeri',        label: 'Galeri',         icon: Image },
  { to: '/admin/pemenang',      label: 'Pemenang',       icon: Award },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-bg-void/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 h-full
          lg:top-6 lg:left-6 lg:bottom-6 lg:h-[calc(100vh-3rem)]
          lg:rounded-2xl lg:border lg:border-white/[0.04]
          lg:bg-white/[0.01] lg:backdrop-blur-[35px]
          lg:shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,255,200,0.01)]
          bg-[#020a06] border-r border-border-subtle
          flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border-subtle lg:border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#00ffc8]" />
            <span className="font-display font-bold text-text-primary text-sm">Admin Panel</span>
          </div>
          <button className="lg:hidden text-text-muted" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Admin chip */}
        <div className="px-4 py-3 border-b border-border-subtle lg:border-white/[0.04]">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ffc107]/20 border border-[#ffc107]/40 flex items-center justify-center flex-shrink-0">
              <span className="font-display text-[#ffc107] text-sm font-bold">
                {user?.nama?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-semibold text-text-primary truncate">{user?.nama}</p>
              <span className="badge badge-amber text-[12px] px-2 py-0.5 mt-0.5">Admin</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ffc107]/10 text-[#ffc107] border border-[#ffc107]/20 shadow-[0_0_15px_rgba(255,193,7,0.1)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-[#ffc107]' : ''} />
                  {label}
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border-subtle lg:border-white/[0.04]">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-xs text-text-muted hover:text-text-primary transition-colors mb-2">
            ← Kembali ke Publik
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#ff4f7b] bg-[#ff4f7b]/05 hover:bg-[#ff4f7b]/10 transition-colors border border-transparent hover:border-[#ff4f7b]/20"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72 transition-all duration-300">
        {/* Top bar */}
        <header className="sticky top-0 lg:top-6 z-40 h-16 bg-[#040f09]/95 lg:bg-white/[0.01] backdrop-blur-[35px] border-b border-border-subtle lg:border lg:border-white/[0.04] lg:rounded-2xl lg:mt-6 lg:mr-6 flex items-center px-6 gap-4 lg:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(0,255,200,0.01)]">
          <button
            className="lg:hidden text-text-secondary hover:text-neon-teal transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <span className="font-mono text-[#00ffc8] text-xs tracking-widest ml-auto">
            OSCAR ADMIN v3.0
          </span>
        </header>

        <main className="flex-1 p-6 lg:p-8 lg:mr-6 lg:my-6 bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] lg:rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,255,200,0.01)] mt-4 lg:mt-6">
          <PageTransition />
        </main>
      </div>
    </div>
  );
}
