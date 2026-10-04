import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './DayDivider.module.css';

export interface DayDividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** "Today", "Yesterday", "Monday 28 September" - pre-formatted. */
  children: ReactNode;
  /** `light` (default) on the page canvas; `dark` in the dark app-frame card. */
  surface?: 'light' | 'dark';
}

/**
 * Between days in a conversation (owner, 2026-10-01): a small pill two steps
 * darker than what it sits on - 10% black over it, so it follows the
 * surface - centred in a row that keeps 8 above and below. Inside a thread
 * with an 8 gap, that holds it 16 off the messages either side.
 */
export const DayDivider = forwardRef<HTMLDivElement, DayDividerProps>(function DayDivider(
  { children, surface = 'light', className, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="separator" className={cn(styles.row, className)} data-on={surface} {...rest}>
      <span className={styles.pill}>{children}</span>
    </div>
  );
});
