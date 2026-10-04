import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Tile.module.css';

export type TilePadding = 'none' | 'xs' | 'sm' | 'md';
export type TileRadius = 'md' | 'lg';

export interface TileProps extends HTMLAttributes<HTMLElement> {
  /** The element it renders as - `div` (default), or a landmark / list item
   * when the content calls for one (`TaskTile` is an `article`). */
  as?: 'div' | 'article' | 'section' | 'li';
  /** `none` (default) - the content pads itself · `xs` 8 · `sm` 12 · `md` 16. */
  padding?: TilePadding;
  /** Lifts toward the pointer on hover - rises 2px, grows 1%, its shadow
   * falls further. For tiles that act as one control; leave off for tiles
   * that only hold things. */
  interactive?: boolean;
  /** Corners - `lg` (default) 12, `radius.panel` · `md` 8, `radius.control`,
   * for small tiles such as a chart's legend group. */
  radius?: TileRadius;
}

/**
 * The second-layer card (owner, 2026-09-29): a white surface that sits on a
 * `Card` - task tiles, decision options, anything card-like inside a card.
 * White fill, a white glass catch (2px top + left, 1px bottom + right), a
 * soft inner shadow and a faint drop shadow; `radius.panel` corners.
 *
 * Not `Card` (the first layer, on the page) and not `SelectableCard` (a
 * form control). Built in code first; the Figma master follows from
 * docs/components/Tile.md.
 */
export const Tile = forwardRef<HTMLElement, TileProps>(function Tile(
  { as: Comp = 'div', padding = 'none', radius = 'lg', interactive = false, className, ...rest },
  ref,
) {
  return (
    <Comp
      ref={ref as never}
      className={cn(styles.tile, className)}
      data-padding={padding}
      data-radius={radius}
      data-interactive={interactive || undefined}
      {...rest}
    />
  );
});
