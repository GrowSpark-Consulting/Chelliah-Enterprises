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

/**
 * Seconds the host may run this function. Set explicitly because Apps Script
 * is slow — a routine submission takes several seconds — and a host default
 * shorter than WEBHOOK_TIMEOUT_MS would kill the request mid-flight. The
 * visitor would then see a bare gateway error, often for an enquiry the
 * sheet had already saved. Must stay above WEBHOOK_TIMEOUT_MS.
 */
export const maxDuration = 20;

/** How long to wait on the Apps Script before giving up. */
const WEBHOOK_TIMEOUT_MS = 15000;

/** How much of a webhook body to keep when describing it in the log. */
const DIAGNOSTIC_BODY_LIMIT = 300;

/**
 * Scrubs the shared secret out of anything bound for the log, in case the
 * webhook ever echoes the request back to us in an error message.
 */
function redact(value: string, secret: string): string {
  return secret ? value.split(secret).join('[redacted]') : value;
}

/**
 * A short, safe description of a webhook response for the server log.
 *
 * Truncated and redacted. The enquiry's own field values are never logged:
 * only what the webhook chose to return.
 */
function describeResponse(status: number, text: string, secret: string): string {
  const body = redact(text.trim().slice(0, DIAGNOSTIC_BODY_LIMIT), secret);
  return `HTTP ${status}; body: ${body || '(empty)'}`;
}

/**
 * What the Apps Script sends back. `success` is what doPost returns and `ok`
 * is what doGet returns; either counts as success.
 */
type WebhookResult = {
  success?: boolean;
  ok?: boolean;
  duplicate?: boolean;
  message?: string;
  error?: string;
};

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
    // The form always supplies one; this covers a direct API call that does
    // not, since the script requires an id to guard against duplicates.
    submissionId: asString(body.submissionId) || crypto.randomUUID(),
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
      // A 404 on the googleusercontent echo URL means doPost ran but returned
      // nothing. The row may well have been written while the caller is told
      // it failed, so name this case explicitly rather than logging a bare 404.
      const missingReturn = response.status === 404 && response.url.includes('googleusercontent');
      console.error(
        missingReturn
          ? '[enquiry] The Apps Script ran but returned no response, so the result could not ' +
              'be confirmed (the row may still have been written). Every doPost path must ' +
              'return a ContentService JSON response — see docs/enquiry-integration.md. ' +
              describeResponse(response.status, text, webhookSecret)
          : `[enquiry] Webhook rejected the request. ${describeResponse(response.status, text, webhookSecret)}`,
      );
      return NextResponse.json(
        { ok: false, error: 'We could not record your enquiry. Please call or WhatsApp us.' },
        { status: 502 },
      );
    }

    /*
     * Apps Script always returns 200, so success is confirmed from the body.
     * The script signals it as `success` on doPost and `ok` on doGet, so both
     * are accepted, and the reason is read from whichever key carries it.
     */
    let result: WebhookResult = {};
    try {
      result = JSON.parse(text) as WebhookResult;
    } catch {
      // HTML back instead of JSON almost always means the live deployment is
      // serving an older version of the script than the editor shows.
      const staleDeployment = text.includes('Script function not found');
      console.error(
        staleDeployment
          ? '[enquiry] The Apps Script deployment is serving a version without this code. ' +
              'Redeploy it: Deploy > Manage deployments > Edit > Version: New version. ' +
              'See docs/enquiry-integration.md step 4. ' +
              describeResponse(response.status, text, webhookSecret)
          : `[enquiry] Webhook returned a body that is not JSON. ${describeResponse(response.status, text, webhookSecret)}`,
      );
      return NextResponse.json(
        { ok: false, error: 'We could not record your enquiry. Please call or WhatsApp us.' },
        { status: 502 },
      );
    }

    /*
     * Confirmation, and only confirmation, is what makes this a success. The
     * script signals it as `success` (doPost) or `ok` (doGet/health), so both
     * count; anything else — false, missing, or a shape we do not recognise —
     * stays a failure rather than being optimistically passed through.
     */
    if (result.success !== true && result.ok !== true) {
      // The script's own `message` is the useful reason. Fall back to the raw
      // body only when it gave none, so an unrecognised shape is still legible
      // instead of logging `undefined`.
      const reported = result.message ?? result.error;
      const reason =
        typeof reported === 'string'
          ? redact(reported.slice(0, DIAGNOSTIC_BODY_LIMIT), webhookSecret)
          : describeResponse(response.status, text, webhookSecret);
      console.error('[enquiry] Webhook reported a failure:', reason);
      return NextResponse.json(
        { ok: false, error: 'We could not record your enquiry. Please call or WhatsApp us.' },
        { status: 502 },
      );
    }

    if (result.duplicate) {
      // The row was already written by an earlier attempt; still a success.
      console.warn('[enquiry] Webhook treated this as a duplicate submission.');
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
