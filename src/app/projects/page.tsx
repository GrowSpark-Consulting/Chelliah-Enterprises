import type { Metadata } from 'next';
import { ClientWall } from '@/components/sections/ClientWall';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { StatStrip } from '@/components/sections/StatStrip';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROJECTS_ARE_PLACEHOLDERS } from '@/data/projects';
import { stats } from '@/data/site';
import { projectsEnquiry } from '@/lib/whatsapp';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Waterproofing, epoxy, PU and ESD flooring, structural repair and deck coating projects delivered for industrial, commercial and residential clients across Chennai and Chengalpattu.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | Chelliah Enterprises',
    description:
      'A record of waterproofing, resin flooring and structural repair work across Chennai and Chengalpattu.',
    url: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        label="Project record · Chennai & Chengalpattu"
        title="Our work speaks for itself"
        lede="Trusted by industrial operators including L&T Energy Hydrocarbon, Murugappa Group, ESAB and CUMI — alongside 150+ commercial and residential projects."
        breadcrumbs={[{ href: '/', label: 'Home' }, { label: 'Projects' }]}
      />

      <section className={styles.stats} aria-labelledby="project-stats-heading">
        <Container>
          <h2 id="project-stats-heading" className="srOnly">
            Project statistics
          </h2>
          <StatStrip items={stats} tone="page" />
        </Container>
      </section>

      <section className={styles.grid} aria-labelledby="project-grid-heading">
        <Container>
          <SectionHeading
            id="project-grid-heading"
            label="Selected work"
            title="Projects by service line"
            body="Filter by the system delivered. Each record notes the location, the scale and the result."
          />
          <div className={styles.gridBody}>
            <ProjectGrid />
          </div>
          {PROJECTS_ARE_PLACEHOLDERS && (
            <p className={styles.disclosure}>
              <strong>Note:</strong> the project records above are indicative examples of the
              scope, scale and results typical of our work. Verified site records and photography
              are being added. The client names listed below are actual clients.
            </p>
          )}
        </Container>
      </section>

      <section className={styles.clients} aria-labelledby="clients-heading">
        <Container>
          <SectionHeading
            id="clients-heading"
            label="Esteemed clients"
            title="Organisations we have worked for"
          />
          <ClientWall className={styles.clientGrid} />
        </Container>
      </section>

      <CTASection
        label="Your project"
        title="Want results like these on your property?"
        body="Send us the site details. We will come and measure, then quote in writing."
        enquiryHref={projectsEnquiry}
      />
    </>
  );
}
