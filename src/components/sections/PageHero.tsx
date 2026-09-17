import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ComponentType, ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { slotImage, type ImageSlot } from '@/data/images';
import { cx } from '@/lib/cx';
import styles from './PageHero.module.css';

export type Crumb = { href?: string; label: string };

/** A small icon-and-label mark, shown in a row under the masthead lede. */
export type HeroMark = {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  /** Two short lines, set uppercase. */
  lines: [string, string];
};

type PageHeroProps = {
  label: string;
  /** Wrap a word in <em> to pick it out in bronze, as the home hero does. */
  title: ReactNode;
  lede: string;
  breadcrumbs?: Crumb[];
  /**
   * Registry slot to draw a background photograph from. With no slot, or
   * with nothing assigned to it, the masthead stays the plain navy band —
   * which is the right result until a photograph that genuinely suits the
   * page exists.
   */
  image?: ImageSlot;
  /**
   * Holds the overlay heavier than usual, for a page where the masthead sits
   * directly above a form and must not compete with it.
   */
  quiet?: boolean;
  /** Qualitative marks closing the masthead. Only used where they earn a row. */
  marks?: HeroMark[];
};

/** The navy masthead every inner page opens with, optionally over a photograph. */
export function PageHero({
  label,
  title,
  lede,
  breadcrumbs,
  image,
  quiet,
  marks,
}: PageHeroProps) {
  const photo = image ? slotImage(image) : undefined;

  return (
    <section className={cx('onNavy', styles.hero, photo && styles.hasPhoto)}>
      {photo && (
        <div className={styles.media}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            quality={80}
            className={styles.image}
            style={{ '--focus': photo.focus ?? 'center center' } as CSSProperties}
          />
          <div className={cx(styles.scrim, quiet && styles.scrimQuiet)} aria-hidden />
        </div>
      )}
      <Container className={styles.content}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumb}>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} aria-current={crumb.href ? undefined : 'page'}>
                  {index > 0 && (
                    <span className={styles.separator} aria-hidden>
                      /
                    </span>
                  )}
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={styles.inner}>
          <SectionLabel>{label}</SectionLabel>
          <h1 className={styles.title}>{title}</h1>
          <p className={`lede ${styles.lede}`}>{lede}</p>
        </div>

        {marks && marks.length > 0 && (
          <ul className={styles.marks}>
            {marks.map(({ icon: Icon, lines }) => (
              <li key={lines.join(' ')} className={styles.mark}>
                <Icon size={26} strokeWidth={1.25} className={styles.markIcon} />
                <span className={styles.markLabel}>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
