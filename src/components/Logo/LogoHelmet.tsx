import { forwardRef, type SVGAttributes } from 'react';

/** The helmet: the logo's fourth piece (Logo.tsx), in its 30-unit space. */
export const HELMET_PATH =
  'M25.6571 14.0766C26.5005 13.5102 27.6474 13.9852 27.846 14.9834L29.6373 24.0083C29.7855 24.7549 29.3242 25.4871 28.5882 25.6726L28.4389 25.7089L25.565 19.5258C25.3308 19.0217 24.8249 18.6986 24.269 18.6986H22.3047C21.6168 18.6986 21.0589 19.2565 21.0589 19.9444C21.0589 20.6322 21.6168 21.1902 22.3047 21.1902H23.3887C23.973 21.1903 24.4987 21.5459 24.7154 22.0886L27.0536 27.9466L27.0759 27.9117L27.1526 28.1949C27.4489 29.2894 26.4162 30.2777 25.3404 29.929L19.8633 28.1545C19.4391 28.017 18.9963 27.9466 18.5505 27.9466H15.6641C14.8777 27.9466 14.2397 27.3068 14.2397 26.518V16.2083C14.2397 15.2911 14.9812 14.5468 15.8956 14.5468H24.9568L25.6571 14.0766Z';
/** The helmet's box in that space, a square around its 15.6 x 16. */
export const HELMET_VIEWBOX = '14 14 16 16';

export type LogoHelmetProps = SVGAttributes<SVGSVGElement>;

/**
 * The logo's helmet as a glyph (owner, 2026-10-08): 1em square, in the
 * current text colour, like an icon - the administrator's mark after a role.
 * Decorative by default; give it an `aria-label` and `role="img"` to name it.
 */
export const LogoHelmet = forwardRef<SVGSVGElement, LogoHelmetProps>(function LogoHelmet(props, ref) {
  return (
    <svg
      ref={ref}
      viewBox={HELMET_VIEWBOX}
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={props['aria-label'] ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d={HELMET_PATH} />
    </svg>
  );
});
