'use client';

import Link from 'next/link';

export default function StickyCta() {
  return (
    <div className="sticky-cta" aria-label="Quick actions">
      <Link href="/contact" className="button button-primary sticky-cta-primary">
        Free consultation
      </Link>
      <Link href="/services" className="button button-secondary sticky-cta-secondary">
        Start project
      </Link>
    </div>
  );
}
