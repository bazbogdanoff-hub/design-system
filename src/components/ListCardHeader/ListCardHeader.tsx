import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './ListCardHeader.module.css';

export type ListCardHeaderSize = 'sm' | 'md' | 'lg';

export interface ListCardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `sm` (18/13) · `md` (20/14, default) · `lg` (24/16) — `text.heading.*` /
   * `text.body.*` at the same size step (not stepped down the way
   * `FormField`'s own headline is relative to its control). Usually left
   * unset and cascaded from a `ListCard` ancestor — see `ListCard`'s own
   * `size` prop. */
  size?: ListCardHeaderSize;
  heading: ReactNode;
  /** The second, muted line. Omit entirely to render just the heading —
   * mirrors the Figma reference's own `description` boolean (default
   * `true` there; here it's just "is the prop present"). */
  description?: ReactNode;
}

/**
 * `ListCard`'s title region — a heading and an optional muted description
 * line, stacked with no gap between them (matches the Figma reference
 * exactly: `itemSpacing: 0`). Always sits directly on `ListCard`'s own
 * padded `Card` surface, never on its own background.
 */
export const ListCardHeader = forwardRef<HTMLDivElement, ListCardHeaderProps>(function ListCardHeader(
  { size = 'md', heading, description, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.header, className)} data-size={size} {...rest}>
      <p className={styles.heading}>{heading}</p>
      {description != null && <p className={styles.description}>{description}</p>}
    </div>
  );
});
