import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import styles from './ListCardHeader.module.css';

export type ListCardHeaderSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ListCardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `xs` (16/12) · `sm` (18/13) · `md` (20/14, default) · `lg` (24/16) -
   * `text.heading.*` / `text.body.*` at the same size step. Usually left
   * unset and cascaded from a `ListCard` ancestor - see `ListCard`'s own
   * `size` prop. */
  size?: ListCardHeaderSize;
  heading: ReactNode;
  /** The second, muted line. Omit entirely to render just the heading -
   * mirrors the Figma reference's own `description` boolean (default
   * `true` there; here it's just "is the prop present"). */
  description?: ReactNode;
  /** The heading's colour: `default` (`color.text.default`), or `strong`
   * (`color.text.strong`) for a heading on a `Tile` inside a card, one level
   * under the card's own (owner, 2026-10-05). */
  headingColor?: 'default' | 'strong';
  /** A ← before the heading, on its line (owner, 2026-10-06: the phone
   * back button); the description keeps the full width under both. */
  onBack?: () => void;
}

/**
 * `ListCard`'s title region - a heading and an optional muted description
 * line, stacked with no gap between them (matches the Figma reference
 * exactly: `itemSpacing: 0`). Always sits directly on `ListCard`'s own
 * padded `Card` surface, never on its own background.
 */
export const ListCardHeader = forwardRef<HTMLDivElement, ListCardHeaderProps>(function ListCardHeader(
  { size = 'md', heading, description, headingColor = 'default', onBack, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.header, className)} data-size={size} data-back={onBack != null || undefined} {...rest}>
      {onBack != null && (
        <IconButton
          className={styles.back}
          variant="secondary"
          size="md"
          aria-label="Back"
          icon={<ArrowLeft weight="bold" aria-hidden="true" />}
          onClick={onBack}
        />
      )}
      <p className={styles.heading} data-color={headingColor === 'strong' ? 'strong' : undefined}>
        {heading}
      </p>
      {description != null && <p className={styles.description}>{description}</p>}
    </div>
  );
});
