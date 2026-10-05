import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Tile } from '../Tile';
import styles from './TableCard.module.css';

export interface TableCardField {
  /** The column's header. */
  label: ReactNode;
  /** The cell's content, as the table draws it. */
  value: ReactNode;
}

export interface TableCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The row's identity - the table's primary cell. */
  title: ReactNode;
  /** Before the title - a selection `Checkbox`. */
  leading?: ReactNode;
  /** Top right - the row's actions. */
  trailing?: ReactNode;
  /** The row's other cells, two to a line under the title. */
  fields?: TableCardField[];
  /** A real fact about the row, as `TableRow`'s `status`. */
  status?: 'danger' | 'success';
  selected?: boolean;
  /** The whole card opens the row. */
  interactive?: boolean;
}

/**
 * One table row on the phone tier (owner, 2026-10-05), inside `Table cards`:
 * the primary cell as the title, the other cells as label over value, two
 * to a line. A `Tile`, so it sits on the table's card like the task tiles.
 */
export const TableCard = forwardRef<HTMLElement, TableCardProps>(function TableCard(
  { title, leading, trailing, fields = [], status, selected = false, interactive = false, className, ...rest },
  ref,
) {
  return (
    <Tile
      as="article"
      ref={ref}
      interactive={interactive}
      padding="md"
      className={cn(styles.card, className)}
      data-status={status}
      data-selected={selected || undefined}
      {...rest}
    >
      <div className={styles.top}>
        {leading != null && <div className={styles.leading}>{leading}</div>}
        <div className={styles.title}>{title}</div>
        {trailing != null && <div className={styles.trailing}>{trailing}</div>}
      </div>
      {fields.length > 0 && (
        <dl className={styles.fields}>
          {fields.map((field, i) => (
            <div key={i} className={styles.field}>
              <dt className={styles.label}>{field.label}</dt>
              <dd className={styles.value}>{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Tile>
  );
});
