import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { CheckCircleIcon } from './CheckCircleIcon';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Defaults to a success-colored checkmark — override for a different context (search returned nothing, a list has no data yet, etc.). */
  icon?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
}

/**
 * A short "nothing here" state — icon + a line of text, optionally a second
 * muted line, all centered. Generic (not itself about "no issues") — the
 * default checkmark icon fits a resolved/all-clear context; pass your own
 * `icon` for others (an empty search, no data yet).
 *
 * First real use: an `EntityProblemPanel` column with zero issues.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, heading, description, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.emptyState, className)} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <CheckCircleIcon />}
      </span>
      <p className={styles.heading}>{heading}</p>
      {description != null && <p className={styles.description}>{description}</p>}
    </div>
  );
});
