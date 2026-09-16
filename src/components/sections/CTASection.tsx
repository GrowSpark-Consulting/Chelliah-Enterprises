import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { contact } from '@/data/site';
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

  return (
    <section className={`onNavy ${styles.cta}`} aria-labelledby="cta-heading">
      <Container>
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
