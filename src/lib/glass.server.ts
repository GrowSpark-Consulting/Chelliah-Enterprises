/**
 * Measures a hero photograph so the enquiry card can be tinted to match it.
 *
 * Server-only: it reads the file from /public with sharp. It runs while the
 * page is statically generated, so swapping the photograph and rebuilding is
 * all it takes for the card to follow — nothing is computed in the browser and
 * there is no flash of a default tint.
 */

import path from 'node:path';
import sharp from 'sharp';
import { deriveGlassTheme, relativeLuminance, type GlassTheme } from './glass';

/**
 * The part of the photograph the enquiry card covers on desktop, as fractions
 * of the file. The hero crops the file very little at desktop proportions, so
 * the card column maps onto roughly the right two-fifths of it.
 */
const CARD_REGION = { left: 0.58, top: 0.12, width: 0.42, height: 0.76 };

/**
 * Downsampling to a small square both keeps this cheap and approximates what
 * the card's backdrop blur does to the photograph behind it.
 */
const SAMPLE_SIZE = 48;

const cache = new Map<string, Promise<GlassTheme | undefined>>();

/**
 * The glass theme for a photograph under /public, or undefined if it cannot be
 * measured — in which case the card falls back to its original opaque style
 * rather than guessing at a tint that might not hold its text.
 */
export function glassThemeFor(src: string): Promise<GlassTheme | undefined> {
  let theme = cache.get(src);
  if (!theme) {
    theme = measure(src);
    cache.set(src, theme);
  }
  return theme;
}

async function measure(src: string): Promise<GlassTheme | undefined> {
  try {
    const file = path.join(process.cwd(), 'public', src);
    const { width, height } = await sharp(file).metadata();
    if (!width || !height) return undefined;

    const left = Math.floor(width * CARD_REGION.left);
    const top = Math.floor(height * CARD_REGION.top);

    const { data, info } = await sharp(file)
      .extract({
        left,
        top,
        width: Math.min(Math.round(width * CARD_REGION.width), width - left),
        height: Math.min(Math.round(height * CARD_REGION.height), height - top),
      })
      .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
      .removeAlpha()
      .toColourspace('srgb')
      .raw()
      .toBuffer({ resolveWithObject: true });

    const step = info.channels;
    const pixels = data.length / step;
    let r = 0;
    let g = 0;
    let b = 0;
    let luminance = 0;

    for (let i = 0; i < data.length; i += step) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      luminance += relativeLuminance(data[i], data[i + 1], data[i + 2]);
    }

    return deriveGlassTheme({
      mean: [r / pixels, g / pixels, b / pixels],
      luminance: luminance / pixels,
    });
  } catch (error) {
    console.warn(`[glass] Could not measure ${src}; using the opaque card.`, error);
    return undefined;
  }
}
