import type { CSSProperties } from 'react';
import styles from './ChartTooltip.module.css';

export interface ChartTooltipRow {
  key: string;
  /** Series name. */
  label: string;
  /** Pre-formatted value — the caller decides rounding/units. */
  value: string;
  color: string;
}

export interface ChartTooltipProps {
  /** The hovered category, e.g. a day name. */
  title: string;
  rows: ChartTooltipRow[];
  /** Positioning — the chart places this (e.g. `transform: translate(x, y)`). */
  style?: CSSProperties;
}

/**
 * Hover/focus readout for a chart — lists every series at the hovered
 * category so the reader never has to land precisely on a segment. Title,
 * values, and series names share `text/label/xs` + `color/text/muted`.
 * Series are keyed with a short line, not a filled box.
 */
export function ChartTooltip({ title, rows, style }: ChartTooltipProps) {
  return (
    <div className={styles.tooltip} style={style} role="tooltip">
      <div className={styles.title}>{title}</div>
      <ul className={styles.rows}>
        {rows.map((row) => (
          <li key={row.key} className={styles.row}>
            <span className={styles.key} style={{ backgroundColor: row.color }} aria-hidden="true" />
            <span className={styles.value}>{row.value}</span>
            <span className={styles.label}>{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
