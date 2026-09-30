import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useContainerSize } from '../../lib/useContainerSize';
import { useRemScale } from '../../lib/rem';
import { GlassFilter, glassFilterId } from '../../lib/glassFilter';
import { ChartLegendGroup } from '../ChartLegendGroup';
import styles from './GaugeChart.module.css';

export interface GaugeChartDatum {
  key: string;
  label: string;
  value: number;
  /** Any CSS color value — usually a token var. */
  color: string;
}

export interface GaugeChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
  /** Segments, in order from the left end of the arc to the right. Zero
   * values are skipped. */
  data: GaugeChartDatum[];
  /** The headline under the arc, e.g. "95%". */
  value: ReactNode;
  /** Under the headline, e.g. "fit to run · 57 / 60". */
  caption?: ReactNode;
  /** Makes each segment a button — e.g. open the units behind it. */
  onSelect?: (key: string) => void;
  valueFormatter?: (value: number) => string;
  /** The segments' names under the arc, in the legend tile (values are
   * on hover and in the table).
   * Default on. */
  legend?: boolean;
  'aria-label': string;
}

/** At the 16px root; all scale with it. */
const THICKNESS_PX = 28; // thick, but the bowl must hold the headline (owner, 2026-09-30: 48 → 32 → 28)
const CORNER_PX = 6; // each segment's corner radius
const GAP_PX = 4; // between segments, along the middle of the band
const SHADOW_ROOM_PX = 10;
const MAX_OUTER_PX = 100; // the arc stops growing here (owner, 2026-09-30: 136 → 112 → 100)
const MIN_SEGMENT_PX = 16; // shortest arc a non-zero segment is drawn with

/**
 * A half-ring gauge (owner, 2026-09-30) — the donut's glass, opened into an
 * arc from nine o'clock over the top to three, and thicker (28px to its 24). Segments
 * share the arc by value, left to right; the headline sits in the bowl.
 * Hovering or focusing a segment dims the others and puts its value and
 * name in the middle, as DonutChart does. Built in code first; the Figma
 * master follows from docs/components/GaugeChart.md.
 *
 * Segments are filled ring sectors with small rounded corners, not
 * round-capped strokes: at this thickness a round cap would swell a
 * one-in-sixty segment into a blob a quarter of the arc long.
 */
export function GaugeChart({
  data,
  value,
  caption,
  onSelect,
  valueFormatter = (v) => String(v),
  legend = true,
  className,
  'aria-label': ariaLabel,
  ...rest
}: GaugeChartProps) {
  const [wrapperRef, measured] = useContainerSize<HTMLDivElement>();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const glassBase = useId();
  const s = useRemScale();

  const thickness = THICKNESS_PX * s;
  const corner = CORNER_PX * s;
  const gap = GAP_PX * s;
  const room = SHADOW_ROOM_PX * s;

  // The arc is the widest half ring that fits both ways, up to MAX_OUTER_PX.
  const width = Math.max(160 * s, measured.width || 320);
  const heightLimit = measured.height || width / 2 + 2 * room;
  const outer = Math.max(thickness * 1.5, Math.min(MAX_OUTER_PX * s, width / 2 - room, heightLimit - 2 * room));
  const mid = outer - thickness / 2;
  const cx = width / 2;
  const cy = outer + room;
  const svgHeight = outer + 2 * room;

  const slices = data.filter((d) => d.value > 0);
  const total = slices.reduce((sum, d) => sum + d.value, 0);
  const active = slices.find((d) => d.key === activeKey) ?? null;

  // The glass scales with the band, as the donut's does.
  // Half the donut's catch (owner, 2026-09-30): ~1px at 28px thick.
  const catchWidth = Math.min(1.5, Math.max(1, thickness * 0.0375));
  const innerScale = thickness / 16;

  // Angles run from π (nine o'clock) to 2π (three), clockwise over the top.
  // Corners are drawn by a stroke of the segment's own colour, 2 × corner
  // wide with round joins, so the sector is shrunk by `corner` on every side
  // first.
  const rIn = mid - thickness / 2 + corner;
  const rOut = mid + thickness / 2 - corner;
  const pt = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;

  // Every segment gets at least MIN_SEGMENT_PX of arc beyond its gap,
  // borrowed from the largest: one in sixty is ~6px of arc — less than its
  // own corners — and would collapse into a radial splinter. The exact
  // values stay in the legend and on hover.
  const minSweep = (MIN_SEGMENT_PX * s + gap) / mid;
  const sweeps = slices.map((d) => (d.value / total) * Math.PI);
  const deficit = sweeps.reduce((sum, w) => sum + Math.max(0, minSweep - w), 0);
  const largest = sweeps.indexOf(Math.max(...sweeps));
  const fitted = sweeps.map((w, i) => (i === largest ? w - deficit : Math.max(w, minSweep)));

  let cursor = Math.PI;
  const arcs = slices.map((d, i) => {
    const sweep = fitted[i]!;
    const a0 = cursor;
    cursor += sweep;
    const trimStart = (i === 0 ? 0 : gap / 2) / mid + corner / mid;
    const trimEnd = (i === slices.length - 1 ? 0 : gap / 2) / mid + corner / mid;
    let s0 = a0 + trimStart;
    let s1 = a0 + sweep - trimEnd;
    if (s1 - s0 < 0.001) {
      const c = (s0 + s1) / 2;
      s0 = c - 0.0005;
      s1 = c + 0.0005;
    }
    const large = s1 - s0 > Math.PI ? 1 : 0;
    const path = [
      `M${pt(rOut, s0)}`,
      `A${rOut},${rOut} 0 ${large} 1 ${pt(rOut, s1)}`,
      `L${pt(rIn, s1)}`,
      `A${rIn},${rIn} 0 ${large} 0 ${pt(rIn, s0)}`,
      'Z',
    ].join(' ');
    return { d, i, path };
  });

  return (
    <div ref={wrapperRef} className={cn(styles.wrapper, className)} {...rest}>
      <div className={styles.stage} style={{ height: svgHeight }}>
        <svg className={styles.svg} width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`} role="group" aria-label={ariaLabel}>
          <defs>
            {slices.map((d, i) => (
              <GlassFilter
                key={d.key}
                id={glassFilterId(glassBase, i)}
                color={d.color}
                region={{ x: 0, y: 0, width, height: svgHeight }}
                catchWidth={catchWidth}
                innerScale={innerScale}
              />
            ))}
          </defs>

          {total === 0 ? (
            <path
              d={`M${pt(mid, Math.PI)} A${mid},${mid} 0 0 1 ${pt(mid, 2 * Math.PI)}`}
              className={styles.empty}
              strokeWidth={thickness}
              fill="none"
            />
          ) : (
            <g className={styles.arc}>
              {arcs.map(({ d, i, path }) => (
                <path
                  key={d.key}
                  d={path}
                  fill={d.color}
                  stroke={d.color}
                  strokeWidth={2 * corner}
                  strokeLinejoin="round"
                  filter={`url(#${glassFilterId(glassBase, i)})`}
                  className={styles.segment}
                  data-dim={active != null && active.key !== d.key ? '' : undefined}
                  data-selectable={onSelect ? '' : undefined}
                  tabIndex={0}
                  role={onSelect ? 'button' : 'img'}
                  aria-label={`${d.label}: ${valueFormatter(d.value)}`}
                  onClick={onSelect ? () => onSelect(d.key) : undefined}
                  onKeyDown={
                    onSelect
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelect(d.key);
                          }
                        }
                      : undefined
                  }
                  onPointerEnter={() => setActiveKey(d.key)}
                  onPointerLeave={() => setActiveKey((k) => (k === d.key ? null : k))}
                  onFocus={() => setActiveKey(d.key)}
                  onBlur={() => setActiveKey((k) => (k === d.key ? null : k))}
                />
              ))}
            </g>
          )}
        </svg>

        {/* The bowl: the headline, or the hovered segment. */}
        <div className={styles.centre} style={{ bottom: room }} aria-hidden="true">
          <span className={styles.value}>{active ? valueFormatter(active.value) : value}</span>
          {(active || caption != null) && <span className={styles.caption}>{active ? active.label : caption}</span>}
        </div>
      </div>

      {legend && (
        <ChartLegendGroup
          items={data.map((d) => ({ key: d.key, label: d.label, color: d.color }))}
        />
      )}

      {/* Hidden in a div, not on the table: a table won't shrink below its
          rows, so a 1px table still stretched the page's scroll height. */}
      <div className={styles.srOnlyTable}>
        <table>
          <caption>{ariaLabel}</caption>
          <tbody>
            {data.map((d) => (
              <tr key={d.key}>
                <th scope="row">{d.label}</th>
                <td>{valueFormatter(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
