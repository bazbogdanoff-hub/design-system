import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from '../IconButton';
import { FunnelIcon } from './FunnelIcon';

export type FilterIconSize = 'sm' | 'md';

/** Distributes `Omit` over `IconButtonProps`' aria-label/aria-labelledby union
 * instead of collapsing it (the built-in `Omit` computes `keyof` over the
 * whole union, which would merge the two branches). */
type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;

export type FilterIconProps = DistributiveOmit<IconButtonProps, 'variant' | 'size' | 'icon'> & {
  /** `sm` (28px) · `md` (32px, default). Secondary-button heights only. */
  size?: FilterIconSize;
};

/**
 * The icon-only filter trigger for card/table headers — `IconButton` fixed to
 * `variant="secondary"` and a fixed funnel icon (not consumer-configurable —
 * matches Figma's `Filter — icon`, which binds the same glyph across every
 * variant rather than exposing it as a property).
 */
export const FilterIcon = forwardRef<HTMLButtonElement, FilterIconProps>(function FilterIcon(
  { size = 'md', ...rest },
  ref,
) {
  return (
    <IconButton ref={ref} variant="secondary" size={size} {...(rest as IconButtonProps)} icon={<FunnelIcon />} />
  );
});
