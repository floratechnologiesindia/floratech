'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChatbotDemo() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="chatbot-demo" ref={rootRef}>
      <button
        type="button"
        className="chatbot-fab"
        aria-expanded={open}
        aria-controls="chatbot-demo-panel"
        onClick={() => setOpen((o) => !o)}
      >
        Demo chat
      </button>
      {open && (
        <div id="chatbot-demo-panel" className="chatbot-panel glass-card" role="dialog" aria-label="Chat demo">
          <p className="chatbot-panel-title">Flora assistant (demo)</p>
          <p className="chatbot-panel-copy">
            This is a UI preview. On a live deployment we connect intelligent flows to your site and WhatsApp.
          </p>
          <div className="chatbot-bubbles">
            <div className="chatbot-bubble bot">Hi! What project can we help you with today?</div>
            <div className="chatbot-bubble user">We need an MSME website with SEO.</div>
            <div className="chatbot-bubble bot">Great—we can scope pages, speed, and lead capture. Want a free consultation?</div>
          </div>
          <Link
            href="/contact"
            className="button button-primary chatbot-cta"
            onClick={() => setOpen(false)}
          >
            Get Free Consultation
          </Link>
        </div>
      )}
    </div>
  );
}
