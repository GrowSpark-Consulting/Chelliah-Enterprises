import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import styles from './PageHero.module.css';

export type Crumb = { href?: string; label: string };

type PageHeroProps = {
  label: string;
  title: string;
  lede: string;
  breadcrumbs?: Crumb[];
};

/** The navy masthead every inner page opens with. */
export function PageHero({ label, title, lede, breadcrumbs }: PageHeroProps) {
  return (
    <section className={`onNavy ${styles.hero}`}>
      <Container>
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
      </Container>
    </section>
  );
}
