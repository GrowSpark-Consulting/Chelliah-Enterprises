import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { SectionLabel } from './SectionLabel';
import styles from './SectionHeading.module.css';

type SectionHeadingProps = {
  label: string;
  title: string;
  /** Element id, so the surrounding section can be aria-labelledby it. */
  id?: string;
  body?: string;
  /** Optional trailing action, typically a "view all" button. */
  action?: ReactNode;
  /** Heading level. Defaults to h2. */
  as?: 'h2' | 'h3';
  className?: string;
};

/** Label + heading + optional supporting line, with an optional trailing action. */
export function SectionHeading({
  label,
  title,
  id,
  body,
  action,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div className={styles.copy}>
        <SectionLabel>{label}</SectionLabel>
        <Tag id={id} className={styles.title}>
          {title}
        </Tag>
        {body && <p className={`lede ${styles.body}`}>{body}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
