import { useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import NebulaBg from '@/components/shared/NebulaBg';
import useAuthStore from '@/stores/authStore';

/**
 * Public layout — wraps all public pages.
 * NebulaBg is rendered at layout level so it persists across route changes
 * for a seamless, smooth background experience.
 * Uses PageTransition for smooth GSAP-powered route changes.
 */
export default function PublicLayout() {
  const { pathname } = useLocation();
  const { user, token } = useAuthStore();

  // Scroll to top on route change (instant, the animation handles the visual smoothness)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Redirect admin to dashboard instantly if they try to access public web pages
  if (token && user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#112C1E] relative">
      {/* Persistent NebulaBg across all public routes */}
      <NebulaBg />
      <Navbar />
      <main className="relative z-10">
        <PageTransition />
      </main>
      <Footer />
    </div>
  );
}
