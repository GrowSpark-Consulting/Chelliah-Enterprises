import type { Metadata } from 'next';
import { BrandStrip } from '@/components/sections/BrandStrip';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { Container } from '@/components/ui/Container';
import { contact, ogImage, site } from '@/data/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${site.name} in ${contact.address.locality}, Chengalpattu for a free site inspection or a quotation for waterproofing, epoxy, PU or ESD flooring and structural repair work.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Chelliah Enterprises',
    description: 'Book a free site inspection or request a written quotation.',
    url: '/contact',
    images: [ogImage],
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Free site inspection · Written quotation"
        title="Let's talk about your project"
        lede="Reach out for a site inspection, a quotation or a technical consultation on the right system for your building."
        breadcrumbs={[{ href: '/', label: 'Home' }, { label: 'Contact' }]}
        image="contactHero"
        quiet
      />

      <section className={styles.body} aria-labelledby="contact-heading">
        <Container>
          <h2 id="contact-heading" className="srOnly">
            Contact details and enquiry form
          </h2>
          <div className={styles.grid}>
            <ContactInfo />
            <div className={styles.form}>
              <ContactForm source="Contact page" />
            </div>
          </div>
        </Container>
      </section>

      <section className={`onInk ${styles.hours}`} aria-labelledby="coverage-heading">
        <Container>
          <h2 id="coverage-heading" className={styles.hoursHeading}>
            Serving {contact.serviceArea}
          </h2>
          <p className={`lede ${styles.hoursBody}`}>
            An authorised applicator for industry-leading branded systems.
          </p>
        </Container>
      </section>

      {/* Authorised applicator — a light band so the marks stand bare. */}
      <section className={styles.brands} aria-labelledby="systems-heading">
        <Container>
          <h2 id="systems-heading" className="srOnly">
            Systems we apply
          </h2>
          <BrandStrip heading="Systems we apply" />
        </Container>
      </section>
    </>
  );
}
