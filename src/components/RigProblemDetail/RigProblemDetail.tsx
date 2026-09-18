import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Modal } from '../Modal';
import { SeverityBadge, type SeverityLevel } from '../SeverityBadge';
import { cn } from '../../lib/cn';
import styles from './RigProblemDetail.module.css';

export interface RigProblemDetailProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The rig's identifier, e.g. "RG-101". Rendered beside `severity` in the
   * `Modal` header, in place of a plain text heading. */
  heading: ReactNode;
  /** The rig's overall severity, shown as a pill `SeverityBadge` next to `heading`. */
  severity: SeverityLevel;
  /** Wired to the header's close button. Omit to hide it. */
  onClose?: () => void;
  /** An `<EntityProblemPanel>` for the truck. */
  truck: ReactNode;
  /** An `<EntityProblemPanel>` for the trailer. */
  trailer: ReactNode;
  /** An `<EntityProblemPanel>` for the driver. */
  driver: ReactNode;
  /** Omit entirely to hide the footer row. */
  footer?: ReactNode;
}

/**
 * The rig detail modal — a `Modal` (`padding="sm"`) whose header pairs the
 * rig id with a `SeverityBadge`, and whose body lays 3 `EntityProblemPanel`s
 * (truck/trailer/driver) side by side in equal-width columns. Single-purpose
 * assembly for one specific interaction (unlike `Headercard` or
 * `EntityProblemPanel`, which are reused broadly) — composes `Modal` and
 * `EntityProblemPanel` directly, never detached.
 */
export const RigProblemDetail = forwardRef<HTMLDivElement, RigProblemDetailProps>(function RigProblemDetail(
  { heading, severity, onClose, truck, trailer, driver, footer, className, ...rest },
  ref,
) {
  return (
    <Modal
      ref={ref}
      padding="sm"
      onClose={onClose}
      footer={footer}
      className={cn(className)}
      heading={
        <div className={styles.heading}>
          <span>{heading}</span>
          <SeverityBadge level={severity} size="sm" format="pill" />
        </div>
      }
      {...rest}
    >
      <div className={styles.columns}>
        {truck}
        {trailer}
        {driver}
      </div>
    </Modal>
  );
});
