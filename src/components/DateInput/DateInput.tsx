import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CalendarBlank } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { remPx } from '../../lib/rem';
import { usePresence } from '../../lib/presence';
import { Calendar } from '../Calendar';
import { Card } from '../Card';
import { IconButton } from '../IconButton';
import { Input, type InputProps } from '../Input';
import menuStyles from '../Menu/Menu.module.css';
import styles from './DateInput.module.css';

export interface DateInputProps
  extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'trailingIcon' | 'trailingAction'> {
  /** `yyyy-mm-dd`, or `''` for no date - what a native date input holds. */
  value: string;
  onChange: (value: string) => void;
  /** Today for the calendar, `yyyy-mm-dd`. Defaults to the device's date. */
  today?: string;
  /** The calendar's first column - `0` Sunday (default) · `1` Monday. */
  weekStartsOn?: 0 | 1;
}

/** Matches Menu's exit animation (Menu.module.css). */
const EXIT_MS = 130;
/** A pick closes the panel once the week pill has landed (Calendar.module.css). */
const CLOSE_AFTER_PICK_MS = 380;
const BUTTON_SIZE = { sm: 'sm', md: 'md', lg: 'lg' } as const;

/**
 * A date field (owner, 2026-10-02): `Input` with a native date input inside -
 * so a date can still be typed segment by segment - whose browser picker
 * icon is replaced by our own calendar `IconButton`. The button opens
 * `Calendar` on a card below the field (above it when there is more room
 * there); picking a day fills the field and closes it. Escape or a click
 * outside closes it too.
 *
 * The panel borrows `Menu`'s shell - fixed positioning, elevation, the
 * grow-out-of-its-corner enter and exit - and pins to the field's right
 * edge, under the button that opened it.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { value, onChange, today, weekStartsOn, size = 'md', disabled, className, wrapperClassName, ...rest },
  ref,
) {
  const [open, setOpen] = useState(false);
  const { present, closing } = usePresence(open, EXIT_MS);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const [placement, setPlacement] = useState<{ top: number; left: number; above: boolean } | null>(null);

  // Placed in viewport space, like Menu: fixed escapes scrolling panels and
  // modals; re-placed on scroll (capture - inner panels too) and resize.
  useLayoutEffect(() => {
    if (!open) {
      setPlacement(null);
      return;
    }
    const place = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const rect = anchor.getBoundingClientRect();
      const gap = 0.25 * remPx();
      const below = window.innerHeight - rect.bottom - gap;
      const aboveRoom = rect.top - gap;
      const above = panel.offsetHeight > below && aboveRoom > below;
      const left = Math.min(Math.max(rect.right - panel.offsetWidth, gap), window.innerWidth - panel.offsetWidth - gap);
      setPlacement({
        top: above ? Math.max(rect.top - gap - panel.offsetHeight, gap) : rect.bottom + gap,
        left,
        above,
      });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !anchorRef.current?.contains(t)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // Keyboard users land on the picked (or today's) day.
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('[role=gridcell][tabindex="0"]')?.focus());
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <span ref={anchorRef} className={styles.wrapper}>
      <Input
        ref={ref}
        type="date"
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(styles.input, className)}
        wrapperClassName={wrapperClassName}
        trailingAction={
          <IconButton
            variant="tertiary"
            size={BUTTON_SIZE[size]}
            icon={<CalendarBlank weight="bold" />}
            aria-label="Open calendar"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={() => {
              window.clearTimeout(closeTimer.current);
              setOpen((o) => !o);
            }}
          />
        }
        {...rest}
      />
      {present && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Choose a date"
          className={cn(menuStyles.menu, styles.panel)}
          data-align="end"
          data-above={placement?.above || undefined}
          data-placed={placement ? '' : undefined}
          data-state={closing ? 'closing' : 'open'}
          style={placement ? { top: placement.top, left: placement.left } : { visibility: 'hidden' }}
        >
          <Card padding="md">
            <Calendar
              value={value}
              today={today}
              weekStartsOn={weekStartsOn}
              onChange={(next, how) => {
                onChange(next);
                if (how === 'pick') closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_AFTER_PICK_MS);
              }}
            />
          </Card>
        </div>
      )}
    </span>
  );
});
