import Image from 'next/image';
import type { CSSProperties } from 'react';
import { ArrowRight, Building2, CalendarDays, Settings, ShieldCheck, Users } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { slotImage } from '@/data/images';
import { site } from '@/data/site';
import { generalEnquiry } from '@/lib/whatsapp';
import styles from './Hero.module.css';

/**
 * The four marks that close the hero, per the approved hero design. They are
 * qualitative only — the counted figures (projects completed, years, service
 * area) stay in the statistics strip directly below, where they are stated
 * once and sourced.
 */
const trustIndicators = [
  { icon: ShieldCheck, lines: ['Durable', 'surfaces'] },
  { icon: Building2, lines: ['Industrial', 'expertise'] },
  { icon: Users, lines: ['Trusted', 'partner'] },
  { icon: Settings, lines: ['Quality', 'execution'] },
];

export function Hero() {
  const photo = slotImage('homeHero');

  return (
    <section className={`onNavy ${styles.hero}`} aria-labelledby="hero-heading">
      {photo && (
        <div
          className={styles.media}
          style={
            {
              '--focus': photo.focus ?? 'center center',
              '--focus-mobile': photo.focusMobile ?? photo.focus ?? 'center center',
            } as CSSProperties
          }
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={82}
            className={styles.image}
          />
          {/* Two layers: a left-to-right navy wash that carries the text, and
              a soft floor-level gradient that seats the enquiry card. The
              right third of the photograph stays largely uncovered. */}
          <div className={styles.scrim} aria-hidden />
        </div>
      )}

      <Container className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <SectionLabel>
              {site.name} · Since {site.foundedYear} · GST registered
            </SectionLabel>

            <h1 id="hero-heading" className={styles.title}>
              Waterproofing &amp; flooring solutions <em>built to last</em>
            </h1>

            <p className={styles.lede}>
              Epoxy, PU and ESD flooring, terrace and basement waterproofing, and structural
              repair for factories, commercial buildings and homes — delivered by an authorised
              applicator for six manufacturer systems across Chennai and Chengalpattu.
            </p>

            <div className={styles.actions}>
              <Button href={generalEnquiry} variant="accent" size="lg">
                <CalendarDays size={17} strokeWidth={1.75} aria-hidden />
                Book a site inspection
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                View our projects
                <ArrowRight size={17} strokeWidth={1.75} aria-hidden />
              </Button>
            </div>

            <ul className={styles.trust}>
              {trustIndicators.map(({ icon: Icon, lines }) => (
                <li key={lines.join(' ')} className={styles.trustItem}>
                  <Icon size={26} strokeWidth={1.25} aria-hidden className={styles.trustIcon} />
                  <span className={styles.trustLabel}>
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.enquiry}>
            <ContactForm source="Home — hero" tone="card" />
          </div>
        </div>
      </Container>

      {/* The standing mark in the bottom corner of the approved hero design.
          Decorative: it repeats nothing and is hidden from assistive tech. */}
      <p className={styles.mark} aria-hidden>
        Floors
        <br />
        that
        <br />
        perform
      </p>
    </section>
  );
}
