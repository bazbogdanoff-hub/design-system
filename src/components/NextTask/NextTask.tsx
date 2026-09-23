import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Card } from '../Card';
import { IconButton } from '../IconButton';
import { ArrowUpRightIcon } from './ArrowUpRightIcon';
import { cn } from '../../lib/cn';
import styles from './NextTask.module.css';

export interface NextTaskProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Wired to the header's "view all" `IconButton`. Omit to hide it. */
  onViewAll?: () => void;
  /** Accessible name for the "view all" trigger. */
  viewAllLabel?: string;
  /** A `<Tracker>`. */
  tracker: ReactNode;
  /** A `<TaskCard context="queue">` — the front of the queue. */
  taskCard: ReactNode;
}

/**
 * The "what's next" dashboard widget — a `Tracker` (time-left/due/asap) atop
 * the front `TaskCard` of a queue, in a `Card`. Composes both directly
 * (never detached) — L2 pattern.
 */
export const NextTask = forwardRef<HTMLDivElement, NextTaskProps>(function NextTask(
  { onViewAll, viewAllLabel = 'View all tasks', tracker, taskCard, className, ...rest },
  ref,
) {
  return (
    <Card ref={ref} padding="md" className={cn(styles.card, className)} {...rest}>
      <div className={styles.header}>
        <h3 className={styles.title}>Next task</h3>
        {onViewAll != null && (
          <IconButton variant="secondary" size="lg" icon={<ArrowUpRightIcon />} aria-label={viewAllLabel} onClick={onViewAll} />
        )}
      </div>
      <div className={styles.body}>
        {tracker}
        <div className={styles.taskFrame}>{taskCard}</div>
      </div>
    </Card>
  );
});
