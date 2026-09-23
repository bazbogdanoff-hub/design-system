import { forwardRef, type ReactNode, type ThHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { CaretUpDownIcon } from './CaretUpDownIcon';
import styles from './TableHeaderCell.module.css';

export type TableHeaderCellWidth = 'checkbox' | 'radio' | 'icon' | 'action' | 'value' | 'timestamp' | 'wide';

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children' | 'width'> {
  /** Whatever the column header needs — usually text, but also a select-all `Checkbox`, or nothing (a trailing overflow column). */
  children?: ReactNode;
  /** Shows the sort caret and makes the header a real clickable control. */
  sortable?: boolean;
  /** Sets `aria-sort` on the `<th>` — `'none'` (default) when this column isn't the current sort. */
  sortDirection?: 'ascending' | 'descending' | 'none';
  /** Fires on click when `sortable`. */
  onSort?: () => void;
  /**
   * Column width role — must match the body cells in this column.
   * - `checkbox` / `radio` / `icon` — fixed 48px
   * - `action` — fixed 8rem, for a column whose cells hold a `Button`
   * - `value` — 7rem minimum, for a figure wider than its own header
   * - `timestamp` — 9rem minimum, for a date and time on one line
   * - `wide` — text column with a higher min-width (e.g. Model)
   * - omit — hug label on one line
   */
  width?: TableHeaderCellWidth;
}

/**
 * A `<th>` — real table-header semantics, not a styled `<div>`, so column
 * association (`scope="col"`) and sort state (`aria-sort`) come for free to
 * assistive tech. `sortable` wraps the content in a real `<button>` (a `<th>`
 * itself isn't interactive) so the whole label+caret is one keyboard-operable
 * target, not just the tiny icon.
 */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell(
  { children, sortable, sortDirection = 'none', onSort, width, className, ...rest },
  ref,
) {
  const isControlWidth = width === 'checkbox' || width === 'radio' || width === 'icon';

  return (
    <th
      ref={ref}
      scope="col"
      className={cn(styles.cell, className)}
      data-width={width}
      aria-sort={sortable ? sortDirection : undefined}
      {...rest}
    >
      {sortable ? (
        <button type="button" className={styles.sortButton} onClick={onSort}>
          <span className={styles.label}>{children}</span>
          <CaretUpDownIcon className={styles.caret} />
        </button>
      ) : isControlWidth ? (
        children
      ) : (
        children != null && <span className={styles.label}>{children}</span>
      )}
    </th>
  );
});
