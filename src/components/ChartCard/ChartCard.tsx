import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Card } from '../Card';
import { ChartLegend, type ChartLegendItem } from '../ChartLegend';
import { cn } from '../../lib/cn';
import styles from './ChartCard.module.css';

export interface ChartCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** A small companion right after the title, centred on it, 12px away -
   * e.g. a count the whole chart qualifies (owner, 2026-09-30: the expiry
   * heatmap's lapsed counter). Outside the heading element, so it keeps
   * its own type and can be a button. */
  titleAccessory?: ReactNode;
  /** 2+ series → always show a legend (the dependable identity channel). A
   * single-series chart needs none - the title already says what's plotted.
   * Always sits on the same header row as the title and filters. */
  legend?: ChartLegendItem[];
  /** `Filter` instances, grouped with `action` at the header's right edge.
   * Per-chart filters (date range, dimension) - a deliberate deviation from
   * "filters live in one shared row above all charts": these mockups scope
   * each chart independently. */
  filters?: ReactNode;
  /** A single trailing icon action next to the filters - e.g. an
   * expand/"view full chart" `IconButton`. */
  action?: ReactNode;
  /** Space between the header row and the chart: `md` (16px, default) or
   * `sm` (8px) - for a chart whose own top row (an axis) already sets it
   * off from the title (owner, 2026-09-30: the dashboard timeline). */
  headerGap?: 'sm' | 'md';
  /** `stretch` (default) - the chart fills the card below the header.
   * `end` - the chart keeps its own height and sits at the card's foot; the
   * space above it grows instead (owner, 2026-09-30: a card matched to a
   * taller neighbour keeps its chart still rather than stretching it). */
  bodyAlign?: 'stretch' | 'end';
  /** The chart itself - `BarChart`, or any future chart type. */
  children: ReactNode;
}

/**
 * The card shell every chart sits in: title + legend + filters/action on
 * one row (`space-between` auto-distributes the gaps), chart body below.
 * Composes `Card` (never detached) - L2.
 */
export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(function ChartCard(
  { title, titleAccessory, legend, filters, action, headerGap = 'md', bodyAlign = 'stretch', children, className, ...rest },
  ref,
) {
  return (
    <Card ref={ref} padding="md" className={cn(styles.card, className)} data-header-gap={headerGap} {...rest}>
      <div className={styles.header}>
        {titleAccessory != null ? (
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>{title}</h3>
            {titleAccessory}
          </div>
        ) : (
          <h3 className={styles.title}>{title}</h3>
        )}
        {legend && legend.length > 0 && (
          <div className={styles.legendRow}>
            <ChartLegend items={legend} />
          </div>
        )}
        {(filters || action) && (
          <div className={styles.trailing}>
            {filters && <div className={styles.filters}>{filters}</div>}
            {action}
          </div>
        )}
      </div>
      <div className={styles.body} data-align={bodyAlign}>
        {children}
      </div>
    </Card>
  );
});
