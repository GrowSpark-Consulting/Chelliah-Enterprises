import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/sections/Hero';
import { BrandStrip } from '@/components/sections/BrandStrip';
import { ClientMarquee } from '@/components/sections/ClientMarquee';
import { CTASection } from '@/components/sections/CTASection';
import { Process } from '@/components/sections/Process';
import { StatStrip } from '@/components/sections/StatStrip';
import { BeforeAfterGallery } from '@/components/ui/BeforeAfterGallery';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { featuredComparison, resolveComparison } from '@/data/images';
import { featuredServices } from '@/data/services';
import { projects } from '@/data/projects';
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

/** The before/after the work section leads with. */
const featured = resolveComparison(featuredComparison);

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

      {/* Clients — straight after the figures, so the proof reads together.
          No bottom padding: the services section below brings its own. */}
      <section className="section section--flush-bottom" aria-labelledby="clients-heading">
        <Container>
          <SectionHeading
            id="clients-heading"
            label="Esteemed clients"
            title="Trusted by industrial & commercial operators"
            body="A selection of the organisations whose sites we have worked on."
          />
          <ClientMarquee className={styles.clients} />
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

      {/* Featured work — the same comparison the waterproofing section carries.
          The grid areas put the gallery between the heading and the body copy
          when it stacks, and beside both when there is room. */}
      {featured && (
        <section className="section section--flush-top" aria-labelledby="compare-heading">
          <Container>
            <div className={styles.compare}>
              <div className={styles.compareHead}>
                <SectionLabel>Our work</SectionLabel>
                <h2 id="compare-heading" className={styles.compareTitle}>
                  From stained concrete to a sealed floor
                </h2>
              </div>

              <Reveal className={styles.compareMedia}>
                <BeforeAfterGallery
                  before={featured.before}
                  after={featured.after}
                  subject="waterproofing"
                  ratio="1/1"
                  sizes="(max-width: 899px) 100vw, 600px"
                />
              </Reveal>

              <div className={styles.compareBody}>
                <p className="lede">
                  One walkway, before and after. Bare concrete, stained and holding water, finished
                  with a brickbats coba system, a cement screed and a waterproof coating. Tap the
                  arrow to see it finished.
                </p>
                <div className={styles.compareAction}>
                  <Button href="/services" variant="secondary">
                    View all services
                    <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

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

      {/* Recent work */}
      <section
        className="section section--flush-top section--flush-bottom"
        aria-labelledby="work-heading"
      >
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
        </Container>
      </section>

      <Process />

      {/* Authorised applicator — a light band so the marks stand bare, closing
          the page's proof before the call to action. */}
      <section className={styles.brands} aria-labelledby="brands-heading">
        <Container>
          <h2 id="brands-heading" className="srOnly">
            Authorised applicator
          </h2>
          <BrandStrip />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
