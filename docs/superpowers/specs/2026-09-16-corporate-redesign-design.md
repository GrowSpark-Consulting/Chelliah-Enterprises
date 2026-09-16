# Chelliah Enterprises — Corporate UI Redesign

Status: approved for implementation planning
Date: 2026-09-16

## Scope

A visual redesign of every page of the existing Next.js site — colors, typography,
spacing, layout composition, and responsive behavior — without changing business
content, routes, component file names/locations, or the technology stack.

**Explicitly out of scope:** rewriting marketing copy, inventing content (clients,
stats, certifications, projects, photography), adding dependencies, renaming or
moving files, changing the enquiry/WhatsApp functionality, restructuring routes.

**Superseded:** the pre-existing `UI mockups and brand colors (1)/` folder (the
"Industry" blueprint/wireframe design system — steel-blue, Barlow Condensed,
crosshair-cornered cards). It conflicts with the direction below and is disregarded.

## Stack decision

No new dependencies. Redesign happens entirely inside the existing architecture:

- Next.js 15 / React 19 / TypeScript, unchanged.
- Design tokens stay centralized in `src/app/globals.css` (`:root` custom
  properties) — only the *values* change, not the mechanism.
- Each component keeps its own `ComponentName.module.css`; only the rules inside
  change.
- `Reveal` + `RevealObserver` (IntersectionObserver-based fade-up, disabled under
  `prefers-reduced-motion`) stays as the one animation primitive. No GSAP, no
  Lenis.
- No Swiper. Where a horizontal swipe reads better on mobile (the "Recent work"
  project strip), use native CSS `scroll-snap-type` / `overflow-x: auto` instead —
  zero JS, same touch UX.
- No new icon library — keep `lucide-react`.

## Visual system

### Color

Replace the current blue/red token values with the brief's palette. Same
variable names in `globals.css`, new values, so every component that already
consumes `var(--primary)`, `var(--accent)`, etc. re-themes automatically:

| Token | Old value | New value | Role |
| --- | --- | --- | --- |
| `--background` | `#f7f7f5` | `#F7F7F5` | Page ground (unchanged) |
| `--surface` | `#ecece8` | `#E8E8E5` | Raised surface / light grey |
| `--foreground` | `#1a1d21` | `#252525` | Ink (charcoal) |
| `--primary` | `#0b4da2` (blue) | `#162536` (deep navy) | Headings-on-light, primary UI ink |
| `--primary-dark` / `--navy` | `#051d3f` | `#162536` | Dark section ground |
| `--ink` (onInk ground) | `#1a1d21` | `#1B1B1B`–`#252525` range | Charcoal section ground |
| `--accent` | `#d6321f` (red) | `#A58B5B` (muted bronze/gold) | Sparing accent only — small labels, active states, numbered markers, one hover treatment. **Never a section fill or a large button fill** — buttons stay navy/charcoal solid or outline, per the brief's restraint rule. |
| `--accent-text` | `#c22a19` | a slightly deepened bronze step, contrast-checked at 4.5:1 on `--surface` | Small accent text |

Contrast is re-verified against WCAG AA for every repurposed role (the codebase's
existing habit — see the accent-text / muted-step comments in `globals.css` — is
kept: bronze on light grounds gets a deepened step if the base tone fails 4.5:1
for text).

### Typography

- Headings: **Libre Baskerville** (traditional serif — more "established
  engineering firm" than the more editorial DM Serif Display). Loaded via
  `next/font/google` alongside the existing Inter, both as CSS variables.
- Body/UI: **Inter**, already loaded — kept.
- Remove the current `text-transform: uppercase` on `h1`/`h2` (the brief wants
  confident, readable headings, not all-caps blocks); uppercase stays only for
  small eyebrow labels (`.label`, `.meta`), which is already how those are used.
- `clamp()` fluid sizing stays (already implemented) — scale values re-tuned
  once Libre Baskerville is in place, since serif type reads larger than sans
  at the same px size.

### Spacing, radius, motion

The existing token scale (`--space-1` … `--space-30`, `--radius-sm/md/lg`,
`--t-link/button/card/image`) is already disciplined and matches the brief's
"generous whitespace, small radius, subtle motion" direction. Values are
re-tuned in place (more section-level breathing room per §18 of the brief) but
the system itself is kept, not replaced.

## Global shell

**Header** (`Header.tsx` / `Header.module.css`): off-white background, thin
1px bottom border (`--border`), no glass/blur. Nav order becomes Services,
Projects, About, Clients, Contact. "Clients" is new — no dedicated route
exists, so it links to `/about#clients` (an `id` added to the existing
`ClientWall` section on the About page). Logo stays the home link (unchanged
behavior). Primary CTA button copy changes from "Chat on WhatsApp" to "Request
Site Inspection" — same `generalEnquiry` WhatsApp link, label only. Sticky-scroll
behavior (`data-scrolled`) is kept, restyled to a subtle shadow/border rather
than size jump.

**Footer** (`Footer.tsx` / `Footer.module.css`): navy/charcoal background,
same four-column content (brand, services, quick links, contact) plus group
companies and copyright bar — restyled only.

**Mobile menu panel**: same open/close/focus-trap behavior, restyled to match
the new palette and serif/sans pairing.

## Page-by-page mapping

Brief section numbers in parentheses. Content/data sources unchanged in all
cases — only markup structure and CSS change.

- **Hero** (§6): `Hero.tsx` restructured — eyebrow ("CHELLIAH ENTERPRISES ·
  EST. 2009"), serif h1, existing `shortDescription` copy, two CTAs (WhatsApp
  enquiry + View Projects), trust indicators row. Existing `ImageFrame`
  placeholder/photo slot kept as-is (no fabricated imagery).
- **Stats** (§7): `StatStrip.tsx` restyled to a horizontal strip with thin
  vertical dividers on desktop, stacked on mobile — data unchanged
  (`stats` in `site.ts`).
- **Services** (§8): `ServiceGrid`/`ServiceCard` on the home page and
  `/services` change from a card grid to the brief's formal numbered list
  (number, title, description, subtle arrow, thin separator). Same `services`
  data, same `hasPage`/`featured` filtering logic.
- **About / company intro** (§9): `about/page.tsx` intro section restyled to
  the two-column heading+copy layout described in the brief — content
  (the three paragraphs) unchanged.
- **Why Chelliah** (§10): the home page's `whyUs` list and About's
  `qualityPrinciples` list (already numbered `01`–`04`/`01`–`06`) get the
  brief's formal numbered presentation — data unchanged.
- **Clients** (§11): `ClientWall.tsx` becomes the monochrome typography grid
  described in the brief (already close to this) with a subtle hover only —
  `id="clients"` added for the new header nav anchor. No logos exist to swap
  in; names stay as text per the current honest-placeholder approach.
- **Projects** (§12): `ProjectCard`/`ProjectGrid` restyled to an editorial
  grid (varied emphasis rather than identical cards) on desktop/tablet; the
  home page's "Recent work" 3-card row becomes a `scroll-snap` swipeable strip
  on mobile. `PROJECTS_ARE_PLACEHOLDERS` disclosure behavior is preserved
  exactly — this redesign does not touch project data or the placeholder
  flag.
- **Process** (§13): `Process.tsx`'s 4-step list restyled to the brief's
  horizontal-with-connecting-line layout on desktop, vertical timeline on
  mobile — `processSteps` data unchanged.
- **CTA** (§14): `CTASection.tsx` restyled to the formal navy/charcoal band
  with "Request a Site Inspection" primary + "Contact Us" secondary.
- **Contact** (§ contact page): `ContactInfo`/`ContactForm` restyled only;
  validation and WhatsApp submission behavior (`enquiry.ts`) untouched.
- **404** (`not-found.tsx`): restyled to match, same copy.

## Responsive & accessibility

Verified at the breakpoints already covered by the codebase (320/375/390/430/
768/1024/1280/1440/1920) after each page's restyle — no new horizontal
overflow, no text clipping. Existing accessibility baseline (skip link, focus
rings, `aria-current`, form error handling, alt text discipline) is preserved;
color changes get contrast-checked against the same 4.5:1 bar the current
tokens document.

## Rollout order (page by page, stop for review after each)

1. Design tokens (`globals.css`) + Header + Footer (shared shell) — reviewed
   together since every page depends on them.
2. Home page (Hero, Stats, Services, Why Us, Clients, Recent Work, Process, CTA).
3. Services (index + `[slug]` detail template).
4. Projects (index + card/grid).
5. About.
6. Contact.
7. 404 / final full-site responsive pass.

Each step stops for explicit approval before moving to the next, per your
existing preference.
