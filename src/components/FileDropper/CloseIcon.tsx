import type { SVGProps } from 'react';

/** `FileDropper`'s cancel/remove glyph — a bold rounded X, built from two
 * rotated rounded bars rather than a hand-drawn path. Fixed, not
 * consumer-configurable. */
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="118" y="48" width="20" height="160" rx="10" transform="rotate(45 128 128)" />
      <rect x="118" y="48" width="20" height="160" rx="10" transform="rotate(-45 128 128)" />
    </svg>
  );
}
