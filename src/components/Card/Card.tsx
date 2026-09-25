import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Card.module.css';

export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner padding on all sides. `none` (0) · `xs` (8) · `sm` (12) · `md` (16, default) · `lg` (20) · `xl` (24).
   * `xs` is for a card that is a container for controls rather than for
   * content — a toolbar, a control bar — where 12 already reads as a margin
   * around buttons that carry their own padding. */
  padding?: CardPadding;
  /** Lifts the card off whatever is behind it, for a card that FLOATS —
   *  over a map, over a canvas — rather than sitting in a page.
   *
   *  This exists because the glass look is itself a `box-shadow`, so a
   *  consumer adding a drop shadow in its own stylesheet replaces the glass
   *  instead of adding to it, and the card quietly loses its surface. The
   *  only safe place to combine them is here. */
  elevated?: boolean;
  /** Render as the child element (e.g. `<article>`, `<li>`, an `<a>`). */
  asChild?: boolean;
}

/**
 * A surface that groups related content — a padded box, nothing more.
 * Always the glass look: #fcfcfc fill, 16px radius, an asymmetric white catch on
 * the top + left edges, and a soft inner "vignette xs" shadow.
 *
 * Sections, dividers, footers, clickable behaviour: the consumer's composition,
 * or a specific card type built on top. See docs/architecture.md.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = 'md', elevated = false, asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp ref={ref} className={cn(styles.card, className)} data-padding={padding}
      data-elevated={elevated || undefined} {...rest} />
  );
});
