import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';

/**
 * ScrollLine — Lusion-style decorative SVG scroll line
 * Garis cyan/lime yang tumbuh mengikuti progress scroll halaman
 */
export default function ScrollLine() {
  const svgRef  = useRef(null);
  const pathRef = useRef(null);
  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Hitung panjang path
    const length = path.getTotalLength();

    // Set initial state: garis belum tergambar
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.set([dot1Ref.current, dot2Ref.current], {
      opacity: 0,
      scale: 0,
    });

    // Animate garis mengikuti scroll halaman
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      }
    });

    tl.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
    })
    .to(dot1Ref.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(2)',
    }, 0.2)
    .to(dot2Ref.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(2)',
    }, 0.6);

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars?.trigger === document.body) t.kill();
      });
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: '28px',
        width: '60px',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
        overflow: 'visible',
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 60 800"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        {/* Glow filter */}
        <defs>
          <filter id="scroll-line-glow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="5.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00f0ff" stopOpacity="0" />
            <stop offset="15%"  stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="65%"  stopColor="#0066ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#002299" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Background track (faint) */}
        <line
          x1="30" y1="0" x2="30" y2="800"
          stroke="rgba(0, 240, 255, 0.05)"
          strokeWidth="1"
        />

        {/* Animating main line */}
        <path
          ref={pathRef}
          d="M30,0 C30,80 30,160 30,240 C30,320 30,400 30,480 C30,560 30,640 30,720 C30,760 30,790 30,800"
          stroke="url(#lineGrad)"
          strokeWidth="2.2"
          fill="none"
          filter="url(#scroll-line-glow)"
          strokeLinecap="round"
        />

        {/* Dot at top */}
        <circle
          ref={dot1Ref}
          cx="30" cy="8" r="3.5"
          fill="#00f0ff"
          style={{ transformOrigin: '30px 8px', filter: 'drop-shadow(0 0 8px rgba(0,240,255,1))' }}
        />

        {/* Dot at bottom */}
        <circle
          ref={dot2Ref}
          cx="30" cy="792" r="3.5"
          fill="#0066ff"
          style={{ transformOrigin: '30px 792px', filter: 'drop-shadow(0 0 8px rgba(0,102,255,1))' }}
        />
      </svg>
    </div>
  );
}
