import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import NebulaBg from '@/components/shared/NebulaBg';

/**
 * PesertaLayout — wraps all participant workspace pages.
 * Replaces the old sidebar dashboard layout with the landing page navbar and footer,
 * integrating the registration and verification stages seamlessly.
 */
export default function PesertaLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0A1A0A] relative flex flex-col justify-between">
      {/* Persistent NebulaBg */}
      <NebulaBg />
      
      {/* Landing style Navbar */}
      <Navbar />
      
      {/* Main content area */}
      <main className="relative z-10 flex-1 pt-28 pb-20 container-oscar min-h-[calc(100vh-320px)]">
        <PageTransition />
      </main>
      
      {/* Integrated Footer */}
      <Footer />
    </div>
  );
}

