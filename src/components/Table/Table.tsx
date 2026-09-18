import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import styles from './Table.module.css';

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Left-aligned in the header row. Omit along with `actions` to hide the header entirely. */
  filters?: ReactNode;
  /** Right-aligned in the header row — 0 to N buttons. Just compose them; there's no per-button prop, an empty/omitted slot simply takes no space. */
  actions?: ReactNode;
  /** The header row — a `<TableRow>` of `<TableHeaderCell>`s. */
  header: ReactNode;
  /** Body rows — `<TableRow>`s of `<TableCell>`s. */
  children: ReactNode;
  /** How many rows are currently selected. The footer's left side (and the footer itself, if `pagination` is also absent) only appears once this is truthy. */
  selectedCount?: number;
  /** Shown next to the selection count — e.g. a "Delete" button. Only rendered when `selectedCount` is truthy. */
  selectionActions?: ReactNode;
  /** The `<Pagination>` element, right-aligned in the footer. */
  pagination?: ReactNode;
}

/**
 * Card surface + header (filters/actions) + a real `<table>` + footer
 * (selection/pagination) — the same 3-region shape built in Figma, ported
 * with one structural difference: `hasHeader`/`hasFooter`/`hasFilters`/
 * `hasSelection`/`hasPagination` were real exposed booleans there because
 * Figma has no way to compute "is this content present" — here they're just
 * `filters/actions/selectedCount/pagination` being truthy or not, plain
 * conditional rendering.
 *
 * Wraps the real `Card` (`padding="none"`) rather than replicating its
 * fill/radius/shadow — Figma couldn't nest a live `Card` **instance** without
 * hitting a real Slot-insertion depth limit, but that restriction doesn't
 * exist in React, so this is the one place code and the Figma reference
 * deliberately diverge in how they reach the identical visual result. `Card`
 * itself gained `overflow: hidden` under `padding="none"` for this — the
 * header/rows/footer all sit flush against its rounded corners.
 */
export const Table = forwardRef<HTMLDivElement, TableProps>(function Table(
  { filters, actions, header, children, selectedCount, selectionActions, pagination, className, ...rest },
  ref,
) {
  const hasHeader = filters != null || actions != null;
  const hasFooter = Boolean(selectedCount) || pagination != null;

  return (
    <Card ref={ref} padding="none" className={cn(styles.table, className)} {...rest}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.filters}>{filters}</div>
          <div className={styles.actions}>{actions}</div>
        </div>
      )}
      <div className={styles.content}>
        <table className={styles.grid}>
          <thead>{header}</thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {hasFooter && (
        <div className={styles.footer}>
          <div className={styles.selection}>
            {Boolean(selectedCount) && (
              <>
                <span className={styles.selectionCount}>{selectedCount} selected</span>
                {selectionActions}
              </>
            )}
          </div>
          <div className={styles.pagination}>{pagination}</div>
        </div>
      )}
    </Card>
  );
});
