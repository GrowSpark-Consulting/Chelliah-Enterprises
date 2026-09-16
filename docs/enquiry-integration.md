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

The script writes this header row automatically on first run:

| Timestamp | Name | Email | Phone | Company | Service | Location | Message | Source | Submission ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 2. Add the Apps Script

In that spreadsheet: **Extensions → Apps Script**. Replace `Code.gs` with:

```javascript
/** Chelliah Enterprises — website enquiry intake. */

const SHEET_NAME = 'Enquiries';
const HEADERS = [
  'Timestamp', 'Name', 'Email', 'Phone', 'Company',
  'Service', 'Location', 'Message', 'Source', 'Submission ID',
];

/**
 * Health check. Open the /exec URL in a browser: if you see this JSON, the
 * deployment is live and running THIS version of the code. If you instead see
 * "Script function not found: doGet", the deployment is serving an older
 * version — redeploy as a new version (see step 4).
 */
function doGet() {
  return json({ ok: true, service: 'Chelliah Enterprises enquiry intake' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();

    if (body.secret !== props.getProperty('SHARED_SECRET')) {
      return json({ ok: false, error: 'unauthorised' });
    }

    const sheet = getSheet();

    // Reject a repeat of an attempt that already landed.
    const id = String(body.submissionId || '');
    if (id && isDuplicate(sheet, id)) {
      return json({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      body.submittedAt || new Date().toISOString(),
      body.name || '',
      body.email || '',
      body.phone || '',
      body.company || '',
      body.service || '',
      body.location || '',
      body.message || '',
      body.source || '',
      id,
    ]);

    notify(props.getProperty('NOTIFY_EMAIL'), body);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Scans recent rows only — enough to catch a retry, cheap on a long sheet. */
function isDuplicate(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const from = Math.max(2, last - 50);
  const ids = sheet.getRange(from, HEADERS.length, last - from + 1, 1).getValues();
  return ids.some(function (row) { return String(row[0]) === id; });
}

function notify(to, body) {
  if (!to) return; // No recipient configured: the row is still saved.

  const lines = [
    'New website enquiry',
    '',
    'Name:     ' + (body.name || '—'),
    'Phone:    ' + (body.phone || '—'),
    'Email:    ' + (body.email || '—'),
    'Company:  ' + (body.company || '—'),
    'Service:  ' + (body.service || '—'),
    'Location: ' + (body.location || '—'),
    '',
    'Message:',
    body.message || '—',
    '',
    'Submitted from: ' + (body.source || '—'),
    'Received: ' + (body.submittedAt || ''),
  ];

  MailApp.sendEmail({
    to: to,
    subject: 'Website enquiry — ' + (body.name || 'Unknown') + ' (' + (body.service || '') + ')',
    body: lines.join('\n'),
    replyTo: body.email || undefined,
    name: 'Chelliah Enterprises Website',
  });
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
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
