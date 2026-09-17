import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { slotImage } from '@/data/images';
import { contact } from '@/data/site';
import { cx } from '@/lib/cx';
import { generalEnquiry } from '@/lib/whatsapp';

import styles from './CTASection.module.css';

type CTASectionProps = {
  label?: string;
  title?: string;
  body?: string;
  /** Overrides the WhatsApp link so a page can pre-fill a relevant message. */
  enquiryHref?: string;
  enquiryLabel?: string;
};

/** The closing call to action carried by every major page. */
export function CTASection({
  label = 'Next step',
  title = "Let's talk about your project",
  body = 'Schedule a site inspection or request a quotation for your waterproofing or flooring requirement.',
  enquiryHref = generalEnquiry,
  enquiryLabel = 'Book a site inspection',
}: CTASectionProps) {
  const phone = contact.phones[0];
  // The one major band that carries a photograph. Falls back to flat navy
  // until a suitable project photograph is assigned to the slot.
  const photo = slotImage('cta');

  return (
    <section
      className={cx('onNavy', styles.cta, photo && styles.hasPhoto)}
      aria-labelledby="cta-heading"
    >
      {photo && (
        <div className={styles.media}>
          <Image
            src={photo.src}
            alt=""
            aria-hidden
            fill
            loading="lazy"
            sizes="100vw"
            quality={78}
            className={styles.image}
            style={{ '--focus': photo.focus ?? 'center center' } as CSSProperties}
          />
          <div className={styles.scrim} aria-hidden />
        </div>
      )}
      <Container className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <SectionLabel>{label}</SectionLabel>
            <h2 id="cta-heading" className={styles.title}>
              {title}
            </h2>
            <p className="lede">{body}</p>
          </div>
          <div className={styles.actions}>
            <Button href={enquiryHref} variant="accent" size="lg">
              <WhatsAppIcon size={17} />
              {enquiryLabel}
            </Button>
            <Button href={`tel:${phone.tel}`} variant="outline" size="lg">
              <Phone size={17} strokeWidth={1.75} aria-hidden />
              {phone.display}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
