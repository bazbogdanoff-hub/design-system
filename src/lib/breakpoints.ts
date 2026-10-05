import { useSyncExternalStore } from 'react';

/**
 * Viewport breakpoints. Not DTCG tokens (DTCG has no breakpoint type) - plain
 * constants. Values match Tailwind's, the de-facto web standard.
 *
 * This is a desktop-first CRM: `lg` (1024) is the real floor. Design screens
 * at 1440; the `wide` tier below is designed at 1920.
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** `min-width` media query string for a breakpoint. `up('lg')` → `(min-width: 1024px)`. */
export const up = (bp: Breakpoint): string => `(min-width: ${breakpoints[bp]}px)`;

/** `max-width` media query string (one px below the breakpoint). `down('lg')` → `(max-width: 1023px)`. */
export const down = (bp: Breakpoint): string => `(max-width: ${breakpoints[bp] - 1}px)`;

/**
 * Layout tiers - what templates and `Grid` switch on. Three, not five: the
 * breakpoints above are the vocabulary, the tiers are the decisions.
 *
 * - `wide` - a 1920 monitor at 100%. 1600 rather than `2xl` (1536) because
 *   1536 is a 1920 laptop at Windows' 125% scaling, which is a laptop and
 *   belongs in `desktop`. The height floor keeps a 1600×900 monitor (≈770
 *   tall once the browser is drawn) out.
 * - `desktop` - 1280–1599: 1366, 1440, 1536. The Figma reference.
 * - `tablet` - below 1280. Rails drop under the main column.
 * - `phone` - below 640 (`sm`), or a phone on its side: short (under 500)
 *   with a touch screen. The sidebar gives way to a bottom bar, the page
 *   card scrolls, and every grid column collapses to one (owner,
 *   2026-10-05). `pointer: coarse` keeps a short desktop window out.
 *
 * Tiers decide placement only. **Size** is `scale.css`: the root grows
 * smoothly from 16px at 1440 to 20px at 1920, independent of any tier. So in
 * rem a `wide` screen is barely roomier than `desktop` - 1600 is 92rem across,
 * 1920 is 96rem, against 90rem at 1440. Judge `wide` placement at 1600 as
 * well as 1920.
 *
 * **CSS cannot read these.** `Grid.module.css` repeats the queries as
 * literals; change one, change both.
 */
export type Tier = 'phone' | 'tablet' | 'desktop' | 'wide';

export const tierQueries = {
  wide: '(min-width: 1600px) and (min-height: 820px)',
  tablet: `(max-width: ${breakpoints.xl - 1}px)`,
  phone: `(max-width: ${breakpoints.sm - 1}px), (max-height: 499px) and (pointer: coarse)`,
} as const;

function readTier(): Tier {
  if (typeof window === 'undefined' || !window.matchMedia) return 'desktop';
  if (window.matchMedia(tierQueries.phone).matches) return 'phone';
  if (window.matchMedia(tierQueries.wide).matches) return 'wide';
  if (window.matchMedia(tierQueries.tablet).matches) return 'tablet';
  return 'desktop';
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const lists = [tierQueries.wide, tierQueries.tablet, tierQueries.phone].map((q) => window.matchMedia(q));
  lists.forEach((list) => list.addEventListener('change', onChange));
  return () => lists.forEach((list) => list.removeEventListener('change', onChange));
}

/** The current layout tier, live across resizes. `desktop` without a DOM. */
export function useTier(): Tier {
  return useSyncExternalStore(subscribe, readTier, () => 'desktop');
}
