import type { SVGProps } from 'react';

/** `Pagination`'s "previous page" glyph. Fixed, not consumer-configurable. */
export function CaretLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M168.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L97 128Z" />
    </svg>
  );
}
