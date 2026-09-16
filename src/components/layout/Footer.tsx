import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { contact, groupCompanies, nav, site } from '@/data/site';
import { services } from '@/data/services';
import styles from './Footer.module.css';

const footerServices = services.filter((service) => service.featured).slice(0, 6);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div>
            <Link href="/" className={styles.brand}>
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                className={styles.brandMark}
                aria-hidden
              />
              <span>
                <span className={styles.brandName}>{site.name}</span>
                <span className={styles.brandDescriptor}>{site.descriptor}</span>
              </span>
            </Link>
            <address className={styles.address}>
              {contact.address.lines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </address>
            <p className={styles.gstin}>GSTIN: {site.gstin}</p>
          </div>

          <div>
            <h2 className={styles.heading}>Services</h2>
            <ul className={styles.links}>
              {footerServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    prefetch={false}
                    href={
                      service.hasPage
                        ? `/services/${service.slug}`
                        : `/services#${service.slug}`
                    }
                  >
                    {service.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" prefetch={false}>All services</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Quick links</h2>
            <ul className={styles.links}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Contact</h2>
            <ul className={styles.contactList}>
              {contact.phones.map((phone) => (
                <li key={phone.tel} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={1.75} aria-hidden />
                  <a href={`tel:${phone.tel}`}>{phone.display}</a>
                </li>
              ))}
              <li className={styles.contactRow}>
                <Mail size={15} strokeWidth={1.75} aria-hidden />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li className={styles.contactRow}>
                <MapPin size={15} strokeWidth={1.75} aria-hidden />
                <Link href="/contact" prefetch={false}>{contact.address.locality}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.group}>
          <h2 className={styles.heading}>Group companies</h2>
          {groupCompanies.map((company) => (
            <p key={company.name} className={styles.groupItem}>
              <span className={styles.groupName}>{company.name}</span>
              <span className={styles.groupLocation}>{company.location}</span>
            </p>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>Serving {contact.serviceArea}</p>
        </div>
      </Container>
    </footer>
  );
}
