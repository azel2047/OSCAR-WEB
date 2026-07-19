import { useState, useEffect, useRef } from 'react';

/**
 * Countdown timer hook.
 * @param {string|Date} targetDate  - ISO string or Date object
 * @returns {{ days, hours, minutes, seconds, isExpired }}
 *
 * @example
 * const { days, hours, minutes, seconds, isExpired } = useCountdown('2025-09-01T00:00:00');
 */
export function useCountdown(targetDate) {
  const calculate = () => {
    const now  = new Date();
    const end  = new Date(targetDate);
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days:      Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:     Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes:   Math.floor((diff / (1000 * 60)) % 60),
      seconds:   Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timeLeft.isExpired) return;

    intervalRef.current = setInterval(() => {
      const next = calculate();
      setTimeLeft(next);
      if (next.isExpired) clearInterval(intervalRef.current);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [targetDate]);

  return timeLeft;
}

export default useCountdown;
