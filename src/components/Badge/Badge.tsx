import { forwardRef, useCallback, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import { useEdgeCorners } from '../../lib/edgeCorners';
import styles from './Badge.module.css';

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'warning-strong'
  | 'danger';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour. `neutral` (default) · `brand` · `success` · `warning` · `warning-strong` (orange) · `danger`. */
  tone?: BadgeTone;
  /** `xs` (12) · `sm` (13) · `md` (14, default) · `lg` (16). */
  size?: BadgeSize;
  /** Shows `leadingIcon` (owner, 2026-10-04: a boolean, as in Figma; it was
   * `icon="hasIcon"`). The shape is the same either way. */
  hasIcon?: boolean;
  /** Leading glyph when `hasIcon`. Inherits tone colour via `currentColor`. */
  leadingIcon?: ReactNode;
  /** Render as the child element (e.g. an `<a>`, a `<button>`). */
  asChild?: boolean;
}

/**
 * A small status/label pill - subtle tinted fill, bold label, optional leading
 * icon. Semantic `tone`, not a colour. Presentational: no border, no elevation,
 * no interaction states.
 *
 * For the fixed severity scale (low / attention / warning / critical) use
 * `SeverityBadge`, which composes this. See docs/architecture.md.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    tone = 'neutral',
    size = 'md',
    hasIcon = false,
    leadingIcon,
    asChild = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'span';
  // Corners on a side that sits on its card's padding edge go back to the
  // badge's original radius (lib/edgeCorners.ts).
  const localRef = useRef<HTMLSpanElement | null>(null);
  useEdgeCorners(localRef);
  const setRef = useCallback(
    (node: HTMLSpanElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  return (
    <Comp
      ref={setRef}
      className={cn(styles.badge, className)}
      data-tone={tone}
      data-size={size}
      {...rest}
    >
      {/* asChild forwards to a single consumer element - the consumer composes
          their own icon in that case; leadingIcon is only for the plain span. */}
      {asChild ? (
        children
      ) : (
        <>
          {hasIcon && leadingIcon != null && (
            <span className={styles.icon} aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          {children}
        </>
      )}
    </Comp>
  );
});
