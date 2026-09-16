'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The one observer behind every <Reveal>. Mounted once in the root layout and
 * re-scanned on each route change.
 *
 * Elements are revealed when they intersect the viewport, and also when they
 * have already been scrolled past — a jump (anchor link, restored scroll
 * position) can move an element from below the viewport to above it without
 * it ever registering as intersecting.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(
      '[data-reveal]:not([data-revealed="true"])',
    );
    if (nodes.length === 0) return;

    const reveal = (node: Element) => node.setAttribute('data-revealed', 'true');

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      nodes.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
