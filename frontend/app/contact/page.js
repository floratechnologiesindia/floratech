import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import MediaFrame from '../../components/MediaFrame';
import { pageImages } from '../../lib/imageMap';
import { absoluteUrl, truncateMetaDescription } from '../../lib/seo';

const desc = 'Book a free consultation, send a project inquiry, or reach Flora Technologies via WhatsApp.';

export const metadata = {
  title: 'Contact | Flora Technologies',
  description: truncateMetaDescription(desc, 165),
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Flora Technologies',
    description: truncateMetaDescription(desc, 160),
    url: absoluteUrl('/contact'),
    type: 'website',
    images: [{ url: pageImages.contact.src, alt: pageImages.contact.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Flora Technologies',
    description: truncateMetaDescription(desc, 160),
    images: [pageImages.contact.src],
  },
};

export default function ContactPage() {
  return (
    <section className="page-shell">
      <div className="contact-visual">
        <MediaFrame
          src={pageImages.contact.src}
          alt={pageImages.contact.alt}
          variant="wide"
          priority
          sizes="100vw"
        />
      </div>
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Talk with Flora Technologies</h1>
        <p>Fill out the form or connect instantly via WhatsApp to book your free consultation.</p>
      </div>
      <div className="contact-grid">
        <ContactForm />
        <div className="glass-card contact-info card-media-top">
          <MediaFrame
            src={pageImages.cta.src}
            alt="Collaborative planning session for your digital roadmap"
            variant="tall"
            sizes="(max-width: 900px) 100vw, 420px"
          />
          <h2>Instant support</h2>
          <p>Connect with Flora Technologies on WhatsApp for a quick digital consultation.</p>
          <Link
            href="https://wa.me/919342524607"
            className="button button-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </Link>
          <div className="info-group">
            <strong>Email</strong>
            <p>
              <Link href="mailto:floratechnologiesindia@gmail.com">floratechnologiesindia@gmail.com</Link>
            </p>
          </div>
          <div className="info-group">
            <strong>Phone</strong>
            <p>
              <Link href="tel:+919342524607">+91 93425 24607</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
