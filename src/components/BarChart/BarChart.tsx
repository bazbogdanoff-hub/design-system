import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ChartTooltip } from '../ChartTooltip';
import { niceScale } from '../../lib/niceScale';
import { useContainerSize } from '../../lib/useContainerSize';
import { useRemScale } from '../../lib/rem';
import { GlassFilter, glassFilterId } from '../../lib/glassFilter';
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

const GAP_PX = 2; // surface-color gap between stacked segments (marks-and-anatomy.md)
const CORNER_PX = 4; // rounded data-end radius
const MAX_BAR_THICKNESS_PX = 24;
const MIN_HEIGHT_PX = 140; // pre-measurement / degenerate-container fallback
// Top inset leaves a little room for hover tooltips above tall bars.
// `left` is only the floor — the real left inset is measured from the widest
// axis label (see `padLeft`). A fixed 24 was enough for single-digit counts
// and cut four-figure money labels off the left edge of the viewBox.
const PADDING_PX = { top: 20, right: 16, bottom: 24, left: 24 };
/** Distance from a label's right edge to the axis. */
const AXIS_LABEL_GAP_PX = 8;

/** A rectangle with all four corners rounded — every stacked block is its
 * own rounded block (owner, 2026-09-29). The radius shrinks to fit a short
 * or narrow block. */
function roundedRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.min(radius, height / 2, width / 2);
  if (r <= 0) return `M${x},${y} h${width} v${height} h${-width} Z`;
  return [
    `M${x},${y + r}`,
    `a${r},${r} 0 0 1 ${r},${-r}`,
    `h${width - 2 * r}`,
    `a${r},${r} 0 0 1 ${r},${r}`,
    `v${height - 2 * r}`,
    `a${r},${r} 0 0 1 ${-r},${r}`,
    `h${-(width - 2 * r)}`,
    `a${r},${r} 0 0 1 ${-r},${-r}`,
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
  // Every geometry constant above is authored at the 16px root and scales
  // with it, like the rem-based CSS around the chart.
  const s = useRemScale();
  const GAP = GAP_PX * s;
  const CORNER = CORNER_PX * s;
  const MAX_BAR_THICKNESS = MAX_BAR_THICKNESS_PX * s;
  const MIN_HEIGHT = MIN_HEIGHT_PX * s;
  const AXIS_LABEL_GAP = AXIS_LABEL_GAP_PX * s;
  const PADDING = {
    top: PADDING_PX.top * s,
    right: PADDING_PX.right * s,
    bottom: PADDING_PX.bottom * s,
    left: PADDING_PX.left * s,
  };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const axisRef = useRef<SVGGElement>(null);
  const [measuredLabel, setMeasuredLabel] = useState(0);
  const titleId = useId();
  const glassBase = useId();
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

  /* Reserve exactly what the longest tick label needs. Labels are drawn
     end-anchored at `padLeft - AXIS_LABEL_GAP`, so too small an inset pushes
     them off the left edge of the viewBox and they're clipped, not wrapped.

     The width is *measured*, not estimated from character count: digit
     advances differ by font and by glyph, and a per-character guess was out
     by enough to shave the first digit off a four-figure label. The first
     paint uses the floor, the layout effect below corrects it before the
     browser shows anything. */
  const padLeft = Math.max(PADDING.left, measuredLabel + AXIS_LABEL_GAP * 2);

  const plotWidth = intrinsicWidth - padLeft - PADDING.right;
  const bandWidth = plotWidth / Math.max(1, data.length);
  const barWidth = Math.min(MAX_BAR_THICKNESS, bandWidth * 0.5);

  const yFor = (value: number) => PADDING.top + plotHeight * (1 - value / axisMax);

  /* Measure the rendered labels themselves. Re-runs whenever the tick values
     change; a font swapping in fires the ResizeObserver on the wrapper, which
     re-renders and re-measures. */
  const tickKey = ticks.join(',');
  useLayoutEffect(() => {
    const g = axisRef.current;
    if (!g) return;
    let widest = 0;
    for (const node of g.querySelectorAll('text')) {
      widest = Math.max(widest, (node as SVGTextElement).getComputedTextLength());
    }
    setMeasuredLabel((prev) => (Math.abs(prev - widest) > 0.5 ? widest : prev));
  }, [tickKey, intrinsicWidth]);

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
        <g ref={axisRef}>
        {ticks.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                x2={intrinsicWidth - PADDING.right}
                y1={y}
                y2={y}
                className={styles.gridline}
              />
              <text
                x={padLeft - AXIS_LABEL_GAP}
                y={y}
                className={styles.axisLabel}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          );
        })}
        </g>

        {/* Glass per series (lib/glassFilter.tsx) — region = the whole chart,
            so the shadow is never clipped. */}
        <defs>
          {series.map((s, si) => (
            <GlassFilter
              key={s.key}
              id={glassFilterId(glassBase, si)}
              color={s.color}
              region={{ x: 0, y: 0, width: intrinsicWidth, height }}
            />
          ))}
        </defs>

        {/* bars */}
        {data.map((datum, i) => {
          const x = padLeft + bandWidth * i + (bandWidth - barWidth) / 2;
          let cumulative = 0;
          // Every coloured block is its own rounded block (owner, 2026-09-29):
          // all four corners at CORNER (less if the block is shorter), and a
          // GAP between it and the block below; the lowest sits on the
          // baseline.
          let hasBelow = false;
          const segments = series.map((s, si) => {
            const value = datum.values[s.key] ?? 0;
            const segTop = cumulative + value;
            cumulative = segTop;
            const yTop = yFor(segTop);
            const yBottom = yFor(cumulative - value);
            const rawHeight = yBottom - yTop;
            if (rawHeight <= 0) return null;
            const segHeight = hasBelow ? Math.max(0, rawHeight - GAP) : rawHeight;
            hasBelow = true;
            const path = roundedRectPath(x, yTop, barWidth, segHeight, CORNER);
            return (
              <path
                key={s.key}
                d={path}
                fill={s.color}
                filter={`url(#${glassFilterId(glassBase, si)})`}
                className={activeIndex === i ? styles.segmentActive : styles.segment}
              />
            );
          });

          return (
            <g key={datum.category}>
              {/* Grows up from the baseline on mount, one column after the
                  other (CSS; off under reduced motion). */}
              <g
                className={styles.bar}
                style={{ transformOrigin: `0 ${yFor(0)}px`, '--i': i } as CSSProperties}
              >
                {segments}
              </g>
              <text
                x={x + barWidth / 2}
                y={height - 8 * s}
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {datum.category}
              </text>
              {/* hit target — the whole column, taller/wider than the bar itself */}
              <rect
                x={padLeft + bandWidth * i}
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
            left: `${((padLeft + bandWidth * (activeIndex + 0.5)) / intrinsicWidth) * 100}%`,
            // clamped so a near-max bar's tooltip can't render above the
            // chart's own top edge — PADDING.top already reserves the
            // typical headroom, this is the safety net for tall tooltips
            top: `${(Math.max(yFor(activeTotal), 48) / height) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 0.5rem))',
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
