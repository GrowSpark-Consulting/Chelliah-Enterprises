import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in milliseconds, applied once the element enters the viewport. */
  delay?: number;
  className?: string;
};

/**
 * Marks a block to fade up as it scrolls into view.
 *
 * This is a server component: it only emits a `data-reveal` attribute. A
 * single `RevealObserver` in the root layout watches every marked element,
 * so a page with twenty reveals still ships one observer and no per-element
 * React state.
 *
 * The hidden starting state is unconditional CSS (matches on server and
 * client, so hydration never disagrees on it) with a `<noscript>` stylesheet
 * in the root layout restoring visibility when scripting is unavailable.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className }: RevealProps) {
  return (
    <Tag
      className={cx('reveal', className)}
      data-reveal=""
      style={delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
