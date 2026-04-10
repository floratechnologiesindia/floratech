import { notFound } from 'next/navigation';
import Link from 'next/link';
import MediaFrame from '../../../components/MediaFrame';
import { getIndustryBySlug, industries } from '../../../lib/siteData';
import { getIndustryImage } from '../../../lib/imageMap';
import { absoluteUrl, buildDetailMetadata } from '../../../lib/seo';

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const item = getIndustryBySlug(params.slug);
  if (!item) {
    return { title: 'Industry | Flora Technologies' };
  }
  const img = getIndustryImage(item.slug);
  return buildDetailMetadata({
    path: `/industries/${item.slug}`,
    title: item.title,
    description: item.description,
    imageUrl: absoluteUrl(img.src),
    imageAlt: img.alt,
  });
}

export default function IndustryDetail({ params }) {
  const item = getIndustryBySlug(params.slug);
  if (!item) return notFound();

  const img = getIndustryImage(item.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: item.title,
    description: item.description,
    url: absoluteUrl(`/industries/${item.slug}`),
    isPartOf: { '@type': 'WebSite', name: 'Flora Technologies' },
  };

  return (
    <section className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="section-heading">
        <p className="eyebrow">Industry</p>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </div>
      <div className="glass-card detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        <MediaFrame src={img.src} alt={img.alt} variant="wide" sizes="(max-width: 900px) 100vw, 780px" />
        <p style={{ lineHeight: 1.75, color: 'var(--muted)', padding: '0 2rem 2rem' }}>{item.detail}</p>
      </div>
      <div className="cta-actions">
        <Link href="/contact" className="button button-primary">
          Get Free Consultation
        </Link>
        <Link href="/services" className="button button-secondary">
          Explore services
        </Link>
      </div>
    </section>
  );
}
