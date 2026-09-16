import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

/** The one horizontal rhythm every section aligns to. */
export function Container({ children, as: Tag = 'div', className }: ContainerProps) {
  return <Tag className={cx('container', className)}>{children}</Tag>;
}
