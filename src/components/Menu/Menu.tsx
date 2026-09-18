import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import styles from './Menu.module.css';

export type MenuVariant = 'default' | 'card';
export type MenuSize = 'sm' | 'md' | 'lg';

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `default` — a plain bordered/shadowed dropdown shell, for `Select`/`Input`-triggered menus. `card` — reuses the real `Card` component for its shell, for `Filter`-triggered menus. */
  variant?: MenuVariant;
  /** Cascades to every `MenuRow` inside — match whatever size triggered this menu (the `Input`/`Select`/`Filter`). */
  size?: MenuSize;
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
 * only one this design system's screens need so far.
 *
 * Closes on an outside click or Escape. Not a portal+backdrop like
 * `Overlay` — that's the right mechanism for a modal, not a dropdown, which
 * should stay inline and close without dimming the page behind it.
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { variant = 'default', size = 'md', open, onClose, children, className, ...rest },
  ref,
) {
  const localRef = useRef<HTMLDivElement>(null);

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
    <div ref={mergeRefs(localRef, ref)} className={cn(styles.menu, className)} data-variant={variant} {...rest}>
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
