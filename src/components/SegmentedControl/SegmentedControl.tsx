import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { useSlidingHighlight } from '../../lib/slidingHighlight';
import buttonStyles from '../Button/Button.module.css';
import {
  SegmentedControlModeContext,
  SegmentedControlSlidingContext,
  type SegmentedControlMode,
} from './context';
import styles from './SegmentedControl.module.css';

export type SegmentedControlSize = 'sm' | 'md' | 'lg' | 'xs';
export type { SegmentedControlMode } from './context';

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `sm` · `md` (default) · `lg` — the same height scale as `Button`
   * (`size.control.*`), since this sits alongside buttons/filters in a
   * toolbar. `xs` is a distinct track recipe (transparent, no padding, no
   * track radius — each item carries its own edge rounding via `position`)
   * for the sidebar module switcher only. Cascades to every
   * `SegmentedControlItem` inside. */
  size?: SegmentedControlSize;
  /** `xs`-only: the sidebar's own collapsed/expanded state — shrinks every
   * item's height from 24 to 16. No effect at any other size. */
  collapsed?: boolean;
  /** `choice` (default) — pick one value: List/Grid/Map, a status filter.
   * `tabs` — switch which content panel is showing. Same look; the
   * difference is for keyboard and screen-reader users, who get the tabs
   * pattern: one Tab stop for the whole control, arrow keys between tabs,
   * and "tab 2 of 4". Each item then needs an `id` and `aria-controls`, and
   * its panel `role="tabpanel"` + `aria-labelledby` — see
   * docs/components/SegmentedControl.md. */
  mode?: SegmentedControlMode;
  /** `SegmentedControlItem`s. */
  children: ReactNode;
}

const NEXT_KEYS: Record<string, (i: number, n: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowDown: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  ArrowUp: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_i, n) => n - 1,
};

/**
 * A track of mutually-exclusive options. In `choice` mode it is "choose
 * exactly one of N visible choices" (radio semantics, e.g. List/Grid/Map).
 * In `tabs` mode the same track switches content panels (tab semantics).
 * Not `Switch` (a single boolean toggle).
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { size = 'md', collapsed, mode = 'choice', children, className, onKeyDown, ...rest },
  ref,
) {
  // The picked item's fill is one element that travels between items
  // (lib/slidingHighlight.ts) rather than each item switching its own.
  const trackRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  useSlidingHighlight(trackRef, highlightRef, ':scope > [data-selected]');
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      trackRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Tabs use automatic activation: moving focus with the arrows also shows
  // that tab's panel — done by clicking the newly focused tab, so the
  // consumer's own onClick stays the single source of truth.
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e);
    if (mode !== 'tabs' || e.defaultPrevented) return;
    const move = NEXT_KEYS[e.key];
    if (!move) return;
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    if (tabs.length === 0) return;
    const current = tabs.findIndex((t) => t === document.activeElement);
    const next = tabs[move(current < 0 ? 0 : current, tabs.length)];
    if (!next) return;
    e.preventDefault();
    next.focus();
    next.click();
  }

  return (
    <SegmentedControlModeContext.Provider value={mode}>
      <SegmentedControlSlidingContext.Provider value>
        <div
          ref={setRef}
          role={mode === 'tabs' ? 'tablist' : 'radiogroup'}
          className={cn(styles.track, className)}
          data-size={size}
          data-collapsed={size === 'xs' ? collapsed || false : undefined}
          data-sliding=""
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {/* The travelling highlight. Neutral items: the secondary Button's
              glass, under the labels. Toned items (the sidebar switcher): the
              tone's solid fill, over the bare segments, blending tone to tone
              as it travels. */}
          <span
            ref={highlightRef}
            aria-hidden="true"
            className={cn(styles.highlight, buttonStyles.surface)}
            data-variant="secondary"
          />
          {children}
        </div>
      </SegmentedControlSlidingContext.Provider>
    </SegmentedControlModeContext.Provider>
  );
});
