/**
 * Colour maths for the translucent enquiry card on the home hero.
 *
 * Pure functions only — no Node APIs — so client components can import the
 * `GlassTheme` type from here. The photograph itself is measured in
 * glass.server.ts at build time.
 */

export type GlassMode = 'light' | 'dark';

export type GlassTheme = {
  /**
   * The glass the card uses where it sits beside the copy, over an unwashed
   * part of the photograph. Stacked layouts always use dark glass instead —
   * see ContactForm.module.css.
   */
  mode: GlassMode;
  /** Pale tint drawn from the photograph, as an "r g b" triplet. */
  light: string;
  /** Deep tint drawn from the photograph, as an "r g b" triplet. */
  dark: string;
};

export type RegionStats = {
  /** Mean sRGB colour of the region, 0–255 per channel. */
  mean: readonly [number, number, number];
  /** Mean relative luminance, averaged per pixel in linear light (0–1). */
  luminance: number;
};

/**
 * Below this, the region behind the card is too dark for frosted glass to
 * hold dark text, and the card switches to dark glass with light text.
 *
 * Calibrated against the supplied mastheads: the home photographs measure
 * ~0.28 behind the card and take light glass comfortably; the pink corridor
 * shot measures 0.15 and does not.
 */
const LIGHT_GLASS_MIN_LUMINANCE = 0.2;

/** sRGB channel (0–255) to linear light. */
function toLinear(channel: number): number {
  const v = channel / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of an sRGB colour. */
export function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** sRGB (0–255) to HSL, with hue in degrees and s/l in 0–1. */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return [0, 0, l];

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  return [(h * 60 + 360) % 360, s, l];
}

/** HSL to an "r g b" triplet for use inside rgb(… / alpha). */
function hslToTriplet(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0]
    : h < 120 ? [x, c, 0]
    : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c]
    : h < 300 ? [x, 0, c]
    : [c, 0, x];

  return [r, g, b].map((v) => Math.round((v + m) * 255)).join(' ');
}

/**
 * Turns the measured region into the card's two tints and its mode.
 *
 * Both tints keep the photograph's hue but hold their own lightness, so the
 * card picks up the colour of the image without ever taking on a lightness
 * that would undercut its text. Saturation is damped and bounded: a vivid
 * photograph gives a tinted card, never a coloured one, and a grey photograph
 * gives a near-neutral one.
 */
export function deriveGlassTheme(region: RegionStats): GlassTheme {
  const [hue, saturation] = rgbToHsl(...region.mean);

  return {
    mode: region.luminance >= LIGHT_GLASS_MIN_LUMINANCE ? 'light' : 'dark',
    light: hslToTriplet(hue, clamp(saturation * 0.55, 0.06, 0.3), 0.95),
    dark: hslToTriplet(hue, clamp(saturation * 0.65, 0.14, 0.42), 0.13),
  };
}
