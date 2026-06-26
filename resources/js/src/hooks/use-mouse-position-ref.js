import { useEffect, useRef } from "react";

export const useMousePositionRef = (containerRef) => {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let cachedRect = null;

    const updatePosition = (x, y) => {
      if (containerRef && containerRef.current) {
        if (!cachedRect) {
          cachedRect = containerRef.current.getBoundingClientRect();
        }
        const relativeX = x - cachedRect.left - cachedRect.width / 2;
        const relativeY = y - cachedRect.top - cachedRect.height / 2;

        // Calculate relative position even when outside the container
        positionRef.current = { x: relativeX, y: relativeY };
      } else {
        positionRef.current = { x: x - window.innerWidth / 2, y: y - window.innerHeight / 2 };
      }
    };

    const handleMouseMove = (ev) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    const handleResize = () => {
      cachedRect = null;
    };

    // Listen for mouse, touch, and window resize events
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRef]);

  return positionRef;
};
