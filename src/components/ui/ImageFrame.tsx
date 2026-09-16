import Image from 'next/image';
import type { CSSProperties } from 'react';
import { ImageIcon } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './ImageFrame.module.css';

export type ImageRatio = '16/10' | '16/9' | '4/3' | '3/2' | '1/1';

type ImageFrameProps = {
  /** Path under /public. Omit to render the placeholder. */
  src?: string;
  /** Meaningful alternative text. Required whenever `src` is set. */
  alt?: string;
  /** Describes the photograph this slot expects — shown in the placeholder. */
  hint: string;
  ratio?: ImageRatio;
  /** Set on the one above-the-fold image so it is not lazy-loaded. */
  priority?: boolean;
  /** Responsive sizes hint; defaults to a sensible grid value. */
  sizes?: string;
  className?: string;
};

/**
 * Every content image on the site goes through here: one aspect-ratio system,
 * one hairline frame, lazy loading below the fold, and no layout shift.
 *
 * Until real site photography is supplied, it draws a blueprint-style
 * placeholder naming the shot the slot needs. Drop a file into /public/images
 * and pass `src` + `alt` — nothing else changes.
 */
export function ImageFrame({
  src,
  alt,
  hint,
  ratio = '4/3',
  priority = false,
  sizes = '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 620px',
  className,
}: ImageFrameProps) {
  return (
    <div
      className={cx(styles.frame, className)}
      style={{ '--frame-ratio': ratio.replace('/', ' / ') } as CSSProperties}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <>
          <div
            className={styles.placeholder}
            role="img"
            aria-label={`Photograph pending: ${hint}`}
          >
            <ImageIcon
              className={styles.placeholderIcon}
              size={20}
              strokeWidth={1.5}
              aria-hidden
            />
            <p className={styles.placeholderText}>{hint}</p>
            <p className={styles.placeholderNote}>Photograph pending</p>
          </div>
          {/* Registration marks carry the blueprint framing of the supplied
              design. They sit on the placeholder only, so real photography
              stays clean. */}
          <span className={styles.marks} aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </span>
        </>
      )}
    </div>
  );
}
