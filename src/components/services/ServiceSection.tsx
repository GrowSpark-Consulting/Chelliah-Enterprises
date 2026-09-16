import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import type { Service } from '@/data/services';
import { cx } from '@/lib/cx';
import { serviceEnquiry } from '@/lib/whatsapp';
import styles from './ServiceSection.module.css';

type ServiceSectionProps = {
  service: Service;
  /** Flips the layout so the content leads and the figure follows. */
  reversed?: boolean;
  /**
   * Set false on a dedicated service page, where the page masthead already
   * carries the number, category and title as the h1.
   */
  showHeading?: boolean;
};

function SpecList({ label, items }: { label: string; items: string[] }) {
  return (
    <>
      <p className={styles.specsLabel}>{label}</p>
      <ul className={styles.specs}>
        {items.map((item) => (
          <li key={item} className={styles.spec}>
            <Check size={14} strokeWidth={2.25} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

/** One service, set as an alternating image / content band. */
export function ServiceSection({
  service,
  reversed = false,
  showHeading = true,
}: ServiceSectionProps) {
  return (
    <section
      id={service.slug}
      className={cx(styles.section, reversed && styles.reversed)}
      aria-labelledby={showHeading ? `${service.slug}-heading` : undefined}
      aria-label={showHeading ? undefined : service.title}
    >
      <figure className={styles.figure}>
        <ImageFrame
          hint={service.imageHint}
          ratio="4/3"
          sizes="(max-width: 899px) 100vw, 600px"
        />
      </figure>

      <div className={styles.content}>
        {showHeading && (
          <>
            <p className={styles.marker}>
              <span>{service.number}</span>
              <span className={styles.divider} aria-hidden />
              <span>{service.category}</span>
            </p>

            <h2 id={`${service.slug}-heading`} className={styles.title}>
              {service.title}
            </h2>
          </>
        )}

        <p className={styles.description}>{service.description}</p>

        {service.features && <SpecList label="System characteristics" items={service.features} />}
        {service.applications && <SpecList label="Applications" items={service.applications} />}

        <div className={styles.action}>
          <Button href={serviceEnquiry(service.enquiryTopic)} variant="primary">
            <WhatsAppIcon size={16} />
            Enquire about this service
          </Button>
        </div>
      </div>
    </section>
  );
}
