import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Card.module.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardElevation = 'raised' | 'flat';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner padding on all sides. `none` · `sm` (16) · `md` (20, default) · `lg` (24). */
  padding?: CardPadding;
  /** `raised` adds the glass inner-shadow; `flat` is border only. */
  elevation?: CardElevation;
  /** Adds a hover background + `cursor: pointer`. The consumer supplies the interaction semantics. */
  interactive?: boolean;
  /** Render as the child element (e.g. an `<a>` or router `<Link>`). */
  asChild?: boolean;
}

/**
 * A surface that groups related content. A padded box — nothing more.
 * Sections, dividers, footers etc. are the consumer's composition, or belong
 * to a specific card type built on top of this.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = 'md', elevation = 'raised', interactive = false, asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(styles.card, className)}
      data-padding={padding}
      data-elevation={elevation}
      data-interactive={interactive || undefined}
      {...rest}
    />
  );
});
