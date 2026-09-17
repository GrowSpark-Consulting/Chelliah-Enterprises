import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/sections/Hero';
import { BrandStrip } from '@/components/sections/BrandStrip';
import { ClientWall } from '@/components/sections/ClientWall';
import { CTASection } from '@/components/sections/CTASection';
import { Process } from '@/components/sections/Process';
import { StatStrip } from '@/components/sections/StatStrip';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { featuredServices } from '@/data/services';
import { PROJECTS_ARE_PLACEHOLDERS, projects } from '@/data/projects';
import { site, stats } from '@/data/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `${site.name} | Waterproofing & Epoxy Flooring Contractors, Chennai`,
  description: site.shortDescription,
  alternates: { canonical: '/' },
};

const whyUs = [
  {
    number: '01',
    title: 'Branded systems only',
    body: 'An authorised applicator for six manufacturer systems — no unverified generic materials on site.',
  },
  {
    number: '02',
    title: 'Plant-grade execution',
    body: 'Shutdown windows, surface preparation records and phased handover, the way industrial sites require.',
  },
  {
    number: '03',
    title: 'One contractor, full scope',
    body: 'Waterproofing, resin flooring, structural repair and line marking under a single accountable team.',
  },
  {
    number: '04',
    title: 'Direct line, fast response',
    body: 'A free site inspection and a written quotation — reach the team directly, not a call centre.',
  },
];

const recentWork = projects.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Credibility strip */}
      <section className={`onInk ${styles.trust}`} aria-labelledby="credibility-heading">
        <Container>
          <h2 id="credibility-heading" className="srOnly">
            Our record
          </h2>
          <StatStrip items={stats} tone="ink" />
        </Container>
      </section>

      {/* Authorised applicator — a light band so the marks stand bare. */}
      <section className={styles.brands} aria-labelledby="brands-heading">
        <Container>
          <h2 id="brands-heading" className="srOnly">
            Authorised applicator
          </h2>
          <BrandStrip />
        </Container>
      </section>

      {/* Services */}
      <section className="section" aria-labelledby="services-heading">
        <Container>
          <SectionHeading
            id="services-heading"
            label="What we do"
            title="Engineered surface & structure solutions"
            body="End-to-end waterproofing, resin flooring and structural repair for industrial, commercial and residential properties."
            action={
              <Button href="/services" variant="secondary">
                View all services
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
              </Button>
            }
          />
          <ServiceGrid services={featuredServices} />
        </Container>
      </section>

      {/* Why us */}
      <section className="section section--flush-top" aria-labelledby="why-heading">
        <Container>
          <SectionHeading
            id="why-heading"
            label="Why choose us"
            title="Built around how industrial sites actually run"
          />
          <ol className={styles.whyGrid}>
            {whyUs.map((item, index) => (
              <Reveal as="li" key={item.number} className={styles.whyItem} delay={index * 60}>
                <p className={styles.whyNumber}>{item.number}</p>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyBody}>{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Clients */}
      <section className="section section--flush-top" aria-labelledby="clients-heading">
        <Container>
          <SectionHeading
            id="clients-heading"
            label="Esteemed clients"
            title="Trusted by industrial & commercial operators"
            body="A selection of the organisations whose sites we have worked on."
          />
          <ClientWall className={styles.clientNote} />
        </Container>
      </section>

      {/* Recent work */}
      <section className="section section--flush-top" aria-labelledby="work-heading">
        <Container>
          <SectionHeading
            id="work-heading"
            label="Recent work"
            title="A look at the sites we have protected"
            action={
              <Button href="/projects" variant="secondary">
                See all projects
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
              </Button>
            }
          />
          <ul className={styles.workGrid}>
            {recentWork.map((project, index) => (
              <Reveal as="li" key={project.id} delay={index * 70}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
          {PROJECTS_ARE_PLACEHOLDERS && (
            <p className={styles.placeholderNote}>
              Indicative project records. Verified site records and photography are being added.
            </p>
          )}
        </Container>
      </section>

      <Process />

      <CTASection />
    </>
  );
}
