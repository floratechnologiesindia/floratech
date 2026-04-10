/** @param {string | undefined} base */
export function getSiteUrl(base) {
  const raw = base || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.floratechnologies.in';
  return raw.replace(/\/$/, '');
}

/** @param {string} path */
export function absoluteUrl(path) {
  const base = getSiteUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

const DEFAULT_TITLE_SUFFIX = ' | Flora Technologies';

/**
 * @param {string | undefined} text
 * @param {number} max
 */
export function truncateMetaDescription(text, max = 160) {
  if (!text || typeof text !== 'string') return '';
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

/**
 * @param {{
 *   path: string;
 *   title: string;
 *   metaTitle?: string;
 *   description?: string;
 *   metaDescription?: string;
 *   imageUrl?: string;
 *   imageAlt?: string;
 *   ogType?: 'website' | 'article';
 *   publishedTime?: string | Date | null;
 *   modifiedTime?: string | Date | null;
 *   noIndex?: boolean;
 * }} opts
 */
export function buildDetailMetadata(opts) {
  const {
    path,
    title,
    metaTitle,
    description = '',
    metaDescription,
    imageUrl,
    imageAlt,
    ogType = 'website',
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = opts;

  const canonical = absoluteUrl(path);
  const desc = truncateMetaDescription(metaDescription || description);
  const pageTitle = metaTitle ? `${metaTitle}${DEFAULT_TITLE_SUFFIX}` : `${title}${DEFAULT_TITLE_SUFFIX}`;
  const ogTitle = metaTitle || title;

  /** @type {import('next').Metadata} */
  const meta = {
    title: pageTitle,
    description: desc || undefined,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description: desc || undefined,
      url: canonical,
      siteName: 'Flora Technologies',
      type: ogType,
      locale: 'en_IN',
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: desc || undefined,
    },
  };

  if (imageUrl) {
    meta.openGraph.images = [{ url: imageUrl, alt: imageAlt || ogTitle }];
    meta.twitter.images = [imageUrl];
  }

  if (ogType === 'article' && publishedTime) {
    meta.openGraph.publishedTime = new Date(publishedTime).toISOString();
    if (modifiedTime) {
      meta.openGraph.modifiedTime = new Date(modifiedTime).toISOString();
    }
  }

  return meta;
}

/**
 * @param {object} post
 * @param {string} siteUrl
 */
export function blogPostingJsonLd(post, siteUrl) {
  const url = `${siteUrl}/blog/${post.slug}`;
  const img = post.featuredImage;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: truncateMetaDescription(post.metaDescription || post.excerpt, 200),
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Organization',
      name: 'Flora Technologies',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Flora Technologies',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/flora-logo.svg`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    ...(img && {
      image: [img],
    }),
  };
}

/**
 * @param {object} service
 * @param {string} siteUrl
 */
export function serviceJsonLd(service, siteUrl) {
  const url = `${siteUrl}/services/${service.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: truncateMetaDescription(service.metaDescription || service.summary, 240),
    provider: { '@type': 'Organization', name: 'Flora Technologies', url: siteUrl },
    url,
    ...(service.imageUrl && { image: service.imageUrl }),
  };
}

/**
 * @param {object} item
 * @param {string} siteUrl
 */
export function portfolioCaseJsonLd(item, siteUrl) {
  const url = `${siteUrl}/portfolio/${item.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: truncateMetaDescription(item.metaDescription || item.summary, 240),
    url,
    author: { '@type': 'Organization', name: 'Flora Technologies' },
    ...(item.imageUrl && { image: item.imageUrl }),
  };
}
