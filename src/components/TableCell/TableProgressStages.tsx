import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './TableProgressStages.module.css';

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Total number of stages (e.g. 5 for "Awaiting booking → Booked → En route → In repair → Completed"). */
  stageCount: number;
  /** 0-indexed. Stages at or before this are "done". */
  currentStage: number;
  caption?: ReactNode;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. Same
 * mandatory-name pattern as `ProgressBar`. */
export type TableProgressStagesProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A compact multi-stage tracker — evenly-spaced dots joined by a line, the
 * current stage enlarged. Not `ProgressBar` (that's a continuous 0–100%
 * fill) and not `Tracker` (a big time-left countdown card) — checked both
 * before building this; neither matches "discrete named stages, one of
 * which is current" so this stayed its own thing, same call made in Figma.
 */
export const TableProgressStages = forwardRef<HTMLDivElement, TableProgressStagesProps>(function TableProgressStages(
  { stageCount, currentStage, caption, className, ...rest },
  ref,
) {
  const stages = Array.from({ length: stageCount });

  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      role="progressbar"
      aria-valuenow={currentStage + 1}
      aria-valuemin={1}
      aria-valuemax={stageCount}
      {...rest}
    >
      <div className={styles.stages}>
        {stages.map((_, i) => (
          <Fragment key={i}>
            <span className={styles.dot} data-done={i <= currentStage || undefined} data-current={i === currentStage || undefined} />
            {i < stageCount - 1 && <span className={styles.line} data-done={i < currentStage || undefined} />}
          </Fragment>
        ))}
      </div>
      {caption != null && <p className={styles.caption}>{caption}</p>}
    </div>
  );
});
