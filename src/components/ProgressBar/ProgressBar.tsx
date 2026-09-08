import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './ProgressBar.module.css';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarTone = 'brand' | 'success' | 'warning' | 'danger';

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Current value. Clamped into `[0, max]` — an out-of-range value never
   * over/under-fills the bar. */
  value: number;
  /** Defaults to 100, i.e. `value` is already a percentage. Pass the real
   * total instead (e.g. `totalSeconds`) rather than pre-dividing yourself. */
  max?: number;
  /** `sm` (8px) · `md` (12px, default) · `lg` (16px). */
  size?: ProgressBarSize;
  /** Semantic colour — not decorative choice. `brand` (default, neutral
   * progress) · `success` · `warning` · `danger`. */
  tone?: ProgressBarTone;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`
 * (e.g. pointing at the "Time left" label sitting next to it). Same
 * mandatory-name pattern as `IconButton`. */
export type ProgressBarProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A horizontal progress track + fill. Built on the WAI-ARIA `progressbar`
 * pattern by hand (`role="progressbar"` + `aria-value*`) rather than a
 * headless-UI dependency — the surface is small enough (no focus management,
 * no composition) that Radix's own `Progress` primitive wouldn't buy
 * anything `Slot` isn't already doing elsewhere in this system.
 *
 * Fill width is the only thing `value` controls — colour (`tone`) is a
 * fully independent signal a consumer sets from its own logic (e.g. time
 * remaining vs. a danger threshold). The two are allowed to disagree: a
 * half-full bar can be `danger` if an absolute deadline is what tripped it,
 * not the ratio. See `docs/components/ProgressBar.md`.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, max = 100, size = 'md', tone = 'brand', className, ...rest },
  ref,
) {
  const clampedMax = Math.max(0, max);
  const clampedValue = Math.min(clampedMax, Math.max(0, value));
  const percent = clampedMax > 0 ? (clampedValue / clampedMax) * 100 : 0;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={clampedMax}
      className={cn(styles.track, className)}
      data-size={size}
      {...rest}
    >
      <div className={styles.fill} data-tone={tone} style={{ width: `${percent}%` }} />
    </div>
  );
});
