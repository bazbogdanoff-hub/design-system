import type { SVGProps } from 'react';

/** `NextTask`'s header "view all" glyph — same icon `StatButton` uses for its
 * own drill-down arrow. */
export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path
        transform="translate(4.87 4.875)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 14.25 1.13 L 14.25 10.88 C 14.25 11.17 14.13 11.46 13.92 11.67 C 13.71 11.88 13.43 12 13.13 12 C 12.83 12 12.54 11.88 12.33 11.67 C 12.12 11.46 12 11.17 12 10.88 L 12 3.84 L 1.92 13.92 C 1.71 14.13 1.43 14.25 1.13 14.25 C 0.83 14.25 0.54 14.13 0.33 13.92 C 0.12 13.71 0 13.42 0 13.12 C 0 12.83 0.12 12.54 0.33 12.33 L 10.41 2.25 L 3.38 2.25 C 3.08 2.25 2.79 2.13 2.58 1.92 C 2.37 1.71 2.25 1.42 2.25 1.13 C 2.25 0.83 2.37 0.54 2.58 0.33 C 2.79 0.12 3.08 0 3.38 0 L 13.13 0 C 13.43 0 13.71 0.12 13.92 0.33 C 14.13 0.54 14.25 0.83 14.25 1.13 Z"
      />
    </svg>
  );
}
