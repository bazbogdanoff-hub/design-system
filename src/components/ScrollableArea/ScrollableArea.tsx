import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './ScrollableArea.module.css';

export interface ScrollableAreaProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `div`. */
  as?: ElementType;
  /** Render as the child element instead. */
  asChild?: boolean;
}

/**
 * A generic vertically-scrolling container — recessed background, inner-shadow
 * edges. No variants (matches Figma: one component, no properties). Sizing is
 * up to the consumer (flex/grid parent, explicit height, etc.) — this only
 * owns overflow + the recessed look.
 */
export const ScrollableArea = forwardRef<HTMLElement, ScrollableAreaProps>(function ScrollableArea(
  { as, asChild = false, className, ...rest },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? 'div');
  return <Comp ref={ref} className={cn(styles.scrollableArea, className)} {...rest} />;
});
