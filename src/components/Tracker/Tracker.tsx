import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Tracker.module.css';

export type TrackerUrgency =
  | { mode: 'countdown'; remainingSeconds: number; totalSeconds: number }
  /** `startAt` (e.g. when the problem was detected) gives the track its
   * left end: the bar then fills with the time used of the window. */
  | { mode: 'scheduled'; dueAt: Date | string; startAt?: Date | string }
  | { mode: 'asap' }
  /** Finished: no clock left to run (owner, 2026-10-06: a closed task kept
   * counting "Overdue 866h"). */
  | { mode: 'done'; doneAt?: Date | string | null; startAt?: Date | string };

export interface TrackerProps {
  urgency: TrackerUrgency;
  /** Forces danger regardless of the time-based escalation below - e.g. a
   * flagged critical/blocking task. Wins over everything, including `asap`.
   * Ignored once `done`. */
  important?: boolean;
  /** Names the track's left end. Default "Detected". */
  startLabel?: string;
  /** Names the right end. Default "Due". */
  dueLabel?: string;
  /** One line under the track: what the deadline is ("Next checkpoint ·
   * Koroszczyn"). */
  context?: ReactNode;
  /** Formats the ends' times. Default: "Sep 30, 13:48". */
  timeFormatter?: (d: Date) => string;
  className?: string;
}

/** The track's material, by situation: Prism when calm, the severity
 * glass when it isn't, emerald once done. */
type Tone = 'brand' | 'warning' | 'danger' | 'done';

/** Whichever trips first: proportion of the window gone, or an absolute
 * floor - a task can have plenty of window left by ratio and still be
 * genuinely urgent in absolute terms (or vice versa on a short window). */
function countdownTone(remainingSeconds: number, totalSeconds: number): Tone {
  if (remainingSeconds <= 0) return 'danger';
  const ratio = remainingSeconds / totalSeconds;
  if (ratio <= 0.2 || remainingSeconds <= 300) return 'danger';
  if (ratio <= 0.5 || remainingSeconds <= 1800) return 'warning';
  return 'brand';
}

/** No ratio branch on purpose without a start: a scheduled task with no
 * window start has no honest "total" to measure against, so only the
 * absolute floors apply. With one, a window four-fifths gone warns too. */
function scheduledTone(secondsUntilDue: number, usedRatio: number | null): Tone {
  if (secondsUntilDue <= 300) return 'danger';
  if (secondsUntilDue <= 1800 || (usedRatio != null && usedRatio >= 0.8)) return 'warning';
  return 'brand';
}

/** Absolute duration as count-only text (no words). */
function formatDuration(absSeconds: number): string {
  const s = Math.max(0, Math.floor(absSeconds));
  if (s >= 86400 * 2) return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`;
  if (s >= 3600) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  if (s >= 60) return `${Math.floor(s / 60)}m`;
  return `${s}s`;
}

/** Countdown under an hour keeps ticking seconds on the figure. */
function formatCountdownValue(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  if (s >= 3600) return formatDuration(s);
  if (s >= 60) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
  return `${s}s`;
}

const defaultTime = (d: Date) =>
  `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })}`;

const toDate = (v: Date | string) => (typeof v === 'string' ? new Date(v) : v);

/** Re-renders on an interval so time-derived text and tone stay live
 * without the consumer re-rendering - `null` stops the ticking. */
function useTick(intervalMs: number | null) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (intervalMs == null) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

/**
 * How much time a task has (owner, 2026-10-06: the deadline card). A small
 * label, the figure in the default text colour, and a time track: a
 * recessed well from the window's start to its deadline, a glass bar
 * filling with the time used. Only the bar's material carries the
 * situation - Prism when calm, warning or danger glass when it isn't,
 * emerald once done. Past the deadline the bar runs on to now and a notch
 * marks where the deadline was. The ends and an optional context line sit
 * under it. Sits on a Card; see docs/components/Tracker.md.
 */
export function Tracker({
  urgency,
  important = false,
  startLabel = 'Detected',
  dueLabel = 'Due',
  context,
  timeFormatter = defaultTime,
  className,
}: TrackerProps) {
  // A countdown shows seconds under an hour; scheduled only needs to notice
  // the minutes passing; asap and done have nothing to tick.
  useTick(urgency.mode === 'countdown' ? 1000 : urgency.mode === 'scheduled' ? 30_000 : null);

  // `remainingSeconds` is a snapshot as of whenever the consumer last had
  // real data - tick it down locally from the moment it arrived.
  const baseRef = useRef({ remaining: 0, capturedAt: Date.now() });
  if (urgency.mode === 'countdown' && baseRef.current.remaining !== urgency.remainingSeconds) {
    baseRef.current = { remaining: urgency.remainingSeconds, capturedAt: Date.now() };
  }

  const now = new Date();
  let label: string;
  let value: string;
  let tone: Tone;
  let fill = 100; // % of the track
  let notch: number | null = null; // % where the deadline sits, once passed
  const ends: { label: string; at: Date }[] = [];
  let passed: string | null = null; // the deadline, once the track has run past it

  if (urgency.mode === 'asap') {
    label = 'Priority';
    value = 'As soon as possible';
    tone = important ? 'danger' : 'brand';
  } else if (urgency.mode === 'done') {
    const doneAt = urgency.doneAt ? toDate(urgency.doneAt) : null;
    const startAt = urgency.startAt ? toDate(urgency.startAt) : null;
    // How long it took, when both ends are known: the dates sit under the
    // track, so the figure doesn't repeat one.
    label = doneAt && startAt ? 'Closed after' : doneAt ? 'Closed' : 'Status';
    value = doneAt && startAt ? formatDuration((doneAt.getTime() - startAt.getTime()) / 1000) : doneAt ? timeFormatter(doneAt) : 'Done';
    tone = 'done';
    if (urgency.startAt) ends.push({ label: startLabel, at: toDate(urgency.startAt) });
    if (doneAt) ends.push({ label: 'Closed', at: doneAt });
  } else if (urgency.mode === 'countdown') {
    const elapsed = (Date.now() - baseRef.current.capturedAt) / 1000;
    const remaining = baseRef.current.remaining - elapsed;
    tone = important ? 'danger' : countdownTone(remaining, urgency.totalSeconds);
    label = remaining <= 0 ? 'Overdue' : 'Time left';
    value = remaining <= 0 ? formatDuration(-remaining) : formatCountdownValue(remaining);
    fill = Math.max(0, Math.min(100, (1 - remaining / urgency.totalSeconds) * 100));
  } else {
    const due = toDate(urgency.dueAt);
    const start = urgency.startAt ? toDate(urgency.startAt) : null;
    const untilDue = (due.getTime() - now.getTime()) / 1000;
    const used =
      start && due.getTime() > start.getTime()
        ? (now.getTime() - start.getTime()) / (due.getTime() - start.getTime())
        : null;
    if (untilDue <= 0) {
      label = 'Overdue';
      value = formatDuration(-untilDue);
      tone = 'danger';
      // The track now runs from the start to now; the deadline is a notch,
      // named on its own line (the right end is now, not the deadline).
      if (start) notch = ((due.getTime() - start.getTime()) / (now.getTime() - start.getTime())) * 100;
      passed = dueLabel === 'Due' ? `Was due ${timeFormatter(due)}` : `${dueLabel} was ${timeFormatter(due)}`;
    } else {
      label = 'Due in';
      value = formatDuration(untilDue);
      tone = important ? 'danger' : scheduledTone(untilDue, used);
      fill = used == null ? 100 : Math.max(0, Math.min(100, used * 100));
    }
    if (start) ends.push({ label: startLabel, at: start });
    ends.push(passed != null && start ? { label: 'Now', at: now } : { label: dueLabel, at: due });
  }

  return (
    <div className={cn(styles.tracker, className)} data-tone={tone}>
      <div className={styles.text}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
      <div
        className={styles.track}
        role="img"
        aria-label={`${label}: ${value}${ends.map((e) => `, ${e.label.toLowerCase()} ${timeFormatter(e.at)}`).join('')}`}
      >
        <span className={styles.bar} style={{ width: `${fill.toFixed(2)}%` } as CSSProperties} />
        {notch != null && <span className={styles.notch} style={{ left: `${notch.toFixed(2)}%` }} />}
      </div>
      {ends.length > 0 && (
        <dl className={styles.ends}>
          {ends.map((e) => (
            <div key={e.label} className={styles.end}>
              <dt>{e.label}</dt>
              <dd>{timeFormatter(e.at)}</dd>
            </div>
          ))}
        </dl>
      )}
      {(passed != null || context != null) && (
        <div className={styles.notes}>
          {passed != null && <p className={styles.context}>{passed}</p>}
          {context != null && <p className={styles.context}>{context}</p>}
        </div>
      )}
    </div>
  );
}
