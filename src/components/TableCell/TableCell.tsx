import { forwardRef, type TdHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './TableCell.module.css';

export type TableCellWidth = 'checkbox' | 'radio' | 'icon' | 'action' | 'value' | 'timestamp' | 'wide';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align' | 'width'> {
  /** `start` (default) · `center` · `end`. */
  align?: 'start' | 'center' | 'end';
  /**
   * Column width role.
   * - `checkbox` / `radio` / `icon` — fixed 48px control column
   * - `action` — fixed 8rem, for a column whose cells hold a `Button`
   * - `value` — 7rem minimum, for a figure wider than its own header
   *   (money, distances, durations)
   * - `timestamp` — fixed 9rem, for a date **and** time on one line, which
   *   no short header reserves room for. Fixed rather than a minimum: its
   *   width doesn't vary, so it shouldn't take slack from a text column
   * - `wide` — text column with a 12rem minimum (e.g. Model)
   * - omit — hug content on one line (never wraps mid-value)
   *
   * Omitting it is right only when the header is at least as wide as
   * everything under it. A locked row fill takes cell content out of flow,
   * so a column with no role is sized by its header, and a longer value is
   * clipped rather than widening the column — that is what `action` and
   * `value` exist to prevent.
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
