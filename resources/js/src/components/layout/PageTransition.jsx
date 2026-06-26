import { useRef, useEffect, useState, Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import gsap from '@/animations/gsapConfig';

/**
 * PageTransition — replaces <Outlet> and animates content on route change.
 *
 * How it works:
 *  1. On initial mount: fades + slides content in with a subtle blur.
 *  2. On location.pathname change: fades out → swaps content → fades in.
 *  3. Scrolls window to top after the transition.
 *
 * Props:
 *  - className: additional CSS classes for the wrapper div
 *  - duration:  animation duration in seconds (default 0.45)
 */
function LocalPageLoader() {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Double ring spinner */}
        <div className="absolute inset-0 border-2 border-[#70C492]/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-[#70C492] rounded-full animate-spin" />
      </div>
      <p className="text-xs font-mono tracking-widest text-[#70C492] uppercase mt-2">Memuat Halaman...</p>
    </div>
  );
}

export default function PageTransition({ className = '', duration = 0.45 }) {
  const location = useLocation();
  const outlet = useOutlet();
  const containerRef = useRef(null);
  const prevPathRef = useRef(location.pathname);
  const isFirstRef = useRef(true);

  // State that holds the "displayed" outlet, so we can delay swapping until
  // the exit animation finishes.
  const [displayedOutlet, setDisplayedOutlet] = useState(outlet);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Play entrance on first render
  useEffect(() => {
    if (!isFirstRef.current) return;
    isFirstRef.current = false;
    const el = containerRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration, ease: 'power4.out' }
    );
  }, []);

  // Handle route changes (after the first render)
  useEffect(() => {
    // Skip if same path
    if (location.pathname === prevPathRef.current) {
      // Still update outlet content (could be a param change like /lomba/:slug)
      if (location.key !== prevPathRef.current) {
        setDisplayedOutlet(outlet);
      }
      return;
    }

    const el = containerRef.current;
    if (!el) {
      setDisplayedOutlet(outlet);
      setCurrentPath(location.pathname);
      prevPathRef.current = location.pathname;
      return;
    }

    // Exit animation — cinematic fade + slide + blur
    gsap.to(el, {
      opacity: 0,
      y: -15,
      duration: duration * 0.5,
      ease: 'power2.in',
      onComplete: () => {
        // Swap to new content
        setDisplayedOutlet(outlet);
        setCurrentPath(location.pathname);
        prevPathRef.current = location.pathname;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Entrance animation
        requestAnimationFrame(() => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration,
              ease: 'power4.out',
            }
          );
        });
      },
    });
  }, [location.pathname, location.key]);

  // If user navigates to a different param on the same path (e.g. /lomba/a -> /lomba/b),
  // we still want to animate.
  useEffect(() => {
    if (location.pathname === currentPath && location.key !== prevPathRef.current) {
      const el = containerRef.current;
      if (!el) return;

      gsap.to(el, {
        opacity: 0,
        y: -15,
        duration: duration * 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayedOutlet(outlet);
          prevPathRef.current = location.key;

          window.scrollTo({ top: 0, behavior: 'instant' });

          requestAnimationFrame(() => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration, ease: 'power4.out' }
            );
          });
        },
      });
    }
  }, [location.key]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      <Suspense fallback={<LocalPageLoader />}>
        {displayedOutlet}
      </Suspense>
    </div>
  );
}
