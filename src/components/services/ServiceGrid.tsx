import type { Service } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { cx } from '@/lib/cx';
import { ServiceCard } from './ServiceCard';
import styles from './ServiceGrid.module.css';

type ServiceGridProps = {
  services: Service[];
  className?: string;
};

export function ServiceGrid({ services, className }: ServiceGridProps) {
  return (
    <ul className={cx(styles.grid, className)}>
      {services.map((service, index) => (
        <Reveal as="li" key={service.slug} delay={(index % 3) * 70}>
          <ServiceCard service={service} />
        </Reveal>
      ))}
    </ul>
  );
}
