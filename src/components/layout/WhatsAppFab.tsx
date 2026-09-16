import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { generalEnquiry } from '@/lib/whatsapp';
import styles from './WhatsAppFab.module.css';

/** Persistent secondary contact route, present on every page. */
export function WhatsAppFab() {
  return (
    <a
      href={generalEnquiry}
      className={styles.fab}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Chelliah Enterprises on WhatsApp"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
