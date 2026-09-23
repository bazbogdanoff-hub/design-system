import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Tooltip, type TooltipPosition } from './Tooltip';
import styles from './TooltipTrigger.module.css';

export interface TooltipTriggerProps {
  /** What the tooltip says. Empty or `null` renders `children` alone — no
   * wrapper, no description — so a caller never has to branch on it. */
  content: ReactNode;
  /** Which side of the trigger the bubble opens on. `top` (default). */
  position?: TooltipPosition;
  /** Exactly one focusable element — usually an `IconButton`. It receives
   * `aria-describedby` pointing at the bubble, so a screen reader reads the
   * tooltip as the control's description. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  className?: string;
}

/**
 * The behaviour half of a tooltip — `Tooltip` is the bubble only, on purpose
 * (see its doc comment); this decides **when** it shows and **where**.
 *
 * - Opens on pointer hover **and** keyboard focus; no delay.
 * - Stays open while the pointer is over the bubble itself, and closes on
 *   `Escape` — WCAG 1.4.13 (hoverable, dismissible).
 * - The bubble is always in the DOM, linked by `aria-describedby`, so assistive
 *   tech gets the text even while it is visually hidden.
 * - Long content wraps: the bubble sizes to its text up to a max width, then
 *   breaks onto more lines, rather than running off in one line.
 *
 * No floating-UI collision handling — it sits on the chosen side, centred.
 */
export function TooltipTrigger({ content, position = 'top', children, className }: TooltipTriggerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

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
      className={cn(styles.anchor, className)}
      data-position={position}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span className={styles.bubble} data-open={open || undefined}>
        <Tooltip id={id} position={position}>
          {content}
        </Tooltip>
      </span>
    </span>
  );
}
