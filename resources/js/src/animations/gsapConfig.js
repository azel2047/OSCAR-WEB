import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
}

// --- Easing Aliases (Needed by preloader.js and textReveal.js to prevent compilation errors) ---
export const EASE = {
  out:        'power3.out',
  inOut:      'power3.inOut',
  expo:       'expo.out',
  elastic:    'elastic.out(1, 0.4)',
  bounce:     'bounce.out',
  back:       'back.out(1.7)',
  slow:       'power1.inOut',
  cinematic:  'power4.inOut',
  reveal:     'circ.out',
};

// --- Duration Presets (Needed by preloader.js and textReveal.js to prevent compilation errors) ---
export const DUR = {
  xs:  0.3,
  sm:  0.5,
  md:  0.8,
  lg:  1.2,
  xl:  1.8,
  xxl: 2.5,
};

// --- Stagger Presets (Needed by textReveal.js to prevent compilation errors) ---
export const STAGGER = {
  xs:     { amount: 0.2, ease: EASE.out },
  sm:     { amount: 0.4, ease: EASE.out },
  md:     { amount: 0.6, ease: EASE.out },
  lg:     { amount: 1.0, ease: EASE.out },
  cascade: { each: 0.08, ease: EASE.out },
  wave:   { each: 0.1, from: 'start', ease: EASE.out },
};

export { gsap, ScrollTrigger };
export default gsap;
