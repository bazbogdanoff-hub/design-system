import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Box.module.css';

type Space = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Bg = 'none' | 'default' | 'subtle' | 'card' | 'sunken';
type Radius = 'none' | 'chip' | 'control' | 'panel' | 'container';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** Padding on all sides. Maps to `space/*` (none·4·8·12·16·20). */
  p?: Space;
  /** Horizontal padding (overrides `p`). */
  px?: Space;
  /** Vertical padding (overrides `p`). */
  py?: Space;
  /** Background — a `surface`/`background` token. */
  bg?: Bg;
  /** Corner radius — a radius role token. */
  radius?: Radius;
  /** 1px `border.default`. */
  border?: boolean;
  /** Element to render. Default `div`. */
  as?: ElementType;
  /** Render as the child element instead. */
  asChild?: boolean;
}

/**
 * The generic styled box — a `div` (or `as` / `asChild`) with token-driven
 * padding, background, radius and border. Layout composition lives in `Stack`.
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { p, px, py, bg = 'none', radius = 'none', border = false, as, asChild = false, className, style, ...rest },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? 'div');
  return (
    <Comp
      ref={ref}
      className={cn(styles.box, border && styles.border, className)}
      data-p={px == null && py == null ? p : undefined}
      data-px={px ?? (py != null ? p : undefined)}
      data-py={py ?? (px != null ? p : undefined)}
      data-bg={bg !== 'none' ? bg : undefined}
      data-radius={radius !== 'none' ? radius : undefined}
      style={style}
      {...rest}
    />
  );
});
