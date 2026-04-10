'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const shellRef = useRef(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    const onDocPointerDown = (e) => {
      if (shellRef.current && !shellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      ref={shellRef}
      className={`nav-shell${open ? ' nav-shell--open' : ''}`}
    >
      <button
        type="button"
        className={`nav-toggle${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`nav-backdrop${open ? ' is-open' : ''}`}
        aria-hidden
        onClick={close}
      />

      <nav
        id="mobile-nav-drawer"
        className={`nav-links${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            className={pathname === link.href ? 'nav-active' : ''}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/contact" onClick={close} className="button button-ghost nav-contact">
          Contact
        </Link>
      </nav>
    </div>
  );
}
