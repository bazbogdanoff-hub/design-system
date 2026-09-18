import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './TableRow.module.css';

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** A real fact about this row's data (e.g. "this rig has a critical issue") — not an interaction state. Hover and focus are handled by real CSS `:hover`/`:focus-within` on a real `<tr>`, not props; there's no `variant="header"` either, since that distinction comes from whether this row happens to render inside `Table`'s `<thead>` or `<tbody>`. */
  status?: 'danger' | 'success';
  /** This row's own leading `TableCell content="select"` checkbox/radio is
   * checked — a real fact about selection state, like `status`, not an
   * interaction state. Added to Figma's reference after `status` — see
   * `color.table.row.background.selected`. */
  selected?: boolean;
}

/**
 * A real `<tr>`. No `variant` prop for header-vs-body — `Table` places header
 * rows inside a real `<thead>` and body rows inside `<tbody>`, and this
 * component's own CSS keys off that ancestor context, the same distinction
 * the Figma reference needed a `variant` variant-property for (Figma has no
 * "this row happens to sit inside a thead" concept to key off of; real HTML
 * does). Likewise no `hover`/`active` props — a real `<tr>` gets `:hover`
 * and `:focus-within` for free, so those two of the four Figma `state`
 * values need no code-side equivalent at all.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { status, selected, className, ...rest },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={cn(styles.row, className)}
      data-status={status}
      data-selected={selected || undefined}
      {...rest}
    />
  );
});
