/**
 * Single source of truth for company facts.
 *
 * Everything here comes from the supplied company material (letterhead,
 * company profile and the approved UI mockups). Do not add certifications,
 * awards, clients or statistics that are not in that material.
 */

export const site = {
  name: 'Chelliah Enterprises',
  legalName: 'Chelliah Enterprises',
  descriptor: 'Waterproofing & Epoxy Works',
  foundedYear: 2009,
  /*
   * Drives canonical URLs, Open Graph URLs, sitemap.xml and robots.txt, so it
   * must be the address that actually serves the site. The bare domain
   * redirects to www, so www is the canonical host. No trailing slash.
   */
  url: 'https://www.chelliahenterprises.in',
  displayUrl: 'www.chelliahenterprises.in',
  gstin: '33AJUPC6761F1Z3',
  tagline: 'Waterproofing & flooring solutions built to last',
  shortDescription:
    'Waterproofing, epoxy, PU and ESD flooring and structural repair contractors serving industrial, commercial and residential properties across Chennai.',
} as const;

/**
 * The share card, used by every route's Open Graph and Twitter metadata.
 *
 * Next merges metadata shallowly, so a page that declares its own `openGraph`
 * replaces the parent's entirely — every such page has to spread this in, or
 * its links unfurl with no image.
 */
export const ogImage = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Chelliah Enterprises — Waterproofing & Epoxy Works',
} as const;

export const contact = {
  /** Digits only, international format — used to build wa.me links. */
  whatsapp: '919962534338',
  phones: [
    { label: 'Office mobile', display: '+91 99625 34338', tel: '+919962534338' },
    { label: 'Mobile', display: '+91 80159 33448', tel: '+918015933448' },
  ],
  email: 'chelliahenterprises@gmail.com',
  address: {
    lines: [
      'No. 453, Arul Nagar Main Road',
      'Vandalur (Taluk), Arul Nagar',
      'Nandivaram Guduvancheri',
      'Chengalpattu (Dist)',
      'Tamil Nadu – 603202',
    ],
    locality: 'Nandivaram Guduvancheri',
    region: 'Tamil Nadu',
    postalCode: '603202',
    country: 'IN',
  },
  serviceArea: 'Guduvanchery, Chengalpattu, Tambaram, Vandalur & Greater Chennai',
  /*
   * What the map embed is asked for.
   *
   * The business name with its street is what makes the embed resolve to the
   * real Google listing — the place card with the name, address and rating —
   * rather than dropping an unlabelled pin on an area. The listing is at
   * 12.8604657, 80.0633757 (feature id 0x3a52f71cacbafa3f:0x55991015436e7f06),
   * but the keyless embed accepts none of `cid`, `ftid` or `ll`: given any of
   * them it renders the whole world, or nothing at all. So the query is the
   * only handle it takes, and it is deliberately specific enough to be
   * unambiguous.
   */
  mapQuery: 'Chelliah Enterprises, Arul Nagar Main Road, Nandivaram Guduvancheri',
} as const;

export const groupCompanies = [
  {
    name: 'Chelliah Groups Infrastructure',
    location: 'Kalvilai, Thoothukudi Dist – 628210',
  },
  {
    name: 'Chelliah Stores',
    location: 'Guduvancheri, Chennai – 603202',
  },
] as const;

/** Manufacturer systems the company is an authorised applicator for. */
export const authorisedBrands = [
  'Ardex Endura',
  'CUMI',
  'Nippon Paint',
  'Asian Paints',
  'MYK Arment',
  'Sunanda Speciality Coatings',
] as const;

/**
 * Official logo files for the brands above, once they are supplied and
 * cleared for use.
 *
 * TO ADD ONE: drop the file in `public/logos/` and add an entry keyed by the
 * exact brand name above, e.g.
 *
 *   'Ardex Endura': { src: '/logos/ardex-endura.svg', width: 120, height: 32 },
 *
 * Any brand without an entry is set typographically — its name carries the
 * cell — so nothing is fabricated and nothing breaks while assets are pending.
 *
 * `renderHeight` is the height the file is drawn at. Each supplied file wraps
 * its mark in a different amount of its own margin — the lettering runs from
 * 35% to 100% of the canvas — so drawing them all at one height left some
 * marks twice the size of others. These values were derived by measuring the
 * ink in each file and solving for a common optical height of about 25px.
 */
export const brandLogos: Record<
  string,
  { src: string; width: number; height: number; renderHeight?: number }
> = {
  /*
   * Cleaned derivatives of the supplied artwork, in `public/logos/`. The files
   * as delivered were opaque rasters, each on its own canvas — two of them not
   * on white — so standing them on the page left a grey rectangle under the
   * mark. The canvas has been flood-filled to transparency from the edges,
   * which removes the ground without touching the mark or the white inside it.
   * The originals are untouched in `public/`.
   */
  'Ardex Endura': {
    src: '/logos/ardex-endura.png',
    width: 225,
    height: 180,
    renderHeight: 62,
  },
  /*
   * The exception: CUMI's blue field is the mark, not a canvas, so this one is
   * the supplied file as delivered. It is judged as a tile rather than by its
   * lettering — sized against the other marks' overall presence, not their
   * text height.
   */
  CUMI: { src: '/CUMI.png', width: 554, height: 554, renderHeight: 40 },
  /* A compact badge rather than a line of lettering, so it is given a little
     more height than the ink calculation alone suggested — at the shared 25px
     it read small beside the wordmarks either side of it. */
  'Nippon Paint': {
    src: '/logos/nippon-paint.png',
    width: 242,
    height: 194,
    renderHeight: 72,
  },
  // A stacked lockup — symbol over wordmark — so it needs less height than a
  // single line of lettering to carry the same weight.
  'Asian Paints': {
    src: '/logos/asian-paints.png',
    width: 242,
    height: 193,
    renderHeight: 38,
  },
  'MYK Arment': {
    src: '/logos/myk-arment.png',
    width: 715,
    height: 429,
    renderHeight: 68,
  },
  'Sunanda Speciality Coatings': {
    src: '/logos/sunanda-speciality-coatings.png',
    width: 333,
    height: 250,
    renderHeight: 72,
  },
};

/** Named clients from the company profile. */
export const clients = [
  'L&T Energy Hydrocarbon',
  'ESAB',
  'Hanon Systems',
  'Murugappa Group',
  'CUMI',
  'Checkpoint',
  'SSS Hi-tech Constructions',
  'Wittur',
  'Bentoli',
  'INFAC',
  'Manek Micron',
  'Ocean Healthcare',
  'Marble Valley Foods',
  'EPS Interiors',
  'Vidveda',
  'Helios',
  'SVC',
  'GATALA',
] as const;

/**
 * Supplied client logos, keyed by the name in `clients`. A client with no
 * entry is set as its name, as `brandLogos` does — no logo is ever invented.
 *
 * Same conventions as `brandLogos`. Files that needed cleaning have a
 * derivative in `public/logos/clients/` and the original is untouched:
 *   - L&T arrived as a JPEG on a white canvas; the canvas is knocked out.
 *   - Checkpoint and Helios arrived as reversed (white) marks, invisible on
 *     the page ground; they are recoloured to --ink with their alpha kept.
 * Everything else is the supplied file as delivered.
 *
 * `renderHeight` is solved from the measured ink in each file for an even
 * visual weight: wide wordmarks sit lower, compact marks taller, and the
 * solid fields (ESAB, CUMI) are given less area than lettering because they
 * carry more mass.
 *
 * Not used: `Wittur_Logo_left_110.png` is a fragment of Wittur's artwork, not
 * the logo, so Wittur is still set as its name. No files have been supplied
 * for INFAC, EPS Interiors, Vidveda or GATALA.
 */
export const clientLogos: Partial<
  Record<(typeof clients)[number], { src: string; width: number; height: number; renderHeight: number }>
> = {
  'L&T Energy Hydrocarbon': {
    src: '/logos/clients/lnt-energy-hydrocarbon.png',
    width: 640,
    height: 183,
    renderHeight: 29,
  },
  ESAB: { src: '/logos/clients/esab.svg', width: 718, height: 449, renderHeight: 32 },
  'Hanon Systems': { src: '/logo_hanon.svg', width: 130, height: 50, renderHeight: 34 },
  'Murugappa Group': {
    src: '/Group_40279_92b4cee325.svg',
    width: 136,
    height: 83,
    renderHeight: 42,
  },
  CUMI: { src: '/CUMI.png', width: 554, height: 554, renderHeight: 40 },
  Checkpoint: { src: '/logos/clients/checkpoint.png', width: 400, height: 75, renderHeight: 23 },
  'SSS Hi-tech Constructions': { src: '/23.png', width: 384, height: 75, renderHeight: 24 },
  Bentoli: { src: '/logos/clients/bentoli.svg', width: 358, height: 370, renderHeight: 46 },
  'Manek Micron': {
    src: '/Manek-Micron-edited.new-PNG-copy-1.png',
    width: 2033,
    height: 456,
    renderHeight: 32,
  },
  'Ocean Healthcare': {
    src: '/logos/clients/ocean-healthcare.svg',
    width: 1900,
    height: 800,
    renderHeight: 43,
  },
  'Marble Valley Foods': {
    src: '/logos/clients/marble-valley-foods.png',
    width: 500,
    height: 84,
    renderHeight: 25,
  },
  Helios: { src: '/logos/clients/helios.png', width: 257, height: 74, renderHeight: 29 },
  SVC: { src: '/svc-logo-1.png', width: 1658, height: 322, renderHeight: 24 },
};

export type Stat = { value: string; label: string };

/** Figures supported by the supplied company material — nothing inferred. */
export const stats: Stat[] = [
  { value: '150+', label: 'Projects completed' },
  { value: '6', label: 'Authorised brand systems' },
  { value: '18', label: 'Industrial & commercial clients' },
  { value: 'Since 2009', label: 'Operating from Chennai' },
];

export const nav = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/about#clients', label: 'Clients' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Options offered in the enquiry form's "Service required" field. */
export const enquiryServices = [
  'Waterproofing (Terrace / Roof / Bathroom / Basement)',
  'Epoxy Flooring & Coatings',
  'Polyurethane (PU) Flooring',
  'ESD Flooring',
  'Car Park Deck Coating',
  'Sports Floor Coating',
  'Structural Repair & Strengthening',
  'Wall Coating (Industrial / Residential)',
  'HDPE / APP Membrane Waterproofing',
  'Other / Not sure',
] as const;

export const processSteps = [
  {
    step: '01',
    title: 'Site inspection',
    body: 'We visit the site, measure the area and identify the source of the problem rather than the symptom.',
  },
  {
    step: '02',
    title: 'Surface assessment',
    body: 'Substrate condition, moisture, load and chemical exposure are assessed to establish what the surface can carry.',
  },
  {
    step: '03',
    title: 'System recommendation',
    body: 'We specify a branded system suited to the conditions and issue a written quotation against it.',
  },
  {
    step: '04',
    title: 'Execution & handover',
    body: 'Surface preparation, application and line marking are completed to schedule, then checked before handover.',
  },
] as const;
