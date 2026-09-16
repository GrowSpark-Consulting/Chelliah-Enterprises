import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { Service } from '@/data/services';
import { cx } from '@/lib/cx';
import { serviceHref } from './ServiceCard';
import styles from './ServiceList.module.css';

type ServiceListProps = {
  services: Service[];
  className?: string;
};

/**
 * A formal numbered list presentation for services — number, title,
 * description and a subtle arrow, separated by thin rules rather than cards.
 */
export function ServiceList({ services, className }: ServiceListProps) {
  return (
    <ol className={cx(styles.list, className)}>
      {services.map((service, index) => (
        <Reveal as="li" key={service.slug} delay={(index % 4) * 60}>
          <Link href={serviceHref(service)} className={styles.row}>
            <span className={styles.number}>{service.number}</span>
            <span className={styles.copy}>
              <h3 className={styles.title}>{service.shortName}</h3>
              <p className={styles.body}>{service.summary}</p>
            </span>
            <ArrowUpRight className={styles.arrow} size={18} strokeWidth={1.75} aria-hidden />
          </Link>
        </Reveal>
      ))}
    </ol>
  );
}
