import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, DUR, STAGGER } from './gsapConfig';

/**
 * Split text into individual lines and animate them in.
 * Uses overflow:hidden wrapper per line — no SplitText plugin needed.
 *
 * @param {HTMLElement|string} container  - element containing .reveal-line children
 * @param {object}             options
 */
export function revealLines(container, options = {}) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const lines = el.querySelectorAll('.reveal-line');
  if (!lines.length) return;

  const {
    delay       = 0,
    stagger     = 0.12,
    duration    = DUR.md,
    ease        = EASE.reveal,
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    lines,
    { y: '110%' },
    {
      y: '0%',
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: scrollTrigger || {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

/**
 * Clip-path horizontal wipe reveal for headings
 * @param {string|Element} target
 * @param {object}         options
 */
export function clipReveal(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const {
    direction     = 'left',  // 'left' | 'right' | 'up' | 'down'
    duration      = DUR.lg,
    ease          = EASE.cinematic,
    delay         = 0,
    scrollTrigger = null,
  } = options;

  const fromClip = {
    left:  'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    up:    'inset(100% 0 0 0)',
    down:  'inset(0 0 100% 0)',
  }[direction];

  return gsap.fromTo(
    el,
    { clipPath: fromClip, opacity: 0 },
    {
      clipPath: 'inset(0 0% 0 0%)',
      opacity: 1,
      duration,
      ease,
      delay,
      scrollTrigger: scrollTrigger || {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    }
  );
}

/**
 * Stagger fade-up for a list of cards or items
 * @param {string|Element[]} targets
 * @param {object}           options
 */
export function staggerFadeUp(targets, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;

  const {
    y            = 60,
    duration     = DUR.md,
    ease         = EASE.out,
    stagger      = STAGGER.cascade,
    delay        = 0,
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    els,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: scrollTrigger || {
        trigger: els[0],
        start: 'top 88%',
        once: true,
      },
    }
  );
}

/**
 * Horizontal parallax on scroll
 * @param {string|Element} target
 * @param {number}         xPercent  - how far to move (e.g., -20 for left)
 */
export function parallaxX(target, xPercent = -20) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  return gsap.to(el, {
    xPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
}

/**
 * Vertical parallax (depth effect)
 */
export function parallaxY(target, yPercent = -30) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  return gsap.to(el, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    },
  });
}

/**
 * Counter animation (number ticker)
 * @param {HTMLElement} el      - element to update textContent
 * @param {number}      target  - end value
 * @param {object}      options
 */
export function countUp(el, target, options = {}) {
  const { duration = DUR.lg, ease = 'power2.out', prefix = '', suffix = '' } = options;

  return gsap.fromTo(
    { val: 0 },
    { val: target },
    {
      duration,
      ease,
      onUpdate() {
        el.textContent = prefix + Math.round(this.targets()[0].val).toLocaleString('id-ID') + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    }
  );
}
