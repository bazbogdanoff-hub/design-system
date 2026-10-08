import { useRef, type MouseEvent, type PointerEvent } from 'react';

/** How far a finger moves before it is reading the chart, not tapping it. */
const MOVE_PX = 8;

/**
 * Charts on touch (owner, 2026-10-08): drag to read, tap to open.
 *
 * A finger sliding sideways scrubs: `pick` says what is under it and
 * `onScrub` shows its tooltip, cleared when the finger lifts; the click
 * that follows a drag is swallowed, so a drag never opens the panel. A
 * finger moving up or down is left to the page, so it still scrolls (the
 * chart sets `touch-action: pan-y`). A plain tap is an ordinary click.
 *
 * Spread the handlers on the chart's wrapper. Hover handlers on the marks
 * should ignore touch (`isTouch`), and focus should show a tooltip only
 * for the keyboard (`:focus-visible`), or a tap would show one too.
 */
export function useTouchScrub<T>(pick: (clientX: number, clientY: number) => T | null, onScrub: (value: T | null) => void) {
  const down = useRef<{ id: number; x: number; y: number; scrubbing: boolean } | null>(null);
  const swallowClick = useRef(false);
  return {
    onPointerDown(e: PointerEvent) {
      if (e.pointerType !== 'touch') return;
      // A long drag often fires no click at all; never let a swallow left
      // over from it eat the next tap.
      swallowClick.current = false;
      down.current = { id: e.pointerId, x: e.clientX, y: e.clientY, scrubbing: false };
    },
    onPointerMove(e: PointerEvent) {
      const d = down.current;
      if (!d || e.pointerId !== d.id) return;
      if (!d.scrubbing) {
        const dx = Math.abs(e.clientX - d.x);
        const dy = Math.abs(e.clientY - d.y);
        if (dx < MOVE_PX && dy < MOVE_PX) return;
        // Up or down first: the page is scrolling, not the chart.
        if (dy > dx) {
          down.current = null;
          return;
        }
        d.scrubbing = true;
      }
      onScrub(pick(e.clientX, e.clientY));
    },
    onPointerUp(e: PointerEvent) {
      const d = down.current;
      if (!d || e.pointerId !== d.id) return;
      down.current = null;
      if (d.scrubbing) {
        swallowClick.current = true;
        onScrub(null);
      }
    },
    onPointerCancel() {
      if (down.current?.scrubbing) onScrub(null);
      down.current = null;
    },
    onClickCapture(e: MouseEvent) {
      if (!swallowClick.current) return;
      swallowClick.current = false;
      e.stopPropagation();
      e.preventDefault();
    },
  };
}

export const isTouch = (e: { pointerType: string }) => e.pointerType === 'touch';

/** Focus from the keyboard, not from a tap or a click. */
export const isKeyboardFocus = (el: Element) => el.matches(':focus-visible');
