import { useEffect, useRef, useState } from 'react';
import { ProgressBar, type ProgressBarTone } from '../ProgressBar';
import { cn } from '../../lib/cn';
import styles from './Tracker.module.css';

export type TrackerUrgency =
  | { mode: 'countdown'; remainingSeconds: number; totalSeconds: number }
  | { mode: 'scheduled'; dueAt: Date | string }
  | { mode: 'asap' };

export interface TrackerProps {
  urgency: TrackerUrgency;
  /** Forces danger regardless of the time-based escalation below — e.g. a
   * flagged critical/blocking task. Wins over everything, including `asap`. */
  important?: boolean;
  className?: string;
}

type Tone = 'good' | 'warning' | 'danger';

/** Whichever trips first: proportion of the window gone, or an absolute
 * floor — a task can have plenty of window left by ratio and still be
 * genuinely urgent in absolute terms (or vice versa on a short window). */
function countdownTone(remainingSeconds: number, totalSeconds: number): Tone {
  if (remainingSeconds <= 0) return 'danger';
  const ratio = remainingSeconds / totalSeconds;
  if (ratio <= 0.2 || remainingSeconds <= 300) return 'danger';
  if (ratio <= 0.5 || remainingSeconds <= 1800) return 'warning';
  return 'good';
}

/** No ratio branch here on purpose — a scheduled task has no honest "total"
 * to measure against (no assumed created-at timestamp), so only the
 * absolute floors apply. See docs/components/Tracker.md. */
function scheduledTone(secondsUntilDue: number): Tone {
  if (secondsUntilDue <= 0) return 'danger';
  if (secondsUntilDue <= 300) return 'danger';
  if (secondsUntilDue <= 1800) return 'warning';
  return 'good';
}

function formatOverdue(overSeconds: number): string {
  const over = Math.abs(overSeconds);
  if (over >= 3600) return `Overdue by ${Math.floor(over / 3600)}h ${Math.floor((over % 3600) / 60)}m`;
  if (over >= 60) return `Overdue by ${Math.floor(over / 60)}m`;
  return 'Overdue';
}

/** Seconds -> the coarsest honest label. Seconds only matter under an hour. */
function formatCountdown(seconds: number): string {
  if (seconds <= 0) return formatOverdue(seconds);
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m left`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${String(s).padStart(2, '0')}s left`;
  }
  return `${Math.floor(seconds)}s left`;
}

/** Tightens to relative countdown-style text under the same 1-hour mark
 * where scheduledTone can first escalate — an exact clock time stops being
 * useful once the deadline is imminent. */
function formatDue(dueAt: Date, now: Date): string {
  const diffSeconds = (dueAt.getTime() - now.getTime()) / 1000;
  if (diffSeconds <= 0) return formatOverdue(diffSeconds);
  if (diffSeconds < 3600) return `Due in ${Math.max(1, Math.round(diffSeconds / 60))}m`;

  const time = dueAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (dueAt.toDateString() === now.toDateString()) return `Today ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (dueAt.toDateString() === tomorrow.toDateString()) return `Tomorrow ${time}`;
  return `${dueAt.toLocaleDateString(undefined, { weekday: 'short' })} ${time}`;
}

// countdown-good -> success (an actively healthy countdown); scheduled's
// calm state -> brand (a neutral "on the books" identity, not a countdown —
// deliberately a different color from countdown-good even though both are
// "fine," because they mean different things); asap's calm state -> brand
// too, distinct from every danger state so "immediate" isn't confused with
// "about to expire" — unless `important` is set, which wins over everything
// including asap (see TrackerProps.important) and turns it danger like any
// other mode. No dedicated 5th tone was added for asap — reuses what
// already exists on ProgressBar. See docs/components/Tracker.md.
function progressTone(mode: TrackerUrgency['mode'], tone: Tone): ProgressBarTone {
  if (tone === 'danger') return 'danger';
  if (tone === 'warning') return 'warning';
  return mode === 'countdown' ? 'success' : 'brand';
}

const LABEL: Record<TrackerUrgency['mode'], string> = {
  countdown: 'Time left',
  scheduled: 'Due',
  asap: 'Priority',
};

/** Re-renders on an interval so time-derived text/tone stay live without the
 * consumer re-rendering the tree — `null` disables ticking entirely (asap
 * has nothing to tick). */
function useTick(intervalMs: number | null) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (intervalMs == null) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

/**
 * The counter block for `NextTask` — a label, a hero value, and a
 * `ProgressBar` in one fixed shape across all three time modes; only the
 * track's fill amount, color, and (for `asap`) a persistent accent change.
 * See `docs/components/Tracker.md` for the full urgency-resolution table.
 */
export function Tracker({ urgency, important = false, className }: TrackerProps) {
  // countdown ticks by the second (seconds are the displayed unit below an
  // hour); scheduled only needs to notice new minutes/hours passing.
  useTick(urgency.mode === 'countdown' ? 1000 : urgency.mode === 'scheduled' ? 30_000 : null);

  // `remainingSeconds` is a snapshot as of whenever the consumer last had
  // real data — tick it down locally from the moment it arrived rather than
  // freezing it or requiring the consumer to re-render every second.
  const baseRef = useRef({ remaining: 0, capturedAt: Date.now() });
  if (urgency.mode === 'countdown' && baseRef.current.remaining !== urgency.remainingSeconds) {
    baseRef.current = { remaining: urgency.remainingSeconds, capturedAt: Date.now() };
  }

  let label: string;
  let value: string;
  let pbTone: ProgressBarTone;
  let fillPercent: number;

  if (urgency.mode === 'asap') {
    label = LABEL.asap;
    value = 'ASAP';
    pbTone = important ? 'danger' : 'brand';
    fillPercent = 100;
  } else if (urgency.mode === 'countdown') {
    const elapsed = (Date.now() - baseRef.current.capturedAt) / 1000;
    const liveRemaining = baseRef.current.remaining - elapsed;
    const tone = important ? 'danger' : countdownTone(liveRemaining, urgency.totalSeconds);
    label = LABEL.countdown;
    value = formatCountdown(liveRemaining);
    pbTone = progressTone('countdown', tone);
    fillPercent = Math.max(0, Math.min(100, (liveRemaining / urgency.totalSeconds) * 100));
  } else {
    const dueAt = typeof urgency.dueAt === 'string' ? new Date(urgency.dueAt) : urgency.dueAt;
    const now = new Date();
    const secondsUntilDue = (dueAt.getTime() - now.getTime()) / 1000;
    const tone = important ? 'danger' : scheduledTone(secondsUntilDue);
    label = LABEL.scheduled;
    value = formatDue(dueAt, now);
    pbTone = progressTone('scheduled', tone);
    fillPercent = 100;
  }

  return (
    <div className={cn(styles.tracker, className)}>
      <div className={styles.text}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value} data-tone={pbTone}>
          {value}
        </p>
      </div>
      <ProgressBar value={fillPercent} size="md" tone={pbTone} aria-label={`${label}: ${value}`} />
    </div>
  );
}
