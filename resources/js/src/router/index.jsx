import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import PageTransition from '@/components/layout/PageTransition';

// --- Layouts ---
import PublicLayout  from '@/components/layout/PublicLayout';
import PesertaLayout from '@/components/layout/PesertaLayout';
import AdminLayout   from '@/components/layout/AdminLayout';

// --- Lazy pages: Public ---
const LandingPage   = lazy(() => import('@/pages/public/LandingPage'));
const LombaPage     = lazy(() => import('@/pages/public/LombaPage'));
const LombaDetail   = lazy(() => import('@/pages/public/LombaDetail'));
const RoadmapPage   = lazy(() => import('@/pages/public/RoadmapPage'));
const TentangPage   = lazy(() => import('@/pages/public/TentangPage'));
const GaleriPage    = lazy(() => import('@/pages/public/GaleriPage'));
const Oscar1Page    = lazy(() => import('@/pages/archive/Oscar1Page'));
const Oscar2Page    = lazy(() => import('@/pages/archive/Oscar2Page'));

// --- Lazy pages: Auth ---
const LoginPage     = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage  = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPage    = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPage     = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// --- Lazy pages: Peserta ---
const PesertaDashboard   = lazy(() => import('@/pages/peserta/DashboardPage'));
const PesertaFormDaftar  = lazy(() => import('@/pages/peserta/FormDaftarPage'));
const PesertaRiwayat     = lazy(() => import('@/pages/peserta/RiwayatPage'));
const PesertaProfil      = lazy(() => import('@/pages/peserta/ProfilPage'));

// --- Lazy pages: Admin (rebuild trigger) ---
const AdminDashboard     = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminPendaftaran   = lazy(() => import('@/pages/admin/PendaftaranPage'));
const AdminPendaftDetail = lazy(() => import('@/pages/admin/PendaftaranDetailPage'));
const AdminLombaPageComp = lazy(() => import('@/pages/admin/LombaPage'));
const AdminLombaForm     = lazy(() => import('@/pages/admin/LombaFormPage'));
const AdminPengumumanPageComp = lazy(() => import('@/pages/admin/PengumumanPage'));
const AdminGaleriPageComp = lazy(() => import('@/pages/admin/GaleriPage'));
const AdminPemenang      = lazy(() => import('@/pages/admin/PemenangPage'));
const AdminRolePerms     = lazy(() => import('@/pages/admin/RolePermissionsPage'));

// --- Fallback loader ---
function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#112C1E]">
      <div className="w-10 h-10 border-2 border-[#70C492] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// --- Route Guards ---
function RequireAuth({ allowedRoles }) {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function GuestOnly() {
  const { token, user } = useAuthStore();
  if (token && user) {
    if (user.role !== 'peserta') {
      window.location.href = '/admin';
      return null;
    }
    return <Navigate to="/peserta" replace />;
  }
  return <PageTransition />;
}

// --- Router config ---
const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/',         element: <LandingPage /> },
      { path: '/lomba',    element: <LombaPage /> },
      { path: '/lomba/:slug', element: <LombaDetail /> },
      { path: '/roadmap',  element: <RoadmapPage /> },
      { path: '/tentang',  element: <TentangPage /> },
      { path: '/galeri',   element: <GaleriPage /> },
      { path: '/archive/oscar-1', element: <Oscar1Page /> },
      { path: '/archive/oscar-2', element: <Oscar2Page /> },
    ],
  },
  // Guest-only routes (redirect if logged in)
  {
    element: <GuestOnly />,
    children: [
      { path: '/login',           element: <LoginPage /> },
      { path: '/register',        element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPage /> },
      { path: '/reset-password',  element: <ResetPage /> },
    ],
  },
  // Peserta area
  {
    element: <RequireAuth allowedRoles={['peserta']} />,
    children: [
      {
        element: <PesertaLayout />,
        children: [
          { path: '/peserta',           element: <PesertaDashboard /> },
          { path: '/peserta/daftar',    element: <PesertaFormDaftar /> },
          { path: '/peserta/riwayat',   element: <PesertaRiwayat /> },
          { path: '/peserta/profil',    element: <PesertaProfil /> },
        ],
      },
    ],
  },
  // Admin area
  {
    element: <RequireAuth allowedRoles={['admin', 'po', 'sc', 'event', 'humas', 'bendahara', 'sekretaris']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin',                         element: <AdminDashboard /> },
          { path: '/admin/pendaftaran',             element: <AdminPendaftaran /> },
          { path: '/admin/pendaftaran/:id',         element: <AdminPendaftDetail /> },
          { path: '/admin/lomba',                   element: <AdminLombaPageComp /> },
          { path: '/admin/lomba/buat',              element: <AdminLombaForm /> },
          { path: '/admin/lomba/:id/edit',          element: <AdminLombaForm /> },
          { path: '/admin/pengumuman',              element: <AdminPengumumanPageComp /> },
          { path: '/admin/galeri',                  element: <AdminGaleriPageComp /> },
          { path: '/admin/pemenang',                element: <AdminPemenang /> },
          {
            element: <RequireAuth allowedRoles={['admin']} />,
            children: [
              { path: '/admin/hak-akses',           element: <AdminRolePerms /> }
            ]
          }
        ],
      },
    ],
  },
  // 404
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-[#112C1E] flex flex-col items-center justify-center text-center px-4">
        <p className="font-mono text-8xl font-bold text-[#70C492] opacity-30 mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Halaman tidak ditemukan</h1>
        <p className="text-[#7A9A8A] mb-8">URL yang kamu cari tidak ada.</p>
        <a href="/" className="px-8 py-3 rounded-full bg-[#70C492] text-[#112C1E] font-display font-bold uppercase tracking-wider hover:brightness-[1.15] hover:shadow-[0_0_20px_rgba(112,196,146,0.4)] transition-all">Kembali ke Beranda</a>
      </div>
    ),
  },
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
      />
    </Suspense>
  );
}
