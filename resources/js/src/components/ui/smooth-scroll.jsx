import { ReactLenis } from 'lenis/react';
import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SmoothScroll = forwardRef((props, ref) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = lenisRef.current?.lenis;
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, []);

  return (
    <ReactLenis 
      ref={lenisRef} 
      root 
      options={{
        autoRaf: false,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium expoOut curve
        smoothWheel: true,
      }}
    >
      <div ref={ref} {...props}>
        {props.children}
      </div>
    </ReactLenis>
  );
});

SmoothScroll.displayName = 'SmoothScroll';

export default SmoothScroll;
