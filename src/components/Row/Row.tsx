import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { IconCell, type IconCellTone } from '../IconCell';
import { LabelGroup, type LabelGroupProps } from '../LabelGroup';
import { type LabelSize } from '../Label';
import { cn } from '../../lib/cn';
import styles from './Row.module.css';

export type RowSize = 'sm' | 'md' | 'lg';

/** Figma's Row nests a size-matched `LabelGroup` as its `description`. When a
 * consumer passes a bare `<LabelGroup>` (no explicit `size`), Row applies the
 * mapping so callers don't have to memorise it. */
const DESCRIPTION_LABEL_GROUP_SIZE: Record<RowSize, LabelSize> = { sm: '2xs', md: 'xs', lg: 'sm' };

/** Locked to `IconCell` — never a generic slot. Mirrors `IconCell`'s own
 * icon-xor-children union, minus `size` (`Row` controls that itself, keyed
 * off its own `size`). See docs/components/Row.md for why this is a typed
 * prop and not a `ReactNode` slot like `status`/`action`. */
export type RowLeading =
  | { icon: ReactNode; children?: never; tone?: IconCellTone }
  | { icon?: never; children: ReactNode; tone?: IconCellTone };

const ICON_CELL_SIZE: Record<RowSize, 'sm' | 'md' | 'lg'> = { sm: 'sm', md: 'md', lg: 'lg' };

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  /** `sm` (8px padding) · `md` (10px, default) · `lg` (12px) — same step
   * controls the heading/description text size pairing. */
  size?: RowSize;
  /** Optional leading accessory — always an `IconCell`, sized to match
   * `size`. Omit entirely for a row with no leading element. */
  leading?: RowLeading;
  heading: ReactNode;
  /** Usually a `<LabelGroup>` (Figma's Row nests one, size-matched — Row fills
   * in the `size` for you). Plain text / any node also works. */
  description: ReactNode;
  /** Trailing, left side — a `Badge` or `SeverityBadge`, usually. Freeform
   * within itself; always renders left-of-`action`. */
  status?: ReactNode;
  /** Trailing, right side — a `Button` and/or `IconButton`, usually.
   * Freeform within itself; always renders right-of-`status`. */
  action?: ReactNode;
  onClick?: () => void;
};

export type RowProps = Base;

/**
 * A single list row for `ScrollableArea` (`Next task` reference lists,
 * fleet-problem lists, etc.) — one fixed anatomy, not a generic `Slot` like
 * `Card`: `[leading?] [heading+description, fills] [status?] [action?]`.
 *
 * No fill by default (matches `color/scrollableArea/row/*` — rows in a
 * recessed scroll track stay transparent). Hover is an inset shadow, not a
 * background swap, for the same reason. Only interactive (hover/focus
 * treatment, keyboard reachable) when `onClick` is passed — a purely
 * informational row renders as plain content with no button semantics.
 * See docs/components/Row.md.
 */
export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(
  { size = 'md', leading, heading, description, status, action, onClick, className, ...rest },
  ref,
) {
  const interactive = onClick != null;

  const resolvedDescription =
    isValidElement(description) && description.type === LabelGroup
      ? cloneElement(description as ReactElement<LabelGroupProps>, {
          size: (description.props as LabelGroupProps).size ?? DESCRIPTION_LABEL_GROUP_SIZE[size],
        })
      : description;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick!();
    }
  };

  return (
    <div
      ref={ref}
      className={cn(styles.row, className)}
      data-size={size}
      data-interactive={interactive || undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {leading && (
        <IconCell size={ICON_CELL_SIZE[size]} tone={leading.tone} {...(leading.icon != null ? { icon: leading.icon } : { children: leading.children })} />
      )}
      <div className={styles.text}>
        <p className={styles.heading}>{heading}</p>
        <div className={styles.description}>{resolvedDescription}</div>
      </div>
      {(status != null || action != null) && (
        <div className={styles.trailing}>
          {status != null && <div className={styles.status}>{status}</div>}
          {action != null && <div className={styles.action}>{action}</div>}
        </div>
      )}
    </div>
  );
});
