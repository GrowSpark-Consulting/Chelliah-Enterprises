import { whatsappLink } from './whatsapp';
import { site } from '@/data/site';

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  company: string;
  service: string;
  location: string;
  message: string;
};

export type EnquiryResult =
  | { ok: true; channel: 'whatsapp' | 'api' }
  | { ok: false; error: string };

/** Formats an enquiry as the plain-text body used by every delivery channel. */
export function formatEnquiry(enquiry: Enquiry): string {
  const lines = [
    `Hi ${site.name}, I'd like a quotation.`,
    '',
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
  ];

  if (enquiry.email.trim()) lines.push(`Email: ${enquiry.email.trim()}`);
  if (enquiry.company.trim()) lines.push(`Company: ${enquiry.company.trim()}`);
  lines.push(`Service required: ${enquiry.service}`);
  if (enquiry.location.trim()) lines.push(`Project location: ${enquiry.location.trim()}`);
  if (enquiry.message.trim()) lines.push('', `Details: ${enquiry.message.trim()}`);

  return lines.join('\n');
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THE SUBMISSION HANDLER — the one place to connect a backend.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * There is no server-side endpoint yet, so the enquiry is delivered over
 * WhatsApp to the company's configured number: a real, working channel, not
 * a simulated success. The form only reports success once this resolves.
 *
 * To connect an API / email service later, replace the body below with the
 * request and return `{ ok: true, channel: 'api' }`. Nothing else in the UI
 * needs to change — `ContactForm` renders whatever this returns.
 *
 *   const res = await fetch('/api/enquiry', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(enquiry),
 *   });
 *   if (!res.ok) return { ok: false, error: 'We could not send your enquiry.' };
 *   return { ok: true, channel: 'api' };
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<EnquiryResult> {
  const url = whatsappLink(formatEnquiry(enquiry));
  const opened = window.open(url, '_blank', 'noopener,noreferrer');

  if (!opened) {
    return {
      ok: false,
      error:
        'Your browser blocked the WhatsApp window. Allow pop-ups for this site, or call us directly.',
    };
  }

  return { ok: true, channel: 'whatsapp' };
}
