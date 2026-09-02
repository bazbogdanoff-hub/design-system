import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Card.module.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner padding on all sides. `none` (0) · `sm` (12) · `md` (16, default) · `lg` (20). */
  padding?: CardPadding;
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
  { padding = 'md', asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp ref={ref} className={cn(styles.card, className)} data-padding={padding} {...rest} />
  );
});
