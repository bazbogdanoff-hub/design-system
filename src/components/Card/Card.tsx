import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Card.module.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardElevation = 'raised' | 'flat';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Outer padding. `none` · `sm` (16) · `md` (20) · `lg` (24). */
  padding?: CardPadding;
  /** `raised` adds the glass inner-shadow; `flat` is border only. */
  elevation?: CardElevation;
  /** Adds a hover background + `cursor: pointer`. The consumer supplies the interaction semantics. */
  interactive?: boolean;
  /** Render as the child element (e.g. an `<a>` or router `<Link>`). */
  asChild?: boolean;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
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

export type CardSectionSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Internal gap between children. `none` · `sm` (8) · `md` (12) · `lg` (16). */
  spacing?: CardSectionSpacing;
  /** 1px bottom border — omit on the last section. */
  divider?: boolean;
  /** Subtle fill — e.g. a footer / toolbar row. */
  muted?: boolean;
}

const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(function CardSection(
  { spacing = 'md', divider = false, muted = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.section, className)}
      data-spacing={spacing}
      data-divider={divider || undefined}
      data-muted={muted || undefined}
      {...rest}
    />
  );
});

export const Card = Object.assign(CardRoot, { Section: CardSection });
