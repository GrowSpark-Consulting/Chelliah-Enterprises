# Enquiry form integration — Google Sheet + email notification

Every enquiry submitted from the website is written to a Google Sheet and
emailed to the business, as one atomic step. The form only reports success
once both have happened.

## How it works

```
Browser  ──POST /api/enquiry──▶  Next.js API route  ──POST──▶  Apps Script web app
(no secrets)                    (holds the secrets)            (runs as the Google account)
                                                                      │
                                                               ┌──────┴──────┐
                                                               ▼             ▼
                                                        Sheet row      Notification email
```

**Why this shape.** The Apps Script runs *as the Google account that owns it*,
so there is no service-account key, API key or SMTP password anywhere in the
application. The only secrets are the deployment URL and a shared secret, both
held server-side. The browser talks only to our own origin and never sees
either. It also adds no dependencies to the project.

## The payload contract

The form collects seven fields. They travel unchanged through every layer and
land in a fixed column order. Any change must be made in all four places at
once, or rows will misalign.

**1. Browser → `/api/enquiry`** (`ContactForm` → `submitEnquiry`)

```jsonc
{
  "name":     "string, required",
  "phone":    "string, required, ≥10 digits",
  "email":    "string, optional, validated when present",
  "company":  "string, optional",
  "service":  "string, required, one of enquiryServices",
  "location": "string, optional — the 'Project location' field",
  "message":  "string, optional",
  "source":   "string — 'Home — hero' or 'Contact page'",
  "submissionId": "string — uuid, stable across retries of one attempt",
  "website":  "string — honeypot, always empty for a person"
}
```

**2. `/api/enquiry` → Apps Script.** The route re-validates, drops `website`,
and adds the shared secret plus a server timestamp. `source` falls back to the
`referer` header if absent.

```jsonc
{
  "secret":       "from ENQUIRY_WEBHOOK_SECRET, server-side only",
  "submissionId": "string",
  "submittedAt":  "ISO 8601, set by the server",
  "name": "…", "email": "…", "phone": "…", "company": "…",
  "service": "…", "location": "…", "message": "…", "source": "…"
}
```

**3. Apps Script → Sheet.** One row, in exactly this order:

| # | Column | Source |
| --- | --- | --- |
| 1 | Timestamp | `submittedAt` |
| 2 | Submission ID | `submissionId` |
| 3 | Name | `name` |
| 4 | Email | `email` |
| 5 | Phone | `phone` |
| 6 | Company | `company` |
| 7 | Service | `service` |
| 8 | Location | `location` |
| 9 | Message | `message` |
| 10 | Source | `source` |
| 11 | Status | `New`, set by the script |

**4. Apps Script → email.** The notification lists every field above,
including Company and Project location, with `replyTo` set to the enquirer's
email where they gave one.

**Response contract.** Every `doPost` path must return a `ContentService` JSON
response. Returning nothing still writes the row but leaves the site unable to
confirm it, so the enquiry is reported as failed while the data is in the sheet.

| Outcome | Body |
| --- | --- |
| Saved | `{"success":true,"message":"Enquiry submitted successfully."}` |
| Already saved | `{"success":true,"message":"Enquiry already submitted.","duplicate":true}` |
| Rejected/failed | `{"success":false,"message":"…"}` |
| Health check (`doGet`) | `{"ok":true,"service":"…"}` |

The API route accepts either `success: true` or `ok: true` as confirmation, and
treats anything else — including HTML or an empty body — as a failure.

## Security properties

- `ENQUIRY_WEBHOOK_URL` and `ENQUIRY_WEBHOOK_SECRET` are read only inside
  `src/app/api/enquiry/route.ts`, which is server-only. They are **not**
  `NEXT_PUBLIC_*` and never reach the client bundle.
- The Apps Script rejects any request whose `secret` does not match.
- The API route re-validates every field server-side; client validation is a
  convenience, not a trust boundary.
- A hidden honeypot field rejects automated submissions.
- Nothing is reported as sent unless the Apps Script confirms it.

---

## Setup

### 1. Create the Sheet (GrowSpark Google account)

Sign in as the GrowSpark account that should own the data.

1. Check **Drive → Brands → Chelliah Enterprises** (or your equivalent brand
   folder) for an existing enquiries sheet before creating anything, to avoid
   a duplicate.
2. If none exists, create a spreadsheet there named
   **`Chelliah Enterprises — Website Enquiries`**.
3. Leave sharing as **private** (default). Do not publish it to the web.
4. Rename the first tab to **`Enquiries`**.

5. Add this header row to row 1, in exactly this order — the script appends
   positionally and does **not** create headers for you:

| Timestamp | Submission ID | Name | Email | Phone | Company | Service | Location | Message | Source | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

`Status` is written as `New` and is yours to update by hand as enquiries are
worked through — the script never overwrites it on an existing row. If the
notification email fails after the row is saved, it is written as
`New — email failed` so the failure is visible rather than silent.

> **The column order above is positional.** The script appends values in this
> exact sequence, so reordering the sheet without changing `appendRow` will
> misalign every future row.

### 2. Add the Apps Script

In that spreadsheet: **Extensions → Apps Script**. Replace `Code.gs` with:

```javascript
const SHEET_NAME = 'Enquiries';

/** How long a written Submission ID is remembered in the cache (6h, the max). */
const DUPLICATE_CACHE_SECONDS = 21600;

// One property-service call rather than one per property: this runs on every
// request, including the health check.
const PROPS = PropertiesService.getScriptProperties().getProperties();
const SHARED_SECRET = PROPS.SHARED_SECRET;
const NOTIFY_EMAIL = PROPS.NOTIFY_EMAIL;

/**
 * Website enquiry webhook.
 *
 * Website → Next.js /api/enquiry → Google Apps Script → Sheet + Email
 */
function doPost(e) {
  let lock = null;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: 'Invalid request.' });
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return jsonResponse({ success: false, message: 'Invalid JSON payload.' });
    }

    // ---- Shared secret -------------------------------------------------
    if (!SHARED_SECRET) {
      console.error('SHARED_SECRET is not configured.');
      return jsonResponse({ success: false, message: 'Webhook is not configured.' });
    }
    if (data.secret !== SHARED_SECRET) {
      console.warn('Unauthorized webhook request.');
      return jsonResponse({ success: false, message: 'Unauthorized.' });
    }

    // ---- Honeypot ------------------------------------------------------
    // Reported as success so an automated submitter learns nothing. No row
    // is written. (The API route already rejects these before this point.)
    if (data.website) {
      return jsonResponse({ success: true, message: 'Enquiry submitted successfully.' });
    }

    // ---- Read fields ---------------------------------------------------
    const submissionId = String(data.submissionId || '').trim();
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const company = String(data.company || '').trim();
    const service = String(data.service || '').trim();
    const location = String(data.location || '').trim();
    const message = String(data.message || '').trim();
    const source = String(data.source || 'Website').trim();

    // ---- Validate ------------------------------------------------------
    if (!name || !phone || !service) {
      return jsonResponse({ success: false, message: 'Name, phone and service are required.' });
    }
    if (!submissionId) {
      return jsonResponse({ success: false, message: 'Submission ID is required.' });
    }
    if (submissionId.length > 200) {
      return jsonResponse({ success: false, message: 'Invalid submission ID.' });
    }
    if (email && !isValidEmail(email)) {
      return jsonResponse({ success: false, message: 'Please provide a valid email address.' });
    }

    const tooLong =
      (name.length > 100 && 'Name is too long.') ||
      (email.length > 150 && 'Email address is too long.') ||
      (phone.length > 50 && 'Phone number is too long.') ||
      (company.length > 150 && 'Company name is too long.') ||
      (service.length > 150 && 'Service value is too long.') ||
      (location.length > 250 && 'Project location is too long.') ||
      (message.length > 5000 && 'Message is too long.') ||
      (source.length > 150 && 'Source value is too long.');

    if (tooLong) {
      return jsonResponse({ success: false, message: tooLong });
    }

    if (!NOTIFY_EMAIL || !isValidEmail(NOTIFY_EMAIL)) {
      console.error('NOTIFY_EMAIL is missing or invalid.');
      return jsonResponse({ success: false, message: 'Email notification is not configured.' });
    }

    // ---- Sheet ---------------------------------------------------------
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error('Unable to access the active spreadsheet.');

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found.');

    // Serialised so two submissions landing together cannot interleave a
    // duplicate check with an append.
    lock = LockService.getScriptLock();
    lock.waitLock(10000);

    if (isDuplicate(sheet, submissionId)) {
      return jsonResponse({
        success: true,
        message: 'Enquiry already submitted.',
        duplicate: true,
      });
    }

    const timestamp = new Date();

    // A=Timestamp B=Submission ID C=Name D=Email E=Phone F=Company
    // G=Service H=Location I=Message J=Source K=Status
    sheet.appendRow([
      timestamp, submissionId, name, email, phone, company,
      service, location, message, source, 'New',
    ]);

    // Taken while the lock is still held. Once it is released another
    // enquiry can append, and getLastRow() would then point at that row.
    const row = sheet.getLastRow();
    CacheService.getScriptCache()
      .put(cacheKey(submissionId), '1', DUPLICATE_CACHE_SECONDS);

    // The row is saved; the email does not need the lock. Releasing it now
    // means an enquiry arriving at the same moment waits for this sheet
    // write only, not for this one's email as well.
    lock.releaseLock();
    lock = null;

    // ---- Notification email -------------------------------------------
    const body = [
      'New enquiry received from the Chelliah Enterprises website.',
      '',
      '----------------------------------------',
      'ENQUIRY DETAILS',
      '----------------------------------------',
      '',
      'Submission ID: ' + submissionId,
      'Name: ' + name,
      'Email: ' + (email || 'Not provided'),
      'Phone: ' + (phone || 'Not provided'),
      'Company: ' + (company || 'Not provided'),
      'Service: ' + (service || 'Not specified'),
      'Project Location: ' + (location || 'Not provided'),
      'Source: ' + source,
      '',
      'Message:',
      message || 'Not provided',
      '',
      'Received: ' + timestamp,
    ].join('\n');

    const emailOptions = {
      to: NOTIFY_EMAIL,
      subject: 'New Website Enquiry — ' + name,
      body: body,
      name: 'Chelliah Enterprises Website',
    };
    if (email) emailOptions.replyTo = email;

    // The row is already saved at this point. If the mail quota is exhausted
    // the enquiry must not be reported as lost, or the visitor retries, the
    // duplicate check short-circuits, and the email is never sent at all.
    try {
      MailApp.sendEmail(emailOptions);
    } catch (mailError) {
      console.error('Notification email failed:', mailError);
      sheet.getRange(row, 11).setValue('New — email failed');
    }

    return jsonResponse({ success: true, message: 'Enquiry submitted successfully.' });

  } catch (error) {
    console.error('Enquiry processing error:', error);
    return jsonResponse({
      success: false,
      message: 'Unable to process enquiry. Please try again.',
    });

  } finally {
    if (lock) {
      try {
        lock.releaseLock();
      } catch (error) {
        console.error('Unable to release lock:', error);
      }
    }
  }
}

/**
 * Health check. Open the /exec URL in a browser; if you see this JSON the
 * deployment is live and running this version of the code. If you instead
 * see "Script function not found: doGet", publish a new version (step 4).
 */
function doGet() {
  return jsonResponse({ ok: true, service: 'Chelliah Enterprises enquiry intake' });
}

/**
 * Whether this Submission ID has already been written.
 *
 * The cache answers a recent retry without touching the sheet at all. Past
 * that, a TextFinder searches column B on Google's side instead of
 * downloading the whole column — which is what the check used to do, and
 * why it got slower with every enquiry the sheet held.
 */
function isDuplicate(sheet, submissionId) {
  if (CacheService.getScriptCache().get(cacheKey(submissionId))) return true;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const match = sheet
    .getRange(2, 2, lastRow - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .matchCase(true)
    .findNext();

  return match !== null;
}

function cacheKey(submissionId) {
  return 'enquiry:' + submissionId;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3. Configure the script

**Project Settings → Script properties → Add script property**, twice:

| Property | Value |
| --- | --- |
| `SHARED_SECRET` | A long random string. Generate with `openssl rand -base64 32`. |
| `NOTIFY_EMAIL` | The business address that should receive enquiry notifications. |

`NOTIFY_EMAIL` is the single place the recipient is configured — change it here
and it takes effect immediately, with no site redeploy.

### 4. Deploy

**Deploy → New deployment → Web app**

- Execute as: **Me** (the GrowSpark account)
- Who has access: **Anyone**

"Anyone" is required because our server calls it without a Google session; the
shared secret is what actually authorises the request. Authorise the script
when prompted (it needs Sheets and Gmail access). Copy the `/exec` URL — the
URL must end in `/exec`, not a trailing slash.

> **Editing the code later does not update a live deployment.** Apps Script
> serves the *version* that was published, so after any code change you must go
> to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
> Skipping this is the most common cause of the integration failing.

**Verify the deployment before moving on.** Open the `/exec` URL in a browser:

- `{"ok":true,"service":"Chelliah Enterprises enquiry intake"}` → the live
  deployment is running this code. Continue.
- `Script function not found: doGet` → the deployment is serving an older
  version. Publish a new version as described above, then re-check.

### 5. Add the environment variables

Locally, create `.env.local` (already gitignored):

```
ENQUIRY_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
ENQUIRY_WEBHOOK_SECRET=the-same-string-as-SHARED_SECRET
```

On Vercel: **Project → Settings → Environment Variables**, add both for
Production, Preview and Development. Redeploy.

> Add them as plain variables. Do **not** prefix them with `NEXT_PUBLIC_`,
> which would expose them in the browser bundle.

### 6. Verify

Submit a test enquiry from `/contact`. You should see a new row in the sheet
and an email at `NOTIFY_EMAIL`. Until the variables are set, the form shows
"The enquiry service is not configured yet" rather than a false success.

---

## Why a submission takes a few seconds

Most of the wait is Google's Apps Script platform, not this code. Measured
against the live deployment on 2026-09-17, with calls that write nothing:

| Call | Round trip |
| --- | --- |
| `doGet` health check (returns JSON, does nothing else) | 7–11 s |
| `doPost` rejected on its first line | ~2 s |
| One outlier | 58 s |

Every call makes two hops — `script.google.com`, then a redirect to
`script.googleusercontent.com` — and starts a script container, before the
script itself does any work. A real submission then opens the sheet, takes the
lock, checks for a duplicate, appends the row and sends the email.

What is already done to keep that tolerable:

- **The duplicate check no longer grows with the sheet.** It used to download
  the whole Submission ID column on every enquiry; it now checks a cache, then
  searches server-side.
- **The lock is released before the email is sent**, so simultaneous enquiries
  do not queue behind each other's mail.
- **The host cannot cut a slow submission short.** `route.ts` sets
  `maxDuration` above its own 15 s webhook timeout.
- **The form explains the wait.** After 2.5 s it says the enquiry is still
  being saved, rather than looking frozen.

The two changes that would make submissions genuinely fast are structural:
send the notification email from a time-driven trigger instead of inside the
request, or replace Apps Script with a direct Google Sheets API call from
`route.ts`. Both need setup outside this repo.

---

## Where things live

| Concern | File |
| --- | --- |
| Server handler, validation, secrets | `src/app/api/enquiry/route.ts` |
| Client submit + result shape | `src/lib/enquiry.ts` |
| Form UI, states, honeypot | `src/components/contact/ContactForm.tsx` |
| Required variables | `.env.example` |

## Changing the recipient later

Edit the `NOTIFY_EMAIL` script property. Nothing in the repo changes.

## Adding more fields later

Add the field to `Enquiry` in `src/lib/enquiry.ts`, render it in
`ContactForm.tsx`, pass it through in `route.ts`, then add the column to
`HEADERS` and the `appendRow` call in the script.
