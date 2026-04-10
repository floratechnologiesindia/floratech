import Link from 'next/link';
import MediaFrame from '../../components/MediaFrame';
import { industries } from '../../lib/siteData';
import { getIndustryImage, listPageBanners } from '../../lib/imageMap';
import { absoluteUrl, truncateMetaDescription } from '../../lib/seo';

const desc =
  'Digital strategies for MSMEs, startups, and researchers—tailored websites, SaaS, and portfolios.';

export const metadata = {
  title: 'Industries | Flora Technologies',
  description: truncateMetaDescription(desc, 165),
  alternates: { canonical: '/industries' },
  openGraph: {
    title: 'Industries | Flora Technologies',
    description: truncateMetaDescription(desc, 160),
    url: absoluteUrl('/industries'),
    type: 'website',
    images: [{ url: listPageBanners.industries.src, alt: listPageBanners.industries.alt }],
  },
};

export default function IndustriesPage() {
  const banner = listPageBanners.industries;

  return (
    <section className="page-shell">
      <div className="page-banner glass-card">
        <MediaFrame src={banner.src} alt={banner.alt} variant="wide" priority sizes="100vw" />
      </div>
      <div className="section-heading">
        <p className="eyebrow">Industries</p>
        <h1>Industry-focused digital strategies</h1>
        <p>Our services are optimized for MSMEs, startups, and research professionals who want a modern online presence.</p>
      </div>
      <div className="grid industry-grid">
        {industries.map((item) => {
          const img = getIndustryImage(item.slug);
          return (
            <article key={item.slug} className="industry-card glass-card card-media-top">
              <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 520px" />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <Link href={`/industries/${item.slug}`} className="link-text">
                View industry focus
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
