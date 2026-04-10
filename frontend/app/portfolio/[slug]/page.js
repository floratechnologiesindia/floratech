import { notFound } from 'next/navigation';
import Link from 'next/link';
import MediaFrame from '../../../components/MediaFrame';
import { getPortfolioBySlug, getPortfolioList } from '../../../lib/api';
import { getPortfolioImage } from '../../../lib/imageMap';
import { buildDetailMetadata, getSiteUrl, portfolioCaseJsonLd } from '../../../lib/seo';

export async function generateStaticParams() {
  const list = await getPortfolioList();
  return list.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const item = await getPortfolioBySlug(params.slug);
  if (!item) {
    return { title: 'Case Study | Flora Technologies' };
  }
  return buildDetailMetadata({
    path: `/portfolio/${item.slug}`,
    title: item.title,
    metaTitle: item.metaTitle || undefined,
    description: item.summary,
    metaDescription: item.metaDescription || undefined,
    imageUrl: item.imageUrl || undefined,
    imageAlt: item.imageAlt,
    noIndex: item.noIndex,
  });
}

export default async function PortfolioDetail({ params }) {
  const item = await getPortfolioBySlug(params.slug);
  if (!item) return notFound();

  const fallback = getPortfolioImage(item.slug);
  const img = {
    src: item.imageUrl || fallback.src,
    alt: item.imageAlt || fallback.alt,
  };

  const jsonLd = portfolioCaseJsonLd(item, getSiteUrl());

  return (
    <section className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="section-heading">
        <p className="eyebrow">Case Study</p>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
      </div>
      <div className="glass-card detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        <MediaFrame src={img.src} alt={img.alt} variant="wide" sizes="(max-width: 900px) 100vw, 780px" />
        <div style={{ padding: '0 2rem 2rem' }}>
          {item.client && (
            <>
              <h2>Client</h2>
              <p>{item.client}</p>
            </>
          )}
          <h2>Industry</h2>
          <p>{item.industry}</p>
          {item.challenges && (
            <>
              <h2>Challenge</h2>
              <p>{item.challenges}</p>
            </>
          )}
          {item.solution && (
            <>
              <h2>Solution</h2>
              <p>{item.solution}</p>
            </>
          )}
          <h2>Outcome</h2>
          <p>{item.result}</p>
        </div>
      </div>
      <div className="cta-actions">
        <Link href="/contact" className="button button-primary">
          Discuss your project
        </Link>
      </div>
    </section>
  );
}
