'use client';

import { useState } from 'react';

const SERVICE_OPTIONS = [
  { value: 'Static & Dynamic Websites', label: 'Static & Dynamic Websites' },
  { value: 'E-commerce Development', label: 'E-commerce Development' },
  { value: 'CRM / LMS / SaaS Platforms', label: 'CRM / LMS / SaaS Platforms' },
  {
    value: 'Learning Management Systems, CRM & Business Platforms',
    label: 'LMS, CRM & business platforms',
  },
  { value: 'AI & Chatbot Solutions', label: 'AI & Chatbot Solutions' },
  { value: 'Blockchain Solutions', label: 'Blockchain Solutions' },
  { value: 'Digital Marketing & SEO', label: 'Digital Marketing & SEO' },
  {
    value: 'Portfolio Websites for PhD Scholars & Scientists',
    label: 'PhD & scientist portfolio websites',
  },
];

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  return base.replace(/\/$/, '');
}

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');
    const form = event.currentTarget;
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
      source: 'Website contact form',
    };

    try {
      const res = await fetch(`${apiBase()}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText =
          data.errors?.map((e) => e.msg).join(' ') || data.message || 'Something went wrong.';
        throw new Error(errText);
      }
      setStatus('success');
      setMessage('Thank you—we received your message and will get back to you shortly.');
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Could not send. Please try WhatsApp or email.');
    }
  }

  return (
    <form className="glass-card contact-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" placeholder="Your name" required autoComplete="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" placeholder="Your email" required autoComplete="email" />
      </label>
      <label>
        Phone
        <input type="tel" name="phone" placeholder="Your phone or WhatsApp" required autoComplete="tel" />
      </label>
      <label>
        Service required
        <select name="service" required defaultValue={SERVICE_OPTIONS[0].value}>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Message
        <textarea name="message" placeholder="Tell us about your project" />
      </label>
      {message && (
        <p className={status === 'error' ? 'form-message form-message-error' : 'form-message form-message-success'}>
          {message}
        </p>
      )}
      <button type="submit" className="button button-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}
