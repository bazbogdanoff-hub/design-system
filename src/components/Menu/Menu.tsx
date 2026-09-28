import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import styles from './Menu.module.css';
import { remPx } from '../../lib/rem';

export type MenuVariant = 'default' | 'card';
export type MenuAlign = 'start' | 'end';
export type MenuSize = 'sm' | 'md' | 'lg';

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `default` — a plain bordered/shadowed dropdown shell, for `Select`/`Input`-triggered menus. `card` — reuses the real `Card` component for its shell, for `Filter`-triggered menus. */
  variant?: MenuVariant;
  /** Cascades to every `MenuRow` inside — match whatever size triggered this menu (the `Input`/`Select`/`Filter`). */
  size?: MenuSize;
  /** Which edge the panel is pinned to. `start` (default) grows rightward from
   * the trigger's left edge — right for a wide trigger like a `Select`. `end`
   * grows leftward from its right edge, which is what a trigger sitting at the
   * right of a header needs: a `start` menu there runs off the card. */
  align?: MenuAlign;
  open: boolean;
  onClose: () => void;
  /** `MenuRow`s. */
  children: ReactNode;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * A dropdown panel — anchored, not floating-UI-positioned. Renders
 * `position: absolute; top: 100%` relative to its own nearest positioned
 * ancestor, so the consumer wraps its trigger + `Menu` in a
 * `position: relative` box (`Select` does this internally). No collision
 * detection or auto-flip — a full popover-positioning system is its own
 * project; this covers the common "opens below, room underneath" case, the
 * only one this design system's screens need so far. `align` is the manual
 * stand-in for the horizontal half of that: the consumer says which way there
 * is room, because the component cannot measure.
 *
 * Closes on an outside click or Escape. Not a portal+backdrop like
 * `Overlay` — that's the right mechanism for a modal, not a dropdown, which
 * should stay inline and close without dimming the page behind it.
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { variant = 'default', align = 'start', size = 'md', open, onClose, children, className, ...rest },
  ref,
) {
  const localRef = useRef<HTMLDivElement>(null);
  /* The anchor is whatever box the consumer made `position: relative` around
     its trigger — the same box this used to be absolutely positioned inside.
     Reading it from the DOM keeps the API unchanged: no anchorRef to thread
     through every Select, Filter and IconButton that opens a menu. */
  const [placement, setPlacement] = useState<{
    top: number;
    left: number;
    width: number;
    above: boolean;
  } | null>(null);

  /* Positioning, in viewport coordinates.

     `position: fixed` rather than `absolute` because absolute is clipped by
     any ancestor that scrolls, and menus open inside scrolling panels all the
     time — a Select in a side panel, a Filter above a table. Fixed escapes
     overflow entirely.

     The trade is that fixed does not move with its anchor, so this recomputes
     on scroll and resize while open. It listens in the CAPTURE phase so it
     also hears a scroll inside the panel the trigger sits in, which does not
     bubble to window. */
  useLayoutEffect(() => {
    if (!open) return;

    const anchor = localRef.current?.parentElement;
    if (!anchor) return;

    const place = () => {
      const panel = localRef.current;
      if (!panel) return;
      const rect = anchor.getBoundingClientRect();
      const height = panel.offsetHeight;
      const width = Math.max(panel.offsetWidth, rect.width);
      const gap = 0.25 * remPx();

      /* Flip up only when there is genuinely more room above. Flipping
         whenever it would not fit below means a menu near the bottom of a
         short window flips into an even smaller space. */
      const below = window.innerHeight - rect.bottom - gap;
      const above = rect.top - gap;
      const flip = height > below && above > below;

      let left = align === 'end' ? rect.right - width : rect.left;
      // Never off the side, whichever edge it was pinned to.
      left = Math.min(Math.max(left, gap), window.innerWidth - width - gap);

      setPlacement({
        top: flip ? Math.max(rect.top - gap - height, gap) : rect.bottom + gap,
        left,
        width: rect.width,
        above: flip,
      });
    };

    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, align, children]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (localRef.current && !localRef.current.contains(event.target as Node)) onClose();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const list = (
    <div role="menu" className={styles.list} data-size={size}>
      {children}
    </div>
  );

  return (
    <div
      ref={mergeRefs(localRef, ref)}
      className={cn(styles.menu, className)}
      data-variant={variant}
      data-align={align}
      data-above={placement?.above || undefined}
      style={
        placement
          ? {
              top: placement.top,
              left: placement.left,
              // Matches the trigger, as the old `min-width: 100%` did when
              // the menu was a child of it.
              minWidth: placement.width,
            }
          : // Before the first measure, keep it out of the way rather than
            // flashing at the top-left of the viewport.
            { visibility: 'hidden' }
      }
      {...rest}
    >
      {variant === 'card' ? (
        <Card padding="none" className={styles.cardShell}>
          {list}
        </Card>
      ) : (
        <div className={styles.defaultShell}>{list}</div>
      )}
    </div>
  );
});
