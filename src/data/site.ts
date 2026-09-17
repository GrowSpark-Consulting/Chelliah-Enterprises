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
   * must be the address that actually serves the site. Switch this to the
   * custom domain only once that domain is connected and serving, or search
   * engines will be pointed at a canonical that does not respond.
   */
  url: 'https://chelliah-enterprises.vercel.app',
  displayUrl: 'chelliah-enterprises.vercel.app',
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
  mapQuery: 'Nandivaram Guduvancheri Chengalpattu 603202 Tamil Nadu',
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
 * Any brand without an entry keeps showing its name with an empty logo slot,
 * so nothing is fabricated and nothing breaks while assets are pending.
 */
export const brandLogos: Record<string, { src: string; width: number; height: number }> = {};

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
