import { forwardRef, type TdHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './TableCell.module.css';

export type TableCellWidth = 'checkbox' | 'radio' | 'icon' | 'wide';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align' | 'width'> {
  /** `start` (default) · `center` · `end`. */
  align?: 'start' | 'center' | 'end';
  /**
   * Column width role.
   * - `checkbox` / `radio` / `icon` — fixed 48px control column
   * - `wide` — text column with a higher min-width (e.g. Model)
   * - omit — hug content on one line (never wraps mid-value)
   */
  width?: TableCellWidth;
}

/**
 * A `<td>` — deliberately just a padded, transparent box. `TableRow` is what
 * carries visible row color (default/hover/danger/success); a `TableCell`
 * with its own opaque fill would hide every one of those states underneath
 * it (the exact bug this had in Figma before the fill was removed — see
 * TableRow.md). Composes directly with existing components for the common
 * shapes (`<TableCell><Badge .../></TableCell>`, `<Button>`, `<IconButton>`)
 * rather than a `content` prop enumerating every possible shape the way the
 * Figma reference has to — `TableCellText` and `TableProgressStages` are the
 * two shapes here that needed real new code, not just composition.
 *
 * Children sit in an inner `.fill` flex box. When `Table` locks
 * `--table-row-height`, that fill is absolutely positioned so cell content
 * cannot force the row taller than its share of the content area (CSS tables
 * otherwise treat content height as a hard minimum).
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = 'start', width, className, children, ...rest },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn(styles.cell, className)}
      data-align={align}
      data-width={width}
      {...rest}
    >
      <div className={styles.fill}>{children}</div>
    </td>
  );
});
