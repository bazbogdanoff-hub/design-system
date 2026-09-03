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
  /** The drill-down row — `<StatButton>`s. They share the width evenly. */
  children?: ReactNode;
}

/**
 * A dashboard summary card (L2) — a `Card` holding a headline stat, an optional
 * trend `badge`, and a row of `StatButton`s. Composes `Card` (padding `lg`).
 * See docs/components/StatCard.md.
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(function StatCard(
  { label, value, badge, children, className, ...rest },
  ref,
) {
  return (
    <Card ref={ref} padding="lg" className={cn(styles.card, className)} {...rest}>
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
