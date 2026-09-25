import type { Metadata } from 'next';
import type { HeroMark } from '@/components/sections/PageHero';
import Link from 'next/link';
import { Clock, FlaskConical, HardHat, LayoutGrid } from 'lucide-react';
import { BrandStrip } from '@/components/sections/BrandStrip';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceSection } from '@/components/services/ServiceSection';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { services } from '@/data/services';
import { ogImage } from '@/data/site';
import { generalEnquiry } from '@/lib/whatsapp';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Waterproofing, Brickbats Coba, membrane systems, epoxy, PU and ESD flooring, structural repair, car park deck coatings and vacuum dewatering flooring across South India.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Chelliah Enterprises',
    description:
      'Eleven service lines covering waterproofing, resin flooring and structural repair for industrial, commercial and residential properties.',
    url: '/services',
    images: [ogImage],
  },
};

/**
 * Qualitative marks only, each one restating a characteristic already stated
 * on a service below — chemical and impact resistance, extended service life,
 * applied to manufacturer specification, and the industrial / commercial /
 * residential range. Nothing counted, nothing new claimed.
 */
const heroMarks: HeroMark[] = [
  { icon: FlaskConical, lines: ['Chemical', 'resistant'] },
  { icon: Clock, lines: ['Long', 'lasting'] },
  { icon: HardHat, lines: ['Professional', 'execution'] },
  { icon: LayoutGrid, lines: ['All types', 'of spaces'] },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label={`${services.length} service lines · Industrial · Commercial · Residential`}
        title={
          <>
            Our <em>services</em>
          </>
        }
        lede="A complete platform for concrete flooring, waterproofing and structural repair problems — specified for the conditions each site actually faces."
        breadcrumbs={[{ href: '/', label: 'Home' }, { label: 'Services' }]}
        image="servicesHero"
        marks={heroMarks}
      />

      <section className={styles.index} aria-labelledby="service-index-heading">
        <Container>
          <SectionLabel>On this page</SectionLabel>
          <h2 id="service-index-heading" className="srOnly">
            Service index
          </h2>
          <nav className={styles.indexGrid} aria-label="Service index">
            {services.map((service) => (
              <Link key={service.slug} href={`#${service.slug}`} className={styles.indexItem}>
                <span className={styles.indexNumber}>{service.number}</span>
                {service.shortName}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      <div className={styles.sections}>
        <Container>
          {services.map((service, index) => (
            <ServiceSection key={service.slug} service={service} reversed={index % 2 === 1} />
          ))}
        </Container>
      </div>

      <section className={styles.brands} aria-labelledby="brands-heading">
        <Container>
          <h2 id="brands-heading" className="srOnly">
            Authorised applicator
          </h2>
          <BrandStrip />
        </Container>
      </section>

      <CTASection
        label="Not sure which system you need?"
        title="Send us a photo of the site"
        body="We will tell you what system it needs and what it will cost — after a free inspection and a written quotation."
        enquiryHref={generalEnquiry}
        enquiryLabel="Ask us on WhatsApp"
      />
    </>
  );
}
