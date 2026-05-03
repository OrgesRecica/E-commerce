import { useEffect } from 'react';

/**
 * Two-layer custom cursor:
 *  - dot (small, instant)
 *  - ring (large, eased follow + grow on hover targets)
 *
 * Auto-disabled on touch devices via media query in CSS.
 */
export default function Cursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const setVar = (el, x, y) => {
      el.style.setProperty('--cursor-x', x + 'px');
      el.style.setProperty('--cursor-y', y + 'px');
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      setVar(dot, mx, my);
      setVar(ring, rx, ry);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onEnter = (e) => {
      const t = e.target.closest('a, button, [role="button"], [data-cursor="hover"]');
      if (t) document.body.classList.add('cursor-hover');
      const txt = e.target.closest('input, textarea, [contenteditable="true"]');
      if (txt) document.body.classList.add('cursor-text');
    };
    const onLeave = (e) => {
      const t = e.target.closest('a, button, [role="button"], [data-cursor="hover"]');
      if (t) document.body.classList.remove('cursor-hover');
      const txt = e.target.closest('input, textarea, [contenteditable="true"]');
      if (txt) document.body.classList.remove('cursor-text');
    };
    const onWindowLeave = () => {
      dot.style.opacity = ring.style.opacity = '0';
    };
    const onWindowEnter = () => {
      dot.style.opacity = ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });
    document.addEventListener('mouseleave', onWindowLeave);
    document.addEventListener('mouseenter', onWindowEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mouseleave', onWindowLeave);
      document.removeEventListener('mouseenter', onWindowEnter);
      dot.remove(); ring.remove();
    };
  }, []);

  return null;
}
