'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import MediaFrame from './MediaFrame';

const AUTO_MS = 5500;

/**
 * @typedef {{ type: 'industry'; title: string; slug: string; description: string; detail: string; imageSrc: string; imageAlt: string }} IndustrySlide
 * @typedef {{ type: 'phd'; title: string; subtitle: string; details: string; serviceSlug: string; imageSrc: string; imageAlt: string }} PhdSlide
 * @param {{ slides: (IndustrySlide | PhdSlide)[] }} props
 */
export default function IndustrySpotlightCarousel({ slides }) {
  const viewportRef = useRef(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const count = slides?.length ?? 0;

  const goTo = useCallback(
    (i) => {
      const el = viewportRef.current;
      if (!el || count === 0) return;
      const idx = ((i % count) + count) % count;
      el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
      setActive(idx);
    },
    [count]
  );

  const onScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el || count === 0) return;
    const w = el.offsetWidth || 1;
    const i = Math.round(el.scrollLeft / w);
    setActive(Math.min(count - 1, Math.max(0, i)));
  }, [count]);

  useEffect(() => {
    if (count <= 1) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return undefined;

    const tick = () => {
      if (pausedRef.current) return;
      const el = viewportRef.current;
      if (!el) return;
      const w = el.offsetWidth || 1;
      const next = Math.round(el.scrollLeft / w);
      const target = (next + 1) % count;
      el.scrollTo({ left: target * w, behavior: 'smooth' });
      setActive(target);
    };

    const id = window.setInterval(tick, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count]);

  if (!slides?.length) return null;

  return (
    <div
      className="spotlight-carousel glass-card"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={viewportRef}
        className="spotlight-viewport"
        onScroll={onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label="Industry and audience highlights"
      >
        <div className="spotlight-track">
          {slides.map((slide, i) => (
            <div
              key={`${slide.type}-${slide.type === 'industry' ? slide.slug : 'phd'}-${i}`}
              className="spotlight-slide"
              aria-hidden={active !== i}
              id={`spotlight-panel-${i}`}
              role="tabpanel"
            >
              {slide.type === 'industry' ? (
                <div className="spotlight-slide-inner">
                  <p className="eyebrow">{slide.title}</p>
                  <h2 className="spotlight-slide-title">{slide.description}</h2>
                  <div className="phd-split spotlight-split">
                    <MediaFrame
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      variant="tall"
                      sizes="(max-width: 900px) 100vw, 480px"
                    />
                    <div className="glass-card detail-card spotlight-copy-card">
                      <p>{slide.detail}</p>
                      <Link href={`/industries/${slide.slug}`} className="link-text">
                        Industry focus
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="spotlight-slide-inner spotlight-slide-inner--phd">
                  <p className="eyebrow">PhD &amp; scientist portfolios</p>
                  <h2 className="spotlight-slide-title">Dedicated websites for researchers and academics</h2>
                  {slide.subtitle ? <p className="spotlight-lead">{slide.subtitle}</p> : null}
                  <div className="phd-split">
                    <MediaFrame
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      variant="tall"
                      sizes="(max-width: 900px) 100vw, 480px"
                    />
                    <div className="glass-card detail-card" style={{ marginTop: 0 }}>
                      <p>{slide.details}</p>
                      <div className="cta-actions">
                        <Link href={`/services/${slide.serviceSlug}`} className="button button-primary">
                          Explore academic portfolios
                        </Link>
                        <Link href="/contact" className="button button-secondary">
                          Get Free Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="spotlight-controls">
          <div className="spotlight-dots" role="tablist" aria-label="Carousel slides">
            {slides.map((slide, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls={`spotlight-panel-${i}`}
                className={`spotlight-dot${active === i ? ' is-active' : ''}`}
                onClick={() => goTo(i)}
                title={
                  slide.type === 'industry'
                    ? slide.title
                    : 'PhD & scientist portfolios'
                }
              />
            ))}
          </div>
          <div className="spotlight-arrows">
            <button
              type="button"
              className="spotlight-arrow"
              aria-label="Previous slide"
              onClick={() => goTo(active - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="spotlight-arrow"
              aria-label="Next slide"
              onClick={() => goTo(active + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
