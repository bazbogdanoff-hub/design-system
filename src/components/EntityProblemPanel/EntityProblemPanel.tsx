import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ScrollableArea } from '../ScrollableArea';
import { cn } from '../../lib/cn';
import styles from './EntityProblemPanel.module.css';

export interface EntityProblemPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** An `<EntitySummary>` for this entity/column. */
  summary: ReactNode;
  /** `Row` elements for this entity's issues. Omit (or pass `null`) to show
   * `emptyState` instead — built at this grain (not a combinatorial
   * `RigProblemDetail`) so any mix of which entities have issues is just
   * picking which panels get `children` vs. `emptyState`. */
  children?: ReactNode;
  /** Shown instead of the rows list when there's nothing here — usually an
   * `<EmptyState>`. */
  emptyState?: ReactNode;
}

/**
 * One entity's problem column — an `EntitySummary` header + either a
 * scrollable list of `Row`s or an `EmptyState`. Pairs with
 * `RigProblemDetail`, which lays 3 of these out side by side.
 */
export const EntityProblemPanel = forwardRef<HTMLDivElement, EntityProblemPanelProps>(function EntityProblemPanel(
  { summary, children, emptyState, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.panel, className)} {...rest}>
      {summary}
      {children != null ? (
        <ScrollableArea className={styles.body}>{children}</ScrollableArea>
      ) : (
        <div className={styles.body}>{emptyState}</div>
      )}
    </div>
  );
});
