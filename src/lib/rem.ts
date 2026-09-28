import { useSyncExternalStore } from 'react';

/**
 * Pixels per `rem` — the root font size. Everything in the system is sized in
 * rem, so raising the root (see `scale.css`) scales the whole UI. This is for
 * the few places that compute geometry in JS (SVG charts, table row fill, menu
 * placement), which author their numbers at the 16px reference and multiply.
 */
export function remPx(): number {
  if (typeof window === 'undefined') return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  // The root size only changes through a viewport media query, so a resize is
  // the only event that can move it.
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
}

/** The live root scale against the 16px reference — `1` at 16px, `1.125` at 18px. */
export function useRemScale(): number {
  return useSyncExternalStore(subscribe, () => remPx() / 16, () => 1);
}
