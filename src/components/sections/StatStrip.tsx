import { Reveal } from '@/components/ui/Reveal';
import type { Stat } from '@/data/site';
import { cx } from '@/lib/cx';
import styles from './StatStrip.module.css';

type StatStripProps = {
  items: readonly Stat[];
  tone?: 'ink' | 'page';
  className?: string;
};

/**
 * A corporate statistics strip: hairline cells, strong figures, no icons.
 *
 * The cells are `Reveal` wrappers rather than plain divs, so the figures fade
 * up in sequence the way every other list on the site does. No extra markup —
 * `Reveal` renders the element it is given.
 */
export function StatStrip({ items, tone = 'ink', className }: StatStripProps) {
  return (
    <div className={cx(styles.grid, styles[tone], className)}>
      {items.map((item, index) => (
        <Reveal key={item.label} className={styles.cell} delay={index * 70}>
          <p className={styles.value}>{item.value}</p>
          <p className={styles.label}>{item.label}</p>
        </Reveal>
      ))}
    </div>
  );
}
