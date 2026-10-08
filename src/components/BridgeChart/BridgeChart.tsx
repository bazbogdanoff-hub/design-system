import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useTier } from '../../lib/breakpoints';
import { ChartTooltip } from '../ChartTooltip';
import styles from './BridgeChart.module.css';

/** `total` - revenue and other totals · `cost` - a cost line · `gain` -
 * money made · `loss` - money lost. */
export type BridgeTone = 'total' | 'cost' | 'gain' | 'loss';

export interface BridgeRow {
  key: string;
  /** The line's name, left column - e.g. "Fuel". */
  label: ReactNode;
  /** Where the bar starts and ends on the value scale. A bridge's cost runs
   * from the running total down; a ranked list's bar runs from 0. Either
   * end may be negative. */
  from: number;
  to: number;
  /** The same line in the comparison period, drawn as a recessed band
   * behind the bar (owner, 2026-10-05: last month, the way TimelineChart
   * draws a delivery window). */
  compare?: { from: number; to: number };
  tone: BridgeTone;
  /** The amount shown right of the track, already formatted. */
  value: ReactNode;
  /** Extra tooltip lines below this period and the comparison - e.g. per
   * km, share of revenue. */
  details?: { key: string; label: string; value: string }[];
  /** Makes the row a button - e.g. open the line's entries. */
  onSelect?: () => void;
}

export interface BridgeChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  rows: BridgeRow[];
  /** Formats axis ticks and the tooltip's amounts - e.g. "€25k". */
  valueFormatter?: (value: number) => string;
  /** Tooltip names for the two periods - e.g. "September", "August". */
  periodLabel?: string;
  compareLabel?: string;
  'aria-label': string;
}

/** Round ticks that hug the data. The shared niceScaleRange steps in 1, 2,
 * 5 and rounded a €151k revenue up to a €200k axis, a quarter of the width
 * empty; with 2.5 among the steps and the tightest fit of 4 to 8 ticks it
 * stops at €175k. Zero is always on the scale. */
function bridgeScale(min: number, max: number): { min: number; max: number; step: number } {
  const span = max - min || 1;
  let best = { min, max: min + span, step: span, waste: Infinity };
  for (let ticks = 4; ticks <= 8; ticks++) {
    const raw = span / (ticks - 1);
    const mag = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 2.5, 5, 10]) {
      const step = m * mag;
      if (step < raw) continue;
      const lo = Math.floor(min / step) * step;
      const hi = Math.ceil(max / step) * step;
      const count = Math.round((hi - lo) / step) + 1;
      if (count > 8) continue;
      const waste = hi - lo - span;
      if (waste < best.waste) best = { min: lo, max: hi, step, waste };
      break;
    }
  }
  return { min: best.min, max: best.max, step: best.step };
}

const TONE_VAR: Record<BridgeTone, string> = {
  total: 'var(--color-bridge-chart-total)',
  cost: 'var(--color-bridge-chart-cost)',
  gain: 'var(--color-bridge-chart-gain)',
  loss: 'var(--color-bridge-chart-loss)',
};

/**
 * A profit bridge drawn as statement rows (owner, 2026-10-05): one row per
 * line, its label left, a floating bar on a shared value scale, its amount
 * right, and the comparison period as a recessed band behind the bar. Read
 * top to bottom it is a P&L statement; with every bar from 0 it is a ranked
 * list (profit per truck, losses left of zero). The money sibling of
 * `TimelineChart`: the same two-column rows, glass bars and recessed band,
 * drawn in HTML so the glass is the CSS recipe of the pill. Built in code
 * first; the Figma master follows from docs/components/BridgeChart.md.
 */
export function BridgeChart({
  rows,
  valueFormatter = (v) => String(Math.round(v)),
  periodLabel = 'This period',
  compareLabel = 'Last period',
  className,
  'aria-label': ariaLabel,
  ...rest
}: BridgeChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const phone = useTier() === 'phone';

  // One scale for every row, zero always in it.
  const scale = useMemo(() => {
    const all = rows.flatMap((r) => [r.from, r.to, ...(r.compare ? [r.compare.from, r.compare.to] : [])]);
    return bridgeScale(Math.min(0, ...all), Math.max(0, ...all));
  }, [rows]);
  const span = scale.max - scale.min || 1;
  const pos = (v: number) => ((v - scale.min) / span) * 100;
  const place = (a: number, b: number): CSSProperties => ({
    left: `${pos(Math.min(a, b)).toFixed(3)}%`,
    width: `${(Math.abs(b - a) / span * 100).toFixed(3)}%`,
  });

  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let t = scale.min; t <= scale.max + scale.step / 2; t += scale.step) out.push(Math.round(t * 1e6) / 1e6);
    return out;
  }, [scale]);
  // Tick labels as close as they fit (2026-10-08: at phone width every
  // label piled into one smudge), as TimelineChart does: the axis's measured
  // width decides, a label needs about 3.5rem ("−€1.5k"), and zero always keeps its own.
  // The gridlines stay at every tick.
  const axisRef = useRef<HTMLDivElement>(null);
  const [axisPx, setAxisPx] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = axisRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAxisPx(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const labelEvery = useMemo(() => {
    if (axisPx == null || axisPx <= 0 || ticks.length < 2) return 1;
    const labelPx = 3.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const gapPx = (scale.step / span) * axisPx;
    return Math.max(1, Math.ceil(labelPx / gapPx));
  }, [axisPx, ticks.length, scale.step, span]);
  const zeroAt = Math.max(0, ticks.indexOf(0));
  // Which ticks get a label. An end label sits inside its line on phone (it
  // would hang off the card centred), so it reaches a whole label inward:
  // it stays only with 1.5 labels of room to the next one.
  const labelled = useMemo(() => {
    const on = ticks.map((_, i) => (i - zeroAt) % labelEvery === 0);
    if (phone && axisPx != null && axisPx > 0 && ticks.length > 1) {
      const labelPx = 3.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const gapPx = (scale.step / span) * axisPx;
      const last = ticks.length - 1;
      if (on[0] && labelEvery * gapPx < 1.5 * labelPx && zeroAt !== 0) on[0] = false;
      if (on[last] && labelEvery * gapPx < 1.5 * labelPx && zeroAt !== last) on[last] = false;
    }
    return on;
  }, [phone, ticks, zeroAt, labelEvery, axisPx, scale.step, span]);
  const hasNegative = scale.min < 0;
  // A bar from zero is a signed value (a truck's loss reads −€664); a
  // floating bar is an amount, its length.
  const amount = (r: { from: number; to: number }) => (r.from === 0 ? r.to : Math.abs(r.to - r.from));

  return (
    <div className={cn(styles.chart, className)} role="group" aria-label={ariaLabel} {...rest}>
      <div className={styles.axisRow} aria-hidden="true">
        <span />
        <div className={styles.axis} ref={axisRef}>
          {ticks.map((t, i) =>
            labelled[i] ? (
              <span
                key={t}
                className={styles.tick}
                data-edge={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : undefined}
                style={{ left: `${pos(t)}%` }}
              >
                {valueFormatter(t)}
              </span>
            ) : null,
          )}
        </div>
        <span />
      </div>

      <div className={styles.rows}>
        <div className={styles.guides} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className={styles.gridline} data-zero={t === 0 && hasNegative ? '' : undefined} style={{ left: `${pos(t)}%` }} />
          ))}
        </div>

        {rows.map((r, i) => {
          const Row = r.onSelect ? 'button' : 'div';
          const summary = [
            `${periodLabel} ${valueFormatter(amount(r))}`,
            r.compare ? `${compareLabel} ${valueFormatter(amount(r.compare))}` : null,
            ...(r.details ?? []).map((d) => `${d.label} ${d.value}`),
          ]
            .filter(Boolean)
            .join(', ');
          return (
            <Row
              key={r.key}
              type={r.onSelect ? 'button' : undefined}
              className={styles.row}
              data-selectable={r.onSelect ? '' : undefined}
              data-hovered={hovered === r.key || undefined}
              onClick={r.onSelect}
              onPointerEnter={() => setHovered(r.key)}
              onPointerLeave={() => setHovered((k) => (k === r.key ? null : k))}
              onFocus={() => setHovered(r.key)}
              onBlur={() => setHovered((k) => (k === r.key ? null : k))}
              aria-label={r.onSelect ? `${typeof r.label === 'string' ? r.label : ''}: ${summary}` : undefined}
              style={{ '--i': i } as CSSProperties}
            >
              <span className={styles.label}>{r.label}</span>
              <span className={styles.track}>
                {r.compare && <span className={styles.compare} style={place(r.compare.from, r.compare.to)} />}
                <span
                  className={styles.bar}
                  data-tone={r.tone}
                  // Grows from the end it starts at: a cost from the running
                  // total down, a loss from zero leftwards.
                  data-origin={r.to < r.from ? 'right' : 'left'}
                  style={place(r.from, r.to)}
                />
                {hovered === r.key && (
                  <ChartTooltip
                    title={typeof r.label === 'string' ? r.label : periodLabel}
                    rows={[
                      { key: 'now', label: periodLabel, value: valueFormatter(amount(r)), color: TONE_VAR[r.tone] },
                      ...(r.compare
                        ? [{ key: 'then', label: compareLabel, value: valueFormatter(amount(r.compare)), color: 'var(--color-bridge-chart-compare)' }]
                        : []),
                      ...(r.details ?? []).map((d) => ({ ...d, color: 'transparent' })),
                    ]}
                    style={{
                      left: `${pos(Math.max(r.from, r.to)).toFixed(3)}%`,
                      top: 0,
                      whiteSpace: 'nowrap',
                      transform: `translate(${pos(Math.max(r.from, r.to)) > 70 ? '-100%' : '-50%'}, calc(-100% - 0.25rem))`,
                    }}
                  />
                )}
              </span>
              <span className={styles.value}>{r.value}</span>
            </Row>
          );
        })}
      </div>

      {/* Screen-reader twin: the statement as a table. */}
      <div className={styles.srOnlyTable}>
        <table>
          <caption>{ariaLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Line</th>
              <th scope="col">{periodLabel}</th>
              <th scope="col">{compareLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                <td>{r.value}</td>
                <td>{r.compare ? valueFormatter(amount(r.compare)) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
