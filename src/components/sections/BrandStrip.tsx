import Image from 'next/image';
import type { CSSProperties } from 'react';
import { authorisedBrands, brandLogos } from '@/data/site';
import { cx } from '@/lib/cx';
import styles from './BrandStrip.module.css';

type BrandStripProps = {
  heading?: string;
  /**
   * `page` — the default — stands the marks free on a light ground. `ink`
   * plates each one on white for a dark section, which the supplied files
   * need: they are opaque rasters, so on charcoal they would otherwise read
   * as six pale rectangles.
   */
  tone?: 'ink' | 'page';
  className?: string;
};

/**
 * The manufacturer systems the company is an authorised applicator for.
 *
 * Where an official logo has been supplied and registered in `brandLogos` it
 * carries the row; until then the brand name is set as the mark itself. No
 * logo is ever invented, and no empty box stands in for one — a reserved,
 * visibly blank slot read as a broken image rather than as pending artwork.
 */
export function BrandStrip({
  heading = 'Authorised applicator',
  tone = 'page',
  className,
}: BrandStripProps) {
  return (
    <div className={cx(styles.wrap, styles[tone], className)}>
      <h3 className={styles.heading}>{heading}</h3>
      <ul className={styles.list}>
        {authorisedBrands.map((brand) => {
          const logo = brandLogos[brand];

          return (
            <li
              key={brand}
              className={cx(styles.item, logo && styles.itemLogo)}
              /* The height each file is drawn at, which evens out the margin
                 it carries — see `renderHeight` in data/site. */
              style={
                logo?.renderHeight
                  ? ({ '--logo-h': `${logo.renderHeight}px` } as CSSProperties)
                  : undefined
              }
            >
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
