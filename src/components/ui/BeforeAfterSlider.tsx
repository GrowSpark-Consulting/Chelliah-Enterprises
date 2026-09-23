'use client';

import Image from 'next/image';
import { useCallback, useRef } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SiteImage } from '@/data/images';
import { cx } from '@/lib/cx';
import styles from './BeforeAfterSlider.module.css';

export type ComparisonRatio = '4/3' | '3/2' | '16/10' | '1/1';

type BeforeAfterSliderProps = {
  /** The original condition. Shown on the left of the divider. */
  before: SiteImage;
  /** The completed work. Shown on the right of the divider. */
  after: SiteImage;
  beforeLabel?: string;
  afterLabel?: string;
  /** Accessible name for the control — say what is being compared. */
  label: string;
  ratio?: ComparisonRatio;
  /** How much of the before image is shown at rest, 0–100. */
  initial?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * A before/after comparison the visitor drags.
 *
 * The control is a real `input[type=range]` laid transparently over the
 * frame. That is what makes it work with a mouse, a finger, a pen and the
 * keyboard without any custom drag handling: the browser already does
 * pointer capture, clamping and arrow/Home/End keys, and screen readers
 * already announce it as a slider.
 *
 * Moving it writes one CSS custom property on the frame, which the clip, the
 * divider and the handle all read. Nothing re-renders while dragging.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  label,
  ratio = '4/3',
  initial = 50,
  sizes = '(max-width: 899px) 100vw, 600px',
  priority = false,
  className,
}: BeforeAfterSliderProps) {
  const frame = useRef<HTMLDivElement>(null);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const value = input.valueAsNumber;
    // Written straight to the DOM: input events already arrive at most once
    // per frame, so this stays smooth without React or requestAnimationFrame.
    frame.current?.style.setProperty('--pos', `${value}%`);
    input.setAttribute('aria-valuetext', `${Math.round(value)}% before, ${100 - Math.round(value)}% after`);
  }, []);

  return (
    <div
      ref={frame}
      className={cx(styles.frame, className)}
      style={
        {
          '--ratio': ratio.replace('/', ' / '),
          '--pos': `${initial}%`,
        } as CSSProperties
      }
    >
      <div className={styles.layer}>
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
          style={{ objectPosition: after.focus ?? 'center center' }}
        />
      </div>

      {/* Clipped to the left of the divider, so the original shows through. */}
      <div className={cx(styles.layer, styles.beforeLayer)}>
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
          style={{ objectPosition: before.focus ?? 'center center' }}
        />
      </div>

      <span className={cx(styles.label, styles.labelBefore)}>{beforeLabel}</span>
      <span className={cx(styles.label, styles.labelAfter)}>{afterLabel}</span>

      {/*
        First in the DOM so the divider and handle can key off its focus, and
        so everything drawn after it sits on top. Those are all
        pointer-events: none, so a press anywhere on the frame reaches this.
      */}
      <input
        type="range"
        className={styles.control}
        min={0}
        max={100}
        step={1}
        defaultValue={initial}
        aria-label={label}
        aria-valuetext={`${initial}% before, ${100 - initial}% after`}
        onInput={handleInput}
      />

      <div className={styles.divider} aria-hidden />
      <div className={styles.handle} aria-hidden>
        <ChevronLeft size={15} strokeWidth={2.5} />
        <ChevronRight size={15} strokeWidth={2.5} />
      </div>
    </div>
  );
}
