import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from '../IconButton';
import { cn } from '../../lib/cn';
import { FunnelIcon } from './FunnelIcon';
import { PlusIcon } from './PlusIcon';
import styles from './FilterIcon.module.css';

export type FilterIconSize = 'sm' | 'md';

/** Distributes `Omit` over `IconButtonProps`' aria-label/aria-labelledby union
 * instead of collapsing it (the built-in `Omit` computes `keyof` over the
 * whole union, which would merge the two branches). */
type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;

export type FilterIconProps = DistributiveOmit<IconButtonProps, 'variant' | 'size' | 'icon'> & {
  /** `sm` (28px) · `md` (32px, default — match `Filter`'s default when
   * sitting in a `FilterBar`). */
  size?: FilterIconSize;
};

/**
 * The add-a-filter trigger for `FilterBar` — `IconButton` fixed to
 * `variant="secondary"`. Shows a **funnel** at rest and morphs to a **"+"** on
 * hover / press / while its menu is open (`aria-expanded`), because its job is
 * *adding* a filter, not filtering directly. Both glyphs are fixed (not a
 * prop), matching Figma's `Filter — icon` — which now carries the same
 * funnel→plus state swap.
 *
 * Future: clicking opens a context menu listing every filter available for the
 * host, each with a show/hide checkbox.
 */
export const FilterIcon = forwardRef<HTMLButtonElement, FilterIconProps>(function FilterIcon(
  { size = 'md', className, ...rest },
  ref,
) {
  return (
    <IconButton
      ref={ref}
      variant="secondary"
      size={size}
      className={cn(styles.filterIcon, className)}
      {...(rest as IconButtonProps)}
      icon={
        <>
          <FunnelIcon className={styles.funnel} />
          <PlusIcon className={styles.plus} />
        </>
      }
    />
  );
});
