import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { TagColor } from '../Tag';
import styles from './CategoryIcon.module.css';

export type CategoryIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type CategoryIconEmphasis = 'strong' | 'muted';
/** A category hue, or `dark`: the shell's own dark (owner, 2026-10-08: the
 * admin module, the colour the logo stands on). */
export type CategoryIconColor = TagColor | 'dark';
/** `tile` (default) - the rounded square with an icon. `helmet` - the
 * logo's helmet piece itself, in the same glass, with no icon (owner,
 * 2026-10-08: the admin module, and the small role mark after a name). */
export type CategoryIconShape = 'tile' | 'helmet';

export interface CategoryIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** `xs` (16px, a mark beside text) · `sm` (28px) · `md` (32px) · `lg`
   * (36px) · `xl` (40px) · `2xl` (44px, default) - the same box/icon/radius
   * scale as `IconCell`. */
  size?: CategoryIconSize;
  /** One of the 10 validated `color.category.*` hues - same palette as
   * `Tag`, same round-robin order matters if auto-assigning - or `dark`. */
  color: CategoryIconColor;
  /** `strong` (default) - saturated fill + white icon, for **modules**.
   * `muted` - the same hue genuinely desaturated (not just lightened, see
   * `color.category.*.background-muted`), still a white icon, for
   * **settings**. */
  emphasis?: CategoryIconEmphasis;
  /** Disabled - flat 30% opacity, matching the legacy reference. */
  disabled?: boolean;
  shape?: CategoryIconShape;
  /** Required for a `tile`; a `helmet` has none. */
  icon?: ReactNode;
}

/** The helmet: the logo's fourth piece (Logo.tsx), in its 30-unit space. */
const HELMET =
  'M25.6571 14.0766C26.5005 13.5102 27.6474 13.9852 27.846 14.9834L29.6373 24.0083C29.7855 24.7549 29.3242 25.4871 28.5882 25.6726L28.4389 25.7089L25.565 19.5258C25.3308 19.0217 24.8249 18.6986 24.269 18.6986H22.3047C21.6168 18.6986 21.0589 19.2565 21.0589 19.9444C21.0589 20.6322 21.6168 21.1902 22.3047 21.1902H23.3887C23.973 21.1903 24.4987 21.5459 24.7154 22.0886L27.0536 27.9466L27.0759 27.9117L27.1526 28.1949C27.4489 29.2894 26.4162 30.2777 25.3404 29.929L19.8633 28.1545C19.4391 28.017 18.9963 27.9466 18.5505 27.9466H15.6641C14.8777 27.9466 14.2397 27.3068 14.2397 26.518V16.2083C14.2397 15.2911 14.9812 14.5468 15.8956 14.5468H24.9568L25.6571 14.0766Z';
/** The helmet's box in that space, a square around its 15.6 x 16. */
const HELMET_VIEW = '14 14 16 16';
/** px per unit at each size: the glass's px offsets, converted. */
const UNIT_PX: Record<CategoryIconSize, number> = { xs: 1, sm: 1.75, md: 2, lg: 2.25, xl: 2.5, '2xl': 2.75 };

/**
 * A colored icon tile for categorical identity - arbitrary category color
 * (like `Tag`'s `color`), not status meaning (that's `IconCell`'s `tone`).
 * Used for module icons and settings nav icons; kept as a sibling of
 * `IconCell` rather than merged into it since the two vocabularies
 * (semantic tone vs. categorical color) don't belong in one prop.
 */
export const CategoryIcon = forwardRef<HTMLSpanElement, CategoryIconProps>(function CategoryIcon(
  { size = '2xl', color, emphasis = 'strong', disabled, shape = 'tile', icon, className, ...rest },
  ref,
) {
  const filterId = useId();
  const u = 1 / UNIT_PX[size];
  return (
    <span
      ref={ref}
      className={cn(styles.tile, className)}
      data-size={size}
      data-color={color}
      data-emphasis={emphasis}
      data-shape={shape}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {shape === 'helmet' ? (
        /* The glass of the tile's box-shadows, as an SVG filter so it follows
           the piece's outline: a catch 1px in from the top-left edge, an
           inner shade 2px in, blurred 12; the thrown light is the CSS
           drop-shadows on the svg (CategoryIcon.module.css). */
        <svg className={styles.helmet} viewBox={HELMET_VIEW} aria-hidden="true" focusable="false">
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feComponentTransfer in="SourceAlpha" result="outside">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feOffset in="outside" dx={2 * u} dy={2 * u} />
            <feGaussianBlur stdDeviation={6 * u} result="shadeShape" />
            <feFlood className={styles.shade} />
            <feComposite in2="shadeShape" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" result="shade" />
            <feOffset in="outside" dx={u} dy={u} result="catchShape" />
            <feFlood className={styles.catch} />
            <feComposite in2="catchShape" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" result="catch" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="shade" />
              <feMergeNode in="catch" />
            </feMerge>
          </filter>
          <path d={HELMET} className={styles.helmetPath} filter={`url(#${filterId})`} />
        </svg>
      ) : (
        <span className={styles.icon}>{icon}</span>
      )}
    </span>
  );
});
