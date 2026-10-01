import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { usePresence } from '../../lib/presence';
import styles from './Overlay.module.css';

/** Matches the longest exit animation in Overlay.module.css. */
const EXIT_MS = 200;

export interface OverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Mounts the scrim + portal while `true`. */
  open: boolean;
  /** Called on backdrop click and on Escape. Wire it to your `open` state. */
  onClose?: () => void;
  /** The modal panel. Give it `role="dialog"` + `aria-modal="true"` + a label. */
  children: ReactNode;
  /** `center` (default) or `top` — where the panel sits when it's shorter than the viewport. */
  align?: 'center' | 'top';
  /** Close when the scrim (not the panel) is clicked. Default `true`. */
  closeOnBackdropClick?: boolean;
  /** Close on the Escape key. Default `true`. */
  closeOnEscape?: boolean;
  /** `default` — the light 40% darkener that keeps the interface readable
   * behind a dialog. `strong` — 80%, for content that wants the room dark
   * around it: a full-screen picture (owner, 2026-10-01). */
  scrim?: 'default' | 'strong';
  /** Lock body scroll while open. Default `true`. */
  lockScroll?: boolean;
  /** Called once the exit animation has finished and the overlay is gone.
   * A modal that lives on its own route closes by setting `open` false and
   * navigating here — navigating straight away would unmount it mid-exit. */
  onExited?: () => void;
}

/**
 * The modal scrim + centering layer — `position: fixed; inset: 0`, portalled to
 * `<body>`, fill `color/modal/scrim`. Whatever you pass as `children` is the
 * modal panel; `Overlay` only darkens, centers, and dismisses.
 *
 * Handled now: backdrop-click + Escape to close, body scroll-lock, focus moves
 * in on open and is restored on close, enter/exit animation (the scrim fades,
 * the panel rises in and sinks out — it stays mounted through the exit; see
 * `onExited`). **Not yet:** focus *trapping* (tab can leave the panel) — that
 * arrives with the `Dialog` panel component. Until then, put
 * `role="dialog"`/`aria-modal`/a label on your panel yourself. See
 * `docs/components/Overlay.md`.
 */
export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(function Overlay(
  {
    open,
    onClose,
    children,
    align = 'center',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    lockScroll = true,
    scrim = 'default',
    onExited,
    className,
    onMouseDown,
    onClick,
    ...rest
  },
  ref,
) {
  const [mounted, setMounted] = useState(false);
  const { present, closing } = usePresence(open, EXIT_MS, onExited);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // a backdrop "click" must start AND end on the backdrop — otherwise a drag
  // that begins inside the panel and releases on the scrim would close it.
  const backdropMouseDown = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeOnEscape, onClose]);

  useEffect(() => {
    if (!open || !lockScroll) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    // let the panel render, then pull focus in
    const id = window.requestAnimationFrame(() => {
      const root = containerRef.current;
      if (!root) return;
      const focusable = root.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? root).focus();
    });
    return () => {
      window.cancelAnimationFrame(id);
      restoreFocusTo.current?.focus?.();
    };
  }, [open]);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      backdropMouseDown.current = e.target === e.currentTarget;
      onMouseDown?.(e);
    },
    [onMouseDown],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (
        closeOnBackdropClick &&
        e.target === e.currentTarget &&
        backdropMouseDown.current
      ) {
        onClose?.();
      }
      backdropMouseDown.current = false;
    },
    [closeOnBackdropClick, onClose, onClick],
  );

  if (!present || !mounted) return null;

  return createPortal(
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(styles.overlay, className)}
      data-align={align}
      data-scrim={scrim}
      data-state={closing ? 'closing' : 'open'}
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
});
