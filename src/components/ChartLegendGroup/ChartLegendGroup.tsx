import { cn } from '../../lib/cn';
import { ChartLegend, type ChartLegendProps } from '../ChartLegend';
import { Tile } from '../Tile';
import styles from './ChartLegendGroup.module.css';

export type ChartLegendGroupProps = ChartLegendProps;

/**
 * A chart's legend set on its own small tile (owner, 2026-09-29): a `Tile`
 * with `md` (8) corners, 8 top and bottom and 12 at the sides, full width,
 * as tall as its content. For a legend under the plot, where the chart card
 * is too narrow for it in the header row.
 */
export function ChartLegendGroup({ className, ...rest }: ChartLegendGroupProps) {
  return (
    <Tile radius="md" className={cn(styles.group, className)}>
      <ChartLegend {...rest} />
    </Tile>
  );
}
