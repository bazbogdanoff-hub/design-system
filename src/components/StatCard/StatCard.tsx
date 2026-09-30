import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Card } from '../Card';
import { cn } from '../../lib/cn';
import styles from './StatCard.module.css';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Headline metric name — e.g. "Blocked". */
  label: ReactNode;
  /** Headline figure — e.g. 2. */
  value: ReactNode;
  /** Optional trend / status indicator, top-right — usually a `<Badge>`. */
  badge?: ReactNode;
  /** `md` (default) — heading.xs label over a heading.xl figure, 16 to the
   * buttons. `sm` — one step down each (label.lg over heading.lg) and 12 to
   * the buttons, for a row of cards that must leave room below it (owner,
   * 2026-09-30: the dashboard's readiness strip). */
  size?: 'sm' | 'md';
  /** The drill-down row — `<StatButton>`s. They share the width evenly. */
  children?: ReactNode;
}

/**
 * A dashboard summary card (L2) — a `Card` holding a headline stat, an optional
 * trend `badge`, and a row of `StatButton`s. Composes `Card` (padding `md`).
 * See docs/components/StatCard.md.
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(function StatCard(
  { label, value, badge, size = 'md', children, className, ...rest },
  ref,
) {
  return (
    <Card ref={ref} padding="md" className={cn(styles.card, className)} data-size={size} {...rest}>
      <div className={styles.header}>
        <div className={styles.content}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
        {badge != null && <div className={styles.badge}>{badge}</div>}
      </div>
      {children != null && <div className={styles.stats}>{children}</div>}
    </Card>
  );
});
