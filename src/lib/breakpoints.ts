/**
 * Viewport breakpoints. Not DTCG tokens (DTCG has no breakpoint type) — plain
 * constants. Values match Tailwind's, the de-facto web standard.
 *
 * This is a desktop-first CRM: `lg` (1024) is the real floor. Below `lg` the
 * AppShell collapses the sidebar. Design screens at 1440; spot-check 1280.
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
