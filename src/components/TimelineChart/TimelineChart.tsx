import { useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ChartTooltip } from '../ChartTooltip';
import styles from './TimelineChart.module.css';

export type TimelineTone = 'default' | 'danger' | 'pending';

export interface TimelineItem {
  key: string;
  /** Left column, first line - e.g. the shipment code. */
  label: ReactNode;
  /** Left column, second line - e.g. the route. */
  sublabel?: ReactNode;
  /** The trip itself: from `start` (pickup) to `end` (ETA or arrival). */
  start: string | Date;
  end: string | Date;
  /** The delivery window, drawn behind the trip as a recessed band. */
  window?: { start: string | Date; end: string | Date };
  /** `default` - on its way; `danger` - will miss its window; `pending` -
   * not departed yet (paler). */
  tone?: TimelineTone;
  /** Makes the row a button - e.g. open the shipment. */
  onSelect?: () => void;
}

export interface TimelineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: TimelineItem[];
  /** The visible time span. Defaults to every item's times, padded to whole
   * hours. */
  range?: { start: string | Date; end: string | Date };
  /** Where the "now" line sits. Defaults to the current time. */
  now?: Date;
  /** Formats times in the axis and the tooltip. */
  timeFormatter?: (d: Date) => string;
  'aria-label': string;
}

const HOUR = 3_600_000;
const time = (v: string | Date) => (v instanceof Date ? v : new Date(v)).getTime();
// 24-hour: the dispatch norm here, and shorter on the axis.
const defaultFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/**
 * Trips across time (owner, 2026-09-30) - one row per item, a glass bar from
 * its start to its end over a recessed band for its delivery window, a "now"
 * line through every row. A bar that runs past its window is `danger`. Same
 * glass as the other charts (src/glass.css). Built in code first; the Figma
 * master follows from docs/components/TimelineChart.md.
 *
 * Drawn in HTML, not SVG, so the glass is the same CSS recipe as the
 * progress pill - no filters to rasterise.
 */
export function TimelineChart({
  items,
  range,
  now = new Date(),
  timeFormatter = (d) => defaultFormat.format(d),
  className,
  'aria-label': ariaLabel,
  ...rest
}: TimelineChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const span = useMemo(() => {
    if (range) return { start: time(range.start), end: time(range.end) };
    const all = items.flatMap((it) => [time(it.start), time(it.end), ...(it.window ? [time(it.window.start), time(it.window.end)] : [])]);
    all.push(now.getTime());
    const min = Math.floor(Math.min(...all) / HOUR) * HOUR;
    const max = Math.ceil(Math.max(...all) / HOUR) * HOUR;
    return { start: min, end: Math.max(max, min + HOUR) };
  }, [items, range, now]);

  const width = span.end - span.start;
  const pct = (t: number) => `${(((Math.min(Math.max(t, span.start), span.end) - span.start) / width) * 100).toFixed(3)}%`;
  const len = (a: number, b: number) =>
    `${(((Math.min(b, span.end) - Math.max(a, span.start)) / width) * 100).toFixed(3)}%`;

  // Axis ticks every 3 hours (or 6 when the span is long), on whole hours.
  const step = (width > 30 * HOUR ? 6 : 3) * HOUR;
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let t = Math.ceil(span.start / step) * step; t <= span.end; t += step) out.push(t);
    return out;
  }, [span, step]);

  // Midnights inside the span get a day label ("Thu"), so a span that
  // crosses into tomorrow reads as such.
  const midnights = useMemo(() => {
    const out: number[] = [];
    const d = new Date(span.start);
    d.setHours(24, 0, 0, 0);
    for (; d.getTime() < span.end; d.setDate(d.getDate() + 1)) out.push(d.getTime());
    return out;
  }, [span]);
  const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short' });

  const nowShown = now.getTime() >= span.start && now.getTime() <= span.end;

  // Times off today carry their weekday - an ETA of "11:48" is ambiguous
  // when the trip ends tomorrow.
  const when = (ms: number) => {
    const d = new Date(ms);
    return d.toDateString() === now.toDateString() ? timeFormatter(d) : `${weekdayFormat.format(d)} ${timeFormatter(d)}`;
  };

  // A span names its day once: "Thu 09:48–13:48", not "Thu 09:48–Thu 13:48".
  const span2 = (a: number, b: number) =>
    new Date(a).toDateString() === new Date(b).toDateString()
      ? `${when(a)}–${timeFormatter(new Date(b))}`
      : `${when(a)}–${when(b)}`;

  // The "Now" flag sits on the axis; a tick close to it would sit under the
  // flag, so it keeps its gridline but drops its label. "Close" is a share
  // of the tick spacing, not a fixed hour: with 6-hour ticks on a narrow
  // card, 1.3 hours away still collided (owner, 2026-09-30).
  const nearNow = (t: number) => nowShown && Math.abs(t - now.getTime()) < step * 0.3;

  return (
    <div className={cn(styles.chart, className)} role="group" aria-label={ariaLabel} {...rest}>
      {/* Axis */}
      <div className={styles.axisRow} aria-hidden="true">
        <span />
        <div className={styles.axis}>
          {ticks.map((t) => (
            <span key={t} className={styles.tick} style={{ left: pct(t) }}>
              {nearNow(t) ? null : timeFormatter(new Date(t))}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.rows}>
        {/* Guides behind every row: hour gridlines, midnights, now. */}
        <div className={styles.guides} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className={styles.gridline} style={{ left: pct(t) }} />
          ))}
          {midnights.map((t) => (
            <span key={t} className={styles.midnight} style={{ left: pct(t) }}>
              <span className={styles.dayLabel}>{weekdayFormat.format(new Date(t))}</span>
            </span>
          ))}
          {nowShown && (
            <span className={styles.now} style={{ left: pct(now.getTime()) }}>
              <span className={styles.nowLabel}>Now</span>
            </span>
          )}
        </div>

        {items.map((it, i) => {
          const s = time(it.start);
          const e = time(it.end);
          const summary = [
            `Pickup ${when(s)}`,
            `ETA ${when(e)}`,
            it.window ? `window ${span2(time(it.window.start), time(it.window.end))}` : null,
            it.tone === 'danger' ? 'will miss its window' : null,
          ]
            .filter(Boolean)
            .join(', ');
          const Row = it.onSelect ? 'button' : 'div';
          return (
            <Row
              key={it.key}
              type={it.onSelect ? 'button' : undefined}
              className={styles.row}
              data-selectable={it.onSelect ? '' : undefined}
              data-hovered={hovered === it.key || undefined}
              onClick={it.onSelect}
              onPointerEnter={() => setHovered(it.key)}
              onPointerLeave={() => setHovered((k) => (k === it.key ? null : k))}
              onFocus={() => setHovered(it.key)}
              onBlur={() => setHovered((k) => (k === it.key ? null : k))}
              aria-label={it.onSelect ? `${typeof it.label === 'string' ? it.label : ''}, ${summary}` : undefined}
              style={{ '--i': i } as CSSProperties}
            >
              <span className={styles.labels}>
                <span className={styles.label}>{it.label}</span>
                {it.sublabel != null && <span className={styles.sublabel}>{it.sublabel}</span>}
              </span>
              <span className={styles.track}>
                {it.window && (
                  <span
                    className={styles.window}
                    style={{ left: pct(time(it.window.start)), width: len(time(it.window.start), time(it.window.end)) }}
                  />
                )}
                <span
                  className={styles.bar}
                  data-tone={it.tone ?? 'default'}
                  style={{ left: pct(s), width: len(s, e) }}
                />
                {hovered === it.key && (
                  <ChartTooltip
                    title={typeof it.label === 'string' ? it.label : 'Trip'}
                    rows={[
                      { key: 'pickup', label: 'Pickup', value: when(s), color: 'var(--color-text-subtle)' },
                      { key: 'eta', label: 'ETA', value: when(e), color: it.tone === 'danger' ? 'var(--color-chart-severity-critical)' : 'var(--color-chart-1)' },
                      ...(it.window
                        ? [{ key: 'window', label: 'Window', value: span2(time(it.window.start), time(it.window.end)), color: 'var(--color-chart-window)' }]
                        : []),
                    ]}
                    // Centred on the ETA, but opening inward near either end
                    // so it never runs off the card.
                    style={{
                      left: pct(e),
                      top: 0,
                      whiteSpace: 'nowrap',
                      transform: `translate(${(e - span.start) / width > 0.75 ? '-100%' : (e - span.start) / width < 0.25 ? '0%' : '-50%'}, calc(-100% - 0.5rem))`,
                    }}
                  />
                )}
              </span>
            </Row>
          );
        })}
      </div>

      {/* Screen-reader twin: the same trips as a table. */}
      {/* Hidden in a div, not on the table: a table won't shrink below its
          rows, so a 1px table still stretched the page's scroll height. */}
      <div className={styles.srOnlyTable}>
        <table>
          <caption>{ariaLabel}</caption>
          <tbody>
            {items.map((it) => (
              <tr key={it.key}>
                <th scope="row">{it.label}</th>
                <td>{when(time(it.start))}</td>
                <td>{when(time(it.end))}</td>
                <td>{it.tone === 'danger' ? 'late' : 'on time'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
