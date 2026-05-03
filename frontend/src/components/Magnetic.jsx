import { useRef } from 'react';

/**
 * Magnetic wrapper — child translates toward cursor when within radius.
 * Usage:
 *   <Magnetic>
 *     <button>...</button>
 *   </Magnetic>
 */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const inner = el.firstElementChild;
    if (inner) inner.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild;
    if (inner) inner.style.transform = 'translate(0,0)';
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`magnetic inline-flex ${className}`}>
      {children}
    </div>
  );
}
