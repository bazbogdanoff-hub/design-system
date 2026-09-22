import { forwardRef, type ReactNode } from 'react';
import { Card } from '../Card';
import { IconCell } from '../IconCell';
import { Tag, type TagColor } from '../Tag';
import { TooltipTrigger } from '../Tooltip';
import { SeverityBadge, type SeverityLevel } from '../SeverityBadge';
import { cn } from '../../lib/cn';
import styles from './TaskCard.module.css';

export interface TaskCardProps {
  /** `list` (default) — standalone, used on the tasks page, no stack.
   * `queue` — wrapped in the 3-ghost stacked-deck effect, used inside
   * `NextTask` where this card is the front of a queue. `tasks` — a smaller
   * standalone card (matches Figma's `context=tasks`, added for a dense
   * grid of tasks): a smaller `IconCell` and tighter internal spacing, no
   * stack. */
  context?: 'list' | 'queue' | 'tasks';
  /** Queue position for the leading cell — formatted as `#${position}`.
   * Always `1` for `context="queue"` (`NextTask` only ever shows the front
   * task); a real, varying number for `context="list"`. */
  position: number;
  /** The category tag sitting above the title. `module` (sidebar module
   * name) drives Tag color and, when set, a tooltip: `From "…"`. The tag
   * then takes keyboard focus, because the module is otherwise shown only
   * by colour — the tooltip is how anyone who can't see the colour gets it. */
  category: { label: ReactNode; color: TagColor; module?: string };
  title: ReactNode;
  description: ReactNode;
  severity: SeverityLevel;
  /** The trailing action — usually a primary `Button`. */
  action?: ReactNode;
  className?: string;
}

/**
 * A task summary card — queue-position cell, category tag, title,
 * description, severity, and a trailing action. Composes `Card`, `IconCell`,
 * `Tag`, and `SeverityBadge` (never detached) — L2 pattern. `context="queue"`
 * adds 3 decorative ghost layers behind it (aria-hidden, no content) to read
 * as "the front of a stack" — the real queue depth belongs in visible text
 * elsewhere (e.g. "+3 after this"), not in how many edges are drawn. See
 * `docs/components/TaskCard.md`.
 */
export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(function TaskCard(
  { context = 'list', position, category, title, description, severity, action, className },
  ref,
) {
  const tag = (
    <Tag size="xs" color={category.color}>
      {category.label}
    </Tag>
  );

  const content = (
    <div className={styles.shadow}>
      <Card padding="md" className={styles.card}>
        <div className={styles.header}>
          <IconCell size={context === 'tasks' ? 'xl' : '2xl'}>{`#${position}`}</IconCell>
          <div className={styles.titleGroup}>
            {category.module ? (
              <TooltipTrigger content={`From ${category.module}`} position="top">
                <Tag size="xs" color={category.color} tabIndex={0}>
                  {category.label}
                </Tag>
              </TooltipTrigger>
            ) : (
              tag
            )}
            <h3 className={styles.heading}>{title}</h3>
          </div>
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <SeverityBadge level={severity} />
          {action}
        </div>
      </Card>
    </div>
  );

  if (context === 'queue') {
    return (
      <div ref={ref} className={cn(styles.taskCard, styles.queue, className)} data-context={context}>
        <div className={cn(styles.ghost, styles.ghost3)} aria-hidden="true" />
        <div className={cn(styles.ghost, styles.ghost2)} aria-hidden="true" />
        <div className={cn(styles.ghost, styles.ghost1)} aria-hidden="true" />
        {content}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(styles.taskCard, className)} data-context={context}>
      {content}
    </div>
  );
});
