'use client';

import { useEffect } from 'react';

export default function ParallaxDecor() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const top = document.querySelector('.parallax-orb-top');
    const bottom = document.querySelector('.parallax-orb-bottom');
    if (!top || !bottom) return undefined;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        top.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        bottom.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="parallax-decor" aria-hidden="true">
      <span className="parallax-orb parallax-orb-top" />
      <span className="parallax-orb parallax-orb-bottom" />
    </div>
  );
}
