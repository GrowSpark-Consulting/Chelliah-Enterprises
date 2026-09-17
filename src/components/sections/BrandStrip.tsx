import Image from 'next/image';
import { authorisedBrands, brandLogos } from '@/data/site';
import { cx } from '@/lib/cx';
import styles from './BrandStrip.module.css';

type BrandStripProps = {
  heading?: string;
  tone?: 'ink' | 'page';
  className?: string;
};

/**
 * The manufacturer systems the company is an authorised applicator for.
 *
 * Where an official logo has been supplied and registered in `brandLogos` it
 * carries the cell; until then the brand name is set as the mark itself. No
 * logo is ever invented, and no empty box stands in for one — a reserved,
 * visibly blank slot read as a broken image rather than as pending artwork.
 */
export function BrandStrip({
  heading = 'Authorised applicator',
  tone = 'ink',
  className,
}: BrandStripProps) {
  return (
    <div className={cx(styles.wrap, styles[tone], className)}>
      <h3 className={cx('label', styles.heading)}>{heading}</h3>
      <ul className={styles.list}>
        {authorisedBrands.map((brand) => {
          const logo = brandLogos[brand];

          return (
            <li key={brand} className={styles.item}>
              {logo ? (
                <Image
                  src={logo.src}
                  alt={`${brand} logo`}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logo}
                />
              ) : (
                <span className={styles.name}>{brand}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
