'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { contact, nav, site } from '@/data/site';
import { generalEnquiry } from '@/lib/whatsapp';
import styles from './Header.module.css';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock the page behind the open menu and allow Escape to dismiss it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryPhone = contact.phones[0];

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled ? 'true' : 'false'}>
        <div className={`container ${styles.bar}`}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/logo.png"
              alt=""
              width={42}
              height={42}
              className={styles.brandMark}
              /* Eager, but deliberately not `priority`: a 42px mark does not
                 deserve a preload ahead of the page's own critical path. */
              loading="eager"
              aria-hidden
            />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{site.name}</span>
              <span className={styles.brandDescriptor}>{site.descriptor}</span>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <a
              href={`tel:${primaryPhone.tel}`}
              className={`${styles.iconButton} ${styles.callButton}`}
              aria-label={`Call ${primaryPhone.display}`}
            >
              <Phone size={18} strokeWidth={1.75} aria-hidden />
            </a>

            <span className={styles.desktopCta}>
              <Button href={generalEnquiry} variant="accent" size="sm">
                <WhatsAppIcon size={16} />
                Chat on WhatsApp
              </Button>
            </span>

            <button
              type="button"
              className={`${styles.iconButton} ${styles.menuToggle}`}
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X size={20} strokeWidth={1.75} aria-hidden />
              ) : (
                <Menu size={20} strokeWidth={1.75} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      {/*
        The panel lives outside <header> on purpose. The header's
        backdrop-filter makes it the containing block for position: fixed
        descendants, which would collapse this panel to the header's own
        height and clip it away entirely.
      */}
      <div id="mobile-menu" className={styles.panel} data-open={open ? 'true' : 'false'}>
        <div className={styles.panelInner}>
          <nav className={styles.panelNav} aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.panelLink}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
                <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
              </Link>
            ))}
          </nav>

          <div className={styles.panelActions}>
            <Button href={generalEnquiry} variant="accent" block>
              <WhatsAppIcon size={17} />
              Chat on WhatsApp
            </Button>
            <Button href={`tel:${primaryPhone.tel}`} variant="secondary" block>
              <Phone size={17} strokeWidth={1.75} aria-hidden />
              Call {primaryPhone.display}
            </Button>
          </div>

          <div className={styles.panelContact}>
            <p className="meta">Get in touch</p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phones[1].tel}`}>{contact.phones[1].display}</a>
          </div>
        </div>
      </div>
    </>
  );
}
