# Chelliah Enterprises — corporate website

Production website for Chelliah Enterprises: waterproofing, resin flooring and
structural repair contractors operating from Nandivaram Guduvancheri, Chennai.

Built with Next.js 15 (App Router), React 19, TypeScript and plain CSS —
design tokens in one global stylesheet plus CSS Modules per component. No UI
framework, no CSS framework, no animation library.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 18.18+ is required (developed on Node 22).

---

## Where things live

```
src/
  app/                      One folder per route; each exports its own metadata
    layout.tsx              Fonts, <head>, header/footer, JSON-LD, skip link
    globals.css             Design tokens, base type, buttons, forms, utilities
    page.tsx                Home
    services/               Services index
    services/[slug]/        Dedicated pages for the four documented services
    projects/  about/  contact/
    sitemap.ts  robots.ts  not-found.tsx
  components/
    layout/                 Header (+ mobile menu), Footer, WhatsApp button
    sections/               Hero, StatStrip, BrandStrip, ClientWall,
                            Process, CTASection, PageHero
    services/               ServiceCard, ServiceGrid, ServiceSection
    projects/               ProjectCard, ProjectGrid (filtering)
    contact/                ContactInfo, ContactForm
    ui/                     Button, Container, Section, SectionHeading,
                            SectionLabel, ImageFrame, Reveal, RevealObserver
  data/                     site.ts, services.ts, projects.ts
  lib/                      whatsapp.ts, enquiry.ts, cx.ts
public/                     logo.png, icon.png, apple-icon.png
```

### Content is data, not markup

Every company fact — address, GSTIN, phone numbers, the six authorised brands,
the eighteen named clients, the eleven service lines — lives in `src/data/`.
Change it there and it updates everywhere, including the SEO metadata and the
structured data.

Nothing in `src/data/` was invented. It all comes from the supplied company
material. Please keep it that way: no certifications, awards, clients or
statistics that the company cannot evidence.

---

## Three things to finish before launch

### 1. Replace the project records

`src/data/projects.ts` currently holds the twelve placeholder entries carried
over from the approved mockups, which were marked there as *"placeholders for
layout — replace with real site records and photographs before launch"*.

While `PROJECTS_ARE_PLACEHOLDERS` is `true`, the home and projects pages show
a short disclosure saying the records are indicative. Replace the entries with
real ones and set the flag to `false` — the disclosure disappears and nothing
else needs to change.

The **client names** on those pages are real and come from `site.ts`. They are
rendered separately and are unaffected by that flag.

### 2. Add the photography

There are no site photographs yet, so every image slot renders a framed
placeholder naming the shot it needs ("Finished epoxy floor in a factory bay,
with safety line marking"). Nothing is stretched or faked, and the slots
already reserve their space, so dropping images in causes no layout shift.

To add one, put the file in `public/images/` and pass it to the `ImageFrame`:

```tsx
<ImageFrame
  src="/images/oragadam-epoxy.jpg"
  alt="Seamless epoxy floor with yellow safety line marking, Oragadam"
  hint="Finished epoxy floor in a factory bay"
  ratio="4/3"
/>
```

Ratios in use: `16/10` and `4/3` for features, `4/3` for service and project
cards. Alt text is required whenever `src` is set — describe what is in the
photograph, not the file name.

### 3. Point the enquiry form at a backend (optional)

`src/lib/enquiry.ts` has one exported function, `submitEnquiry`. It currently
delivers the enquiry over WhatsApp to the company's configured number — a real
channel, not a simulated success. The form only reports success once that
resolves, and says plainly that the message was prepared in WhatsApp.

To send enquiries to an API or email service instead, replace the body of that
function and return `{ ok: true, channel: 'api' }`. The form renders whatever
it returns; no component needs to change. The file has the request shape in a
comment.

The WhatsApp number lives in `contact.whatsapp` in `src/data/site.ts` and is
used by every WhatsApp link on the site via `src/lib/whatsapp.ts`.

---

## Design system

Tokens are defined once at the top of `src/app/globals.css`.

| Role | Token | Value |
| --- | --- | --- |
| Page ground | `--background` | `#F7F7F5` |
| Raised surface | `--surface` | `#ECECE8` |
| Ink | `--foreground` | `#1A1D21` |
| Brand blue | `--primary` | `#0B4DA2` |
| Dark navy | `--primary-dark` | `#051D3F` |
| Accent red | `--accent` | `#D6321F` |
| Accent red, small text | `--accent-text` | `#C22A19` |

Red is reserved for the primary call to action, active states and small
markers. Blue carries the brand. No section is filled red.

Two notes on colour, both deliberate:

- `--accent-text` exists because `--accent` only reaches 4.1:1 on `--surface`,
  below the 4.5:1 needed for small text. Any red label, number or eyebrow uses
  the darker step.
- Every grey step (`--muted`, `--muted-strong`, `--muted-soft`) clears 4.5:1
  against `--background`, `--surface`, white and `--primary-tint`. If you add a
  lighter grey, check it against `--surface`, which is the strictest ground.

Layout uses one container (`width: min(100% - 2 * gutter, 1280px)`), one
spacing scale (`--space-1` … `--space-30`) and restrained radii (2/4/8px).

Interaction timings are tokenised too: `--t-link` 200ms, `--t-button` 220ms,
`--t-card` 300ms, `--t-image` 500ms. Hovers lift 1–2px or scale 1.02, never
more. Everything is disabled under `prefers-reduced-motion`.

### Scroll reveal

`<Reveal>` is a server component that only emits `data-reveal`. A single
`RevealObserver` in the root layout watches every marked element, so a page
with twenty reveals ships one IntersectionObserver and no per-element state.

The hidden starting state is applied by CSS under `html.js`, set by a tiny
inline script in `<head>`. If the bundle fails to load, content stays visible
rather than disappearing.

---

## Verified

Checked against the production build in Chrome:

- All 9 routes return 200; `/no-such-page` returns the styled 404.
- Every internal link resolves. The only external link target is `wa.me`.
- One `<h1>` per page, no heading-level jumps, no image without `alt`, no
  button without an accessible name.
- Unique `<title>`, meta description, canonical and Open Graph tags per page.
- No console errors, and no horizontal overflow at 1440 / 1280 / 768 / 430 /
  390 / 360px.
- Mobile menu: opens, traps page scroll, closes on Escape and on navigation,
  `aria-expanded` tracks state.
- Keyboard: first Tab reaches the skip link, focus ring visible throughout.
- Form: blocks empty submits, rejects short phone numbers and malformed email,
  moves focus to the first invalid field, links errors with `aria-describedby`.
- Project filters: counts correct, single-select, "All" restores.

### Lighthouse

Measured against `next start` on localhost (HTTP/1.1, no CDN, no edge cache):

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 81–84 | 96–100 | 100 | 100 |

Desktop meets every target in the brief. Accessibility, best practices and SEO
meet them on mobile too.

Mobile performance sits below the 90 target, and the whole gap is LCP
(~4.2s, of which 89% is render delay). The measurable causes are specific to
this environment: 460ms TTFB from a local dev server, and five render-blocking
stylesheets fetched serially over HTTP/1.1. On a host with HTTP/2 and a CDN
those collapse to roughly one round trip on a warm connection.

Two things were ruled out rather than assumed: `font-display: optional`
changes LCP by 0.1s (so the webfont swap is not the cause, and `swap` was kept
for brand fidelity on first paint), and CLS is already 0.01 on mobile and
0.037 on desktop. **Re-run Lighthouse against the deployed URL before treating
the mobile number as final** — it is the only figure here that the local
environment distorts.

---

## Deploying

Any Node host works (`npm run build` then `npm start`), and Vercel needs no
configuration.

For a purely static host, uncomment `output: 'export'` in `next.config.mjs`
and add `images: { unoptimized: true }` — the only raster is the logo, and
every route is statically renderable.

Before going live, set the real domain in `site.url` (`src/data/site.ts`). It
drives canonical URLs, Open Graph URLs, `sitemap.xml` and `robots.txt`.
