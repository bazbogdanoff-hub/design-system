import { forwardRef, type SVGProps } from 'react';
import { cn } from '../../lib/cn';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /** `sm` (16px) · `md` (20px, default) · `lg` (24px). */
  size?: SpinnerSize;
}

/**
 * A standalone loading indicator — a rotating 3/4 arc, real pixel sizes and
 * `color.spinner.icon` (unlike `Button`'s own internal spinner, which is
 * `1em`/`currentColor` so it tracks the label it replaces). Same glyph as
 * `Button`'s, matching the Figma reference reusing the file's existing
 * "Loading" icon rather than a distinct one.
 */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { size = 'md', className, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      className={cn(styles.spinner, className)}
      data-size={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Loading"
      {...rest}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42 14"
      />
    </svg>
  );
});
