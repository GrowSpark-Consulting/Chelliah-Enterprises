import Image from 'next/image';
import type { CSSProperties } from 'react';
import { ImageIcon } from 'lucide-react';
import type { SiteImage } from '@/data/images';
import { cx } from '@/lib/cx';
import styles from './ImageFrame.module.css';

export type ImageRatio = '16/10' | '16/9' | '4/3' | '3/2' | '1/1';

type ImageFrameProps = {
  /**
   * A record from the photography registry (data/images.ts). This is the
   * normal way to fill a frame — it carries the path, the alt text and the
   * crop focus together. Omit it to render the placeholder.
   */
  image?: SiteImage;
  /** Path under /public. Only for one-off images outside the registry. */
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
 * Until a photograph is registered for a slot, it draws a blueprint-style
 * placeholder naming the shot that slot needs. Register the file in
 * data/images.ts and pass the record as `image` — nothing else changes.
 */
export function ImageFrame({
  image,
  src,
  alt,
  hint,
  ratio = '4/3',
  priority = false,
  sizes = '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 620px',
  className,
}: ImageFrameProps) {
  const source = image?.src ?? src;
  const description = image?.alt ?? alt;

  return (
    <div
      className={cx(styles.frame, className)}
      style={
        {
          '--frame-ratio': ratio.replace('/', ' / '),
          '--frame-focus': image?.focus ?? 'center center',
        } as CSSProperties
      }
    >
      {source ? (
        <Image
          src={source}
          alt={description ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
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
