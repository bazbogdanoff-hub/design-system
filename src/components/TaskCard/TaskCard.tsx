import { forwardRef, type ReactNode } from 'react';
import { Card } from '../Card';
import { IconCell } from '../IconCell';
import { Tag, type TagColor } from '../Tag';
import { SeverityBadge, type SeverityLevel } from '../SeverityBadge';
import { cn } from '../../lib/cn';
import styles from './TaskCard.module.css';

export interface TaskCardProps {
  /** `list` (default) — standalone, used on the tasks page, no stack.
   * `queue` — wrapped in the 3-ghost stacked-deck effect, used inside
   * `NextTask` where this card is the front of a queue. */
  context?: 'list' | 'queue';
  /** Queue position for the leading cell — formatted as `#${position}`.
   * Always `1` for `context="queue"` (`NextTask` only ever shows the front
   * task); a real, varying number for `context="list"`. */
  position: number;
  /** The category tag sitting above the title. */
  category: { label: ReactNode; color: TagColor };
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
  const content = (
    <div className={styles.shadow}>
      <Card padding="md" className={styles.card}>
        <div className={styles.header}>
          <IconCell size="2xl">{`#${position}`}</IconCell>
          <div className={styles.titleGroup}>
            <Tag size="xs" color={category.color}>
              {category.label}
            </Tag>
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

  if (context === 'list') {
    return (
      <div ref={ref} className={cn(styles.taskCard, className)}>
        {content}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(styles.taskCard, styles.queue, className)}>
      <div className={cn(styles.ghost, styles.ghost3)} aria-hidden="true" />
      <div className={cn(styles.ghost, styles.ghost2)} aria-hidden="true" />
      <div className={cn(styles.ghost, styles.ghost1)} aria-hidden="true" />
      {content}
    </div>
  );
});
