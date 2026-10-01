import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowUpRight, CaretLeft } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import styles from './ChatFrame.module.css';

export interface ChatFramePeer {
  /** An `Avatar`. */
  avatar: ReactNode;
  name: ReactNode;
  /** "Driver · DR-002 · Telegram". */
  detail?: ReactNode;
  /** The back caret — to the list of conversations. */
  onBack: () => void;
  backLabel?: string;
}

export interface ChatFrameProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The icon in the header's left tile — what the chat is with. */
  icon: ReactNode;
  /** The header's switch — a `SegmentedControl surface="dark"`. */
  switcher: ReactNode;
  /** The header's right tile: open this chat full size. */
  onExpand: () => void;
  expandLabel: string;
  /** Who an open conversation is with, under the header, with a way back. */
  peer?: ChatFramePeer;
  /** The conversation or the list — takes the rest of the height. The
   * consumer owns its scrolling. */
  children: ReactNode;
  /** Pinned to the foot — suggestions, a `ChatComposer surface="dark"`. */
  footer?: ReactNode;
}

/**
 * The dashboard's chat card (owner, 2026-10-01) — **for that card only.**
 * The app frame reaching into the page: the AppShell's own fill, the main
 * cards' border recipe in the frame's tones, 16 corners on top and the
 * page's 24 at the foot; inside, header tiles in the sidebar panel's colour.
 * Built to carry `ChatBubble`, `DayDivider`, `ConversationRow`,
 * `SegmentedControl`, `Button` and `ChatComposer` in their `surface="dark"`
 * variants. Not a general dark card — a second use is a design question
 * first. See docs/components/ChatFrame.md.
 */
export const ChatFrame = forwardRef<HTMLElement, ChatFrameProps>(function ChatFrame(
  { icon, switcher, onExpand, expandLabel, peer, children, footer, className, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={cn(styles.frame, className)} {...rest}>
      <header className={styles.header}>
        <span className={styles.tile} aria-hidden="true">
          {icon}
        </span>
        {switcher}
        <button type="button" className={cn(styles.tile, styles.expand)} aria-label={expandLabel} onClick={onExpand}>
          <ArrowUpRight weight="bold" />
        </button>
      </header>
      {peer && (
        <div className={styles.peer}>
          <button type="button" className={styles.back} aria-label={peer.backLabel ?? 'Back'} onClick={peer.onBack}>
            <CaretLeft weight="bold" />
          </button>
          {peer.avatar}
          <span className={styles.peerText}>
            <span className={styles.peerName}>{peer.name}</span>
            {peer.detail != null && <span className={styles.peerDetail}>{peer.detail}</span>}
          </span>
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </section>
  );
});
