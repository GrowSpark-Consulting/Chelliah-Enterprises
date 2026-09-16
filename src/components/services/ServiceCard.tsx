import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/data/services';
import styles from './ServiceCard.module.css';

type ServiceCardProps = {
  service: Service;
};

export function serviceHref(service: Service) {
  return service.hasPage ? `/services/${service.slug}` : `/services#${service.slug}`;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={serviceHref(service)} className={styles.card}>
      <div className={styles.top}>
        <span className={styles.number}>{service.number}</span>
        <span className={styles.category}>{service.category}</span>
      </div>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.body}>{service.summary}</p>
      <span className={styles.footer}>
        Explore service
        <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
      </span>
    </Link>
  );
}
