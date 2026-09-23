'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SiteImage } from '@/data/images';
import { cx } from '@/lib/cx';
import styles from './BeforeAfterGallery.module.css';

export type GalleryRatio = '4/3' | '3/2' | '16/10' | '1/1';

type BeforeAfterGalleryProps = {
  /**
   * The two photographs, as registry records rather than bare paths: the alt
   * text and the crop point travel with the file, so a gallery cannot end up
   * with the wrong description or an off-centre subject.
   */
  before: SiteImage;
  after: SiteImage;
  beforeLabel?: string;
  afterLabel?: string;
  /** What the button says it will show, e.g. "completed waterproofing". */
  subject: string;
  ratio?: GalleryRatio;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Two photographs of one place, shown one at a time.
 *
 * The original is shown first; the button swaps to the finished work and
 * back. Both are in the DOM from the start, so the swap is a cross-fade with
 * nothing to fetch and no layout shift — the frame holds its aspect ratio
 * whichever is showing.
 *
 * The image never changes on hover, only on click, tap or Enter/Space.
 */
export function BeforeAfterGallery({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  subject,
  ratio = '1/1',
  sizes = '(max-width: 899px) 100vw, 600px',
  priority = false,
  className,
}: BeforeAfterGalleryProps) {
  const [showAfter, setShowAfter] = useState(false);

  const frames = [
    { image: before, visible: !showAfter },
    { image: after, visible: showAfter },
  ];

  return (
    <div
      className={cx(styles.frame, className)}
      style={{ '--ratio': ratio.replace('/', ' / ') } as CSSProperties}
    >
      {frames.map(({ image, visible }) => (
        <div
          key={image.id}
          className={cx(styles.layer, visible && styles.visible)}
          aria-hidden={!visible}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={styles.image}
            style={{ objectPosition: image.focus ?? 'center center' }}
          />
        </div>
      ))}

      <p className={cx(styles.label, showAfter && styles.labelAfter)} aria-live="polite">
        {showAfter ? afterLabel : beforeLabel}
      </p>

      <button
        type="button"
        className={cx(styles.control, showAfter && styles.controlBack)}
        onClick={() => setShowAfter((value) => !value)}
        aria-label={showAfter ? `View before condition of ${subject}` : `View completed ${subject}`}
      >
        {showAfter ? (
          <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
        ) : (
          <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  );
}
