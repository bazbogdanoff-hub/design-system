import { forwardRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconCell } from '../IconCell';
import { SeverityBadge, type SeverityLevel } from '../SeverityBadge';
import { Tile } from '../Tile';
import styles from './TaskTile.module.css';

export type TaskTileLayout = 'card' | 'row';

export interface TaskTileProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `card` (default) - badge and action on top, title and description
   * below, fills the height its grid cell gives it. `row` - one line:
   * position, title, badge, action; for the List view. */
  layout?: TaskTileLayout;
  severity: SeverityLevel;
  title: ReactNode;
  /** Card layout only. Clamped to three lines. */
  description?: ReactNode;
  /** Row layout only - the task's rank, shown in a small tile at the start. */
  position?: number;
  /** Top-right in `card`, end of the line in `row` - usually an arrow
   * `IconButton` (`md`, secondary) that opens the task. */
  action?: ReactNode;
  /** Opens the task - the whole tile becomes the control: click, or Enter /
   * Space when focused. An `action` inside keeps its own click (it doesn't
   * also trigger this). */
  onOpen?: () => void;
}

/**
 * A task on the Tasks board - a `Tile` (the second-layer card, owner
 * 2026-09-29), interactive: it lifts on hover. Built in code first; the
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
  { layout = 'card', severity, title, description, position, action, onOpen, className, ...rest },
  ref,
) {
  // The whole tile opens the task (owner, 2026-09-29). A click that started
  // on a button or link inside (the row's action) is that control's own.
  const openProps = onOpen
    ? {
        role: 'link' as const,
        tabIndex: 0,
        'data-openable': '',
        onClick: (e: MouseEvent<HTMLElement>) => {
          const inner = (e.target as HTMLElement).closest('button, a');
          if (inner && e.currentTarget.contains(inner)) return;
          onOpen();
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        },
      }
    : {};

  if (layout === 'row') {
    return (
      <Tile as="article" interactive ref={ref} className={cn(styles.tile, styles.row, className)} data-layout="row" {...openProps} {...rest}>
        {position != null && (
          <IconCell size="md" aria-label={`Rank ${position}`}>
            {position}
          </IconCell>
        )}
        <h3 className={styles.rowTitle}>{title}</h3>
        <SeverityBadge level={severity} size="sm" />
        {action}
      </Tile>
    );
  }

  return (
    <Tile as="article" interactive ref={ref} className={cn(styles.tile, styles.card, className)} data-layout="card" {...openProps} {...rest}>
      <div className={styles.top}>
        <SeverityBadge level={severity} size="sm" />
        {action}
      </div>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {description != null && <p className={styles.description}>{description}</p>}
      </div>
    </Tile>
  );
});
