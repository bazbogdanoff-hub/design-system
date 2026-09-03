import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './Badge.module.css';

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'warning-strong'
  | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour. `neutral` (default) · `brand` · `success` · `warning` · `warning-strong` (orange) · `danger`. */
  tone?: BadgeTone;
  /** `sm` (13) · `md` (14, default) · `lg` (16). */
  size?: BadgeSize;
  /** Optional leading icon, rendered in a 1em box that inherits the tone colour. */
  icon?: ReactNode;
  /** Render as the child element (e.g. an `<a>`, a `<button>`). */
  asChild?: boolean;
}

/**
 * A small status/label pill — subtle tinted fill, bold label, optional leading
 * icon. Semantic `tone`, not a colour. Presentational: no border, no elevation,
 * no interaction states.
 *
 * For the fixed severity scale (low / attention / warning / critical) use
 * `SeverityBadge`, which composes this. See docs/architecture.md.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', size = 'md', icon, asChild = false, className, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      ref={ref}
      className={cn(styles.badge, className)}
      data-tone={tone}
      data-size={size}
      {...rest}
    >
      {/* asChild forwards to a single consumer element — the consumer composes
          their own icon in that case; `icon` is only rendered for the plain span. */}
      {asChild ? (
        children
      ) : (
        <>
          {icon != null && (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
        </>
      )}
    </Comp>
  );
});
