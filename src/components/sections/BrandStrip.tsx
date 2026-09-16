import { authorisedBrands } from '@/data/site';
import { cx } from '@/lib/cx';
import styles from './BrandStrip.module.css';

type BrandStripProps = {
  heading?: string;
  tone?: 'ink' | 'page';
  className?: string;
};

/** The manufacturer systems the company is an authorised applicator for. */
export function BrandStrip({
  heading = 'Authorised applicator',
  tone = 'ink',
  className,
}: BrandStripProps) {
  return (
    <div className={cx(styles.wrap, styles[tone], className)}>
      <h3 className={styles.heading}>{heading}</h3>
      <ul className={styles.list}>
        {authorisedBrands.map((brand) => (
          <li key={brand} className={styles.item}>
            {brand}
          </li>
        ))}
      </ul>
    </div>
  );
}
