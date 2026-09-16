import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

type LinkProps = StyleProps & {
  children: ReactNode;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". Inferred for http(s) URLs. */
  external?: boolean;
  ariaLabel?: string;
};

type NativeProps = StyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    children: ReactNode;
    href?: undefined;
  };

function buttonClass({ variant = 'primary', size = 'md', block, className }: StyleProps) {
  return cx(
    'btn',
    `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    block && 'btn--block',
    className,
  );
}

/**
 * The single button primitive. Renders a next/link, an anchor or a native
 * button depending on what it is given, so links stay links and actions stay
 * buttons.
 */
export function Button(props: LinkProps | NativeProps) {
  if (props.href !== undefined) {
    const { href, external, ariaLabel, children, variant, size, block, className } = props;
    const cls = buttonClass({ variant, size, block, className });
    const isHttp = /^https?:/.test(href);
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          aria-label={ariaLabel}
          target={isHttp ? '_blank' : undefined}
          rel={isHttp ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  const { children, variant, size, block, className, type = 'button', ...rest } = props;

  return (
    <button type={type} className={buttonClass({ variant, size, block, className })} {...rest}>
      {children}
    </button>
  );
}
