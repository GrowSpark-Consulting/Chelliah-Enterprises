import type { Metadata } from 'next';
import { BrandStrip } from '@/components/sections/BrandStrip';
import { ClientWall } from '@/components/sections/ClientWall';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { Process } from '@/components/sections/Process';
import { StatStrip } from '@/components/sections/StatStrip';
import { Container } from '@/components/ui/Container';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/data/services';
import { contact, groupCompanies, site, stats } from '@/data/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: `${site.name} has been carrying out waterproofing, resin flooring and structural repair work from Chennai since ${site.foundedYear}, as an authorised applicator for six manufacturer systems.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Chelliah Enterprises',
    description: `Waterproofing, resin flooring and structural repair contractors operating from Chennai since ${site.foundedYear}.`,
    url: '/about',
  },
};

const qualityPrinciples = [
  {
    number: '01',
    title: 'Diagnose before specifying',
    body: 'Every job starts with an inspection and a substrate assessment. The system follows from what the site is actually doing, not from a standard price list.',
  },
  {
    number: '02',
    title: 'Manufacturer systems, applied to spec',
    body: 'We are an authorised applicator for six manufacturer systems and apply them to their published specification — surface preparation included.',
  },
  {
    number: '03',
    title: 'Work around production',
    body: 'Industrial floors are laid in shutdown windows and handed over in phases so the plant can keep running.',
  },
  {
    number: '04',
    title: 'One accountable team',
    body: 'Waterproofing, flooring, structural repair and line marking sit with a single contractor, so nothing falls between trades.',
  },
  {
    number: '05',
    title: 'Quote in writing',
    body: 'Scope, system and cost are set out in writing before work starts, so there is a record to hold us to.',
  },
  {
    number: '06',
    title: 'Direct communication',
    body: 'Clients reach the team handling their site directly, during the job and after handover.',
  },
];

/** Sectors drawn from the applications stated for each service line. */
const sectors = [
  'Manufacturing & machining plants',
  'Electronics assembly & test',
  'Pharmaceutical production',
  'Food & beverage processing',
  'Warehousing & distribution',
  'Commercial buildings & car parks',
  'Sports & recreation facilities',
  'Residential properties',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label={`Since ${site.foundedYear} · GST registered`}
        title={`Protecting structures across Chennai since ${site.foundedYear}`}
        lede={`${site.name} carries out waterproofing, resin flooring and structural repair work across Chennai and Chengalpattu — for factories, commercial buildings and homes.`}
        breadcrumbs={[{ href: '/', label: 'Home' }, { label: 'About' }]}
      />

      <section className={styles.intro} aria-labelledby="intro-heading">
        <Container>
          <div className={styles.introGrid}>
            <div>
              <SectionHeading
                id="intro-heading"
                label="The company"
                title="Built on repeat industrial work"
              />
              <div className={styles.prose}>
                <p>
                  {site.name} has been operating from Nandivaram Guduvancheri, on the southern
                  edge of Chennai, since {site.foundedYear}. The work is split across three
                  disciplines that tend to arrive together on the same site: keeping water out of
                  a structure, putting a floor down that survives what runs over it, and repairing
                  the concrete underneath both.
                </p>
                <p>
                  That covers {services.length} service lines — waterproofing and Brickbats Coba,
                  weathering course, HDPE and APP membranes, structural repair, epoxy, PU and ESD
                  flooring, car park deck coatings, sports flooring and line marking, wall coatings
                  and vacuum dewatering flooring.
                </p>
                <p>
                  We are an authorised applicator for six manufacturer systems, which means
                  materials arrive with a specification behind them and are applied the way the
                  manufacturer intends. Industrial clients including L&amp;T Energy Hydrocarbon,
                  Murugappa Group, ESAB and CUMI have taken us back onto their sites, and 150+
                  projects have been completed to date.
                </p>
              </div>
            </div>

            <div className={styles.aside}>
              <ImageFrame
                hint="Site team preparing a substrate before application"
                ratio="4/3"
                sizes="(max-width: 1023px) 100vw, 560px"
              />
              <dl className={styles.asideMeta}>
                <div className={styles.asideRow}>
                  <dt className={styles.asideLabel}>Founded</dt>
                  <dd>{site.foundedYear}</dd>
                </div>
                <div className={styles.asideRow}>
                  <dt className={styles.asideLabel}>Base</dt>
                  <dd>{contact.address.locality}, Chengalpattu</dd>
                </div>
                <div className={styles.asideRow}>
                  <dt className={styles.asideLabel}>Service area</dt>
                  <dd>{contact.serviceArea}</dd>
                </div>
                <div className={styles.asideRow}>
                  <dt className={styles.asideLabel}>GSTIN</dt>
                  <dd>{site.gstin}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className={`onInk ${styles.stats}`} aria-labelledby="about-stats-heading">
        <Container>
          <h2 id="about-stats-heading" className="srOnly">
            Company record
          </h2>
          <StatStrip items={stats} tone="ink" />
          <div className={styles.statsFooter}>
            <BrandStrip tone="ink" />
          </div>
        </Container>
      </section>

      <section className={styles.quality} aria-labelledby="quality-heading">
        <Container>
          <SectionHeading
            id="quality-heading"
            label="How we approach quality"
            title="Six things we hold to on every site"
          />
          <ol className={styles.qualityGrid}>
            {qualityPrinciples.map((item, index) => (
              <Reveal
                as="li"
                key={item.number}
                className={styles.qualityItem}
                delay={(index % 3) * 60}
              >
                <p className={styles.qualityNumber}>{item.number}</p>
                <h3 className={styles.qualityTitle}>{item.title}</h3>
                <p className={styles.qualityBody}>{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className={styles.sectors} aria-labelledby="sectors-heading">
        <Container>
          <SectionHeading
            id="sectors-heading"
            label="Industries served"
            title="Where our systems are specified"
          />
          <ul className={styles.sectorList}>
            {sectors.map((sector) => (
              <li key={sector} className={styles.sectorItem}>
                {sector}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Process />

      <section className={styles.group} aria-labelledby="group-heading">
        <Container>
          <SectionHeading
            id="group-heading"
            label="Group companies"
            title="Part of the Chelliah group"
          />
          <div className={styles.groupGrid}>
            {groupCompanies.map((company) => (
              <div key={company.name} className={styles.groupCard}>
                <p className={styles.groupName}>{company.name}</p>
                <p className={styles.groupLocation}>{company.location}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section--flush-top" aria-labelledby="about-clients-heading">
        <Container>
          <SectionHeading
            id="about-clients-heading"
            label="Esteemed clients"
            title="Organisations we have worked for"
          />
          <ClientWall className={styles.clientGrid} />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
