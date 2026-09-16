import { NextResponse } from 'next/server';
import type { Enquiry } from '@/lib/enquiry';

/**
 * Server-side enquiry handler.
 *
 * The browser only ever talks to this same-origin route. It forwards the
 * enquiry to a Google Apps Script webhook running under the GrowSpark Google
 * account, which writes the row to the Sheet and sends the notification email.
 *
 * The webhook URL and shared secret are server-only environment variables.
 * Nothing secret is ever sent to, or readable by, the client.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** How long to wait on the Apps Script before giving up. */
const WEBHOOK_TIMEOUT_MS = 15000;

type RequestBody = Partial<Enquiry> & {
  /** Which page the enquiry was submitted from. */
  source?: string;
  /** Stable per-attempt id, so a retry cannot create a duplicate row. */
  submissionId?: string;
  /** Honeypot: hidden from people, filled in by bots. */
  website?: string;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Re-validates on the server. The client validates too, but a request can
 * arrive from anywhere, so the rules are enforced again here.
 */
function validate(body: RequestBody): string | null {
  if (!asString(body.name)) return 'Please enter your name.';

  const phone = asString(body.phone);
  if (!phone) return 'Please enter a phone number.';
  if (phone.replace(/\D/g, '').length < 10) return 'Please enter a valid phone number.';

  const email = asString(body.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return 'Please check this email address.';
  }

  if (!asString(body.service)) return 'Please choose the service you need.';

  return null;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL;
  const webhookSecret = process.env.ENQUIRY_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    // Fail loudly rather than reporting a success that never happened.
    console.error(
      '[enquiry] ENQUIRY_WEBHOOK_URL / ENQUIRY_WEBHOOK_SECRET are not configured.',
    );
    return NextResponse.json(
      { ok: false, error: 'The enquiry service is not configured yet. Please call or WhatsApp us.' },
      { status: 503 },
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  // A filled honeypot means a bot, not a person. Rejected, but recorded in the
  // server log so a real problem here is visible rather than invisible.
  if (asString(body.website)) {
    console.warn('[enquiry] Rejected a submission that filled the honeypot field.');
    return NextResponse.json({ ok: false, error: 'Submission rejected.' }, { status: 400 });
  }

  const invalid = validate(body);
  if (invalid) {
    return NextResponse.json({ ok: false, error: invalid }, { status: 400 });
  }

  const payload = {
    secret: webhookSecret,
    submissionId: asString(body.submissionId),
    submittedAt: new Date().toISOString(),
    name: asString(body.name),
    email: asString(body.email),
    phone: asString(body.phone),
    company: asString(body.company),
    service: asString(body.service),
    location: asString(body.location),
    message: asString(body.message),
    source: asString(body.source) || request.headers.get('referer') || 'Unknown',
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: 'follow',
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('[enquiry] Webhook responded', response.status, text.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: 'We could not record your enquiry. Please call or WhatsApp us.' },
        { status: 502 },
      );
    }

    // Apps Script always returns 200, so success is confirmed from the body.
    let result: { ok?: boolean; error?: string } = {};
    try {
      result = JSON.parse(text) as { ok?: boolean; error?: string };
    } catch {
      // HTML back instead of JSON almost always means the live deployment is
      // serving an older version of the script than the editor shows.
      const staleDeployment = text.includes('Script function not found');
      console.error(
        staleDeployment
          ? '[enquiry] The Apps Script deployment is serving a version without this code. ' +
              'Redeploy it: Deploy > Manage deployments > Edit > Version: New version. ' +
              'See docs/enquiry-integration.md step 4.'
          : `[enquiry] Webhook returned a non-JSON body: ${text.slice(0, 500)}`,
      );
      return NextResponse.json(
        { ok: false, error: 'We could not record your enquiry. Please call or WhatsApp us.' },
        { status: 502 },
      );
    }

    if (!result.ok) {
      console.error('[enquiry] Webhook reported a failure:', result.error);
      return NextResponse.json(
        { ok: false, error: 'We could not record your enquiry. Please call or WhatsApp us.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const aborted = error instanceof Error && error.name === 'AbortError';
    console.error('[enquiry] Webhook request failed:', error);
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? 'The enquiry service timed out. Please call or WhatsApp us.'
          : 'We could not reach the enquiry service. Please call or WhatsApp us.',
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
