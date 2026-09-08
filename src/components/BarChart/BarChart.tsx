import { useId, useState } from 'react';
import { ChartTooltip } from '../ChartTooltip';
import { niceScale } from '../../lib/niceScale';
import { useContainerSize } from '../../lib/useContainerSize';
import styles from './BarChart.module.css';

export interface BarChartSeries {
  /** Matches a key in each datum's `values`. */
  key: string;
  label: string;
  /** Any CSS color value — usually a token var, e.g. `var(--color-chart-1)`. */
  color: string;
}

export interface BarChartDatum {
  /** X-axis category, e.g. a day name. */
  category: string;
  values: Record<string, number>;
}

export interface BarChartProps {
  data: BarChartDatum[];
  /** Stacking order, bottom to top. */
  series: BarChartSeries[];
  /** Total SVG height in px, including the x-axis label band. Omit to fill
   * whatever height the container gives it (the usual case — put `BarChart`
   * in a flex/grid area with a real height, e.g. `ChartCard`'s body). */
  height?: number;
  valueFormatter?: (value: number) => string;
  /** Overall chart description for assistive tech — the data itself is
   * always reachable per-bar (focusable) and via the hidden table below. */
  'aria-label'?: string;
}

const GAP = 2; // surface-color gap between stacked segments (marks-and-anatomy.md)
const CORNER = 4; // rounded data-end radius
const MAX_BAR_THICKNESS = 24;
const MIN_HEIGHT = 140; // pre-measurement / degenerate-container fallback
// top is generous on purpose — reserves headroom so a tall bar's hover
// tooltip has room to render above it without overlapping whatever sits
// above the chart (e.g. ChartCard's header).
const PADDING = { top: 56, right: 16, bottom: 28, left: 32 };

/** A `<rect>`-equivalent path with only the top two corners rounded — the
 * stack's outer end is rounded, its baseline end stays square. */
function roundedTopPath(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.min(radius, height, width / 2);
  if (r <= 0) return `M${x},${y} h${width} v${height} h${-width} Z`;
  return [
    `M${x},${y + r}`,
    `a${r},${r} 0 0 1 ${r},${-r}`,
    `h${width - 2 * r}`,
    `a${r},${r} 0 0 1 ${r},${r}`,
    `v${height - r}`,
    `h${-width}`,
    'Z',
  ].join(' ');
}

/**
 * A stacked bar chart. Thin bars (<=24px), rounded outer end, square
 * baseline, a 2px surface gap between segments — see
 * `docs/components/BarChart.md`. Every value is reachable three ways: the
 * hovered/focused tooltip, the axis gridlines, and a visually-hidden table
 * (screen readers only) so nothing is gated behind hover.
 */
export function BarChart({
  data,
  series,
  height: fixedHeight,
  valueFormatter = (v) => String(v),
  'aria-label': ariaLabel,
}: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();
  const [wrapperRef, measuredSize] = useContainerSize<HTMLDivElement>();

  // The SVG's coordinate space matches the container's real pixel size 1:1
  // (no CSS-level scaling) — bars/gridlines stretch to fill it, but text
  // drawn at e.g. 12px stays 12px regardless of card size. Pre-measurement
  // fallbacks only matter for the very first paint.
  const height = fixedHeight ?? Math.max(MIN_HEIGHT, measuredSize.height);
  const intrinsicWidth = measuredSize.width || 640;
  const plotHeight = height - PADDING.top - PADDING.bottom;
  const totals = data.map((d) => series.reduce((sum, s) => sum + (d.values[s.key] ?? 0), 0));
  const { max: axisMax, step: axisStep } = niceScale(Math.max(0, ...totals));
  const ticks: number[] = [];
  for (let v = 0; v <= axisMax; v += axisStep) ticks.push(v);

  const plotWidth = intrinsicWidth - PADDING.left - PADDING.right;
  const bandWidth = plotWidth / Math.max(1, data.length);
  const barWidth = Math.min(MAX_BAR_THICKNESS, bandWidth * 0.5);

  const yFor = (value: number) => PADDING.top + plotHeight * (1 - value / axisMax);

  const active = activeIndex != null ? data[activeIndex] : null;
  const activeTotal = activeIndex != null ? (totals[activeIndex] ?? 0) : 0;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <svg
        className={styles.svg}
        width={intrinsicWidth}
        height={height}
        viewBox={`0 0 ${intrinsicWidth} ${height}`}
        role="group"
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
      >
        {!ariaLabel && <title id={titleId}>Bar chart</title>}

        {/* gridlines + y-axis labels */}
        {ticks.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={intrinsicWidth - PADDING.right}
                y1={y}
                y2={y}
                className={styles.gridline}
              />
              <text x={PADDING.left - 8} y={y} className={styles.axisLabel} textAnchor="end" dominantBaseline="middle">
                {tick}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {data.map((datum, i) => {
          const x = PADDING.left + bandWidth * i + (bandWidth - barWidth) / 2;
          let cumulative = 0;
          const segments = series.map((s, si) => {
            const value = datum.values[s.key] ?? 0;
            const segTop = cumulative + value;
            const isTopmost = si === series.length - 1;
            cumulative = segTop;
            const yTop = yFor(segTop);
            const yBottom = yFor(cumulative - value);
            const rawHeight = yBottom - yTop;
            const segHeight = isTopmost ? rawHeight : Math.max(0, rawHeight - GAP);
            if (rawHeight <= 0) return null;
            const path = isTopmost
              ? roundedTopPath(x, yTop, barWidth, segHeight, CORNER)
              : `M${x},${yTop} h${barWidth} v${segHeight} h${-barWidth} Z`;
            return <path key={s.key} d={path} fill={s.color} className={activeIndex === i ? styles.segmentActive : styles.segment} />;
          });

          return (
            <g key={datum.category}>
              {segments}
              <text
                x={x + barWidth / 2}
                y={height - PADDING.bottom + 18}
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {datum.category}
              </text>
              {/* hit target — the whole column, taller/wider than the bar itself */}
              <rect
                x={PADDING.left + bandWidth * i}
                y={PADDING.top}
                width={bandWidth}
                height={plotHeight}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${datum.category}: ${series
                  .map((s) => `${s.label} ${valueFormatter(datum.values[s.key] ?? 0)}`)
                  .join(', ')}`}
                onPointerEnter={() => setActiveIndex(i)}
                onPointerLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                className={styles.hitTarget}
              />
            </g>
          );
        })}
      </svg>

      {active && activeIndex != null && (
        <ChartTooltip
          title={active.category}
          rows={series
            .slice()
            .reverse()
            .map((s) => ({
              key: s.key,
              label: s.label,
              value: valueFormatter(active.values[s.key] ?? 0),
              color: s.color,
            }))}
          style={{
            left: `${((PADDING.left + bandWidth * (activeIndex + 0.5)) / intrinsicWidth) * 100}%`,
            // clamped so a near-max bar's tooltip can't render above the
            // chart's own top edge — PADDING.top already reserves the
            // typical headroom, this is the safety net for tall tooltips
            top: `${(Math.max(yFor(activeTotal), 48) / height) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 8px))',
          }}
        />
      )}

      {/* screen-reader-only data table — every value stays reachable without hovering */}
      <table className={styles.srOnlyTable}>
        <caption>{ariaLabel ?? 'Chart data'}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.category}>
              <th scope="row">{datum.category}</th>
              {series.map((s) => (
                <td key={s.key}>{valueFormatter(datum.values[s.key] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
