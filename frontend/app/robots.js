import { getSiteUrl } from '../lib/seo';

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
