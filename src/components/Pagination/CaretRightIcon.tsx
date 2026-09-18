import type { SVGProps } from 'react';

/** `Pagination`'s "next page" glyph. Fixed, not consumer-configurable. */
export function CaretRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M180.49 136.49l-80 80a12 12 0 0 1-17-17L154 128 83.51 57.51a12 12 0 0 1 17-17l80 80a12 12 0 0 1 0 17Z" />
    </svg>
  );
}
