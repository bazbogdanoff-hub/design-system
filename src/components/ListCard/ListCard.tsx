import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import { Stack } from '../Stack';
import { FilterBar } from '../FilterBar';
import { ScrollableArea } from '../ScrollableArea';
import { ListCardHeader, type ListCardHeaderProps } from '../ListCardHeader';
import styles from './ListCard.module.css';

export type ListCardSize = 'sm' | 'md' | 'lg';

export interface ListCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Cascades to a bare `<ListCardHeader>` `header` (no explicit `size` of
   * its own) — same mechanism `FormField` uses for a bare `<Input>` child. */
  size?: ListCardSize;
  /** The title region — usually a `<ListCardHeader>`. */
  header: ReactNode;
  /** Any number of `Filter`s, rendered in a `FilterBar` row below the
   * header. Omit entirely (not even an empty array) to skip the row —
   * `FilterBar` itself already collapses to nothing with no filters and no
   * add-trigger, so this only decides whether `FilterBar` renders at all. */
  filters?: ReactNode;
  /** The list content — rows, usually — rendered inside a `ScrollableArea`. */
  children: ReactNode;
}

/**
 * A card built specifically to hold a filterable, scrollable list —
 * `Header` + optional `Filters` + `Body`, stacked inside a real `Card`
 * (`padding="md"`). Figma (`10084:14100`) has 2 variants — `Default` and
 * `without filters` — added after this was first built as a single fixed
 * component; both are already covered here by the same `filters` prop being
 * present or omitted, no code change needed. The only *other* thing that
 * varies is whether `ListCardHeader`'s own `description` is present, and
 * that's `ListCardHeader`'s prop, not this component's.
 *
 * `size` has no Figma variant to mirror (the reference is a single fixed
 * component) — it exists purely as a React convenience, cascaded to a bare
 * `header` the same way `FormField` cascades `size` to a bare `Input`, for
 * the case where a screen genuinely wants a denser or roomier list card.
 */
export const ListCard = forwardRef<HTMLDivElement, ListCardProps>(function ListCard(
  { size = 'md', header, filters, children, className, ...rest },
  ref,
) {
  const resolvedHeader =
    isValidElement(header) && header.type === ListCardHeader
      ? cloneElement(header as ReactElement<ListCardHeaderProps>, {
          size: (header.props as ListCardHeaderProps).size ?? size,
        })
      : header;

  return (
    <Card ref={ref} padding="md" className={cn(styles.card, className)} {...rest}>
      <Stack direction="column" gap="lg" className={styles.stack}>
        {resolvedHeader}
        {filters != null && <FilterBar>{filters}</FilterBar>}
        <ScrollableArea className={styles.body}>{children}</ScrollableArea>
      </Stack>
    </Card>
  );
});
