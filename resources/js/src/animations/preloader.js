import gsap from 'gsap';
import { EASE, DUR } from './gsapConfig';

/**
 * Cinematic preloader animation
 * Counter 0→100, then dramatic reveal
 *
 * @param {HTMLElement} preloaderEl  - the #preloader DOM element
 * @param {Function}    onComplete   - callback when preloader is done
 */
export function runPreloader(preloaderEl, onComplete) {
  const counter    = preloaderEl.querySelector('.counter');
  const label      = preloaderEl.querySelector('.label');
  const progressBar = preloaderEl.querySelector('.progress-bar');
  const scanLine   = preloaderEl.querySelector('.scan-line');

  const tl = gsap.timeline({
    onComplete: () => {
      if (typeof onComplete === 'function') onComplete();
    },
  });

  // Entrance
  tl.set(preloaderEl, { autoAlpha: 1 })
    .from(label, {
      opacity: 0,
      y: 10,
      duration: DUR.sm,
      ease: EASE.out,
    })

    // Count 0 → 100
    .to(
      { val: 0 },
      {
        val: 100,
        duration: DUR.xxl,
        ease: 'power2.inOut',
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          if (counter) counter.textContent = v;
          if (progressBar) progressBar.style.width = `${v}%`;
        },
      },
      '<0.3'
    )

    // Pause at 100 for drama
    .to({}, { duration: 0.4 })

    // Dramatic exit — clip-path wipe upward
    .to(preloaderEl, {
      clipPath: 'inset(0 0 100% 0)',
      duration: DUR.lg,
      ease: EASE.cinematic,
    })

    // Fade out scan line
    .to(
      scanLine,
      {
        opacity: 0,
        duration: DUR.xs,
      },
      '<'
    )

    // Set display none
    .set(preloaderEl, { display: 'none' });

  return tl;
}

/**
 * Quick logo pulse while "loading" (simulated)
 */
export function preloaderIdleEffect(logoEl) {
  return gsap.to(logoEl, {
    filter: 'brightness(1.8)',
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: 'power1.inOut',
  });
}
