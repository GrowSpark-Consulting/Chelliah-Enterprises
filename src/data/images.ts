/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE PHOTOGRAPHY REGISTRY — the single place image paths are written
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every photograph on the site is declared once in `imageLibrary` below and
 * referenced everywhere else by its `id`. Nothing outside this file writes a
 * path under /public.
 *
 * TO ADD PHOTOGRAPHS
 *   1. Drop the files into /public/images/projects/.
 *   2. Add one entry per file to `imageLibrary` — id, src, alt, categories.
 *   3. Point the slots at the end of this file at the ids you want used.
 *
 * Any slot left `null` renders the existing "photograph pending" placeholder
 * rather than borrowing another section's photograph, so the site never
 * repeats one image to fill a gap.
 *
 * These are the client's own project photographs. They are not stock, and
 * they are not retouched — presentation is handled entirely in CSS (crop,
 * overlay, a slight brightness/saturation trim), never by altering the work
 * shown.
 */

/** How a photograph may be used. One image can belong to several. */
export type ImageCategory =
  /** A. Strong enough to carry a full-bleed hero or background band. */
  | 'hero'
  /** B. Industrial flooring — plants, sheds, warehouses. */
  | 'industrial'
  /** C. Epoxy flooring. */
  | 'epoxy'
  /** D. PU flooring. */
  | 'pu'
  /** E. Waterproofing. */
  | 'waterproofing'
  /** F. ESD / specialised conductive flooring. */
  | 'esd'
  /** G. Car park decks and outdoor coatings. */
  | 'carpark'
  /** H. Work in progress — application, preparation, crew on site. */
  | 'wip'
  /** I. Finished project surfaces. */
  | 'finished'
  /** J. General company / site context. */
  | 'general';

export type SiteImage = {
  id: string;
  /** Path under /public. */
  src: string;
  /** Factual description of what is in the frame. Never a claim about it. */
  alt: string;
  categories: readonly ImageCategory[];
  /**
   * Neutral caption for the gallery. Leave it out and the primary category
   * supplies one. Never put a client or project name here unless the client
   * has confirmed it — an unnamed project is labelled by what it shows.
   */
  label?: string;
  /**
   * CSS object-position for wide crops. Keeps the subject in frame when the
   * container is much wider than the original 4:3 photograph.
   */
  focus?: string;
  /** object-position for narrow (portrait) crops, where more is cropped away. */
  focusMobile?: string;
};

/* ── The library ──────────────────────────────────────────────────────── */

const library = [
  {
    id: 'epoxy-application-plant-floor',
    src: '/hero.png',
    alt: 'An applicator spreading epoxy floor coating with a squeegee across the floor of an industrial plant, the finished surface reflecting the roof structure behind him.',
    categories: ['hero', 'industrial', 'epoxy', 'wip'],
    // This file is the wide grade, with the navy fall-off already on the left
    // edge. Hold the centre on desktop so that graded edge stays under the
    // headline; on tall crops the frame is cut horizontally, so bias right to
    // keep the applicator and the lit floor in shot rather than the blank wall.
    focus: '50% 50%',
    focusMobile: '62% 50%',
  },
  {
    id: 'green-epoxy-roller-application',
    src: '/our_service_hero.png',
    alt: 'An applicator rolling a bright green epoxy coating across the floor of a newly built hall, the wet surface reflecting the windows and columns around him.',
    categories: ['hero', 'epoxy', 'wip', 'finished'],
    label: 'Epoxy flooring application',
    // The applicator stands well to the right and the wet floor fills the
    // lower two thirds. A masthead band is much wider than the file, so the
    // crop is vertical: hold it high enough to keep him whole in frame.
    focus: '50% 36%',
    focusMobile: '70% 42%',
  },
  {
    id: 'pink-epoxy-corridor-application',
    src: '/project.jpeg',
    alt: 'Two applicators rolling a bright pink epoxy coating along a corridor inside a working facility, the wet floor reflecting the ceiling lights, with equipment cabinets on one side and electrical panels on the other.',
    categories: ['hero', 'industrial', 'epoxy', 'wip'],
    label: 'Epoxy corridor coating',
    // Like the home hero file, this one arrives with the navy fall-off already
    // graded onto its left edge, so the masthead wash has less work to do.
    // Both applicators sit centre-right with their heads close to the top of
    // the frame. A masthead band crops ~250px off a 16:9 file at this width,
    // so the crop is held high: centring it decapitated both of them.
    focus: '52% 20%',
    // Narrow crops cut in from the sides, so bias right to keep both men and
    // the lit floor rather than the equipment racks.
    focusMobile: '66% 48%',
  },
  {
    id: 'branded-hard-hat-on-drawings',
    src: '/about.jpeg',
    alt: 'A white hard hat printed with the Chelliah Enterprises name resting on rolled architectural drawings on a workbench, with the interior of a building under construction out of focus behind it.',
    categories: ['hero', 'general'],
    label: 'Site documentation',
    // The helmet sits in the right third and reads low in the frame; hold
    // below centre so a wide crop does not cut its brim off.
    focus: '50% 54%',
    focusMobile: '74% 56%',
  },
  {
    id: 'office-signage-wall',
    src: '/contact.jpeg',
    alt: 'A concrete signage wall at a building entrance carrying the Chelliah Enterprises name and the line Waterproofing & Epoxy Works, with glazing and planting beyond it.',
    categories: ['hero', 'general'],
    label: 'Office signage',
    // The lettering occupies the upper right of the frame, so a wide crop is
    // held high to keep the whole sign in shot.
    focus: '50% 40%',
    // A phone-width crop only keeps ~390 of 753 rendered pixels, and the
    // lettering runs to the right edge of the file, so the crop is pushed
    // most of the way right — at 76% it cut "EPOXY WORKS" mid-word.
    focusMobile: '92% 40%',
  },
] as const satisfies readonly SiteImage[];

export const imageLibrary: readonly SiteImage[] = library;

export type ImageId = (typeof library)[number]['id'];

/* ── Lookups ──────────────────────────────────────────────────────────── */

const byId = new Map<string, SiteImage>(library.map((image) => [image.id, image]));

/** Resolves an id to its record. Returns undefined for null / unknown ids. */
export function getImage(id?: ImageId | null): SiteImage | undefined {
  return id ? byId.get(id) : undefined;
}

/** Every photograph filed under a category, in library order. */
export function imagesIn(category: ImageCategory): SiteImage[] {
  return imageLibrary.filter((image) => image.categories.includes(category));
}

/* ── Slots: which photograph each part of the site uses ───────────────── */

/**
 * Page-level heroes, editorial images and background bands.
 *
 * Only assign a slot a photograph that genuinely suits it. An unassigned
 * hero falls back to the plain navy masthead, which is a better result than
 * a borrowed or badly-cropped image.
 */
export const imageSlots = {
  /** Home page — full-bleed hero behind the headline and enquiry card. */
  homeHero: 'epoxy-application-plant-floor',
  /** Services page masthead. */
  servicesHero: 'green-epoxy-roller-application',
  /** About page masthead. */
  aboutHero: 'branded-hard-hat-on-drawings',
  /** About page — the large editorial image beside the company introduction. */
  aboutEditorial: null,
  /** Projects page masthead. */
  projectsHero: 'pink-epoxy-corridor-application',
  /** Contact page masthead — kept quiet so it never fights the form. */
  contactHero: 'office-signage-wall',
  /** The closing call-to-action band carried by every major page. */
  cta: null,
} satisfies Record<string, ImageId | null>;

export type ImageSlot = keyof typeof imageSlots;

/** The photograph assigned to a slot, or undefined if none is. */
export function slotImage(slot: ImageSlot): SiteImage | undefined {
  return getImage(imageSlots[slot]);
}

/**
 * Service line → photograph, keyed by the service `slug` in data/services.ts.
 *
 * A service with no suitable original photograph is simply left out: the
 * section then shows the placeholder naming the shot it needs.
 */
export const serviceImages: Partial<Record<string, ImageId>> = {
  'epoxy-flooring': 'epoxy-application-plant-floor',
};

export function serviceImage(slug: string): SiteImage | undefined {
  return getImage(serviceImages[slug] ?? null);
}

/** Project record id → photograph, keyed by the `id` in data/projects.ts. */
export const projectImages: Partial<Record<string, ImageId>> = {};

export function projectImage(id: string): SiteImage | undefined {
  return getImage(projectImages[id] ?? null);
}

/* ── Gallery ──────────────────────────────────────────────────────────── */

/** Plain-English name for each category, used by filters and captions. */
export const categoryLabels: Record<ImageCategory, string> = {
  hero: 'Project photography',
  industrial: 'Industrial flooring',
  epoxy: 'Epoxy flooring',
  pu: 'PU flooring',
  waterproofing: 'Waterproofing',
  esd: 'ESD & specialised flooring',
  carpark: 'Car park & outdoor decks',
  wip: 'Work in progress',
  finished: 'Finished surfaces',
  general: 'Project photography',
};

/**
 * The order categories appear in the gallery filter. `hero` and `general` are
 * left out: they describe how an image is used, not what it shows.
 */
export const galleryFilters: readonly ImageCategory[] = [
  'industrial',
  'epoxy',
  'pu',
  'waterproofing',
  'esd',
  'carpark',
  'wip',
  'finished',
];

/**
 * The Projects page gallery.
 *
 * `featuredGallery` carries the six to eight strongest photographs at a
 * larger size; `gallery` is everything else, filterable by category. Both are
 * ordered lists of ids — reorder here and the page follows.
 */
export const featuredGallery: readonly ImageId[] = [];

export const gallery: readonly ImageId[] = [];

/**
 * A neutral caption for a gallery photograph.
 *
 * Where the client or project name is not confirmed, an image is described by
 * what it shows — "Epoxy flooring", "Waterproofing" — never by an invented
 * project name.
 */
export function imageLabel(image: SiteImage): string {
  if (image.label) return image.label;
  const named = image.categories.find(
    (category) => category !== 'hero' && category !== 'general',
  );
  return categoryLabels[named ?? 'general'];
}

export function resolveIds(ids: readonly ImageId[]): SiteImage[] {
  return ids.map((id) => getImage(id)).filter((image): image is SiteImage => Boolean(image));
}

/** True once at least one gallery photograph has been registered. */
export const hasGallery = featuredGallery.length > 0 || gallery.length > 0;
