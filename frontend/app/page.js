import Image from 'next/image';
import Link from 'next/link';
import MediaFrame from '../components/MediaFrame';
import IndustrySpotlightCarousel from '../components/IndustrySpotlightCarousel';
import { getServices, getPortfolioList } from '../lib/api';
import { industries, pricingPackages, trustSignals } from '../lib/siteData';
import {
  getIndustryImage,
  getPortfolioImage,
  getPricingImage,
  getServiceImage,
  heroImage,
  pageImages,
  trustImages,
} from '../lib/imageMap';
import { absoluteUrl, truncateMetaDescription } from '../lib/seo';

export const metadata = {
  title: 'Naturally Intelligent Digital Solutions for MSMEs, Startups & Researchers',
  description: truncateMetaDescription(
    'We empower MSMEs, startups, researchers, and global clients with websites, e-commerce, AI chatbots, blockchain, CRM/LMS SaaS, and SEO—built for growth and trust.',
    165
  ),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Flora Technologies — Naturally Intelligent Digital Solutions',
    description: truncateMetaDescription(
      'Websites, e-commerce, AI, blockchain, SaaS platforms, and SEO for MSMEs and researchers.',
      160
    ),
    url: absoluteUrl('/'),
    type: 'website',
    images: [{ url: heroImage.src, width: 1200, height: 630, alt: heroImage.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flora Technologies — Naturally Intelligent',
    description: truncateMetaDescription(
      'Digital solutions for MSMEs, startups, and researchers—websites, AI, blockchain, SEO.',
      160
    ),
    images: [heroImage.src],
  },
};

export default async function HomePage() {
  const [services, portfolio] = await Promise.all([getServices(), getPortfolioList()]);
  const heroServices = services.slice(0, 5);
  const phdService = services.find((s) => s.slug === 'phd-scientist-portfolio-websites');

  const spotlightSlugs = ['msmes', 'startups', 'blockchain-technologies'];
  const industrySpotlightSlides = spotlightSlugs
    .map((slug) => industries.find((ind) => ind.slug === slug))
    .filter(Boolean)
    .map((item) => {
      const img = getIndustryImage(item.slug);
      return {
        type: 'industry',
        title: item.title,
        slug: item.slug,
        description: item.description,
        detail: item.detail,
        imageSrc: img.src,
        imageAlt: img.alt,
      };
    });

  const spotlightSlides = [
    ...industrySpotlightSlides,
    ...(phdService
      ? [
          {
            type: 'phd',
            title: 'PhD & scientist portfolios',
            subtitle:
              'Showcase publications, research themes, conferences, and collaborations with a globally accessible, professional presence.',
            details: phdService.details,
            serviceSlug: phdService.slug,
            imageSrc: pageImages.phdSection.src,
            imageAlt: pageImages.phdSection.alt,
          },
        ]
      : []),
  ];

  return (
    <section className="page-shell">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Flora Technologies</span>
          <h1>Naturally Intelligent Digital Solutions for Growing Businesses</h1>
          <p>
            We empower MSMEs, startups, researchers, and global clients with websites, AI platforms, blockchain, and
            SEO strategies designed to scale.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button button-primary">
              Get Free Consultation
            </Link>
            <Link href="/services" className="button button-secondary">
              Start Your Project
            </Link>
          </div>
        </div>
        <div className="hero-side glass-card card-media-top">
          <MediaFrame
            src={heroImage.src}
            alt={heroImage.alt}
            variant="hero"
            priority
            sizes="(max-width: 900px) 100vw, 420px"
          />
          <h2>Trusted Digital Growth</h2>
          <p>Launch faster with modern UX, performance optimization, and a conversion-first digital strategy.</p>
          <div className="metrics-grid">
            <div>
              <strong>24/7</strong>
              <span>Automation support</span>
            </div>
            <div>
              <strong>MSME</strong>
              <span>Focus & affordability</span>
            </div>
            <div>
              <strong>PhD</strong>
              <span>Portfolio expertise</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Why teams choose us</p>
          <h2>Signals you can trust</h2>
        </div>
        <div className="grid trust-grid">
          {trustSignals.map((item, i) => {
            const img = trustImages[i];
            return (
              <article key={item.title} className="glass-card service-card card-media-top">
                {img && (
                  <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 360px" />
                )}
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Our Services</p>
          <h2>Solutions built for business growth</h2>
        </div>
        <div className="grid cards-grid">
          {heroServices.map((service) => {
            const fallback = getServiceImage(service.slug);
            const img = {
              src: service.imageUrl || fallback.src,
              alt: service.imageAlt || fallback.alt,
            };
            return (
              <article key={service.slug} className="service-card glass-card card-media-top">
                <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 520px" />
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <Link href={`/services/${service.slug}`} className="link-text">
                  Learn more
                </Link>
              </article>
            );
          })}
        </div>
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/services" className="link-text">
            View all services
          </Link>
        </p>
      </section>

      {spotlightSlides.length > 0 && (
        <section className="section-block alt-block phd-highlight home-industry-spotlight">
          <div className="section-heading">
            <p className="eyebrow">Who we work with</p>
            <h2>MSMEs, startups, blockchain teams, and PhD portfolios</h2>
            <p>
              The same craft and care across every audience—scroll the carousel to see how we tailor digital foundations
              for growth, innovation, and research credibility.
            </p>
          </div>
          <IndustrySpotlightCarousel slides={spotlightSlides} />
        </section>
      )}

      <section className="section-block alt-block">
        <div className="section-heading">
          <p className="eyebrow">Industries</p>
          <h2>Digital services tailored to your business type</h2>
        </div>
        <div className="grid industry-grid">
          {industries.map((item) => {
            const img = getIndustryImage(item.slug);
            return (
              <div key={item.slug} className="industry-card glass-card card-media-top">
                <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 520px" />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Link href={`/industries/${item.slug}`} className="link-text">
                  Industry focus
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Portfolio</p>
          <h2>Selected case studies</h2>
        </div>
        <div className="grid case-grid">
          {portfolio.map((item) => {
            const fallback = getPortfolioImage(item.slug);
            const img = {
              src: item.imageUrl || fallback.src,
              alt: item.imageAlt || fallback.alt,
            };
            return (
              <article key={item.slug} className="case-card glass-card card-media-top">
                <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 520px" />
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <strong>{item.result}</strong>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link href={`/portfolio/${item.slug}`} className="link-text">
                    Read case study
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block alt-block">
        <div className="section-heading">
          <p className="eyebrow">Pricing</p>
          <h2>Packages for MSMEs and growing brands</h2>
        </div>
        <div className="grid pricing-grid">
          {pricingPackages.map((packageInfo) => {
            const img = getPricingImage(packageInfo.name);
            return (
              <div key={packageInfo.name} className="pricing-card glass-card card-media-top">
                <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 360px" />
                <h3>{packageInfo.name}</h3>
                <p className="price">{packageInfo.price}</p>
                <ul>
                  {packageInfo.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block cta-strip cta-strip-visual">
        <div className="cta-strip-bg">
          <Image
            src={pageImages.cta.src}
            alt=""
            fill
            className="cta-strip-bg-img"
            sizes="100vw"
            priority={false}
          />
        </div>
        <div className="cta-copy">
          <p className="eyebrow">Ready to grow?</p>
          <h2>Book your free consultation and start your digital transformation.</h2>
        </div>
        <Link href="/contact" className="button button-primary">
          Get Free Consultation
        </Link>
      </section>
    </section>
  );
}
