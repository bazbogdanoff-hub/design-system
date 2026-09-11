import type { SVGProps } from 'react';

/** `FilterIcon`'s hover/active glyph — the funnel morphs to a "+" to signal
 * that the trigger *adds* a filter (future: opens a menu of every filter
 * available for the host, each with a show/hide checkbox). Not
 * consumer-configurable. */
export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M228 128a12 12 0 01-12 12h-76v76a12 12 0 01-24 0v-76H40a12 12 0 010-24h76V40a12 12 0 0124 0v76h76a12 12 0 0112 12z" />
    </svg>
  );
}
