/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER PROJECT RECORDS — NOT REAL SITE DATA
 * ─────────────────────────────────────────────────────────────────────────
 *
 * These entries come from the approved UI mockups, where they are marked
 * "placeholders for layout — replace with real site records and photographs
 * before launch". They exist so the grid, the filters and the card rhythm
 * can be built and reviewed at the right density.
 *
 * TO GO LIVE: replace each entry below with a real project record and set
 * `PROJECTS_ARE_PLACEHOLDERS` to false. That flag is what removes the
 * on-page disclosure — the page is honest either way, without a code change
 * anywhere else.
 *
 * The named clients on this page (see `clients` in site.ts) ARE real and are
 * rendered separately from this list.
 */

export const PROJECTS_ARE_PLACEHOLDERS = true;

export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'waterproofing', label: 'Waterproofing' },
  { id: 'epoxy', label: 'Epoxy flooring' },
  { id: 'resin', label: 'PU & ESD flooring' },
  { id: 'structural', label: 'Structural repair' },
  { id: 'deck', label: 'Car park & sports' },
] as const;

export type ProjectCategory = Exclude<
  (typeof projectCategories)[number]['id'],
  'all'
>;

export type Project = {
  id: string;
  title: string;
  location: string;
  /** Sector the property belongs to. */
  sector: 'Industrial' | 'Commercial' | 'Residential';
  category: ProjectCategory;
  /** Short label for the service and scale, shown as metadata. */
  scope: string;
  /** Service line delivered, shown as the card tag. */
  service: string;
  description: string;
  /** Describes the photograph this slot expects, shown until one is supplied. */
  imageHint: string;
};

export const projects: Project[] = [
  {
    id: 'wp-terrace-guduvancheri',
    title: 'Residential terrace',
    location: 'Guduvancheri',
    sector: 'Residential',
    category: 'waterproofing',
    scope: '3,200 sq.ft · Brickbats Coba',
    service: 'Waterproofing',
    description:
      'Chronic slab leakage stopped, and dry through two monsoons since handover.',
    imageHint: 'Terrace finished with red waterproof coating',
  },
  {
    id: 'wp-basement-chengalpattu',
    title: 'Industrial basement',
    location: 'Chengalpattu',
    sector: 'Industrial',
    category: 'waterproofing',
    scope: 'HDPE membrane · Below-grade',
    service: 'Waterproofing',
    description:
      'Basement plant room kept dry through a full seasonal water-table rise.',
    imageHint: 'Basement membrane waterproofing being laid',
  },
  {
    id: 'wp-apartment-tambaram',
    title: 'Apartment block',
    location: 'Tambaram',
    sector: 'Residential',
    category: 'waterproofing',
    scope: '18 bathrooms · Sunken slab treatment',
    service: 'Waterproofing',
    description:
      'Seepage into the ceilings below eliminated without breaking up tiled floors.',
    imageHint: 'Bathroom sunken slab waterproofing',
  },
  {
    id: 'ep-machining-oragadam',
    title: 'Machining plant',
    location: 'Oragadam',
    sector: 'Industrial',
    category: 'epoxy',
    scope: '14,000 sq.ft · Self-levelling epoxy',
    service: 'Epoxy flooring',
    description:
      'Delivered inside a six-day shutdown window, including safety line marking.',
    imageHint: 'Glossy epoxy factory floor with yellow line marking',
  },
  {
    id: 'ep-warehouse-sriperumbudur',
    title: 'Distribution warehouse',
    location: 'Sriperumbudur',
    sector: 'Commercial',
    category: 'epoxy',
    scope: '22,000 sq.ft · Epoxy + aisle marking',
    service: 'Epoxy flooring',
    description:
      'Forklift-rated finish with colour-coded aisles and pedestrian walkways.',
    imageHint: 'Warehouse epoxy floor with aisle marking',
  },
  {
    id: 'ep-welding-ambattur',
    title: 'Welding consumables unit',
    location: 'Ambattur',
    sector: 'Industrial',
    category: 'epoxy',
    scope: 'Chemical-resistant epoxy coating',
    service: 'Epoxy flooring',
    description:
      'A wash-down-ready surface that holds up to daily chemical exposure.',
    imageHint: 'Epoxy coating in a clean production area',
  },
  {
    id: 'pu-food-chennai',
    title: 'Food processing hall',
    location: 'Chennai',
    sector: 'Industrial',
    category: 'resin',
    scope: 'Food-grade PU · Coved skirting',
    service: 'PU flooring',
    description:
      'A hygienic, thermal-shock-resistant floor that passed audit first time.',
    imageHint: 'PU floor in a food processing hall',
  },
  {
    id: 'esd-electronics-sriperumbudur',
    title: 'Electronics assembly',
    location: 'Sriperumbudur',
    sector: 'Industrial',
    category: 'resin',
    scope: 'Conductive ESD system · Earthing grid',
    service: 'ESD flooring',
    description:
      'Surface resistance tested to specification before the line restarted.',
    imageHint: 'ESD floor on an electronics assembly line',
  },
  {
    id: 'st-coastal-thoothukudi',
    title: 'Coastal factory shed',
    location: 'Thoothukudi',
    sector: 'Industrial',
    category: 'structural',
    scope: 'Corrosion treatment · Column jacketing',
    service: 'Structural repair',
    description:
      'Exposed reinforcement treated and re-profiled without halting production.',
    imageHint: 'Corrosion treatment on an RCC column',
  },
  {
    id: 'st-commercial-vandalur',
    title: 'Commercial block',
    location: 'Vandalur',
    sector: 'Commercial',
    category: 'structural',
    scope: 'Crack injection · Rehabilitation',
    service: 'Structural repair',
    description:
      'Structural cracks sealed and the slab strengthened ahead of a refit.',
    imageHint: 'Crack injection and grouting work',
  },
  {
    id: 'cp-park-tambaram',
    title: 'Commercial park',
    location: 'Tambaram',
    sector: 'Commercial',
    category: 'deck',
    scope: '2 basement levels · Deck coating',
    service: 'Car park deck',
    description:
      'Abrasion-resistant coating with directional markings and bay numbering.',
    imageHint: 'Car park deck with bright directional markings',
  },
  {
    id: 'sp-court-guduvancheri',
    title: 'Indoor sports court',
    location: 'Guduvancheri',
    sector: 'Commercial',
    category: 'deck',
    scope: 'Impact-resistant coating · Line marking',
    service: 'Sports flooring',
    description:
      'Multi-sport marking set out to regulation dimensions in a single pass.',
    imageHint: 'Indoor sports court coating with line marking',
  },
];
