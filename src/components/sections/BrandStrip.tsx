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
 * Each item carries a logo slot. Where an official logo has been supplied and
 * registered in `brandLogos`, it is shown; otherwise the slot stays empty and
 * the brand name carries the item. No logo is ever invented.
 */
export function BrandStrip({
  heading = 'Authorised applicator',
  tone = 'ink',
  className,
}: BrandStripProps) {
  return (
    <div className={cx(styles.wrap, styles[tone], className)}>
      <h3 className={styles.heading}>{heading}</h3>
      <ul className={styles.list}>
        {authorisedBrands.map((brand) => {
          const logo = brandLogos[brand];

          return (
            <li key={brand} className={styles.item}>
              <span
                className={cx(styles.logoSlot, !logo && styles.logoSlotEmpty)}
                title={logo ? undefined : `Logo slot — add ${brand} artwork in public/logos/`}
              >
                {logo ? (
                  <Image
                    src={logo.src}
                    alt={`${brand} logo`}
                    width={logo.width}
                    height={logo.height}
                    className={styles.logo}
                  />
                ) : null}
              </span>
              {brand}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
