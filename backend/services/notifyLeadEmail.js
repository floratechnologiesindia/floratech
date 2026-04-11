import nodemailer from 'nodemailer';

/** Comma-separated default if LEAD_NOTIFY_EMAIL is unset */
const DEFAULT_NOTIFY_TO =
  'floratechnologiesindia@gmail.com,kernelogy@gmail.com,manuelamalraj2013@gmail.com';

function parseNotifyRecipients() {
  const raw = (process.env.LEAD_NOTIFY_EMAIL || DEFAULT_NOTIFY_TO).trim();
  return raw
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);
}

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

function buildTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === '1' ||
    process.env.SMTP_SECURE === 'true' ||
    port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Sends a notification for a new lead. Does not throw — logs on failure.
 * Requires SMTP_* env vars; if missing, logs once and returns.
 */
export async function sendNewLeadEmail(lead) {
  if (!isSmtpConfigured()) {
    console.warn('[leads] SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS); skipping notification email');
    return;
  }

  const to = parseNotifyRecipients();
  if (to.length === 0) {
    console.warn('[leads] LEAD_NOTIFY_EMAIL has no valid addresses; skipping notification email');
    return;
  }

  const from = (process.env.SMTP_FROM || `Flora Website <${process.env.SMTP_USER}>`).trim();

  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Service: ${lead.service}`,
    `Source: ${lead.source || 'Website'}`,
    '',
    lead.message ? `Message:\n${lead.message}` : '(No message)',
  ];

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
    <p><strong>Service:</strong> ${escapeHtml(lead.service)}</p>
    <p><strong>Source:</strong> ${escapeHtml(lead.source || 'Website')}</p>
    ${lead.message ? `<p><strong>Message:</strong></p><pre>${escapeHtml(lead.message)}</pre>` : ''}
  `.trim();

  try {
    await buildTransporter().sendMail({
      from,
      to,
      subject: `New lead: ${lead.name} — ${lead.service}`,
      text: lines.join('\n'),
      html,
    });
  } catch (err) {
    console.error('[leads] Failed to send notification email', err.message || err);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
