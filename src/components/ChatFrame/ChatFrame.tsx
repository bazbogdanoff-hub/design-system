import { forwardRef, useCallback, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowUpRight, CaretLeft } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import styles from './ChatFrame.module.css';

/** Can `el` itself scroll further along the gesture? */
function canScroll(el: HTMLElement, dx: number, dy: number): boolean {
  const cs = getComputedStyle(el);
  if (dy !== 0 && /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight) {
    if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
  }
  if (dx !== 0 && /(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth) {
    if (dx < 0 ? el.scrollLeft > 0 : el.scrollLeft + el.clientWidth < el.scrollWidth - 1) return true;
  }
  return false;
}

/** Is there anything between `target` and `frame` that can take this
 * scroll? Walks up from the pointer, as the browser would. */
function scrollsInside(target: EventTarget | null, frame: HTMLElement, dx: number, dy: number): boolean {
  for (let n = target instanceof HTMLElement ? target : null; n && n !== frame; n = n.parentElement) {
    if (canScroll(n, dx, dy)) return true;
  }
  return false;
}

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
  // While the pointer is over the card, the page holds still (owner,
  // 2026-10-01): a scroll moves something inside the card that can take it
  // — the conversation, the chip row, the list — or nothing. Otherwise the
  // header, the composer, or a thread at its end handed the gesture to the
  // page. A native listener: React's onWheel is passive and can't cancel.
  const local = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      local.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  useEffect(() => {
    const frame = local.current;
    if (!frame) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      if (!scrollsInside(e.target, frame, e.deltaX, e.deltaY)) e.preventDefault();
    };
    let lastY = 0;
    let lastX = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0;
      lastX = e.touches[0]?.clientX ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const dy = lastY - t.clientY;
      const dx = lastX - t.clientX;
      lastY = t.clientY;
      lastX = t.clientX;
      if (!scrollsInside(e.target, frame, dx, dy)) e.preventDefault();
    };
    frame.addEventListener('wheel', onWheel, { passive: false });
    frame.addEventListener('touchstart', onTouchStart, { passive: true });
    frame.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      frame.removeEventListener('wheel', onWheel);
      frame.removeEventListener('touchstart', onTouchStart);
      frame.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <section ref={setRef} className={cn(styles.frame, className)} {...rest}>
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
