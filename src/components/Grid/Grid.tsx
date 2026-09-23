import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Grid.module.css';

type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count. Default 16 (Page layout guide). */
  columns?: number;
  /** Gutter — `space/*` (none·4·8·12·16·20). Default `lg` (16). */
  gap?: Gap;
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns to span, 1–`columns`. Default = full width. */
  span?: number;
  /** Columns to span below `lg` (sidebar-collapse / narrow). Optional. */
  spanSm?: number;
  /** 1-based start column. */
  start?: number;
}

const GridRoot = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 16, gap = 'lg', className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.grid, className)}
      data-gap={gap}
      style={{ '--grid-cols': columns, ...style } as CSSProperties}
      {...rest}
    />
  );
});

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(function GridItem(
  { span, spanSm, start, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.item, className)}
      style={
        {
          '--span': span,
          '--span-sm': spanSm ?? span,
          '--start': start,
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  );
});

/**
 * A 16-column (configurable) CSS grid with a token gutter. `Grid.Item span={n}`
 * sizes a child; uneven splits are just different spans (`8` + `4`, `4` + `4` +
 * `4` + `4`). Defaults match Page's layout guide (16 cols / gutter 16). For
 * dashboard / content layout inside a `Page`.
 */
export const Grid = Object.assign(GridRoot, { Item: GridItem });
