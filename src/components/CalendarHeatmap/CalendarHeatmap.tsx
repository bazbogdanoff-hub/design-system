import { useMemo, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { ChartTooltip, type ChartTooltipRow } from '../ChartTooltip';
import { Tile } from '../Tile';
import styles from './CalendarHeatmap.module.css';

export interface CalendarHeatmapDay {
  /** Local calendar day, `YYYY-MM-DD`. */
  date: string;
  count: number;
}

export interface CalendarHeatmapLeadProps {
  /** e.g. "Lapsed" - not drawn (owner, 2026-09-30: the red count reads on
   * its own by the title); it names the square for screen readers and on
   * hover. */
  label: string;
  count: number;
  onSelect?: () => void;
  /** What the count counts, for its accessible name. */
  unit?: [singular: string, plural: string];
}

/**
 * What already fell off a CalendarHeatmap (owner, 2026-09-30) - e.g. lapsed
 * documents: a small square in the danger glass holding the count. Its own piece so it can sit in the chart card's header, by the
 * title, rather than inside the plot.
 */
export function CalendarHeatmapLead({ label, count, onSelect, unit = ['item', 'items'] }: CalendarHeatmapLeadProps) {
  const Lead = onSelect && count > 0 ? 'button' : 'span';
  return (
    <span className={styles.leadGroup}>
      <Lead
        type={Lead === 'button' ? 'button' : undefined}
        className={styles.lead}
        data-empty={count === 0 || undefined}
        onClick={onSelect}
        aria-label={`${label}: ${count} ${count === 1 ? unit[0] : unit[1]}`}
        title={label}
      >
        {count}
      </Lead>
    </span>
  );
}

export interface CalendarHeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
  /** Counts by day. Days not listed count 0. */
  days: CalendarHeatmapDay[];
  /** First day shown - earlier days of its week are left blank. Defaults to
   * today. */
  start?: Date;
  /** How many weeks, Monday to Sunday. Default 12. */
  weeks?: number;
  /** `strip` (default) - weeks run left to right as columns, weekdays down
   * the side: a long look ahead in little room. `calendar` - the weeks as
   * rows under the weekdays, like a wall calendar, each square large enough
   * to carry its day number: a few weeks, read day by day. */
  layout?: 'strip' | 'calendar';
  /** Makes a day with a count a button. */
  onSelect?: (date: string) => void;
  /** What the count counts: `['document', 'documents']`. */
  unit?: [singular: string, plural: string];
  /** Extra tooltip rows for a day - e.g. which documents. */
  detail?: (date: string) => ChartTooltipRow[];
  'aria-label': string;
}

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** 0 is empty; 1, 2, then 3 or more step the fill up to the full series
 * colour. */
const level = (n: number) => (n <= 0 ? 0 : n >= 3 ? 3 : n);

/**
 * Counts per day across the coming weeks (owner, 2026-09-30) - columns are
 * weeks, rows Monday to Sunday, a day's glass getting fuller the more falls
 * on it. Empty days sit recessed, like an empty progress segment. Built for
 * the dashboard's document expiries; what has already lapsed is the
 * separate CalendarHeatmapLead, for the card header. Same glass as the other charts (src/glass.css). Built in
 * code first; the Figma master follows from docs/components/CalendarHeatmap.md.
 */
export function CalendarHeatmap({
  days,
  start: startProp,
  weeks = 12,
  layout = 'strip',
  onSelect,
  unit = ['item', 'items'],
  detail,
  className,
  'aria-label': ariaLabel,
  ...rest
}: CalendarHeatmapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const start = useMemo(() => midnight(startProp ?? new Date()), [startProp]);
  const today = iso(midnight(new Date()));

  const counts = useMemo(() => new Map(days.map((d) => [d.date, d.count])), [days]);

  // Monday of the start's week, then `weeks` columns of seven days. Dates are
  // built from calendar fields, not by adding ms, so DST can't skew a day.
  const columns = useMemo(() => {
    const offset = (start.getDay() + 6) % 7;
    const monday = new Date(start.getFullYear(), start.getMonth(), start.getDate() - offset);
    return Array.from({ length: weeks }, (_, w) => {
      const cells = Array.from({ length: 7 }, (_, d) => {
        const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + w * 7 + d);
        return {
          date,
          key: iso(date),
          before: date.getTime() < start.getTime(),
        };
      });
      return { key: iso(monday) + w, cells };
    });
  }, [start, weeks]);

  // A week belongs to the month its Thursday falls in (the ISO rule), so each
  // month is a run of whole weeks: named once, underlined across its run.
  const months = useMemo(() => {
    const runs: { key: string; date: Date; from: number; to: number }[] = [];
    columns.forEach((col, w) => {
      const thu = col.cells[3]!.date;
      const key = `${thu.getFullYear()}-${thu.getMonth()}`;
      const last = runs[runs.length - 1];
      if (last?.key === key) last.to = w;
      else runs.push({ key, date: thu, from: w, to: w });
    });
    return runs;
  }, [columns]);

  const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'short' });
  const dayFormat = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const noun = (n: number) => `${n} ${n === 1 ? unit[0] : unit[1]}`;

  type Day = { date: Date; key: string; before: boolean };
  // One day. xi/xn and yi place its tooltip: opening inward near either side
  // edge, and below the top rows.
  const renderCell = (cell: Day, xi: number, xn: number, yi: number) => {
    if (cell.before) return <span key={cell.key} className={styles.blank} aria-hidden="true" />;
    const count = counts.get(cell.key) ?? 0;
    const selectable = onSelect != null && count > 0;
    const Cell = selectable ? 'button' : 'span';
    const label = `${dayFormat.format(cell.date)}: ${count === 0 ? `no ${unit[1]}` : noun(count)}`;
    const x = xi < 3 ? '0%' : xi > xn - 4 ? '-100%' : '-50%';
    const x0 = xi < 3 ? '0%' : xi > xn - 4 ? '100%' : '50%';
    const below = yi < 2;
    return (
      <Cell
        key={cell.key}
        type={selectable ? 'button' : undefined}
        className={styles.cell}
        data-level={level(count)}
        data-today={cell.key === today || undefined}
        style={{ '--w': layout === 'calendar' ? yi : xi } as CSSProperties}
        onClick={selectable ? () => onSelect!(cell.key) : undefined}
        onPointerEnter={() => setHovered(cell.key)}
        onPointerLeave={() => setHovered((k) => (k === cell.key ? null : k))}
        onFocus={() => setHovered(cell.key)}
        onBlur={() => setHovered((k) => (k === cell.key ? null : k))}
        aria-label={label}
        role={selectable ? undefined : 'img'}
      >
        {layout === 'calendar' && (
          <span className={styles.dayNumber} aria-hidden="true">
            {cell.date.getDate()}
            {cell.date.getDate() === 1 && <span className={styles.monthName}> {monthFormat.format(cell.date)}</span>}
          </span>
        )}
        {hovered === cell.key && (
          <ChartTooltip
            title={cell.key === today ? `Today, ${dayFormat.format(cell.date)}` : dayFormat.format(cell.date)}
            rows={[
              {
                key: 'count',
                label: count === 1 ? unit[0] : unit[1],
                value: String(count),
                color: count > 0 ? 'var(--color-chart-1)' : 'var(--color-chart-window)',
              },
              ...(count > 0 && detail ? detail(cell.key) : []),
            ]}
            style={{
              left: x0,
              top: below ? '100%' : 0,
              whiteSpace: 'nowrap',
              transform: below ? `translate(${x}, 0.5rem)` : `translate(${x}, calc(-100% - 0.5rem))`,
            }}
          />
        )}
      </Cell>
    );
  };

  return (
    <div
      className={cn(styles.chart, className)}
      role="group"
      aria-label={ariaLabel}
      {...rest}
      style={{ '--_weeks': weeks, ...rest.style } as CSSProperties}
    >
      {layout === 'calendar' ? (
        <div className={styles.calendar}>
          {WEEKDAYS.map((d) => (
            <span key={d} className={styles.calendarWeekday} aria-hidden="true">
              {d}
            </span>
          ))}
          {columns.map((col, w) => col.cells.map((cell, d) => renderCell(cell, d, 7, w)))}
        </div>
      ) : (
        <div className={styles.weeks}>
            {WEEKDAYS.map((d, i) => (
              <span key={d} className={styles.weekday} style={{ gridRow: i + 2 }} aria-hidden="true">
                {d}
              </span>
            ))}
            <div className={styles.months} aria-hidden="true">
              {months.map((m) => (
                <span key={m.key} className={styles.month} style={{ gridColumn: `${m.from + 2} / ${m.to + 3}` }}>
                  {monthFormat.format(m.date)}
                </span>
              ))}
            </div>
            {columns.map((col, w) => (
              <div key={col.key} className={styles.week} style={{ gridColumn: w + 2 }}>
                {col.cells.map((cell, d) => renderCell(cell, w, weeks, d))}
              </div>
            ))}
          </div>
      )}

      {/* The scale, in the legend frame every chart uses (ChartLegendGroup's
          tile: md corners, 8 top and bottom, 12 at the sides). */}
      <Tile radius="md" className={styles.footer} aria-hidden="true">
        <span>Fewer</span>
        <span className={styles.swatches}>
          {[1, 2, 3].map((l) => (
            <span key={l} className={styles.swatch} data-level={l} />
          ))}
        </span>
        <span>More</span>
      </Tile>
    </div>
  );
}
