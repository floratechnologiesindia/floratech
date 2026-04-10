import { getServices, getPortfolioList, getBlogPosts } from '../lib/api';
import { industries } from '../lib/siteData';
import { getSiteUrl } from '../lib/seo';

function toLastMod(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const d = c instanceof Date ? c : new Date(c);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const [services, portfolio, posts] = await Promise.all([getServices(), getPortfolioList(), getBlogPosts()]);

  const entries = [
    '/',
    '/services',
    '/industries',
    '/portfolio',
    '/blog',
    '/contact',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  industries.forEach((i) => {
    entries.push({
      url: `${siteUrl}/industries/${i.slug}`,
      lastModified: new Date(),
    });
  });

  services
    .filter((s) => !s.noIndex)
    .forEach((s) => {
      entries.push({
        url: `${siteUrl}/services/${s.slug}`,
        lastModified: toLastMod(s.updatedAt, s.createdAt),
      });
    });

  portfolio
    .filter((item) => !item.noIndex)
    .forEach((item) => {
      entries.push({
        url: `${siteUrl}/portfolio/${item.slug}`,
        lastModified: toLastMod(item.updatedAt, item.createdAt),
      });
    });

  posts
    .filter((post) => !post.noIndex)
    .forEach((post) => {
      entries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: toLastMod(post.updatedAt, post.publishedAt),
      });
    });

  return entries;
}
