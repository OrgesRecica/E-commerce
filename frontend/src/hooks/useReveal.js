import { useEffect } from 'react';

export function useReveal(selector = '.reveal', threshold = 0.15) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, threshold]);
}

export function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.transform = `scaleX(${pct / 100})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
