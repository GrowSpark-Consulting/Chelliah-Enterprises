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

/** Extra context recorded alongside the enquiry itself. */
export type EnquiryContext = {
  /** Which page the form was submitted from, recorded in the sheet. */
  source: string;
  /** Stable per-attempt id, so a retry cannot create a duplicate row. */
  submissionId: string;
  /** Honeypot value — always empty for a real person. */
  website: string;
};

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
 *  THE SUBMISSION HANDLER
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Posts to our own `/api/enquiry` route, which forwards the enquiry to the
 * Google Apps Script webhook that writes it to the Sheet and sends the
 * notification email. Success is only reported once that whole workflow has
 * confirmed it succeeded — a failure is surfaced, never swallowed.
 *
 * The webhook URL and secret live in server-only environment variables, so
 * nothing secret reaches the browser. See docs/enquiry-integration.md.
 */
export async function submitEnquiry(
  enquiry: Enquiry,
  context: EnquiryContext,
): Promise<EnquiryResult> {
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...enquiry, ...context }),
    });

    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok || !result?.ok) {
      return {
        ok: false,
        error:
          result?.error ??
          'We could not send your enquiry. Please call or WhatsApp us instead.',
      };
    }

    return { ok: true, channel: 'api' };
  } catch {
    return {
      ok: false,
      error:
        'We could not reach the server. Check your connection, or call or WhatsApp us instead.',
    };
  }
}

/** A prefilled WhatsApp link for the same enquiry, offered after it is sent. */
export function enquiryWhatsAppLink(enquiry: Enquiry): string {
  return whatsappLink(formatEnquiry(enquiry));
}
