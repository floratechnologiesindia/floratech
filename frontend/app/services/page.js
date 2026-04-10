import Link from 'next/link';
import MediaFrame from '../../components/MediaFrame';
import { getServices } from '../../lib/api';
import { getServiceImage, listPageBanners } from '../../lib/imageMap';
import { absoluteUrl, truncateMetaDescription } from '../../lib/seo';

const desc =
  'Websites, e-commerce, CRM and SaaS, AI chatbots, blockchain, SEO, and academic portfolios for MSMEs and global clients.';

export const metadata = {
  title: 'Services | Flora Technologies',
  description: truncateMetaDescription(desc, 165),
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Flora Technologies',
    description: truncateMetaDescription(desc, 160),
    url: absoluteUrl('/services'),
    type: 'website',
  },
};

export default async function ServicesPage() {
  const services = await getServices();
  const banner = listPageBanners.services;

  return (
    <section className="page-shell">
      <div className="page-banner glass-card">
        <MediaFrame src={banner.src} alt={banner.alt} variant="wide" priority sizes="100vw" />
      </div>
      <div className="section-heading">
        <p className="eyebrow">Services</p>
        <h1>Full-service digital design, development, and marketing</h1>
        <p>Explore our carefully crafted service offerings for websites, AI, blockchain, SaaS, and growth marketing.</p>
      </div>
      <div className="grid cards-grid">
        {services.map((service) => {
          const fallback = getServiceImage(service.slug);
          const img = {
            src: service.imageUrl || fallback.src,
            alt: service.imageAlt || fallback.alt,
          };
          return (
            <article key={service.slug} className="service-card glass-card card-media-top">
              <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 520px" />
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
              <Link href={`/services/${service.slug}`} className="link-text">
                Read details
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
