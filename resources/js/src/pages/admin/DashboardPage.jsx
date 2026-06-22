import { useEffect, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import api from '@/api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, ClipboardList, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const COLORS = ['#00ffc8', '#39ff14', '#b4ff6e', '#00e5ff', '#ffc107'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#020a06]/90 backdrop-blur-xl border border-white/[0.04] px-4 py-3 rounded-xl shadow-xl text-sm">
      <p className="text-[#8B9A7A] mb-1 font-mono text-[12px] uppercase tracking-wider">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono font-black text-sm">
          {p.value.toLocaleString('id-ID')} Pendaftar
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboardPage() {
  // Stats overview endpoint
  const { data: statsData, request: fetchStats } = useApi();
  // Growth charts endpoint
  const { data: growthData, request: fetchGrowth } = useApi();
  const pageRef = useRef(null);

  useEffect(() => {
    fetchStats(() => api.get('/admin/statistik/overview'));
    fetchGrowth(() => api.get('/admin/statistik/pertumbuhan?days=7'));
    
    // Entrance animations
    const el = pageRef.current;
    if (el) {
      const items = el.querySelectorAll('.animate-in');
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 30, filter: 'blur(3px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.1, clearProps: 'filter' }
        );
      }
    }
  }, []);

  const stats = statsData?.data ?? statsData;
  const growth = growthData?.data ?? growthData ?? [];

  const statCards = [
    { label: 'Total Peserta Terdaftar', value: stats?.total_peserta ?? 0, icon: Users,         color: '#00ffc8' },
    { label: 'Total Berkas Pendaftaran', value: stats?.pending_verif ?? 0, icon: ClipboardList, color: '#39ff14' },
    { label: 'Cabang Lomba Aktif',        value: stats?.lomba_aktif ?? 0, icon: Trophy,        color: '#b4ff6e' },
    { label: 'Registrasi Hari Ini',      value: stats?.daftar_hari_ini ?? 0, icon: TrendingUp,    color: '#ffc107' },
  ];

  // Map category data for a simple Bar/Pie distribution
  const kategoriData = [
    { name: 'Siswa / SMA', jumlah: stats?.distribusi_kategori?.siswa ?? 0 },
    { name: 'Mahasiswa / PT', jumlah: stats?.distribusi_kategori?.mahasiswa ?? 0 },
  ];

  // Map daily growth data for X-Axis and Y-Axis charts
  const trendData = growth.map(g => ({
    tgl: new Date(g.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    jumlah: g.total
  }));

  // Map Lomba distribution data
  const lombaData = (stats?.peserta_per_lomba ?? []).map(l => ({
    nama: l.nama,
    jumlah: l.total
  }));

  return (
    <div ref={pageRef} className="space-y-8 text-[#f0fff8]">
      {/* Header */}
      <div className="animate-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/20 mb-3">
            <Sparkles size={12} className="text-[#00ffc8]" />
            <span className="text-[#00ffc8] font-mono text-[12px] tracking-widest uppercase font-bold">ANALISA AKTIVITAS SISTEM</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">Dashboard Administrator</h1>
          <p className="text-[#9dd5b8] text-sm mt-1.5">Rangkuman data dan grafik analitis platform kompetisi OSCAR 3.0.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="animate-in grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div 
            key={label} 
            className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/[0.08]"
          >
            <div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon size={18} style={{ color: color }} />
              </div>
              <div className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
                {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
              </div>
            </div>
            <div className="text-[#8B9A7A] text-[12px] font-mono uppercase tracking-wider mt-3 font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts Panels */}
      <div className="animate-in grid lg:grid-cols-2 gap-6">
        {/* Pendaftaran per Kategori */}
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 rounded-3xl">
          <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffc8]" />
            Volume Registrasi per Jenjang / Kategori
          </h2>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={kategoriData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4a7c62', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a7c62', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
              <Bar dataKey="jumlah" fill="#00ffc8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribusi per lomba */}
        <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 rounded-3xl">
          <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" />
            Distribusi Pendaftar per Cabang Lomba
          </h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={lombaData}
                cx="50%"
                cy="46%"
                innerRadius={55}
                outerRadius={85}
                dataKey="jumlah"
                nameKey="nama"
                paddingAngle={4}
              >
                {lombaData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(2,10,6,0.9)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 10, color: '#9dd5b8', fontFamily: 'Plus Jakarta Sans', paddingTop: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend line */}
      <div className="bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 rounded-3xl">
        <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffc107]" />
          Tren Grafik Pendaftaran (7 Hari Terakhir)
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis dataKey="tgl" tick={{ fill: '#4a7c62', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4a7c62', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="jumlah" stroke="#00ffc8" strokeWidth={2.5} dot={{ fill: '#00ffc8', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
