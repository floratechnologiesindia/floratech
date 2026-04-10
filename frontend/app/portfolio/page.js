import Link from 'next/link';
import MediaFrame from '../../components/MediaFrame';
import { getPortfolioList } from '../../lib/api';
import { getPortfolioImage, listPageBanners } from '../../lib/imageMap';
import { absoluteUrl, truncateMetaDescription } from '../../lib/seo';

const desc = 'Case studies for MSMEs, SaaS, e-commerce, and academic research portfolios.';

export const metadata = {
  title: 'Portfolio & Case Studies | Flora Technologies',
  description: truncateMetaDescription(desc, 165),
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio & Case Studies | Flora Technologies',
    description: truncateMetaDescription(desc, 160),
    url: absoluteUrl('/portfolio'),
    type: 'website',
    images: [{ url: listPageBanners.portfolio.src, alt: listPageBanners.portfolio.alt }],
  },
};

export default async function PortfolioPage() {
  const portfolio = await getPortfolioList();
  const banner = listPageBanners.portfolio;

  return (
    <section className="page-shell">
      <div className="page-banner glass-card">
        <MediaFrame src={banner.src} alt={banner.alt} variant="wide" priority sizes="100vw" />
      </div>
      <div className="section-heading">
        <p className="eyebrow">Portfolio</p>
        <h1>Case studies that demonstrate value</h1>
        <p>Explore examples of our work for MSMEs, SaaS platforms, and academic portfolios.</p>
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
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <strong>{item.result}</strong>
              <Link href={`/portfolio/${item.slug}`} className="link-text">
                View case study
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
