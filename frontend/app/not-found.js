import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="page-shell" style={{ textAlign: 'center', paddingTop: '3rem' }}>
      <h1>404 — Page not found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        The page you requested does not exist or has been moved.
      </p>
      <Link href="/" className="button button-primary">
        Back to home
      </Link>
    </section>
  );
}
