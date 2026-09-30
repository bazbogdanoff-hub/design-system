import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useContainerSize } from '../../lib/useContainerSize';
import { useRemScale } from '../../lib/rem';
import { GlassFilter, glassFilterId } from '../../lib/glassFilter';
import styles from './DonutChart.module.css';

export interface DonutChartDatum {
  key: string;
  label: string;
  value: number;
  /** Any CSS color value — usually a token var. */
  color: string;
}

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Slices, in order clockwise from the top. Zero values are skipped. */
  data: DonutChartDatum[];
  /** Under the total in the middle, e.g. "due today". */
  caption?: ReactNode;
  /** Shown in the middle when every value is zero. */
  emptyCaption?: ReactNode;
  valueFormatter?: (value: number) => string;
  'aria-label': string;
}

/** The ring's gap between slices, in px along the ring's centre line. */
const GAP = 3;
/** Room kept around the ring for the drop shadow. */
const SHADOW_ROOM = 8;
/** Ring thickness in px at the 16px root (owner, 2026-09-29: 24, down from
 * 14% of the chart's size); it scales with the root like everything else. */
const THICKNESS_PX = 24;

/**
 * A part-of-a-whole ring (owner, 2026-09-29) — slices of one total, the
 * total in the middle. Built in code first; the Figma master follows from
 * docs/components/DonutChart.md.
 *
 * Every slice is its own rounded block with a gap on each side, and wears
 * the glass recipe (lib/glassFilter.tsx) like BarChart's blocks. Hovering or
 * focusing a slice dims the others and puts that slice's value and name in
 * the middle — no floating tooltip. Pair with `ChartLegend` /
 * `ChartLegendGroup` for identity; a screen-reader table carries the values.
 * Fills its container; the ring is the largest square that fits.
 */
export function DonutChart({
  data,
  caption,
  emptyCaption,
  valueFormatter = (v) => String(v),
  className,
  'aria-label': ariaLabel,
  ...rest
}: DonutChartProps) {
  const [wrapperRef, measured] = useContainerSize<HTMLDivElement>();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const glassBase = useId();
  const remScale = useRemScale();

  const size = Math.max(80, Math.min(measured.width || 200, measured.height || 200));
  const thickness = THICKNESS_PX * remScale;
  // The glass scales with the ring (owner, 2026-09-29): a 1px catch on a
  // 24px ring reads as clay, not depth — 8% of the thickness, 2–3px; the
  // inner shadow grows by thickness / 16, the pill height it was tuned on.
  const catchWidth = Math.min(3, Math.max(2, thickness * 0.08));
  const innerScale = thickness / 16;
  const radius = size / 2 - thickness / 2 - SHADOW_ROOM;
  const circumference = 2 * Math.PI * radius;
  const centre = size / 2;

  const slices = data.filter((d) => d.value > 0);
  const total = slices.reduce((sum, d) => sum + d.value, 0);
  const active = slices.find((d) => d.key === activeKey) ?? null;

  // Round caps reach half the thickness past each end, so each slice's dash
  // is shortened by the cap and the gap, and starts that far in.
  let cursor = 0;
  const arcs = slices.map((d, i) => {
    const share = (d.value / total) * circumference;
    const start = cursor;
    cursor += share;
    const trim = slices.length > 1 ? GAP + thickness : 0;
    const length = Math.max(0.01, share - trim);
    const offset = start + (slices.length > 1 ? trim / 2 : 0);
    return { d, i, length, offset };
  });

  return (
    <div ref={wrapperRef} className={cn(styles.wrapper, className)} {...rest}>
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          {slices.map((d, i) => (
            <GlassFilter
              key={d.key}
              id={glassFilterId(glassBase, i)}
              color={d.color}
              region={{ x: 0, y: 0, width: size, height: size }}
              catchWidth={catchWidth}
              frameRotation={-90}
              innerScale={innerScale}
            />
          ))}
        </defs>

        {total === 0 ? (
          <circle cx={centre} cy={centre} r={radius} className={styles.empty} strokeWidth={thickness} fill="none" />
        ) : (
          // Two layers: the entrance animation's transform-origin (CSS) must
          // not reach the quarter turn that starts the ring at twelve.
          <g className={styles.ring}>
          <g transform={`rotate(-90 ${centre} ${centre})`}>
            {arcs.map(({ d, i, length, offset }) => (
              <circle
                key={d.key}
                cx={centre}
                cy={centre}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeLinecap={slices.length > 1 ? 'round' : 'butt'}
                strokeDasharray={`${length} ${circumference}`}
                strokeDashoffset={-offset}
                filter={`url(#${glassFilterId(glassBase, i)})`}
                className={styles.slice}
                data-dim={active != null && active.key !== d.key ? '' : undefined}
                tabIndex={0}
                aria-label={`${d.label}: ${valueFormatter(d.value)}`}
                onPointerEnter={() => setActiveKey(d.key)}
                onPointerLeave={() => setActiveKey((k) => (k === d.key ? null : k))}
                onFocus={() => setActiveKey(d.key)}
                onBlur={() => setActiveKey((k) => (k === d.key ? null : k))}
              />
            ))}
          </g>
          </g>
        )}
      </svg>

      {/* The middle: the total, or the hovered slice. */}
      <div className={styles.centre} aria-hidden="true">
        <span className={styles.value}>{valueFormatter(active ? active.value : total)}</span>
        <span className={styles.caption}>
          {active ? active.label : total === 0 ? (emptyCaption ?? caption) : caption}
        </span>
      </div>

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
