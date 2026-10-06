import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import styles from './ProgressSteps.module.css';

export interface ProgressStepEvent {
  key: string;
  /** What happened ("Scored 9.0 · critical", "Superseded"). */
  label: ReactNode;
  /** When. */
  at?: ReactNode;
}

export interface ProgressStep {
  key: string;
  /** The stage's name. */
  label: ReactNode;
  /** When it was reached. */
  at?: ReactNode;
  /** One line about how it was reached ("customs returned a tariff-code
   * mismatch"). */
  note?: ReactNode;
  /** What happened while it was the current stage. */
  events?: ProgressStepEvent[];
}

export interface ProgressStepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  steps: ProgressStep[];
  /** 0-based index of the current step. */
  current: number;
  /** Every step done, the last included (a closed problem). */
  complete?: boolean;
  'aria-label': string;
}

/**
 * Stages on a vertical rail, each with when it was reached and what
 * happened during it (owner, 2026-10-06: the task page's Progress card,
 * Stages and Timeline in one). Done steps are Prism with a check; the
 * current one is lit; steps ahead are empty wells. The rail between two
 * done steps is brand. Code first; see docs/components/ProgressSteps.md.
 */
export const ProgressSteps = forwardRef<HTMLOListElement, ProgressStepsProps>(function ProgressSteps(
  { steps, current, complete = false, className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  return (
    <ol ref={ref} className={cn(styles.steps, className)} aria-label={ariaLabel} {...rest}>
      {steps.map((step, i) => {
        const state = complete || i < current ? 'done' : i === current ? 'current' : 'ahead';
        return (
          <li
            key={step.key}
            className={styles.step}
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className={styles.disc} aria-hidden="true">
              {state === 'done' && <Check weight="bold" />}
            </span>
            <div className={styles.body}>
              <div className={styles.head}>
                <span className={styles.label}>{step.label}</span>
                {step.at != null && <span className={styles.at}>{step.at}</span>}
              </div>
              {step.note != null && <p className={styles.note}>{step.note}</p>}
              {step.events != null && step.events.length > 0 && (
                <ul className={styles.events}>
                  {step.events.map((ev) => (
                    <li key={ev.key} className={styles.event}>
                      <span className={styles.eventLabel}>{ev.label}</span>
                      {ev.at != null && <span className={styles.at}>{ev.at}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
