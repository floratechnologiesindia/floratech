import { notFound } from 'next/navigation';
import Link from 'next/link';
import MediaFrame from '../../../components/MediaFrame';
import { getServiceBySlug, getServices } from '../../../lib/api';
import { getServiceImage } from '../../../lib/imageMap';
import { buildDetailMetadata, getSiteUrl, serviceJsonLd } from '../../../lib/seo';

export async function generateStaticParams() {
  const list = await getServices();
  return list.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) {
    return { title: 'Service | Flora Technologies' };
  }
  return buildDetailMetadata({
    path: `/services/${service.slug}`,
    title: service.title,
    metaTitle: service.metaTitle || undefined,
    description: service.summary,
    metaDescription: service.metaDescription || undefined,
    imageUrl: service.imageUrl || undefined,
    imageAlt: service.imageAlt,
    noIndex: service.noIndex,
  });
}

export default async function ServiceDetail({ params }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) return notFound();

  const fallback = getServiceImage(service.slug);
  const img = {
    src: service.imageUrl || fallback.src,
    alt: service.imageAlt || fallback.alt,
  };

  const jsonLd = serviceJsonLd(service, getSiteUrl());

  return (
    <section className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="section-heading">
        <p className="eyebrow">Service</p>
        <h1>{service.title}</h1>
        <p>{service.details}</p>
      </div>
      <div className="glass-card detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        <MediaFrame src={img.src} alt={img.alt} variant="wide" sizes="(max-width: 900px) 100vw, 780px" />
        <div style={{ padding: '0 2rem 2rem' }}>
          <h2>Why it works</h2>
          <p>{service.summary}</p>
          <h3>Key benefits</h3>
          <ul>
            {service.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="cta-actions">
        <Link href="/contact" className="button button-primary">
          Start Your Project
        </Link>
        <Link href="/contact" className="button button-secondary">
          Get Free Consultation
        </Link>
      </div>
    </section>
  );
}
