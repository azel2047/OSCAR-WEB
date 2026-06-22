import { useEffect, useRef } from 'react';

/**
 * NebulaBg (Teal Cyber Rainforest Fireflies Canvas) — Pure HTML5 Canvas particle system.
 * Renders 30 neon teal fireflies (#70C492) max on all screens to guarantee high performance.
 * Slow upward motion + horizontal sinusoidal drift.
 */
export default function NebulaBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSizes = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSizes();

    const handleResize = () => {
      setSizes();
    };
    window.addEventListener('resize', handleResize);

    const fireflyCount = 30; // Max 30 particles as requested

    // 30 sharp glowing particles with varying size and opacity in Teal
    const fireflies = Array.from({ length: fireflyCount }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2, // 1px to 3px radius
        opacity: 0.3 + Math.random() * 0.4, // opacity 0.3 - 0.7
        speedY: 0.12 + Math.random() * 0.28, // slow upward velocity
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.001 + Math.random() * 0.002, // slow drift speed
        driftAmp: 0.15 + Math.random() * 0.35 // subtle side to side drift
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      fireflies.forEach((f) => {
        // Move upward and drift left-right
        f.y -= f.speedY;
        f.driftPhase += f.driftSpeed;
        f.x += Math.sin(f.driftPhase) * f.driftAmp;

        // Reset if went out of screen at top
        if (f.y < -f.r) {
          f.y = height + f.r;
          f.x = Math.random() * width;
        }

        // Horizontal wrap boundaries
        if (f.x < -f.r) f.x = width + f.r;
        if (f.x > width + f.r) f.x = -f.r;

        // Draw glowing siber teal circle with radial gradient
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 3.5);
        grad.addColorStop(0, `rgba(112, 196, 146, ${f.opacity})`);
        grad.addColorStop(0.4, `rgba(112, 196, 146, ${f.opacity * 0.3})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#112C1E' // Void Teal background
      }}
    />
  );
}
