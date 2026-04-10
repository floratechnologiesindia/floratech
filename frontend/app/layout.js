import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import StickyCta from '../components/StickyCta';
import ChatbotDemo from '../components/ChatbotDemo';
import PageTransition from '../components/PageTransition';
import AutoReveal from '../components/AutoReveal';
import ParallaxDecor from '../components/ParallaxDecor';
import MobileNav from '../components/MobileNav';
import { absoluteUrl, getSiteUrl, truncateMetaDescription } from '../lib/seo';
import { heroImage } from '../lib/imageMap';

const siteUrl = getSiteUrl();

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Flora Technologies',
  url: siteUrl,
  logo: `${siteUrl}/flora-logo.svg`,
  image: `${siteUrl}/flora-logo.svg`,
  description:
    'Naturally Intelligent digital solutions for MSMEs, startups, and researchers—websites, e-commerce, AI, blockchain, and digital marketing.',
  telephone: '+919876543210',
  email: 'hello@floratechnologies.in',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  areaServed: ['IN', 'Global'],
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Flora Technologies | Naturally Intelligent Digital Solutions',
  description: truncateMetaDescription(
    'Flora Technologies helps MSMEs, startups, and researchers with websites, e-commerce, AI, blockchain, SaaS, and digital marketing.',
    165
  ),
  keywords: [
    'Flora Technologies',
    'web development India',
    'MSME websites',
    'e-commerce development',
    'AI chatbot',
    'blockchain solutions',
    'LMS CRM SaaS',
    'SEO services',
    'PhD portfolio website',
    'digital marketing India',
  ],
  applicationName: 'Flora Technologies',
  icons: {
    icon: [{ url: '/flora-logo-only.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/flora-logo-only.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/flora-logo-only.svg', type: 'image/svg+xml' }],
  },
  authors: [{ name: 'Flora Technologies', url: siteUrl }],
  creator: 'Flora Technologies',
  publisher: 'Flora Technologies',
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: absoluteUrl('/'),
    siteName: 'Flora Technologies',
    title: 'Flora Technologies | Naturally Intelligent Digital Solutions',
    description: truncateMetaDescription(
      'Naturally Intelligent digital solutions for MSMEs, startups, and researchers.',
      160
    ),
    images: [
      {
        url: heroImage.src,
        width: 1200,
        height: 630,
        alt: heroImage.alt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flora Technologies',
    description: truncateMetaDescription(
      'Naturally Intelligent digital solutions for MSMEs, startups, and researchers.',
      160
    ),
    images: [heroImage.src],
  },
  alternates: {
    languages: { 'en-IN': absoluteUrl('/') },
  },
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body>
        <ParallaxDecor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <header className="site-header">
          <div className="layout-wrapper header-inner">
            <span className="brand-bubble" aria-hidden="true">
              <Image src="/flora-logo-only.svg" alt="" width={28} height={28} className="brand-bubble-logo" />
            </span>
            <Link href="/" className="brand">
              <Image
                src="/flora-text-only.svg"
                alt="Flora Technologies"
                width={176}
                height={32}
                className="brand-text-logo"
                priority
              />
              <span className="brand-tech-text">Technologies</span>
            </Link>
            <MobileNav />
          </div>
        </header>
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <footer className="site-footer">
          <div className="layout-wrapper footer-inner">
            <div className="footer-copy">
              <p>Flora Technologies — Naturally Intelligent</p>
              <p className="footer-tagline">Trusted by MSMEs, startups, and research professionals worldwide.</p>
              <p className="footer-copyright">© {year} Flora Technologies. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Get Consultation</Link>
            </div>
          </div>
        </footer>
        <div className="bottom-actions-fab">
          <ChatbotDemo />
          <StickyCta />
        </div>
        <AutoReveal />
      </body>
    </html>
  );
}
