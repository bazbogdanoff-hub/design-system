import { forwardRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './ConversationRow.module.css';

export interface ConversationRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** An `<Avatar>` instance - who the conversation is with. Its own slot,
   * rendered at its own size (`xl`, 44, beside the 15/14 text), never
   * forced into a box. */
  avatar: ReactNode;
  /** Who it's with - one line, truncated. */
  name: ReactNode;
  /** The last message - one line, truncated. */
  preview: ReactNode;
  /** When the last message came - already formatted ("09:58", "Wed"). */
  time?: ReactNode;
  /** Unread messages. A solid brand pill under the time, `99+` past 99;
   * omit or 0 for none. */
  unread?: number;
  /** The open conversation. */
  selected?: boolean;
  /** `light` (default) on a card; `dark` in the dark app-frame chat card
   * (2026-10-01) - white text, the sidebar's hover wash. */
  surface?: 'light' | 'dark';
  onClick?: () => void;
}

/**
 * One conversation in a chat list (owner, 2026-10-01, built code-first) -
 * `[avatar] [name / preview, fills] [time / unread]`. A sibling to `Row`,
 * not a variant of it: Row's leading is locked to `IconCell` and a chat
 * list needs an `Avatar`, a time stacked over an unread count, and a
 * selected state. Same "two anatomies, two components" split as
 * `IconCell` / `CategoryIcon`. See docs/components/ConversationRow.md.
 */
export const ConversationRow = forwardRef<HTMLDivElement, ConversationRowProps>(function ConversationRow(
  { avatar, name, preview, time, unread, selected, surface = 'light', onClick, className, ...rest },
  ref,
) {
  const interactive = onClick != null;
  const count = unread != null && unread > 0 ? (unread > 99 ? '99+' : String(unread)) : null;

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
      data-selected={selected || undefined}
      data-on={surface}
      data-interactive={interactive || undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-current={selected || undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <span className={styles.avatar}>{avatar}</span>
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.preview}>{preview}</span>
      </span>
      {(time != null || count != null) && (
        <span className={styles.meta}>
          {time != null && <span className={styles.time}>{time}</span>}
          {count != null && (
            <span className={styles.unread} aria-label={`${count} unread`}>
              {count}
            </span>
          )}
        </span>
      )}
    </div>
  );
});
