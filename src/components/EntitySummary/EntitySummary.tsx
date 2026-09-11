import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import { Badge } from '../Badge';
import styles from './EntitySummary.module.css';

export interface EntitySummaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** The entity's icon, shown in a clickable primary `IconButton`. */
  icon: ReactNode;
  /** Accessible name for the icon trigger — required, since unlike a decorative `IconCell` this is a real button that navigates to the entity's own page. */
  iconLabel: string;
  /** Click handler for the icon trigger — wire this to navigation. */
  onIconClick?: MouseEventHandler<HTMLButtonElement>;
  heading: ReactNode;
  description: ReactNode;
  /** Shown in a trailing brand `Badge` (e.g. "4 issues left"). */
  count: ReactNode;
}

/**
 * A clickable entity icon (→ that entity's own page) + heading/description +
 * a trailing count `Badge`, on a brand-tinted background. Extracted from
 * `RigProblemDetail`, where it appeared 3× identically (one per truck/
 * trailer/driver column).
 *
 * Deliberately **not** built on `Row`, despite the visual resemblance
 * ([leading] [heading+description] [trailing]) — three real differences:
 * the leading icon is an interactive `IconButton` here (`Row.leading` is
 * locked to a decorative `IconCell` on purpose), the background is always
 * filled (`Row` never fills by default), and the trailing slot is always
 * exactly one count `Badge`, not `Row`'s flexible `status`/`action` pair.
 * See docs/components/EntitySummary.md.
 */
export const EntitySummary = forwardRef<HTMLDivElement, EntitySummaryProps>(function EntitySummary(
  { icon, iconLabel, onIconClick, heading, description, count, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.summary, className)} {...rest}>
      <IconButton variant="primary" size="lg" aria-label={iconLabel} icon={icon} onClick={onIconClick} />
      <div className={styles.text}>
        <p className={styles.heading}>{heading}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <Badge tone="brand" size="xs" className={styles.count}>
        {count}
      </Badge>
    </div>
  );
});
