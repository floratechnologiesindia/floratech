import { load } from 'cheerio';
import { assertSafePublicUrl } from '../utils/safeRemoteUrl.js';

const MAX_BYTES = 2_000_000;
const UA = 'FloraTechPortfolioBot/1.0 (+https://floratechnologies.in)';

function metaContent($, selectors) {
  for (const sel of selectors) {
    const el = $(sel).first();
    const c = el.attr('content') || el.attr('value');
    if (c && String(c).trim()) return String(c).trim();
  }
  return '';
}

function absolutize(baseUrl, href) {
  if (!href || typeof href !== 'string') return '';
  try {
    return new URL(href.trim(), baseUrl).href;
  } catch {
    return '';
  }
}

function slugify(text, fallback = 'portfolio-case') {
  const s = String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  return s || fallback;
}

function extractParagraphs($) {
  const root = $('main, article, [role="main"]').first();
  const scope = root.length ? root : $('body');
  const out = [];
  scope.find('p').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t.length >= 45) out.push(t);
  });
  return out.slice(0, 8);
}

function truncate(s, max) {
  const t = String(s || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

/**
 * @param {string} html
 * @param {string} pageUrl
 */
export function parsePortfolioFromHtml(html, pageUrl) {
  const $ = load(html, { decodeEntities: true });

  const title =
    metaContent($, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'meta[property="twitter:title"]',
    ]) || $('title').first().text().trim() || 'Untitled project';

  const description =
    metaContent($, [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]) || '';

  const siteName = metaContent($, ['meta[property="og:site_name"]']);
  let hostClient = '';
  try {
    hostClient = new URL(pageUrl).hostname.replace(/^www\./, '');
  } catch {
    hostClient = '';
  }
  const client = siteName || hostClient || 'Client';

  const ogImage =
    metaContent($, ['meta[property="og:image"]', 'meta[name="twitter:image"]']) ||
    $('link[rel="apple-touch-icon"]').attr('href') ||
    $('link[rel="icon"]').attr('href') ||
    '';

  const imageUrl = absolutize(pageUrl, ogImage);

  const imageAlt =
    metaContent($, ['meta[property="og:image:alt"]']) ||
    (title ? `Visual for ${title}` : 'Project image');

  const paras = extractParagraphs($);
  const bodySnippet = paras.join('\n\n');
  const summary = truncate(description || paras[0] || `Case study based on the live site at ${pageUrl}.`, 600);

  const challenges = truncate(
    paras[0] ||
      description ||
      `The organization needed a clear, credible web presence that explains their offer and supports business goals visible on the public site.`,
    900
  );

  const solution = truncate(
    paras[1] ||
      `Structure, messaging, and user flows align with the deployed experience at ${pageUrl}. Key sections and calls-to-action follow the live implementation.`,
    900
  );

  const results = truncate(
    paras[2] ||
      `Outcomes and metrics should be filled from real engagement data. The live site demonstrates the current customer-facing experience and positioning.`,
    900
  );

  const slugBase = title;
  const slug = slugify(slugBase, slugify(hostClient || 'case', 'case'));

  return {
    title: truncate(title, 200),
    slug,
    client: truncate(client, 120),
    industry: 'General',
    imageUrl,
    imageAlt: truncate(imageAlt, 200),
    summary,
    challenges,
    solution,
    results,
    metaTitle: truncate(title, 70),
    metaDescription: truncate(description || summary, 320),
    sourceUrl: pageUrl,
  };
}

/**
 * @param {string} urlString
 */
export async function fetchPortfolioDraftFromUrl(urlString) {
  const u = assertSafePublicUrl(urlString);
  const href = u.href;

  const res = await fetch(href, {
    redirect: 'follow',
    headers: {
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'User-Agent': UA,
    },
    signal: AbortSignal.timeout(18_000),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch page (HTTP ${res.status})`);
  }

  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('text/html') && !ct.includes('application/xhtml')) {
    throw new Error('URL did not return HTML');
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) {
    throw new Error('Page is too large to import');
  }

  const html = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  return parsePortfolioFromHtml(html, href);
}
