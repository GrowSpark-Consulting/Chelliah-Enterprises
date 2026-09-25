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

import type { ImageRatio } from '@/components/ui/ImageFrame';

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
  /**
   * Overrides the frame's own aspect ratio. Set this only where cropping the
   * file would destroy it — a composite of several panels, for instance, is
   * not a photograph you can crop into and must be shown whole.
   */
  ratio?: ImageRatio;
  /**
   * Set for a file that arrives on its own white ground — a supplied
   * composite with brushed or torn edges, rather than a photograph that
   * fills its frame edge to edge.
   *
   * The frame then drops its border and lets the file multiply into the page,
   * so the white becomes the page colour and the edges feather out. Without
   * it such a file reads as a white panel pasted onto the off-white ground.
   * Never set it for an image shown on a dark section: multiply would sink it.
   */
  bleed?: boolean;
};

/* ── The library ──────────────────────────────────────────────────────── */

const library = [
  {
    id: 'blue-coated-driveway',
    src: '/home.jpeg',
    alt: 'A finished bright blue floor coating running the length of an outdoor driveway, lined with brick planters and palms on one side and a green screened boundary wall on the other.',
    categories: ['hero', 'carpark', 'finished'],
    label: 'Outdoor floor coating',
    // Desktop heroes crop this 16:9 file very little. Where they do, hold
    // below centre: the coated floor is the subject, the sky is not.
    focus: '50% 62%',
    // Tall crops cut in from the sides; bias right to keep the far gate, the
    // vanishing point of the floor.
    focusMobile: '64% 58%',
  },
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
    id: 'app-membrane-torch-applied-roof',
    src: '/HDPE.png',
    alt: 'A worker torch-applying an APP bitumen membrane along a rooftop slab, the roll part-laid ahead of him and a second operative bedding down an earlier run further along the roof.',
    categories: ['waterproofing', 'wip'],
    label: 'Membrane waterproofing',
    // The frame carries a light diagonal flare across its right-hand edge;
    // biasing the crop left keeps the applicator and the roll central and
    // pushes most of that edge out of a 4:3 frame.
    focus: '38% 50%',
    focusMobile: '38% 50%',
  },
  {
    id: 'esd-floor-electronics-assembly',
    src: '/epu_esd.png',
    alt: 'A grey conductive ESD floor running the length of an electronics assembly area, marked with yellow demarcation lines and an ESD warning triangle, with anti-static workbenches and an "ESD protected area" sign along the left-hand side.',
    categories: ['industrial', 'esd', 'finished'],
    label: 'ESD flooring',
    // The frame runs down the aisle with the vanishing point high and right.
    // Holding the crop slightly above centre keeps the marked floor and the
    // benches in shot rather than filling a wide frame with bare foreground.
    focus: '50% 42%',
    focusMobile: '55% 45%',
  },
  {
    id: 'vacuum-dewatering-concrete-slab',
    src: '/vacum.png',
    alt: 'Two operatives in hi-vis vests and hard hats drawing water off a freshly laid concrete slab with suction mats, the hoses running back to a wheeled vacuum dewatering unit standing on the wet floor of a new shed.',
    categories: ['industrial', 'wip'],
    label: 'Vacuum dewatering',
    // The plant and both operatives sit across the left half of the frame and
    // the slab runs away to the right. A 4:3 crop takes the sides off a 3:2
    // file, so the crop is biased left to keep the machine and the crew whole.
    focus: '40% 50%',
    focusMobile: '35% 50%',
  },
  {
    id: 'company-team-and-sports-floor-composite',
    src: '/about-team.jpg',
    alt: 'Three panels: three men standing together on a covered sports court finished in green and red coating; two men rolling red sports floor coating across a hall; and a man rolling green floor coating across a room in a bare building.',
    categories: ['general', 'wip', 'finished'],
    label: 'Sports floor coating projects',
    // Three panels behind a brushed edge, not a single frame. At 2:1 the file
    // is shown effectively whole — an editorial crop would cut the outer two
    // panels in half and take the brushwork with them.
    ratio: '2/1',
    // The file's own white ground carries those brushed edges, so it is
    // multiplied into the page rather than boxed in a frame.
    bleed: true,
  },
  {
    id: 'epoxy-projects-composite',
    src: '/epoxyy.png',
    alt: 'Four Chelliah Enterprises epoxy projects: an applicator spreading grey epoxy across a plant floor, a green floor with yellow safety lines being coated in a production hall, a cream self-levelling epoxy being worked with a notched trowel, and a red outdoor sports surface being rolled.',
    categories: ['industrial', 'epoxy', 'wip', 'finished'],
    label: 'Epoxy flooring projects',
    // A composite of four panels, not a single frame: cropping into it cuts
    // the panels on its edges in half, so it is shown at its own ratio.
    ratio: '3/2',
  },
  {
    id: 'resin-floor-processing-hall',
    src: '/Polyurethane.png',
    alt: 'A seamless light-grey resin floor running the length of a clean processing hall, its gloss surface reflecting the ceiling lights, with guarded machinery wrapped in protective sheeting along one wall.',
    categories: ['industrial', 'pu', 'finished'],
    label: 'PU flooring',
    // The floor is the subject and fills the lower two thirds; a 4:3 frame
    // crops only width, and nothing important sits at either edge.
    focus: '50% 52%',
    // Narrow crops lose the machinery bay first, which is the context that
    // makes this read as a working plant rather than an empty room.
    focusMobile: '34% 52%',
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
  {
    /*
     * The before/after pair the slider carries.
     *
     * Both files are 1280x853 and shot from one position on the same lens, so
     * any frame crops them identically and the two halves meet exactly at the
     * divider. That is why neither carries a `focus`: centre is already the
     * same point in both, and the parapet, the stair block and the tank frame
     * hold their places as the divider moves across them.
     */
    id: 'terrace-roof-before-waterproofing',
    src: '/slider1.1.jpeg',
    alt: 'A flat concrete terrace roof before waterproofing: the slab crazed and cracked across its whole surface, shallow water standing in the hollows, and the parapet walls and stair block dark with staining.',
    categories: ['waterproofing', 'general'],
    label: 'Before waterproofing',
  },
  {
    id: 'terrace-roof-after-waterproofing',
    src: '/slider1.2.jpeg',
    alt: 'The same terrace roof after waterproofing, the slab finished in a smooth grey membrane coating carried up into a skirting at the parapet, with the parapet walls and stair block repainted.',
    categories: ['waterproofing', 'finished'],
    label: 'After waterproofing',
  },
  {
    /*
     * The SMJ walkway before the work. Its finished state is the hero
     * photograph itself, `blue-coated-driveway`, which is why only the before
     * frame is registered here: the phone hero lays this over that one and
     * fades it away. The slider above uses the terrace pair instead.
     */
    id: 'smj-walkway-before-waterproofing',
    src: '/slider1.jpeg',
    alt: 'A palm-lined walkway before waterproofing: bare concrete, stained and patchy, running between brick planters towards a green gate.',
    categories: ['waterproofing', 'general'],
    label: 'Before waterproofing',
    focus: '65% 50%',
    // The phone hero crops this landscape file hard from the sides. Bias
    // right, as the hero photograph does, to hold the far green gate — the
    // one landmark both frames share.
    focusMobile: '62% 50%',
  },
  {
    id: 'waterproofing-terrace-before-after',
    src: '/images/projects/waterproofing-terrace-before-after.jpeg',
    alt: 'A palm-lined terrace walkway shown before and after waterproofing, the finished half coated in blue waterproof paint, alongside a diagram of the waterproof coating, cement screed, brickbats coba and RCC slab layers.',
    categories: ['waterproofing', 'finished'],
  },
  {
    id: 'cooling-tiles-terrace-laying',
    src: '/images/projects/cooling-tiles-terrace-laying.jpeg',
    alt: 'A worker spreading tile adhesive with a notched trowel to lay red cooling tiles on a terrace.',
    categories: ['wip', 'general'],
  },
  {
    id: 'structural-repair-collage',
    src: '/images/projects/structural-repair-collage.jpeg',
    alt: 'Two workers applying red epoxy coating with rollers, with inset photographs of a finished grey epoxy floor and a wide view of the completed hall.',
    categories: ['wip', 'finished', 'general'],
  },
  {
    id: 'residential-terrace-epoxy-floor',
    src: '/images/projects/residential-terrace-epoxy-floor.jpeg',
    alt: 'A finished hall with a glossy beige epoxy floor reflecting the ceiling fans and windows.',
    categories: ['epoxy', 'finished'],
  },
  {
    id: 'industrial-basement-red-epoxy-floor',
    src: '/images/projects/industrial-basement-red-epoxy-floor.jpeg',
    alt: 'A red epoxy floor walkway inside an industrial warehouse, running between storage racks and a shop-floor-management signage board.',
    categories: ['epoxy', 'industrial', 'finished'],
  },
  {
    id: 'office-institute-grey-epoxy-floor',
    src: '/images/projects/office-institute-grey-epoxy-floor.jpeg',
    alt: 'A finished grey epoxy floor in a bright office hall with a large window wall and a blue branded feature wall.',
    categories: ['epoxy', 'finished'],
  },
  {
    id: 'car-park-deck-coating',
    src: '/images/projects/car-park-deck-coating.jpeg',
    alt: 'A finished car park deck with grey epoxy coating, yellow and blue directional markings, hazard-striped columns and parked cars.',
    categories: ['epoxy', 'carpark', 'finished'],
  },
  {
    id: 'sports-court-epoxy-line-marking',
    src: '/images/projects/sports-court-epoxy-line-marking.jpeg',
    alt: 'A finished outdoor badminton court with green and red epoxy coating and white line marking, set among trees.',
    categories: ['epoxy', 'finished'],
  },
  {
    id: 'wall-coating-epoxy-corridor',
    src: '/images/projects/wall-coating-epoxy-corridor.jpeg',
    alt: 'A finished red and grey epoxy floor corridor inside an industrial facility, with yellow and black hazard-striped columns and a row of doors along one wall.',
    categories: ['epoxy', 'industrial', 'finished'],
  },
  {
    id: 'machining-plant-epoxy-floor',
    src: '/images/projects/machining-plant-epoxy-floor.jpeg',
    alt: 'A finished grey epoxy floor with yellow line marking down the centre of an aisle in a machining plant, running between rows of production machinery.',
    categories: ['epoxy', 'industrial', 'finished'],
  },
  {
    id: 'distribution-warehouse-epoxy-floor',
    src: '/images/projects/distribution-warehouse-epoxy-floor.jpeg',
    alt: 'A finished blue epoxy floor with white aisle marking in a distribution warehouse, running between tall pallet racking with hazard-striped corner guards.',
    categories: ['epoxy', 'industrial', 'finished'],
  },
  {
    id: 'welding-unit-epoxy-coating',
    src: '/images/projects/welding-unit-epoxy-coating.jpeg',
    alt: 'A worker rolling red epoxy coating onto a floor, with a Jotun paint tin standing on the wet surface nearby.',
    categories: ['epoxy', 'wip'],
  },
  {
    id: 'food-processing-warehouse-floor',
    src: '/images/projects/food-processing-warehouse-floor.jpeg',
    alt: 'A finished grey resin floor with yellow aisle marking in a warehouse, running between tall pallet racking with a forklift parked at the far end.',
    categories: ['pu', 'industrial', 'finished'],
  },
  {
    id: 'electronics-assembly-esd-floor',
    src: '/images/projects/electronics-assembly-esd-floor.jpeg',
    alt: 'A finished light grey ESD floor with yellow demarcation lines running down an electronics assembly line, past workstations with monitors on either side.',
    categories: ['esd', 'industrial', 'finished'],
  },
  {
    id: 'coastal-factory-column-repair',
    src: '/images/projects/coastal-factory-column-repair.jpeg',
    alt: 'A worker in hi-vis and a hard hat applying repair render to an RCC column with exposed reinforcement, on a construction site with a crane in the background.',
    categories: ['industrial', 'wip'],
  },
  {
    id: 'commercial-block-crack-repair',
    src: '/images/projects/commercial-block-crack-repair.jpeg',
    alt: 'A close view of a structural crack in a concrete column opened up to expose rusted reinforcement bars, ready for repair.',
    categories: ['industrial', 'wip'],
  },
  {
    id: 'commercial-park-car-park-deck',
    src: '/images/projects/commercial-park-car-park-deck.jpeg',
    alt: 'A finished grey car park deck on a rooftop level with yellow directional and bay markings, a city skyline visible beyond the parapet.',
    categories: ['carpark', 'finished'],
  },
  {
    id: 'indoor-sports-court-line-marking',
    src: '/images/projects/indoor-sports-court-line-marking.jpeg',
    alt: 'A finished indoor sports court with blue coating, yellow and white multi-sport line marking, and a basketball hoop against one wall.',
    categories: ['epoxy', 'finished'],
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
  /**
   * Home page — full-bleed hero behind the headline and enquiry card.
   *
   * To replace it, register the new file above and point this slot at it.
   * The translucent enquiry card is tinted from whatever photograph this
   * resolves to, measured at build time, so nothing else needs changing.
   */
  homeHero: 'blue-coated-driveway',
  /**
   * Home page, phones only — the same walkway before the work, laid over the
   * hero photograph and cycled every two seconds. The hero above is the SMJ
   * walkway finished, so this slot has to stay the same site before it, or
   * the cycle stops being a before and after and becomes two unrelated jobs.
   * Set it to null to leave the hero still.
   */
  homeHeroBefore: 'smj-walkway-before-waterproofing',
  /** Services page masthead. */
  servicesHero: 'green-epoxy-roller-application',
  /** About page masthead. */
  aboutHero: 'branded-hard-hat-on-drawings',
  /** About page — the large editorial image beside the company introduction. */
  aboutEditorial: 'company-team-and-sports-floor-composite',
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
  waterproofing: 'waterproofing-terrace-before-after',
  'weathering-course': 'cooling-tiles-terrace-laying',
  'structural-repair': 'structural-repair-collage',
  'epoxy-flooring': 'epoxy-projects-composite',
  'membrane-waterproofing': 'app-membrane-torch-applied-roof',
  'pu-flooring': 'resin-floor-processing-hall',
  'esd-flooring': 'esd-floor-electronics-assembly',
  'vacuum-dewatering-flooring': 'vacuum-dewatering-concrete-slab',
  'car-park-deck-coating': 'car-park-deck-coating',
  'sports-flooring': 'sports-court-epoxy-line-marking',
  'wall-coatings': 'wall-coating-epoxy-corridor',
};

export function serviceImage(slug: string): SiteImage | undefined {
  return getImage(serviceImages[slug] ?? null);
}

/* ── Before / after pairs ─────────────────────────────────────────────── */

/** Two photographs of one place, for the before/after gallery. */
export type ImageComparison = { before: ImageId; after: ImageId };

/** The same pair with both records resolved. */
export type ResolvedComparison = { before: SiteImage; after: SiteImage };

/**
 * Service slug → the pair its section compares.
 *
 * A service with no pair keeps the single photograph from `serviceImages`,
 * so this grows one entry at a time as real before/after shots arrive. Both
 * frames must be the same place from roughly the same position; two
 * different sites wiped together would misrepresent the work.
 */
export const serviceComparisons: Partial<Record<string, ImageComparison>> = {
  waterproofing: {
    before: 'terrace-roof-before-waterproofing',
    after: 'terrace-roof-after-waterproofing',
  },
};

/** The pair the home page leads its work section with. */
export const featuredComparison: ImageComparison = {
  before: 'terrace-roof-before-waterproofing',
  after: 'terrace-roof-after-waterproofing',
};

export function resolveComparison(
  pair: ImageComparison | undefined,
): ResolvedComparison | undefined {
  if (!pair) return undefined;
  const before = getImage(pair.before);
  const after = getImage(pair.after);
  return before && after ? { before, after } : undefined;
}

export function serviceComparison(slug: string): ResolvedComparison | undefined {
  return resolveComparison(serviceComparisons[slug]);
}

/** Project record id → photograph, keyed by the `id` in data/projects.ts. */
export const projectImages: Partial<Record<string, ImageId>> = {
  'wp-terrace-guduvancheri': 'residential-terrace-epoxy-floor',
  'wp-basement-chengalpattu': 'industrial-basement-red-epoxy-floor',
  'wp-apartment-tambaram': 'office-institute-grey-epoxy-floor',
  'ep-machining-oragadam': 'machining-plant-epoxy-floor',
  'ep-warehouse-sriperumbudur': 'distribution-warehouse-epoxy-floor',
  'ep-welding-ambattur': 'welding-unit-epoxy-coating',
  'pu-food-chennai': 'food-processing-warehouse-floor',
  'esd-electronics-sriperumbudur': 'electronics-assembly-esd-floor',
  'st-coastal-thoothukudi': 'coastal-factory-column-repair',
  'st-commercial-vandalur': 'commercial-block-crack-repair',
  'cp-park-tambaram': 'commercial-park-car-park-deck',
  'sp-court-guduvancheri': 'indoor-sports-court-line-marking',
};

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
