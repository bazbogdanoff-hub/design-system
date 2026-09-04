import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from '../IconButton';
import { FunnelIcon } from './FunnelIcon';

export type FilterIconSize = 'lg' | 'xl';

/** Distributes `Omit` over `IconButtonProps`' aria-label/aria-labelledby union
 * instead of collapsing it (the built-in `Omit` computes `keyof` over the
 * whole union, which would merge the two branches). */
type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;

export type FilterIconProps = DistributiveOmit<IconButtonProps, 'variant' | 'size' | 'icon'> & {
  /** `lg` (36px) · `xl` (40px, default). Secondary-button heights only. */
  size?: FilterIconSize;
};

/**
 * The icon-only filter trigger for card/table headers — `IconButton` fixed to
 * `variant="secondary"`, the two taller sizes, and a fixed funnel icon (not
 * consumer-configurable — matches Figma's `Filter — icon`, which binds the
 * same glyph across every variant rather than exposing it as a property).
 */
export const FilterIcon = forwardRef<HTMLButtonElement, FilterIconProps>(function FilterIcon(
  { size = 'xl', ...rest },
  ref,
) {
  return (
    <IconButton ref={ref} variant="secondary" size={size} {...(rest as IconButtonProps)} icon={<FunnelIcon />} />
  );
});
