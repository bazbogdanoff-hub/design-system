import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './ChartLegend.module.css';

export interface ChartLegendItem {
  /** Series key — must match a `BarChart` series `key` for consistent color. */
  key: string;
  /** Series name shown next to the swatch. */
  label: string;
  /** Any CSS color value — usually a token var, e.g. `var(--color-chart-1)`. */
  color: string;
}

export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> {
  items: ChartLegendItem[];
}

/**
 * The identity channel for a chart with 2+ series — a swatch + label per
 * series. Never color-alone: the label is always visible text, never
 * colored itself (identity comes from the swatch beside it).
 */
export function ChartLegend({ items, className, ...rest }: ChartLegendProps) {
  return (
    <ul className={cn(styles.legend, className)} {...rest}>
      {items.map((item) => (
        <li key={item.key} className={styles.item}>
          <span className={styles.swatch} style={{ backgroundColor: item.color }} aria-hidden="true" />
          <span className={styles.label}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
