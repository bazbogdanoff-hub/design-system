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
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
/** Icon shape variant — `default` (uniform radius) · `hasIcon` (32px left corners). */
export type BadgeIcon = 'default' | 'hasIcon';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour. `neutral` (default) · `brand` · `success` · `warning` · `warning-strong` (orange) · `danger`. */
  tone?: BadgeTone;
  /** `xs` (12) · `sm` (13) · `md` (14, default) · `lg` (16). */
  size?: BadgeSize;
  /** Icon variant. `default` — text only, uniform radius. `hasIcon` — leading
   * icon slot + 32px left corners (right corners stay the size radius). */
  icon?: BadgeIcon;
  /** Leading glyph when `icon="hasIcon"`. Inherits tone colour via `currentColor`. */
  leadingIcon?: ReactNode;
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
  {
    tone = 'neutral',
    size = 'md',
    icon = 'default',
    leadingIcon,
    asChild = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      ref={ref}
      className={cn(styles.badge, className)}
      data-tone={tone}
      data-size={size}
      data-icon={icon}
      {...rest}
    >
      {/* asChild forwards to a single consumer element — the consumer composes
          their own icon in that case; leadingIcon is only for the plain span. */}
      {asChild ? (
        children
      ) : (
        <>
          {icon === 'hasIcon' && leadingIcon != null && (
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
