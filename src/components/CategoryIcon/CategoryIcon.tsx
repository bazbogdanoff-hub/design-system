import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { TagColor } from '../Tag';
import { HELMET_PATH, HELMET_VIEWBOX } from '../Logo/LogoHelmet';
import styles from './CategoryIcon.module.css';

export type CategoryIconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type CategoryIconEmphasis = 'strong' | 'muted';
/** A category hue, or `dark`: the shell's own dark (owner, 2026-10-08: the
 * admin module, the colour the logo stands on). */
export type CategoryIconColor = TagColor | 'dark';
/** `tile` (default) - the rounded square with an icon. `helmet` - the
 * logo's helmet piece itself, in the same glass, with no icon (owner,
 * 2026-10-08: the admin module). */
export type CategoryIconShape = 'tile' | 'helmet';
/** `glow` (default) - the glass throws its own colour down and right, as the
 * chart marks do. `drop` - the primary Button's neutral shadow instead
 * (owner, 2026-10-08: Profile's module tiles). */
export type CategoryIconShadow = 'glow' | 'drop';

export interface CategoryIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** `sm` (28px) · `md` (32px) · `lg`
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
  shadow?: CategoryIconShadow;
  /** Required for a `tile`; a `helmet` has none. */
  icon?: ReactNode;
}

/** px per unit at each size: the glass's px offsets, converted. */
const UNIT_PX: Record<CategoryIconSize, number> = { sm: 1.75, md: 2, lg: 2.25, xl: 2.5, '2xl': 2.75 };

/**
 * A colored icon tile for categorical identity - arbitrary category color
 * (like `Tag`'s `color`), not status meaning (that's `IconCell`'s `tone`).
 * Used for module icons and settings nav icons; kept as a sibling of
 * `IconCell` rather than merged into it since the two vocabularies
 * (semantic tone vs. categorical color) don't belong in one prop.
 */
export const CategoryIcon = forwardRef<HTMLSpanElement, CategoryIconProps>(function CategoryIcon(
  { size = '2xl', color, emphasis = 'strong', disabled, shape = 'tile', shadow = 'glow', icon, className, ...rest },
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
      data-shadow={shadow}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {shape === 'helmet' ? (
        /* The glass of the tile's box-shadows, as an SVG filter so it follows
           the piece's outline: a catch 1px in from the top-left edge, an
           inner shade 2px in, blurred 12; the thrown light is the CSS
           drop-shadows on the svg (CategoryIcon.module.css). */
        <svg className={styles.helmet} viewBox={HELMET_VIEWBOX} aria-hidden="true" focusable="false">
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
          <path d={HELMET_PATH} className={styles.helmetPath} filter={`url(#${filterId})`} />
        </svg>
      ) : (
        <span className={styles.icon}>{icon}</span>
      )}
    </span>
  );
});
