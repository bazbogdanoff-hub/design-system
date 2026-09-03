import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './StatButton.module.css';

export type StatButtonTone = 'default' | 'danger';
export type StatButtonSize = 'sm' | 'lg';

export interface StatButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** The metric name — e.g. "Moving", "In transit". */
  label: ReactNode;
  /** The metric figure — e.g. 112. */
  value: ReactNode;
  /** `default` · `danger` (turns the value red — a figure that signals a problem). */
  tone?: StatButtonTone;
  /** `sm` (default, compact — stacks inside a card) · `lg` (prominent, can show the arrow). */
  size?: StatButtonSize;
  /** Show the "drill into the table" arrow. `lg` only — ignored on `sm`. */
  showArrow?: boolean;
}

/** ArrowUpRight — path extracted verbatim from the Figma StatButton icon. */
function ArrowUpRight() {
  return (
    <svg className={styles.arrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path
        transform="translate(4.87 4.875)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 14.25 1.13 L 14.25 10.88 C 14.25 11.17 14.13 11.46 13.92 11.67 C 13.71 11.88 13.43 12 13.13 12 C 12.83 12 12.54 11.88 12.33 11.67 C 12.12 11.46 12 11.17 12 10.88 L 12 3.84 L 1.92 13.92 C 1.71 14.13 1.43 14.25 1.13 14.25 C 0.83 14.25 0.54 14.13 0.33 13.92 C 0.12 13.71 0 13.42 0 13.12 C 0 12.83 0.12 12.54 0.33 12.33 L 10.41 2.25 L 3.38 2.25 C 3.08 2.25 2.79 2.13 2.58 1.92 C 2.37 1.71 2.25 1.42 2.25 1.13 C 2.25 0.83 2.37 0.54 2.58 0.33 C 2.79 0.12 3.08 0 3.38 0 L 13.13 0 C 13.43 0 13.71 0.12 13.92 0.33 C 14.13 0.54 14.25 0.83 14.25 1.13 Z"
      />
    </svg>
  );
}

/**
 * A stat that acts as a button — a metric (label + value) on a glass surface
 * that navigates to the sorted table for that metric. L2 pattern.
 *
 * Renders a `<button>`; drive navigation from `onClick`. States are CSS:
 * `:hover` deepens the glass shadow, `:focus-visible` / `:active` draw the focus
 * ring (identical), `disabled` dims it. See docs/components/StatButton.md.
 */
export const StatButton = forwardRef<HTMLButtonElement, StatButtonProps>(function StatButton(
  { label, value, tone = 'default', size = 'sm', showArrow = false, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.stat, className)}
      data-tone={tone}
      data-size={size}
      {...rest}
    >
      <span className={styles.content}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </span>
      {size === 'lg' && showArrow && <ArrowUpRight />}
    </button>
  );
});
