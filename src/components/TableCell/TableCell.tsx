import { forwardRef, type TdHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './TableCell.module.css';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** `start` (default) · `center` · `end`. */
  align?: 'start' | 'center' | 'end';
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
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = 'start', className, ...rest },
  ref,
) {
  return <td ref={ref} className={cn(styles.cell, className)} data-align={align} {...rest} />;
});
