import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site } from '@/data/site';
import { generalEnquiry } from '@/lib/whatsapp';
import styles from './Hero.module.css';

const trustIndicators = [
  { value: '150+', label: 'Projects completed' },
  { value: 'Industrial', label: 'Plant-grade execution' },
  { value: 'Chennai', label: 'Chennai & Chengalpattu' },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <SectionLabel>
              {site.name} · Since {site.foundedYear} · GST registered
            </SectionLabel>

            <h1 id="hero-heading" className={styles.title}>
              Waterproofing &amp; flooring solutions <em>built to last</em>
            </h1>

            <p className={`lede ${styles.lede}`}>
              Epoxy, PU and ESD flooring, terrace and basement waterproofing, and structural
              repair for factories, commercial buildings and homes — delivered by an authorised
              applicator for six manufacturer systems across Chennai and Chengalpattu.
            </p>

            <div className={styles.actions}>
              <Button href={generalEnquiry} variant="accent" size="lg">
                <WhatsAppIcon size={17} />
                Book a site inspection
              </Button>
              <Button href="/projects" variant="secondary" size="lg">
                View our projects
                <ArrowRight size={17} strokeWidth={1.75} aria-hidden />
              </Button>
            </div>

            <ul className={styles.trust}>
              {trustIndicators.map((item) => (
                <li key={item.label} className={styles.trustItem}>
                  <span className={styles.trustValue}>{item.value}</span>
                  <span className={styles.trustLabel}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className={styles.figure}>
            <ImageFrame
              hint="Finished epoxy floor in a factory bay, with safety line marking"
              ratio="4/3"
              priority
              sizes="(max-width: 1023px) 100vw, 620px"
            />
            <figcaption className={styles.figureMeta}>
              <span>Industrial · Commercial · Residential</span>
              <span>Est. {site.foundedYear}</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
