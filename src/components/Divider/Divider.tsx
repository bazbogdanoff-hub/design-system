import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** `horizontal` (default, full width, 1px tall) · `vertical` (full height, 1px wide). */
  orientation?: DividerOrientation;
}

/**
 * A plain 1px rule — `color.divider.line`. A real `<hr>` (semantic
 * "thematic break"), not a styled `<div>`. Orientation just swaps which
 * dimension is 1px; sizing along the other axis is up to the consumer's
 * layout (a flex/grid parent, `width`/`height`, etc.).
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { orientation = 'horizontal', className, ...rest },
  ref,
) {
  return (
    <hr
      ref={ref}
      className={cn(styles.divider, className)}
      data-orientation={orientation}
      aria-orientation={orientation}
      {...rest}
    />
  );
});
