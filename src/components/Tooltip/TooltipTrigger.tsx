import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { Tooltip, type TooltipPosition } from './Tooltip';
import styles from './TooltipTrigger.module.css';

export interface TooltipTriggerProps {
  /** What the tooltip says. Empty or `null` renders `children` alone - no
   * wrapper, no description - so a caller never has to branch on it. */
  content: ReactNode;
  /** Which side of the trigger the bubble opens on. `top` (default). */
  position?: TooltipPosition;
  /** Exactly one focusable element - usually an `IconButton`. It receives
   * `aria-describedby` pointing at the bubble, so a screen reader reads the
   * tooltip as the control's description. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  className?: string;
}

/**
 * The behaviour half of a tooltip - `Tooltip` is the bubble only, on purpose
 * (see its doc comment); this decides **when** it shows and **where**.
 *
 * - Opens on pointer hover **and** keyboard focus; no delay.
 * - Stays open while the pointer is over the bubble itself, and closes on
 *   `Escape` - WCAG 1.4.13 (hoverable, dismissible).
 * - The bubble is always in the DOM, linked by `aria-describedby`, so assistive
 *   tech gets the text even while it is visually hidden.
 * - Long content wraps: the bubble sizes to its text up to a max width, then
 *   breaks onto more lines, rather than running off in one line.
 *
 * - The bubble is portalled to `<body>` and fixed to the viewport, so a
 *   scrolling box (a Modal's body) neither clips it nor scrolls sideways
 *   because of it. It sits on the chosen side, centred, pushed along to stay
 *   `EDGE` clear of the screen's edges; the arrow keeps pointing at the
 *   trigger. It never flips sides.
 */
/** Room kept between the bubble and the viewport's edges. */
const EDGE = 8;

export function TooltipTrigger({ content, position = 'top', children, className }: TooltipTriggerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [place, setPlace] = useState<CSSProperties>({});

  // Measured before paint on open, and again on any scroll or resize while
  // open, so the bubble follows its trigger.
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const anchor = anchorRef.current;
      const bubble = bubbleRef.current;
      if (!anchor || !bubble) return;
      const a = anchor.getBoundingClientRect();
      const w = bubble.offsetWidth;
      const h = bubble.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const clamp = (v: number, size: number, room: number) =>
        Math.max(EDGE, Math.min(v, room - size - EDGE));
      if (position === 'top' || position === 'bottom') {
        const centre = a.left + a.width / 2;
        const left = clamp(centre - w / 2, w, vw);
        setPlace({
          left,
          top: position === 'top' ? a.top - h : a.bottom,
          ['--_arrow-x' as string]: `${centre - left}px`,
        });
      } else {
        const middle = a.top + a.height / 2;
        setPlace({
          left: position === 'left' ? a.left - w : a.right,
          top: clamp(middle - h / 2, h, vh),
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, position, content]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (content == null || content === '' || !isValidElement(children)) return children;

  const describedBy = [children.props['aria-describedby'], id].filter(Boolean).join(' ');

  function handleBlur(e: FocusEvent<HTMLSpanElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
  }

  return (
    <span
      ref={anchorRef}
      className={cn(styles.anchor, className)}
      data-position={position}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      {/* Still a React child of the anchor, so moving the pointer onto the
          bubble doesn't count as leaving it: it stays open while hovered. */}
      {createPortal(
        <span
          ref={bubbleRef}
          className={styles.bubble}
          data-position={position}
          data-open={open || undefined}
          style={place}
        >
          <Tooltip id={id} position={position}>
            {content}
          </Tooltip>
        </span>,
        document.body,
      )}
    </span>
  );
}
