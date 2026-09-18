import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { WarningIcon } from '../HelperText/WarningIcon';
import styles from './TableCellText.module.css';

export interface TableCellTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Decorative — not focusable. */
  icon?: ReactNode;
  title: ReactNode;
  supporting?: ReactNode;
  /** `default` (subtle, for secondary column values) · `strong` (for a row's primary identifier, e.g. an ID column). */
  emphasis?: 'default' | 'strong';
  /** Trailing 16px warning glyph — a fact about the value itself (e.g. a date that's expiring soon), not an interaction state. Reuses `HelperText`'s own warning triangle, colored `color.icon.warning-strong` to match `SeverityBadge`'s "attention" level. */
  alert?: boolean;
}

/**
 * Icon + title + supporting-text, the dominant `TableCell` content shape.
 * The Figma reference splits this into two separate variants (`text`/
 * `textStrong`) purely because Figma can't parameterize a variant's color —
 * in code that's just an `emphasis` prop on one component, no reason to
 * duplicate the structure.
 */
export const TableCellText = forwardRef<HTMLDivElement, TableCellTextProps>(function TableCellText(
  { icon, title, supporting, emphasis = 'default', alert, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.root, className)} {...rest}>
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.body}>
        <p className={styles.title} data-emphasis={emphasis}>
          {title}
        </p>
        {supporting != null && <p className={styles.supporting}>{supporting}</p>}
      </div>
      {alert && (
        <span className={styles.alert} aria-hidden="true">
          <WarningIcon />
        </span>
      )}
    </div>
  );
});
