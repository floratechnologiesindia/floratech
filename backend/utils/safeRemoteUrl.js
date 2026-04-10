/**
 * @param {string} urlString
 * @returns {URL}
 */
export function assertSafePublicUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    throw new Error('URL is required');
  }
  const trimmed = urlString.trim();
  let u;
  try {
    u = new URL(trimmed);
  } catch {
    throw new Error('Invalid URL');
  }
  if (u.username || u.password) {
    throw new Error('URL must not include credentials');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }
  const host = u.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost')) {
    throw new Error('That URL is not allowed');
  }
  if (host === '0.0.0.0' || host === '[::1]' || host === '::1') {
    throw new Error('That URL is not allowed');
  }
  if (host.endsWith('.local') || host.endsWith('.internal')) {
    throw new Error('That URL is not allowed');
  }
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m = host.match(ipv4);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 127 || a === 0 || a === 10) throw new Error('That URL is not allowed');
    if (a === 169 && b === 254) throw new Error('That URL is not allowed');
    if (a === 192 && b === 168) throw new Error('That URL is not allowed');
    if (a === 172 && b >= 16 && b <= 31) throw new Error('That URL is not allowed');
  }
  return u;
}
