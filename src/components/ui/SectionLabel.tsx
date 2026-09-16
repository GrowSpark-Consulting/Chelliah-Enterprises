import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

type SectionLabelProps = {
  children: ReactNode;
  /** Drops the red leading rule. */
  plain?: boolean;
  className?: string;
};

/** The small uppercase eyebrow that opens most sections. */
export function SectionLabel({ children, plain, className }: SectionLabelProps) {
  return <p className={cx('label', plain && 'label--plain', className)}>{children}</p>;
}
