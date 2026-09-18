import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './SegmentedControl.module.css';

export type SegmentedControlSize = 'sm' | 'md' | 'lg' | 'xs';

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `sm` · `md` (default) · `lg` — the same height scale as `Button`
   * (`size.control.*`), since this sits alongside buttons/filters in a
   * toolbar. `xs` is a distinct track recipe (transparent, no padding, no
   * track radius — each item carries its own edge rounding via `position`)
   * for the sidebar module switcher only. Cascades to every
   * `SegmentedControlItem` inside. */
  size?: SegmentedControlSize;
  /** `xs`-only: the sidebar's own collapsed/expanded state — shrinks every
   * item's height from 24 to 16. No effect at any other size. */
  collapsed?: boolean;
  /** `SegmentedControlItem`s. */
  children: ReactNode;
}

/**
 * A track of mutually-exclusive options — "choose exactly one of N visible
 * choices" (e.g. List/Grid/Map). Not `Switch` (a single boolean toggle) and
 * not `Tab` (page navigation) — a distinct control, named to avoid colliding
 * with either.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { size = 'md', collapsed, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="radiogroup"
      className={cn(styles.track, className)}
      data-size={size}
      data-collapsed={size === 'xs' ? collapsed || false : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});
