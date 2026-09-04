import { forwardRef, type MouseEventHandler, type ReactNode } from 'react';
import { Stack, type StackProps } from '../Stack';
import { FilterIcon } from '../FilterIcon';

export interface FilterBarProps extends Omit<StackProps, 'direction' | 'gap' | 'align' | 'children'> {
  /** Any number of `Filter` instances, rendered next to the fixed funnel trigger. */
  children: ReactNode;
  /** Accessible name for the funnel trigger. */
  filterIconLabel?: string;
  /** Click handler for the funnel trigger — opens the advanced-filter / add-filter popover. */
  onFilterIconClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * A row for card/table headers: a fixed funnel trigger (`FilterIcon`) plus a
 * slot for as many `Filter`s as the header needs. Matches Figma's `FilterBar`
 * 1:1 — the icon is a fixed first element, everything after it is open
 * content (Figma models that with a SLOT; in React it's just `children`).
 */
export const FilterBar = forwardRef<HTMLElement, FilterBarProps>(function FilterBar(
  { children, filterIconLabel = 'Advanced filters', onFilterIconClick, ...rest },
  ref,
) {
  return (
    <Stack ref={ref} direction="row" gap="md" align="center" {...rest}>
      <FilterIcon aria-label={filterIconLabel} onClick={onFilterIconClick} />
      {children}
    </Stack>
  );
});
