import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Container } from './Container';

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** Section vertical rhythm. */
  spacing?: 'default' | 'tight' | 'none';
  /** Background treatment. */
  tone?: 'page' | 'navy' | 'ink';
  /** Set false to lay the section out edge-to-edge and supply your own container. */
  contained?: boolean;
  flushTop?: boolean;
  flushBottom?: boolean;
  className?: string;
  'aria-labelledby'?: string;
};

const spacingClass = {
  default: 'section',
  tight: 'section section--tight',
  none: '',
} as const;

const toneClass = {
  page: '',
  navy: 'onNavy',
  ink: 'onInk',
} as const;

/** A page section: background tone, vertical rhythm and the global container. */
export function Section({
  children,
  id,
  spacing = 'default',
  tone = 'page',
  contained = true,
  flushTop,
  flushBottom,
  className,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cx(
        spacingClass[spacing],
        toneClass[tone],
        flushTop && 'section--flush-top',
        flushBottom && 'section--flush-bottom',
        className,
      )}
      aria-labelledby={rest['aria-labelledby']}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
