import { useEffect, useState, useRef } from 'react';

/**
 * Animates a number from 0 → target when the element enters viewport.
 * Returns [displayValue, refToAttach].
 */
export function useCounter(target, { duration = 1600, decimals = 0 } = {}) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            const start = performance.now();
            const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
            const tick = (now) => {
              const t = Math.min((now - start) / duration, 1);
              setVal(Number((target * ease(t)).toFixed(decimals)));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, decimals]);

  return [val, ref];
}
