import type { Stat } from '@/data/site';
import { cx } from '@/lib/cx';
import styles from './StatStrip.module.css';

type StatStripProps = {
  items: readonly Stat[];
  tone?: 'ink' | 'page';
  className?: string;
};

/** A corporate statistics strip: hairline cells, strong figures, no icons. */
export function StatStrip({ items, tone = 'ink', className }: StatStripProps) {
  return (
    <div className={cx(styles.grid, styles[tone], className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.cell}>
          <p className={styles.value}>{item.value}</p>
          <p className={styles.label}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
