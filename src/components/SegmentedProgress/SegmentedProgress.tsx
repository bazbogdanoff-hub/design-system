import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './SegmentedProgress.module.css';

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** How many segments are filled. Clamped into `[0, max]`. */
  value: number;
  /** How many segments there are — one per counted thing (e.g. one per task),
   * not a percentage. Segments share the width equally, so a very large
   * `max` makes them thin; this is for counts, not for ratios. */
  max: number;
};

/** An accessible name is required — same pattern as `ProgressBar`. */
export type SegmentedProgressProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * Progress as a row of equal segments, one per counted item — the tasks
 * header's "11 / 36". Filled segments wear the primary Button's glass (fill,
 * 1px catch, inner shadow, drop shadow); empty ones are flat
 * `surface.recessed`. 16px tall, `radius.md` (6) corners, 2px apart.
 *
 * Built in code first (owner, 2026-09-28) — the Figma master follows.
 * Not `ProgressBar`, which is a continuous track + fill for ratios and time.
 */
export const SegmentedProgress = forwardRef<HTMLDivElement, SegmentedProgressProps>(
  function SegmentedProgress({ value, max, className, ...rest }, ref) {
    const count = Math.max(0, Math.floor(max));
    const filled = Math.min(count, Math.max(0, Math.floor(value)));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={filled}
        aria-valuemin={0}
        aria-valuemax={count}
        className={cn(styles.row, className)}
        {...rest}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={styles.segment} data-filled={i < filled || undefined} aria-hidden="true" />
        ))}
      </div>
    );
  },
);
