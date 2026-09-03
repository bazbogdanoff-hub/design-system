import type { SVGProps } from 'react';

export type SeverityIconSize = 16 | 20 | 24;

export interface SeverityIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /** Rendered square size. 16 / 20 / 24 — matches SeverityBadge sm / md / lg. */
  size?: SeverityIconSize;
}

/** Path extracted verbatim from the Figma SeverityBadge triangle (vec 21×18.75 at 1.5,2.25 in a 24 box). */
const TRIANGLE =
  'M 20.7 15.38 L 12.5 1.15 C 12.3 0.8 12.01 0.51 11.65 0.31 C 11.3 0.11 10.91 0 10.5 0 C 10.1 0 9.7 0.11 9.35 0.31 C 9 0.51 8.7 0.8 8.5 1.15 L 0.3 15.38 C 0.1 15.72 0 16.1 0 16.5 C 0 16.89 0.1 17.27 0.3 17.61 C 0.5 17.96 0.8 18.25 1.15 18.45 C 1.5 18.65 1.9 18.75 2.3 18.75 L 18.7 18.75 C 19.1 18.75 19.5 18.65 19.85 18.45 C 20.21 18.25 20.5 17.96 20.7 17.61 C 20.9 17.27 21 16.89 21 16.5 C 21 16.1 20.9 15.72 20.7 15.38 Z M 9.75 7.5 C 9.75 7.3 9.83 7.11 9.97 6.97 C 10.11 6.83 10.3 6.75 10.5 6.75 C 10.7 6.75 10.89 6.83 11.03 6.97 C 11.17 7.11 11.25 7.3 11.25 7.5 L 11.25 11.25 C 11.25 11.45 11.17 11.64 11.03 11.78 C 10.89 11.92 10.7 12 10.5 12 C 10.3 12 10.11 11.92 9.97 11.78 C 9.83 11.64 9.75 11.45 9.75 11.25 L 9.75 7.5 Z M 10.5 15.75 C 10.28 15.75 10.06 15.68 9.88 15.56 C 9.69 15.44 9.55 15.26 9.46 15.06 C 9.38 14.85 9.35 14.62 9.4 14.41 C 9.44 14.19 9.55 13.99 9.71 13.83 C 9.86 13.67 10.06 13.57 10.28 13.52 C 10.5 13.48 10.73 13.5 10.93 13.59 C 11.14 13.67 11.31 13.82 11.44 14 C 11.56 14.19 11.63 14.4 11.63 14.63 C 11.63 14.92 11.51 15.21 11.3 15.42 C 11.09 15.63 10.8 15.75 10.5 15.75 Z';

/**
 * The severity alert-triangle — a filled triangle with the "!" punched out
 * (`fill-rule: evenodd`). Colour comes from `currentColor`, so the parent sets it.
 * Internal to SeverityBadge.
 */
export function SeverityIcon({ size = 20, ...rest }: SeverityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={TRIANGLE} transform="translate(1.5 2.25)" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}
