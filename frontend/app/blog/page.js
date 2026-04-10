import Link from 'next/link';
import MediaFrame from '../../components/MediaFrame';
import { getBlogPosts } from '../../lib/api';
import { getBlogImage, listPageBanners } from '../../lib/imageMap';
import { absoluteUrl, truncateMetaDescription } from '../../lib/seo';

const desc = 'Guides on websites, AI chatbots, SEO, and digital growth for MSMEs and researchers.';

export const metadata = {
  title: 'Blog | Flora Technologies',
  description: truncateMetaDescription(desc, 165),
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Flora Technologies',
    description: truncateMetaDescription(desc, 160),
    url: absoluteUrl('/blog'),
    type: 'website',
    images: [{ url: listPageBanners.blog.src, alt: listPageBanners.blog.alt }],
  },
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const banner = listPageBanners.blog;

  return (
    <section className="page-shell">
      <div className="page-banner glass-card">
        <MediaFrame src={banner.src} alt={banner.alt} variant="wide" priority sizes="100vw" />
      </div>
      <div className="section-heading">
        <p className="eyebrow">Blog</p>
        <h1>Insights for digital growth and intelligent transformation</h1>
        <p>Read practical guides for websites, AI chatbots, and online visibility tailored for MSMEs and researchers.</p>
      </div>
      <div className="grid blog-grid">
        {blogPosts.map((post) => {
          const fallback = getBlogImage(post.slug);
          const img = {
            src: post.featuredImage || fallback.src,
            alt: post.featuredImageAlt || fallback.alt,
          };
          return (
            <article key={post.slug} className="blog-card glass-card card-media-top">
              <MediaFrame src={img.src} alt={img.alt} variant="tall" sizes="(max-width: 900px) 100vw, 520px" />
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="link-text">
                Read article
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
