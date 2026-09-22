import { Children, forwardRef, type MouseEventHandler, type ReactNode } from 'react';
import { Stack, type StackProps } from '../Stack';
import { FilterIcon, type FilterIconSize } from '../FilterIcon';

export interface FilterBarProps
  extends Omit<StackProps, 'direction' | 'gap' | 'align' | 'wrap' | 'children'> {
  /** `Filter` instances — any number, including none. */
  children?: ReactNode;
  /** Size of the leading `FilterIcon` — match the `Filter`s beside it
   * (`sm` 28px · `md` 32px). Defaults to `md` so it lines up with `Filter`'s
   * own default. */
  size?: FilterIconSize;
  /** Accessible name for the add-filter trigger. */
  addFilterLabel?: string;
  /** Click handler for the add-filter trigger (funnel → "+" on hover; future:
   *  opens the show/hide-filters menu). **Its presence renders the trigger** —
   *  omit it when the host has no filters to add and the bar is just static
   *  `Filter`s (or empty, in which case `FilterBar` renders nothing at all). */
  onAddFilter?: MouseEventHandler<HTMLButtonElement>;
  /** Reflects a future add-filter menu's open state onto the trigger (keeps
   *  it showing the "+" while the menu is open). */
  addFilterMenuOpen?: boolean;
}

/**
 * A header row for cards/tables that need filtering: an optional add-filter
 * trigger (`FilterIcon`) plus any number of `Filter`s. Everything sits in one
 * wrapping row and stays aligned as it wraps — the trigger is no longer a
 * fixed, always-present first element (that rule was dropped): pass
 * `onAddFilter` to show it, and if there's neither a trigger nor a `Filter`,
 * `FilterBar` renders nothing.
 */
export const FilterBar = forwardRef<HTMLElement, FilterBarProps>(function FilterBar(
  { children, size = 'md', addFilterLabel = 'Add filter', onAddFilter, addFilterMenuOpen, ...rest },
  ref,
) {
  const hasTrigger = onAddFilter != null;
  const hasFilters = Children.count(children) > 0;
  if (!hasTrigger && !hasFilters) return null;

  return (
    <Stack ref={ref} direction="row" gap="md" align="center" wrap {...rest}>
      {hasTrigger && (
        <FilterIcon
          size={size}
          aria-label={addFilterLabel}
          aria-expanded={addFilterMenuOpen}
          onClick={onAddFilter}
        />
      )}
      {children}
    </Stack>
  );
});
