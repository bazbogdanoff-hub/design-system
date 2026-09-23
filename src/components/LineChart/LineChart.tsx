import { useId, useState } from 'react';
import { ChartTooltip } from '../ChartTooltip';
import { niceScaleRange } from '../../lib/niceScale';
import { useContainerSize } from '../../lib/useContainerSize';
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
  /** Overall chart description for assistive tech — the data itself is
   * always reachable per-point (focusable) and via the hidden table below. */
  'aria-label'?: string;
}

const MARKER_RADIUS = 4; // hovered/focused point dot, >=8px diameter per the skill's marker floor
const MIN_HEIGHT = 140; // pre-measurement / degenerate-container fallback
// Top inset leaves a little room for hover tooltips near the top edge.
// Left 48 matches the Fuel chart’s y-label gutter; plot still uses equal
// invisible columns for day labels + hover (line vertices stay edge→edge).
const PADDING = { top: 20, right: 16, bottom: 24, left: 48 };

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

/** Y on the same smooth curve as `smoothPath`, at a given plot X — so hover
 * markers can sit on the line at column centers (which aren't vertices). */
function yOnSmoothPath(points: { x: number; y: number }[], targetX: number): number {
  if (points.length === 0) return 0;
  if (points.length === 1) return points[0]!.y;
  if (targetX <= points[0]!.x) return points[0]!.y;
  if (targetX >= points[points.length - 1]!.x) return points[points.length - 1]!.y;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    if (targetX < p1.x || targetX > p2.x) continue;

    const x0 = p1.x;
    const y0 = p1.y;
    const x1 = p1.x + (p2.x - p0.x) / 6;
    const y1 = p1.y + (p2.y - p0.y) / 6;
    const x2 = p2.x - (p3.x - p1.x) / 6;
    const y2 = p2.y - (p3.y - p1.y) / 6;
    const x3 = p2.x;
    const y3 = p2.y;

    // Monotonic-x segments: binary-search t where Bx(t) = targetX.
    let lo = 0;
    let hi = 1;
    for (let iter = 0; iter < 24; iter++) {
      const t = (lo + hi) / 2;
      const u = 1 - t;
      const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
      if (x < targetX) lo = t;
      else hi = t;
    }
    const t = (lo + hi) / 2;
    const u = 1 - t;
    return u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
  }
  return points[points.length - 1]!.y;
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
  'aria-label': ariaLabel,
}: LineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();
  const [wrapperRef, measuredSize] = useContainerSize<HTMLDivElement>();

  const height = fixedHeight ?? Math.max(MIN_HEIGHT, measuredSize.height);
  const intrinsicWidth = measuredSize.width || 640;
  const plotHeight = height - PADDING.top - PADDING.bottom;
  const plotWidth = intrinsicWidth - PADDING.left - PADDING.right;

  const allValues = data.flatMap((d) => series.map((s) => d.values[s.key] ?? 0));
  const { min: axisMin, max: axisMax, step: axisStep } = niceScaleRange(
    Math.min(...allValues),
    Math.max(...allValues),
  );
  const ticks: number[] = [];
  for (let v = axisMin; v <= axisMax; v += axisStep) ticks.push(v);

  // Line vertices: edge → edge (unchanged visual). Labels + hover use equal
  // columns like BarChart — centered in each band.
  const bandWidth = plotWidth / Math.max(1, data.length);
  const xFor = (i: number) =>
    PADDING.left + (data.length === 1 ? plotWidth / 2 : (plotWidth * i) / (data.length - 1));
  const columnCenterX = (i: number) => PADDING.left + bandWidth * (i + 0.5);
  const yFor = (value: number) => PADDING.top + plotHeight * (1 - (value - axisMin) / (axisMax - axisMin || 1));

  const seriesPoints = series.map((s) =>
    data.map((d, i) => ({ x: xFor(i), y: yFor(d.values[s.key] ?? 0) })),
  );

  const active = activeIndex != null ? data[activeIndex] : null;
  const activeColumnX = activeIndex != null ? columnCenterX(activeIndex) : 0;

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
              <text x={PADDING.left - 8} y={y} className={styles.axisLabel} textAnchor="end" dominantBaseline="middle">
                {valueFormatter(tick)}
              </text>
            </g>
          );
        })}

        {/* lines + area fills, one per series (drawn before markers/crosshair so hover sits on top) */}
        {series.map((s, si) => {
          const points = seriesPoints[si]!;
          const linePath = smoothPath(points);
          const areaPath = area
            ? `${linePath} L${points[points.length - 1]!.x},${PADDING.top + plotHeight} L${points[0]!.x},${PADDING.top + plotHeight} Z`
            : null;
          return (
            <g key={s.key}>
              {areaPath && <path d={areaPath} fill={s.color} className={styles.area} />}
              <path d={linePath} fill="none" stroke={s.color} className={styles.line} />
            </g>
          );
        })}

        {/* hover crosshair + markers at column center, Y sampled on the smooth line */}
        {active && activeIndex != null && (
          <g>
            <line
              x1={activeColumnX}
              x2={activeColumnX}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              className={styles.crosshair}
            />
            {series.map((s, si) => (
              <circle
                key={s.key}
                cx={activeColumnX}
                cy={yOnSmoothPath(seriesPoints[si]!, activeColumnX)}
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
              <text
                x={columnCenterX(i)}
                y={height - 8}
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {datum.category}
              </text>
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
          rows={series.map((s) => ({
            key: s.key,
            label: s.label,
            value: valueFormatter(active.values[s.key] ?? 0),
            color: s.color,
          }))}
          style={{
            left: `${(activeColumnX / intrinsicWidth) * 100}%`,
            top: `${(Math.max(Math.min(...seriesPoints.map((pts) => yOnSmoothPath(pts, activeColumnX))), 48) / height) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 12px))',
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
