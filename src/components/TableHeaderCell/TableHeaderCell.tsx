import { forwardRef, type ReactNode, type ThHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { CaretUpDownIcon } from './CaretUpDownIcon';
import styles from './TableHeaderCell.module.css';

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** Whatever the column header needs — usually text, but also a select-all `Checkbox`, or nothing (a trailing overflow column). */
  children?: ReactNode;
  /** Shows the sort caret and makes the header a real clickable control. */
  sortable?: boolean;
  /** Sets `aria-sort` on the `<th>` — `'none'` (default) when this column isn't the current sort. */
  sortDirection?: 'ascending' | 'descending' | 'none';
  /** Fires on click when `sortable`. */
  onSort?: () => void;
}

/**
 * A `<th>` — real table-header semantics, not a styled `<div>`, so column
 * association (`scope="col"`) and sort state (`aria-sort`) come for free to
 * assistive tech. `sortable` wraps the content in a real `<button>` (a `<th>`
 * itself isn't interactive) so the whole label+caret is one keyboard-operable
 * target, not just the tiny icon.
 */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell(
  { children, sortable, sortDirection = 'none', onSort, className, ...rest },
  ref,
) {
  return (
    <th ref={ref} scope="col" className={cn(styles.cell, className)} aria-sort={sortable ? sortDirection : undefined} {...rest}>
      {sortable ? (
        <button type="button" className={styles.sortButton} onClick={onSort}>
          <span className={styles.label}>{children}</span>
          <CaretUpDownIcon className={styles.caret} />
        </button>
      ) : (
        children != null && <span className={styles.label}>{children}</span>
      )}
    </th>
  );
});
