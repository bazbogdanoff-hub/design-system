import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import buttonStyles from '../Button/Button.module.css';
import styles from './SegmentedControlItem.module.css';

export type SegmentedControlItemTone = 'brand' | 'success' | 'danger';
export type SegmentedControlItemPosition = 'start' | 'middle' | 'end';

export interface SegmentedControlItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Omit for the sidebar module switcher's bare color-pill segments —
   * every other use (List/Grid/Map, etc.) passes a label. */
  children?: ReactNode;
  /** Is this the picked option — shows the elevated card-colored pill + brand text. */
  selected?: boolean;
  /** When set, `selected` renders as a solid `tone`-colored fill instead of
   * the default neutral Button-glass surface — the sidebar's module switcher
   * uses this so the active segment carries that module's own color. Omit
   * for the original neutral List/Grid/Map-style track. */
  tone?: SegmentedControlItemTone;
  /** Only meaningful alongside `tone` — which of the track's outer corners
   * should match the panel it sits flush against. `middle` (default) keeps
   * the plain uniform corner; `start`/`end` round the one outer corner that
   * touches the panel's own edge. Ignored when `tone` is omitted. */
  position?: SegmentedControlItemPosition;
}

/**
 * One option inside a `SegmentedControl` — a real `<button role="radio">`,
 * natively focusable/clickable (Tab between options, Enter/Space to pick).
 * `radio`/`radiogroup` over `tab`/`tablist` because this models "pick exactly
 * one of N visible choices," not "switch which content panel is showing" —
 * the same single-choice semantics `MenuRow` models with `menuitemradio`,
 * just outside a menu popup here.
 *
 * Sized by its nearest `SegmentedControl` ancestor's `data-size` — same
 * ancestor-context cascade `MenuRow`/`TableRow` already use — no `size` prop
 * here.
 *
 * `selected` reuses `Button`'s own `.surface[data-variant='secondary']` glass
 * skin directly (cross-imported, same reuse `IconButton`/`Select` already do
 * with `Button.module.css`/`Input.module.css`) — the picked option is meant
 * to read as an actual secondary `Button` sitting on the track, matching the
 * Figma side, which literally nests a real `Button` instance for this state
 * rather than a hand-drawn fill. Passing `tone` replaces that neutral glass
 * surface with a solid tone-colored fill instead — a different visual
 * language for a different use (module identity, not a generic picker), so
 * it fully swaps rather than layers on top of the glass treatment.
 */
export const SegmentedControlItem = forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  function SegmentedControlItem({ children, selected, tone, position = 'middle', className, type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        role="radio"
        aria-checked={selected || false}
        data-selected={selected || undefined}
        data-variant={selected && !tone ? 'secondary' : undefined}
        data-tone={tone}
        data-position={tone ? position : undefined}
        className={cn(styles.item, selected && !tone && buttonStyles.surface, className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
