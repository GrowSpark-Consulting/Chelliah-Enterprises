/**
 * The eleven service lines from the company profile.
 *
 * Copy is edited for consistency from the supplied material — no service,
 * capability or technical claim has been added beyond it.
 */

export type Service = {
  slug: string;
  /** Two-digit index used as the section marker. */
  number: string;
  /** Small uppercase category label. */
  category: string;
  title: string;
  /** Compact name for navigation and footers, where the full title is too long. */
  shortName: string;
  /** One line, used on cards and in listings. */
  summary: string;
  /** Full paragraph, used on the services page and detail pages. */
  description: string;
  /** Characteristics stated in the company material. */
  features?: string[];
  /** Where the system is applied. */
  applications?: string[];
  /** Describes the photograph this slot expects, shown until one is supplied. */
  imageHint: string;
  /** Shown in the six-card overview on the home page. */
  featured: boolean;
  /** Has a dedicated page under /services/[slug]. */
  hasPage: boolean;
  /** Pre-filled into the WhatsApp enquiry for this service. */
  enquiryTopic: string;
  metaTitle?: string;
  metaDescription?: string;
};

export const services: Service[] = [
  {
    slug: 'waterproofing',
    number: '01',
    category: 'Waterproofing',
    title: 'Waterproofing works & Brickbats Coba systems',
    shortName: 'Waterproofing',
    summary:
      'Terrace, roof, bathroom and basement waterproofing, including traditional Brickbats Coba systems.',
    description:
      'Waterproofing reduces moisture reaching interior surfaces, preventing water damage and the structural breakdown that follows it. Applied across walls, ceilings, basements, floors, rooftops, bathrooms and water-body areas, and carried out after construction to eliminate ingress before it starts causing damage.',
    applications: [
      'Terraces & rooftops',
      'Basements & below-grade slabs',
      'Bathrooms & sunken slabs',
      'Walls & ceilings',
      'Floors',
      'Water bodies & tanks',
    ],
    imageHint: 'Terrace waterproofing in progress',
    featured: true,
    hasPage: true,
    enquiryTopic: 'waterproofing & Brickbats Coba works',
    metaTitle: 'Waterproofing Contractors in Chennai | Terrace, Basement & Bathroom',
    metaDescription:
      'Terrace, basement, bathroom and wall waterproofing including Brickbats Coba systems, for industrial, commercial and residential properties across Chennai.',
  },
  {
    slug: 'weathering-course',
    number: '02',
    category: 'Terrace protection',
    title: 'Weathering course & cooling tiles laying',
    shortName: 'Weathering course',
    summary:
      'Weathering course and cooling tile systems for terrace protection and thermal management.',
    description:
      'Precision-laid weathering course and cooling tile systems that protect the terrace slab and reduce heat transfer into the floors below.',
    imageHint: 'Cooling tiles laid on a terrace',
    featured: false,
    hasPage: false,
    enquiryTopic: 'weathering course & cooling tiles',
  },
  {
    slug: 'membrane-waterproofing',
    number: '03',
    category: 'Membrane systems',
    title: 'HDPE membrane & APP membrane works',
    shortName: 'Membrane systems',
    summary:
      'Membrane-based waterproofing for below-grade slabs, podiums and roofs in demanding conditions.',
    description:
      'Membrane-based waterproofing for long-term protection against water ingress where conditions are demanding — below-grade slabs, podiums and roofs that sit under sustained water pressure.',
    applications: ['Below-grade slabs', 'Podiums & decks', 'Roofs'],
    imageHint: 'APP membrane being torched onto a slab',
    featured: false,
    hasPage: false,
    enquiryTopic: 'HDPE / APP membrane waterproofing',
  },
  {
    slug: 'structural-repair',
    number: '04',
    category: 'Rehabilitation',
    title: 'Structural repairs & strengthening works',
    shortName: 'Structural repair',
    summary:
      'Crack repair, corrosion treatment and rehabilitation that restores strength to ageing structures.',
    description:
      'Crack repair, corrosion treatment and rehabilitation that restores structural strength and extends the service life of an ageing or damaged building.',
    applications: ['Crack repair', 'Corrosion treatment', 'Strengthening & rehabilitation'],
    imageHint: 'Corrosion treatment on an RCC column',
    featured: true,
    hasPage: false,
    enquiryTopic: 'structural repair & strengthening',
  },
  {
    slug: 'epoxy-flooring',
    number: '05',
    category: 'Resin flooring',
    title: 'Epoxy flooring & coatings',
    shortName: 'Epoxy flooring',
    summary:
      'Seamless, chemical- and impact-resistant flooring with a high-gloss finish for industrial and commercial spaces.',
    description:
      'A highly durable flooring system with exceptional heat tolerance, scratch and impact endurance and a striking high-gloss finish. It is seamless, easy to clean and bonds effectively across different substrates, which makes it well suited to industrial and commercial floors that stay in service under daily traffic.',
    features: [
      'Exceptional heat tolerance',
      'Scratch & impact endurance',
      'High-gloss finish',
      'Non-slip, easy maintenance',
      'Weather-resilient',
      'Seamless and easy to clean',
    ],
    applications: [
      'Factory & production floors',
      'Warehouses & distribution centres',
      'Workshops & service bays',
      'Commercial interiors',
    ],
    imageHint: 'High-gloss epoxy floor with safety line marking',
    featured: true,
    hasPage: true,
    enquiryTopic: 'epoxy flooring & coatings',
    metaTitle: 'Epoxy Flooring Contractors in Chennai | Industrial & Commercial',
    metaDescription:
      'Seamless epoxy flooring and coatings with high-gloss finish, chemical and impact resistance, for factories, warehouses and commercial floors in Chennai.',
  },
  {
    slug: 'pu-flooring',
    number: '06',
    category: 'Resin flooring',
    title: 'Polyurethane (PU) flooring & coatings',
    shortName: 'PU flooring',
    summary:
      'Heavy-load, food-grade and high-temperature-resistant flooring for demanding environments.',
    description:
      'One of the most durable flooring materials available. The floor is built up in layers and finished with a polyurethane coating that shields it from wear, staining and moisture over the long term, holding up where loads are heavy and wash-down is routine.',
    features: [
      'Resilient under heavy loads',
      'Sturdy, robust and impervious',
      'Food-grade hygiene',
      'High-temperature resistant',
      'Highly abrasion-resistant',
      'Slip-resistant and easy to clean',
    ],
    applications: [
      'Food & beverage processing',
      'Cold stores & wash-down areas',
      'Heavy manufacturing',
      'Pharmaceutical facilities',
    ],
    imageHint: 'PU floor in a food-processing hall with coved skirting',
    featured: true,
    hasPage: true,
    enquiryTopic: 'PU flooring & coatings',
    metaTitle: 'PU Flooring Contractors in Chennai | Food-Grade Polyurethane Floors',
    metaDescription:
      'Polyurethane (PU) flooring and coatings — heavy-load, food-grade and high-temperature resistant floors for processing plants and manufacturing in Chennai.',
  },
  {
    slug: 'esd-flooring',
    number: '07',
    category: 'Conductive systems',
    title: 'EPU flooring & ESD flooring',
    shortName: 'ESD flooring',
    summary:
      'Electrostatic-discharge flooring that protects sensitive electrical components.',
    description:
      'ESD (electrostatic discharge) flooring is built from conductive material that directs static charge safely away from sensitive electrical components. It is used where a static event would damage product or equipment — electronics assembly, pharmaceutical production and precision manufacturing.',
    applications: [
      'Electronics assembly & test',
      'Pharmaceutical production',
      'Precision manufacturing',
      'Server & control rooms',
    ],
    imageHint: 'ESD flooring on an electronics assembly floor',
    featured: true,
    hasPage: true,
    enquiryTopic: 'EPU / ESD flooring',
    metaTitle: 'ESD Flooring Contractors in Chennai | Anti-Static & Conductive Floors',
    metaDescription:
      'Conductive ESD and EPU flooring that safely dissipates static charge, for electronics, pharmaceutical and precision manufacturing facilities in Chennai.',
  },
  {
    slug: 'car-park-deck-coating',
    number: '08',
    category: 'Deck coatings',
    title: 'Car park deck coatings & cementitious self-levelling',
    shortName: 'Car park decks',
    summary:
      'Abrasion-resistant deck coatings engineered for vehicular loads and constant traffic.',
    description:
      'Engineered with a strong, abrasion-resistant surface coating that withstands vehicular loads, constant traffic and the environmental conditions typical of parking structures, laid over a cementitious self-levelling base where the deck needs regularising.',
    imageHint: 'Car park deck with directional markings',
    featured: true,
    hasPage: false,
    enquiryTopic: 'car park deck coating',
  },
  {
    slug: 'sports-flooring',
    number: '09',
    category: 'Sports & marking',
    title: 'Sports floor coatings & epoxy line marking',
    shortName: 'Sports flooring',
    summary:
      'Impact-resistant sports flooring and precision epoxy line marking for courts and facilities.',
    description:
      'Impact-resistant sports floor coatings and precision epoxy line marking for courts, gyms and performance facilities, set out to the dimensions the sport requires.',
    imageHint: 'Sports court coating with line marking',
    featured: false,
    hasPage: false,
    enquiryTopic: 'sports floor coating / line marking',
  },
  {
    slug: 'wall-coatings',
    number: '10',
    category: 'Wall coatings',
    title: 'Industrial & residential wall coatings',
    shortName: 'Wall coatings',
    summary:
      'Protective and decorative wall coating systems for industrial facilities and homes.',
    description:
      'Protective and decorative wall coating systems specified for the exposure they face, suited to both industrial facilities and residential properties.',
    imageHint: 'Wall coating application on an industrial elevation',
    featured: false,
    hasPage: false,
    enquiryTopic: 'wall coating works',
  },
  {
    slug: 'vacuum-dewatering-flooring',
    number: '11',
    category: 'Concrete flooring',
    title: 'Vacuum dewatering flooring',
    shortName: 'Vacuum dewatering',
    summary:
      'A specialised technique that extracts excess water from fresh concrete for a denser floor.',
    description:
      'A specialised vacuum dewatering technique that extracts excess water from freshly laid concrete, producing a stronger, denser and more durable floor surface than conventional finishing.',
    imageHint: 'Vacuum dewatering being carried out on a fresh concrete floor',
    featured: false,
    hasPage: false,
    enquiryTopic: 'vacuum dewatering flooring',
  },
];

export const featuredServices = services.filter((s) => s.featured);

export const servicePages = services.filter((s) => s.hasPage);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
