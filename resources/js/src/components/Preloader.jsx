import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsapConfig';

export default function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    // Check if user has already visited in this session
    const isVisited = sessionStorage.getItem('visited') === 'true';
    if (isVisited) {
      setVisible(false);
      if (onDone) onDone();
      window.dispatchEvent(new Event('preloader-done'));
      return;
    }

    document.body.style.overflow = 'hidden';

    // GSAP Timeline for the 3-phase cinematic transition
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setVisible(false);
        sessionStorage.setItem('visited', 'true');
        if (onDone) onDone();
        window.dispatchEvent(new Event('preloader-done'));
      }
    });

    // Fase 1: Initial state & Logo reveal (0s - 1.5s)
    gsap.set(logoRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(overlayRef.current, { opacity: 1 });

    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'expo.out',
    })
    .to(logoRef.current, {
      filter: 'drop-shadow(0 0 35px #70C492) drop-shadow(0 0 10px #70C492)',
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    }, '-=0.2')

    // Fase 2: Massive scale up + camera zoom inside (1.5s - 2.5s)
    .to(logoRef.current, {
      scale: 22,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.in',
    }, '+=0.1')
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.4');

    return () => {
      if (tl) tl.kill();
      document.body.style.overflow = '';
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#112C1E', // void teal background
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Cinematic Logo */}
      <h1
        ref={logoRef}
        className="font-cyber animate-pulse-lime"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 900,
          color: '#70C492',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 0 15px rgba(112, 196, 146, 0.6))',
          transformOrigin: 'center center',
          textAlign: 'center',
          willChange: 'transform, opacity, filter',
        }}
      >
        OSCAR
      </h1>
    </div>
  );
}
