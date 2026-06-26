import { useEffect, useRef } from 'react';
import gsap from '@/animations/gsapConfig';

/**
 * usePageEntrance — plays a uniform GSAP entrance animation for a page.
 *
 * Usage:
 *   const pageRef = usePageEntrance();
 *   return <div ref={pageRef}>...</div>
 *
 * Options:
 *   - selector: CSS selector for child elements to stagger-reveal (default: '.animate-in')
 *   - y: initial y offset (default: 40)
 *   - duration: animation duration (default: 0.7)
 *   - stagger: stagger between elements (default: 0.08)
 *   - delay: initial delay (default: 0.1)
 */
export default function usePageEntrance(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      selector = '.animate-in',
      y = 40,
      duration = 0.7,
      stagger = 0.08,
      delay = 0.1,
    } = options;

    const children = el.querySelectorAll(selector);

    if (children.length > 0) {
      gsap.fromTo(
        children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          stagger,
          delay,
        }
      );
    } else {
      // Animate the container itself
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay,
        }
      );
    }
  }, []);

  return ref;
}
