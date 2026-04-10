import {
  services as fallbackServices,
  portfolio as fallbackPortfolio,
  blogPosts as fallbackBlogPosts,
} from './siteData';

export const REVALIDATE_SECONDS = 60;

function serverApiBase() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:4000';
  return base.replace(/\/$/, '');
}

function toAssetUrl(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${serverApiBase()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

async function fetchFromApi(path) {
  const url = `${serverApiBase()}${path}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function mapService(s) {
  if (!s) return null;
  return {
    title: s.title,
    slug: s.slug,
    summary: s.summary,
    details: s.details,
    features: Array.isArray(s.features) ? s.features : [],
    imageUrl: toAssetUrl(s.imageUrl),
    imageAlt: s.imageAlt || '',
    metaTitle: s.metaTitle || '',
    metaDescription: s.metaDescription || '',
    noIndex: Boolean(s.noIndex),
    updatedAt: s.updatedAt,
    createdAt: s.createdAt,
  };
}

export function mapPortfolioItem(item) {
  if (!item) return null;
  const outcome = item.results ?? item.result ?? '';
  return {
    title: item.title,
    slug: item.slug,
    industry: item.industry,
    summary: item.summary,
    result: outcome,
    client: item.client,
    challenges: item.challenges,
    solution: item.solution,
    results: item.results,
    imageUrl: toAssetUrl(item.imageUrl),
    imageAlt: item.imageAlt || '',
    metaTitle: item.metaTitle || '',
    metaDescription: item.metaDescription || '',
    noIndex: Boolean(item.noIndex),
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  };
}

export function mapBlogPost(p) {
  if (!p) return null;
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    featuredImage: toAssetUrl(p.featuredImage),
    featuredImageAlt: p.featuredImageAlt || '',
    metaTitle: p.metaTitle || '',
    metaDescription: p.metaDescription || '',
    noIndex: Boolean(p.noIndex),
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    author: p.author || 'Flora Technologies',
  };
}

export async function getServices() {
  const data = await fetchFromApi('/api/services');
  if (Array.isArray(data) && data.length > 0) {
    return data.map(mapService);
  }
  return fallbackServices.map((s) => ({ ...s }));
}

export async function getServiceBySlug(slug) {
  const data = await fetchFromApi(`/api/services/${encodeURIComponent(slug)}`);
  if (data && data.slug) return mapService(data);
  const local = fallbackServices.find((x) => x.slug === slug);
  return local ? mapService({ ...local }) : null;
}

export async function getPortfolioList() {
  const data = await fetchFromApi('/api/portfolio');
  if (Array.isArray(data) && data.length > 0) {
    return data.map(mapPortfolioItem);
  }
  return fallbackPortfolio.map((p) => mapPortfolioItem(p));
}

export async function getPortfolioBySlug(slug) {
  const data = await fetchFromApi(`/api/portfolio/${encodeURIComponent(slug)}`);
  if (data && data.slug) return mapPortfolioItem(data);
  const local = fallbackPortfolio.find((x) => x.slug === slug);
  return local ? mapPortfolioItem(local) : null;
}

export async function getBlogPosts() {
  const data = await fetchFromApi('/api/blog');
  if (Array.isArray(data) && data.length > 0) {
    return data.map(mapBlogPost);
  }
  return fallbackBlogPosts.map((p) => mapBlogPost(p));
}

export async function getBlogBySlug(slug) {
  const data = await fetchFromApi(`/api/blog/${encodeURIComponent(slug)}`);
  if (data && data.slug) return mapBlogPost(data);
  const local = fallbackBlogPosts.find((x) => x.slug === slug);
  return local ? mapBlogPost(local) : null;
}
