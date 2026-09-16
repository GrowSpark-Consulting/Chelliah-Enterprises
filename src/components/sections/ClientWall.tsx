import { clients } from '@/data/site';
import { cx } from '@/lib/cx';
import styles from './ClientWall.module.css';

type ClientWallProps = {
  className?: string;
};

/**
 * The named client roster from the company profile, set as a hairline grid.
 * Names are rendered as type — swap a cell for an <Image> when an official
 * logo file is supplied and cleared for use.
 */
export function ClientWall({ className }: ClientWallProps) {
  return (
    <ul className={cx(styles.grid, className)}>
      {clients.map((client) => (
        <li key={client} className={styles.cell}>
          {client}
        </li>
      ))}
    </ul>
  );
}
