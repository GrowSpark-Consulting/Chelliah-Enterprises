import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { contact, groupCompanies, site } from '@/data/site';
import { generalEnquiry } from '@/lib/whatsapp';
import styles from './ContactInfo.module.css';

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

export function ContactInfo() {
  return (
    <div>
      <SectionLabel>Company details</SectionLabel>
      <h2 className={styles.heading}>{site.name}</h2>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Address</dt>
          <dd className={styles.rowValue}>
            <address>{contact.address.lines.join(', ')}</address>
          </dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.rowLabel}>GSTIN</dt>
          <dd className={styles.rowValue}>{site.gstin}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.rowLabel}>Phone</dt>
          <dd className={`${styles.rowValue} ${styles.phones}`}>
            {contact.phones.map((phone) => (
              <span key={phone.tel} className={styles.phoneRow}>
                <a href={`tel:${phone.tel}`}>{phone.display}</a>
                <span className={styles.phoneLabel}>{phone.label}</span>
              </span>
            ))}
          </dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.rowLabel}>Email</dt>
          <dd className={styles.rowValue}>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.rowLabel}>Service area</dt>
          <dd className={styles.rowValue}>{contact.serviceArea}</dd>
        </div>
      </dl>

      <div className={styles.action}>
        <Button href={generalEnquiry} variant="accent" block>
          <WhatsAppIcon size={17} />
          Chat on WhatsApp
        </Button>
      </div>

      <figure className={styles.mapFigure}>
        <div className={styles.map}>
          <iframe
            src={mapSrc}
            title={`Map showing ${site.name} in ${contact.address.locality}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <figcaption className={styles.mapCaption}>
          Arul Nagar, {contact.address.locality} — close to Vandalur and Tambaram.
        </figcaption>
      </figure>

      <div className={styles.group}>
        <h3 className={styles.groupHeading}>Group companies</h3>
        <ul className={styles.groupList}>
          {groupCompanies.map((company) => (
            <li key={company.name} className={styles.groupItem}>
              <span className={styles.groupName}>{company.name}</span>
              <span className={styles.groupLocation}>{company.location}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
