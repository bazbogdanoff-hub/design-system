import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Stack.module.css';

type Gap = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** `column` (default) or `row`. */
  direction?: 'row' | 'column';
  /** Gap between children — `space/*` (none·2·4·8·12·16·20·24). */
  gap?: Gap;
  /** Cross-axis alignment. */
  align?: Align;
  /** Main-axis distribution. */
  justify?: Justify;
  /** Allow wrapping (row only). */
  wrap?: boolean;
  /** Row only — children share the width evenly and stretch to equal height. */
  columns?: boolean;
  as?: ElementType;
  asChild?: boolean;
}

/**
 * The layout workhorse — a flex container with token gap. `direction="row"
 * columns` gives the stretch-columns layout (equal-width, equal-height panels)
 * used inside the AppShell content area.
 */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  {
    direction = 'column',
    gap = 'md',
    align,
    justify,
    wrap = false,
    columns = false,
    as,
    asChild = false,
    className,
    ...rest
  },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? 'div');
  return (
    <Comp
      ref={ref}
      className={cn(styles.stack, columns && styles.columns, className)}
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      {...rest}
    />
  );
});
