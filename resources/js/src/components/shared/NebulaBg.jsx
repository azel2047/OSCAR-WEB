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

    // Create an offscreen canvas to pre-render the glow particle once
    const glowCanvas = document.createElement('canvas');
    const glowSize = 32; // Diameter of the glow (radius 16px)
    glowCanvas.width = glowSize;
    glowCanvas.height = glowSize;
    const gCtx = glowCanvas.getContext('2d');
    
    // Draw the gradient ONCE
    const grad = gCtx.createRadialGradient(glowSize/2, glowSize/2, 0, glowSize/2, glowSize/2, glowSize/2);
    grad.addColorStop(0, 'rgba(112, 196, 146, 1)');
    grad.addColorStop(0.3, 'rgba(112, 196, 146, 0.4)');
    grad.addColorStop(1, 'rgba(112, 196, 146, 0)');
    
    gCtx.beginPath();
    gCtx.arc(glowSize/2, glowSize/2, glowSize/2, 0, Math.PI * 2);
    gCtx.fillStyle = grad;
    gCtx.fill();

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

        // Reset if went out of screen at top (use diameter size boundary)
        const size = f.r * 7;
        if (f.y < -size) {
          f.y = height + size;
          f.x = Math.random() * width;
        }

        // Horizontal wrap boundaries
        if (f.x < -size) f.x = width + size;
        if (f.x > width + size) f.x = -size;

        // Draw the pre-rendered glowing circle with scale & opacity
        ctx.globalAlpha = f.opacity;
        ctx.drawImage(glowCanvas, f.x - size / 2, f.y - size / 2, size, size);
      });

      ctx.globalAlpha = 1.0; // Reset canvas alpha
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
