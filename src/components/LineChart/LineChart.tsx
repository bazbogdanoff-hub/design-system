import { useId, useState } from 'react';
import { ChartTooltip } from '../ChartTooltip';
import { niceScaleRange } from '../../lib/niceScale';
import { useContainerSize } from '../../lib/useContainerSize';
import { useRemScale } from '../../lib/rem';
import styles from './LineChart.module.css';

export interface LineChartSeries {
  /** Matches a key in each datum's `values`. */
  key: string;
  label: string;
  /** Any CSS color value — usually a token var, e.g. `var(--color-chart-1)`. */
  color: string;
}

export interface LineChartDatum {
  /** X-axis category, e.g. a day name. */
  category: string;
  values: Record<string, number>;
}

export interface LineChartProps {
  data: LineChartDatum[];
  series: LineChartSeries[];
  /** Fills the area under each line down to the plot's own bottom edge —
   * a soft "glow," not a from-zero magnitude encoding (the axis itself
   * doesn't start at 0; see `docs/components/LineChart.md`). Defaults to
   * on for a single series, off for 2+ (overlapping fills read poorly). */
  area?: boolean;
  /** Total SVG height in px, including the x-axis label band. Omit to fill
   * whatever height the container gives it (the usual case — put
   * `LineChart` in a flex/grid area with a real height, e.g. `ChartCard`'s
   * body). */
  height?: number;
  valueFormatter?: (value: number) => string;
  /** A goal drawn across the plot as a dashed line, labelled at its right
   * start, and listed in the tooltip (owner, 2026-09-30: the on-time target).
   * The y-range always takes it in. */
  reference?: { value: number; label: string };
  /** Makes each category's column a button — click, Enter or Space — e.g.
   * open that week's records. */
  onSelect?: (index: number) => void;
  /** Overall chart description for assistive tech — the data itself is
   * always reachable per-point (focusable) and via the hidden table below. */
  'aria-label'?: string;
}

const MARKER_RADIUS_PX = 4; // hovered/focused point dot, >=8px diameter per the skill's marker floor
const MIN_HEIGHT_PX = 140; // pre-measurement / degenerate-container fallback
// Top inset leaves a little room for hover tooltips near the top edge.
// Left 48 matches the Fuel chart’s y-label gutter; plot still uses equal
// invisible columns for day labels + hover (line vertices stay edge→edge).
const PADDING_PX = { top: 20, right: 16, bottom: 24, left: 48 };

/** Catmull-Rom → cubic Bézier smoothing (tension 1/6) — the standard way to
 * draw a smooth curve through a set of points without overshooting them. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0]!.x},${points[0]!.y}`;
  let d = `M${points[0]!.x},${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/** The same curve as `smoothPath`, shifted `offset` along its normal —
 * positive toward the top of the chart. Sampled densely (each segment as a
 * short polyline) because a cubic's true offset is not itself a cubic; a
 * plain vertical shift would thin to nothing on the steep parts. Used for
 * the glass line's catch and vignette. */
function offsetPath(points: { x: number; y: number }[], offset: number, steps = 16): string {
  if (points.length < 2) return smoothPath(points);
  let d = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    for (let k = i === 0 ? 0 : 1; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      const x = u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x;
      const y = u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y;
      // Tangent, then the normal that points up (x runs left → right).
      const dx = 3 * u * u * (c1.x - p1.x) + 6 * u * t * (c2.x - c1.x) + 3 * t * t * (p2.x - c2.x);
      const dy = 3 * u * u * (c1.y - p1.y) + 6 * u * t * (c2.y - c1.y) + 3 * t * t * (p2.y - c2.y);
      const len = Math.hypot(dx, dy) || 1;
      const px = x + (dy / len) * offset;
      const py = y - (dx / len) * offset;
      d += `${d ? ' L' : 'M'}${px},${py}`;
    }
  }
  return d;
}

/**
 * A line chart — one smooth line per series, optional area fill, a hover
 * crosshair with per-series dot markers and a tooltip (mandatory for
 * line/area per the dataviz skill — unlike a bar chart, the mark itself
 * has no other affordance to land a pointer on). See
 * `docs/components/LineChart.md`.
 */
export function LineChart({
  data,
  series,
  area = series.length === 1,
  height: fixedHeight,
  valueFormatter = (v) => String(v),
  reference,
  onSelect,
  'aria-label': ariaLabel,
}: LineChartProps) {
  // Every geometry constant above is authored at the 16px root and scales
  // with it, like the rem-based CSS around the chart.
  const s = useRemScale();
  const MARKER_RADIUS = MARKER_RADIUS_PX * s;
  const MIN_HEIGHT = MIN_HEIGHT_PX * s;
  // How far the glass catch and vignette strokes sit above and below the line.
  const GLASS_OFFSET = 0.25 * s;
  const PADDING = {
    top: PADDING_PX.top * s,
    right: PADDING_PX.right * s,
    bottom: PADDING_PX.bottom * s,
    left: PADDING_PX.left * s,
  };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();
  const [wrapperRef, measuredSize] = useContainerSize<HTMLDivElement>();

  // A fixed `height` sizes the wrapper too, so a parent can place the chart
  // (e.g. at the foot of a ChartCard) instead of it filling the space.
  const wrapperStyle = fixedHeight != null ? { height: fixedHeight } : undefined;

  // Nothing to plot yet (e.g. still loading): an empty frame, not a crash —
  // every path below assumes at least one point.
  if (data.length === 0 || series.length === 0) {
    return <div className={styles.wrapper} ref={wrapperRef} style={wrapperStyle} role="img" aria-label={ariaLabel} />;
  }

  const height = fixedHeight ?? Math.max(MIN_HEIGHT, measuredSize.height);
  const intrinsicWidth = measuredSize.width || 640;
  const plotHeight = height - PADDING.top - PADDING.bottom;
  const plotWidth = intrinsicWidth - PADDING.left - PADDING.right;

  const allValues = data.flatMap((d) => series.map((s) => d.values[s.key] ?? 0));
  if (reference) allValues.push(reference.value);
  const { min: axisMin, max: axisMax, step: axisStep } = niceScaleRange(
    Math.min(...allValues),
    Math.max(...allValues),
  );
  const ticks: number[] = [];
  for (let v = axisMin; v <= axisMax; v += axisStep) ticks.push(v);

  // Line vertices run edge → edge. Hit targets are equal columns like
  // BarChart (each holds its own vertex); the crosshair, marker, tooltip and
  // x label all sit on the vertex, so the dot is the value the tooltip reads
  // (owner, 2026-09-30 — they used to sit at the column centre, off the point).
  const bandWidth = plotWidth / Math.max(1, data.length);
  const xFor = (i: number) =>
    PADDING.left + (data.length === 1 ? plotWidth / 2 : (plotWidth * i) / (data.length - 1));
  // When labels would collide, draw every n-th, counted back from the last
  // so the latest category is always named. The tooltip and the table below
  // still carry every one.
  const longestLabel = Math.max(0, ...data.map((d) => d.category.length));
  const labelWidth = (longestLabel * 7 + 12) * s;
  const labelEvery = Math.max(1, Math.ceil(labelWidth / Math.max(1, bandWidth)));
  const showLabel = (i: number) => (data.length - 1 - i) % labelEvery === 0;
  const yFor = (value: number) => PADDING.top + plotHeight * (1 - (value - axisMin) / (axisMax - axisMin || 1));

  const seriesPoints = series.map((s) =>
    data.map((d, i) => ({ x: xFor(i), y: yFor(d.values[s.key] ?? 0) })),
  );

  const active = activeIndex != null ? data[activeIndex] : null;
  const activeX = activeIndex != null ? xFor(activeIndex) : 0;

  return (
    <div className={styles.wrapper} ref={wrapperRef} style={wrapperStyle}>
      <svg
        className={styles.svg}
        width={intrinsicWidth}
        height={height}
        viewBox={`0 0 ${intrinsicWidth} ${height}`}
        role="group"
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
      >
        {!ariaLabel && <title id={titleId}>Line chart</title>}

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
              <text x={PADDING.left - 8 * s} y={y} className={styles.axisLabel} textAnchor="end" dominantBaseline="middle">
                {valueFormatter(tick)}
              </text>
            </g>
          );
        })}

        {/* the goal: dashed, under the lines, labelled at its left end — a
            trend heads toward its goal, so the start is where the line is
            furthest from it and the label stays clear */}
        {reference && (
          <g aria-hidden="true">
            <line
              x1={PADDING.left}
              x2={intrinsicWidth - PADDING.right}
              y1={yFor(reference.value)}
              y2={yFor(reference.value)}
              className={styles.reference}
            />
            <text
              x={PADDING.left + 8 * s}
              y={yFor(reference.value) - 6 * s}
              className={styles.referenceLabel}
              textAnchor="start"
            >
              {reference.label} {valueFormatter(reference.value)}
            </text>
          </g>
        )}

        {/* lines + area fills, one per series (drawn before markers/crosshair so hover sits on top) */}
        {series.map((s, si) => {
          const points = seriesPoints[si]!;
          const linePath = smoothPath(points);
          const areaPath = area
            ? `${linePath} L${points[points.length - 1]!.x},${PADDING.top + plotHeight} L${points[0]!.x},${PADDING.top + plotHeight} Z`
            : null;
          return (
            <g key={s.key}>
              {/* Entrance: the line draws itself left to right and the area
                  wipes in under it (CSS; pathLength=1 lets the dash animation
                  ignore the real length). */}
              {areaPath && <path d={areaPath} fill={s.color} className={styles.area} />}
              {/* The line in glass (owner, 2026-09-30), 2.5px from top to
                  bottom: a 0.5px catch of light, the 1.5px line, a 0.5px
                  vignette — the chart elements' catch and inner shadow,
                  light falling from above. Drawn as three strokes: the
                  catch and vignette offset along the curve's normal (so
                  they stay 0.5px on the steep parts too), the line over
                  both. */}
              <path
                d={offsetPath(points, GLASS_OFFSET)}
                fill="none"
                stroke={`color-mix(in srgb, ${s.color}, white var(--glass-catch-mix))`}
                className={styles.line}
                data-layer="catch"
                pathLength={1}
              />
              <path
                d={offsetPath(points, -GLASS_OFFSET)}
                fill="none"
                stroke={`color-mix(in oklch, ${s.color}, black var(--glass-inner-mix))`}
                className={styles.line}
                data-layer="vignette"
                pathLength={1}
              />
              <path d={linePath} fill="none" stroke={s.color} className={styles.line} data-layer="body" pathLength={1} />
            </g>
          );
        })}

        {/* hover crosshair + markers, on the active vertex */}
        {active && activeIndex != null && (
          <g>
            <line
              x1={activeX}
              x2={activeX}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              className={styles.crosshair}
            />
            {series.map((s, si) => (
              <circle
                key={s.key}
                cx={activeX}
                cy={seriesPoints[si]![activeIndex]!.y}
                r={MARKER_RADIUS}
                fill={s.color}
                className={styles.marker}
              />
            ))}
          </g>
        )}

        {/* x-axis category labels + hit targets — equal columns like BarChart */}
        {data.map((datum, i) => {
          return (
            <g key={datum.category}>
              {showLabel(i) && (
                <text
                  x={xFor(i)}
                  y={height - 8 * s}
                  className={styles.axisLabel}
                  // The end labels anchor inward so they stay on the chart.
                  textAnchor={data.length > 1 && i === 0 ? 'start' : data.length > 1 && i === data.length - 1 ? 'end' : 'middle'}
                >
                  {datum.category}
                </text>
              )}
              <rect
                x={PADDING.left + bandWidth * i}
                y={PADDING.top}
                width={bandWidth}
                height={plotHeight}
                fill="transparent"
                tabIndex={0}
                role={onSelect ? 'button' : 'img'}
                onClick={onSelect ? () => onSelect(i) : undefined}
                onKeyDown={
                  onSelect
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(i);
                        }
                      }
                    : undefined
                }
                data-selectable={onSelect ? '' : undefined}
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
          rows={[
            ...series.map((s) => ({
              key: s.key,
              label: s.label,
              value: valueFormatter(active.values[s.key] ?? 0),
              color: s.color,
            })),
            ...(reference
              ? [{ key: '__reference', label: reference.label, value: valueFormatter(reference.value), color: 'var(--color-border-strong)' }]
              : []),
          ]}
          style={{
            left: `${(activeX / intrinsicWidth) * 100}%`,
            top: `${(Math.max(Math.min(...seriesPoints.map((pts) => pts[activeIndex]!.y)), 48) / height) * 100}%`,
            // Centred on the column, but opening inward near either end so it
            // never runs off the card.
            transform: `translate(${activeX / intrinsicWidth > 0.75 ? '-100%' : activeX / intrinsicWidth < 0.25 ? '0%' : '-50%'}, calc(-100% - 0.75rem))`,
            whiteSpace: 'nowrap',
          }}
        />
      )}

      {/* screen-reader-only data table — every value stays reachable without hovering */}
      {/* Hidden in a div, not on the table: a table won't shrink below its
          rows, so a 1px table still stretched the page's scroll height. */}
      <div className={styles.srOnlyTable}>
        <table>
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
    </div>
  );
}
