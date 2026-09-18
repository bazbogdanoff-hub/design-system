import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Tooltip.module.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Which side of its anchor this tooltip sits on — controls where the
   * arrow points from. `top` (default). */
  position?: TooltipPosition;
  children: ReactNode;
}

/**
 * The tooltip bubble itself — a dark pill + a triangle pointing back at
 * whatever it's anchored to. Presentational only, same restraint `Menu`
 * uses: no floating-UI positioning, no show/hide/hover-trigger logic — the
 * consumer positions this (typically `position: absolute` inside a
 * `position: relative` anchor) and controls when it renders.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { position = 'top', children, className, role = 'tooltip', ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.tooltip, className)} data-position={position} role={role} {...rest}>
      <span className={styles.pill}>{children}</span>
      <span className={styles.arrow} aria-hidden="true" />
    </div>
  );
});
