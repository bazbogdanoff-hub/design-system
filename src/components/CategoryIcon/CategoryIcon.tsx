import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { TagColor } from '../Tag';
import styles from './CategoryIcon.module.css';

export type CategoryIconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type CategoryIconEmphasis = 'strong' | 'muted';

export interface CategoryIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** `sm` (28px) · `md` (32px) · `lg` (36px) · `xl` (40px) · `2xl` (44px,
   * default) — the same box/icon/radius scale as `IconCell`. */
  size?: CategoryIconSize;
  /** One of the 10 validated `color.category.*` hues — same palette as
   * `Tag`, same round-robin order matters if auto-assigning. */
  color: TagColor;
  /** `strong` (default) — saturated fill + white icon, for **modules**.
   * `muted` — the same hue genuinely desaturated (not just lightened, see
   * `color.category.*.background-muted`), still a white icon, for
   * **settings**. */
  emphasis?: CategoryIconEmphasis;
  /** Disabled — flat 30% opacity, matching the legacy reference. */
  disabled?: boolean;
  icon: ReactNode;
}

/**
 * A colored icon tile for categorical identity — arbitrary category color
 * (like `Tag`'s `color`), not status meaning (that's `IconCell`'s `tone`).
 * Used for module icons and settings nav icons; kept as a sibling of
 * `IconCell` rather than merged into it since the two vocabularies
 * (semantic tone vs. categorical color) don't belong in one prop.
 */
export const CategoryIcon = forwardRef<HTMLSpanElement, CategoryIconProps>(function CategoryIcon(
  { size = '2xl', color, emphasis = 'strong', disabled, icon, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.tile, className)}
      data-size={size}
      data-color={color}
      data-emphasis={emphasis}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <span className={styles.icon}>{icon}</span>
    </span>
  );
});
