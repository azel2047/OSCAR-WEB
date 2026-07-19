import { useEffect, useRef } from 'react';
import { runPreloader } from '@/animations/preloader';

/**
 * Cinematic preloader screen.
 * Mounts on first visit, runs counter 0→100, wipes up, then calls onDone.
 */
export default function Preloader({ onDone }) {
  const preloaderRef = useRef(null);

  useEffect(() => {
    const el = preloaderRef.current;
    if (!el) return;

    // Simulate asset loading with fake progress
    runPreloader(el, onDone);
  }, []);

  return (
    <div ref={preloaderRef} id="preloader" aria-hidden="true" className="bg-[#112C1E] select-none">
      <div className="scan-line" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Counter - massive and glowing */}
        <div className="counter font-display select-none" style={{ color: '#70C492', textShadow: '0 0 20px rgba(112, 196, 146, 0.4)' }}>0</div>
        
        {/* Futuristic Ticker Label */}
        <div className="label tracking-[0.4em] font-mono text-xs text-[#7A9A8A] mt-4">
          🌿 OSCAR 3.0 // CYBER RAINFOREST
        </div>

        {/* Decorative Tech Lines */}
        <div className="mt-16 flex items-center gap-3 opacity-40">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[2px] bg-[#70C492] shadow-[0_0_8px_rgba(112,196,146,0.5)]"
              style={{ width: `${(i + 1) * 16}px` }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ width: '0%', backgroundColor: '#70C492' }} />
    </div>
  );
}
