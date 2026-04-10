import { notFound } from 'next/navigation';
import Link from 'next/link';
import MediaFrame from '../../../components/MediaFrame';
import { getBlogBySlug, getBlogPosts } from '../../../lib/api';
import { getBlogImage } from '../../../lib/imageMap';
import { blogPostingJsonLd, buildDetailMetadata, getSiteUrl } from '../../../lib/seo';
import { sanitizeBlogHtml } from '../../../lib/sanitizeBlogHtml';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getBlogBySlug(params.slug);
  if (!post) {
    return { title: 'Blog | Flora Technologies' };
  }
  return buildDetailMetadata({
    path: `/blog/${post.slug}`,
    title: post.title,
    metaTitle: post.metaTitle || undefined,
    description: post.excerpt,
    metaDescription: post.metaDescription || undefined,
    imageUrl: post.featuredImage || undefined,
    imageAlt: post.featuredImageAlt,
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    noIndex: post.noIndex,
  });
}

export default async function BlogDetail({ params }) {
  const post = await getBlogBySlug(params.slug);
  if (!post) return notFound();

  const fallback = getBlogImage(post.slug);
  const img = {
    src: post.featuredImage || fallback.src,
    alt: post.featuredImageAlt || fallback.alt,
  };

  const jsonLd = blogPostingJsonLd(post, getSiteUrl());

  return (
    <section className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="section-heading">
        <p className="eyebrow">Blog Article</p>
        <h1>{post.title}</h1>
      </div>
      <article className="glass-card detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        <MediaFrame src={img.src} alt={img.alt} variant="wide" sizes="(max-width: 900px) 100vw, 780px" />
        <div style={{ padding: '0 2rem 2rem' }}>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
          />
        </div>
      </article>
      <div className="cta-actions">
        <Link href="/contact" className="button button-secondary">
          Get a free consultation
        </Link>
      </div>
    </section>
  );
}
