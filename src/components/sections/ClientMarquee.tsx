import Image from 'next/image';
import type { CSSProperties } from 'react';
import { clientLogos, clients } from '@/data/site';
import { cx } from '@/lib/cx';
import { MarqueeToggle } from './MarqueeToggle';
import styles from './ClientMarquee.module.css';

type ClientMarqueeProps = {
  className?: string;
};

function ClientGroup({ hidden }: { hidden?: boolean }) {
  return (
    <ul className={styles.group} role={hidden ? undefined : 'list'} aria-hidden={hidden || undefined}>
      {clients.map((client) => {
        const logo = clientLogos[client];

        return (
          <li key={client} className={styles.item}>
            {logo ? (
              <Image
                src={logo.src}
                // The duplicate set is decorative; the first set is announced.
                alt={hidden ? '' : `${client} logo`}
                width={Math.round((logo.renderHeight * logo.width) / logo.height)}
                height={logo.renderHeight}
                quality={90}
                /*
                 * Eager, at low priority. Lazy loading would hold back every
                 * logo clipped by the strip until it slid into view, and each
                 * would then pop in mid-motion.
                 */
                loading="eager"
                fetchPriority="low"
                className={styles.logo}
                style={
                  {
                    '--logo-h': `${logo.renderHeight}px`,
                    '--logo-ratio': `${logo.width} / ${logo.height}`,
                  } as CSSProperties
                }
              />
            ) : (
              <span className={styles.name}>{client}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The client roster as a slow, continuous strip of logos.
 *
 * The list is rendered twice and the track moves by exactly half its width,
 * so the second copy arrives precisely where the first began and the loop has
 * no seam. Movement is a transform only, so it runs on the compositor.
 *
 * Hovering pauses it, the button pauses it for keyboard and touch users, and
 * with reduced motion it becomes a static, wrapped row.
 */
export function ClientMarquee({ className }: ClientMarqueeProps) {
  return (
    <div className={cx(styles.marquee, className)}>
      {/* Before the strip in the DOM so the sibling selector can reach it,
          and so it is reached before the moving content. Shown after it. */}
      <MarqueeToggle className={styles.toggle} label="client logos" />
      <div className={styles.viewport}>
        <div className={styles.track}>
          <ClientGroup />
          <ClientGroup hidden />
        </div>
      </div>
    </div>
  );
}
