'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

type MarqueeToggleProps = {
  className?: string;
  /** What is moving, for the accessible name. */
  label: string;
};

/**
 * Pause control for a continuously moving strip (WCAG 2.2.2). It only flips
 * its own `aria-pressed`; the strip it sits beside reads that through a
 * sibling selector, so the strip itself stays a server component.
 */
export function MarqueeToggle({ className, label }: MarqueeToggleProps) {
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={paused}
      aria-label={`Pause ${label}`}
      title={paused ? 'Play' : 'Pause'}
      onClick={() => setPaused((value) => !value)}
    >
      {paused ? (
        <Play size={15} strokeWidth={1.75} aria-hidden />
      ) : (
        <Pause size={15} strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
