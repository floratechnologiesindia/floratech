'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL_SELECTORS = [
  '.section-heading',
  '.glass-card',
  '.cta-strip',
  '.hero-copy',
  '.hero-card',
  '.cta-actions',
  '.page-shell h1',
  '.page-shell h2',
  '.page-shell h3',
  '.page-shell p',
  '.page-shell li',
];

export default function AutoReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const elements = Array.from(document.querySelectorAll(REVEAL_SELECTORS.join(',')));
    if (elements.length === 0) return undefined;

    elements.forEach((el, i) => {
      el.classList.add('reveal-init');
      el.style.setProperty('--reveal-delay', `${Math.min(i * 35, 280)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
