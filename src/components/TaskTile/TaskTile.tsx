import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconCell } from '../IconCell';
import { SeverityBadge, type SeverityLevel } from '../SeverityBadge';
import styles from './TaskTile.module.css';

export type TaskTileLayout = 'card' | 'row';

export interface TaskTileProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `card` (default) — badge and action on top, title and description
   * below, fills the height its grid cell gives it. `row` — one line:
   * position, title, badge, action; for the List view. */
  layout?: TaskTileLayout;
  severity: SeverityLevel;
  title: ReactNode;
  /** Card layout only. Clamped to three lines. */
  description?: ReactNode;
  /** Row layout only — the task's rank, shown in a small tile at the start. */
  position?: number;
  /** Top-right in `card`, end of the line in `row` — usually an arrow
   * `IconButton` (`md`, secondary) that opens the task. */
  action?: ReactNode;
}

/**
 * A task on the Tasks board — a white tile sitting on the board's card
 * (the second surface layer, owner 2026-09-28). Built in code first; the
 * Figma master follows from docs/components/TaskTile.md.
 *
 * `card`: a top frame (small `SeverityBadge` left, action right, aligned to
 * the top), 16px below it a text frame (`heading/xs` title + `body/sm`
 * description, 6px apart) that takes the rest of the height.
 *
 * Not `TaskCard`, which is the older glass card with a category tag and a
 * rank tile, still used by `NextTask` on the dashboard.
 */
export const TaskTile = forwardRef<HTMLElement, TaskTileProps>(function TaskTile(
  { layout = 'card', severity, title, description, position, action, className, ...rest },
  ref,
) {
  if (layout === 'row') {
    return (
      <article ref={ref} className={cn(styles.tile, styles.row, className)} data-layout="row" {...rest}>
        {position != null && (
          <IconCell size="md" aria-label={`Rank ${position}`}>
            {position}
          </IconCell>
        )}
        <h3 className={styles.rowTitle}>{title}</h3>
        <SeverityBadge level={severity} size="sm" />
        {action}
      </article>
    );
  }

  return (
    <article ref={ref} className={cn(styles.tile, styles.card, className)} data-layout="card" {...rest}>
      <div className={styles.top}>
        <SeverityBadge level={severity} size="sm" />
        {action}
      </div>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {description != null && <p className={styles.description}>{description}</p>}
      </div>
    </article>
  );
});
