import { forwardRef, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import styles from './Calendar.module.css';

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The picked day, `yyyy-mm-dd` (what a native date input holds). `''` or
   * omitted - nothing picked; the highlight then sits on today. */
  value?: string;
  /** `pick` - a day was clicked (or Enter / Space on it) · `move` - the
   * arrow keys or Page Up / Down walked to it. A popover closes on `pick`. */
  onChange?: (value: string, how: 'pick' | 'move') => void;
  /** Today, `yyyy-mm-dd`. Defaults to the device's date; pass it to pin. */
  today?: string;
  /** First column - `0` Sunday (default) · `1` Monday. */
  weekStartsOn?: 0 | 1;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (iso: string) => {
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const MONTH = new Intl.DateTimeFormat('en-US', { month: 'long' });
const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
const DAY_LABEL = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });

/** Six weeks from the first column on or before the 1st - the grid never
 * changes height between months. */
function monthGrid(year: number, month: number, weekStartsOn: 0 | 1) {
  const first = new Date(year, month, 1);
  const start = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/**
 * A month calendar on a card (owner, 2026-10-02, from a reference): month and
 * year with prev / next, the weekday letters, six weeks of days.
 *
 * The highlighted day's whole week is one pill in the primary-button skin,
 * and the day itself is a disc of card glass inside it; picking another day
 * springs the pill to its week and slides the disc along. The highlight is
 * the picked day, or today while nothing is picked. Today is always marked -
 * a brand dot under its weekday letter and its number in brand.
 *
 * Controlled by `value` for the pick; the month on view is its own state,
 * opening on the picked month (or today's). Arrow keys move the pick by a
 * day or a week, Page Up / Down by a month.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { value, onChange, today: todayProp, weekStartsOn = 0, className, ...rest },
  ref,
) {
  const today = todayProp ?? toIso(new Date());
  const anchor = value || today;
  const [view, setView] = useState(() => {
    const d = fromIso(anchor);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const gridRef = useRef<HTMLDivElement>(null);

  const days = monthGrid(view.year, view.month, weekStartsOn);
  const index = days.findIndex((d) => toIso(d) === anchor);
  const todayDay = fromIso(today);
  const todayInView = todayDay.getFullYear() === view.year && todayDay.getMonth() === view.month;

  const shift = (months: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + months, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const pick = (d: Date, focus = false) => {
    onChange?.(toIso(d), focus ? 'move' : 'pick');
    if (d.getMonth() !== view.month || d.getFullYear() !== view.year) {
      setView({ year: d.getFullYear(), month: d.getMonth() });
    }
    if (focus) {
      requestAnimationFrame(() =>
        gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso='${toIso(d)}']`)?.focus(),
      );
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = fromIso(anchor);
    const step: Record<string, () => Date> = {
      ArrowLeft: () => addDays(from, -1),
      ArrowRight: () => addDays(from, 1),
      ArrowUp: () => addDays(from, -7),
      ArrowDown: () => addDays(from, 7),
      PageUp: () => new Date(from.getFullYear(), from.getMonth() - 1, from.getDate()),
      PageDown: () => new Date(from.getFullYear(), from.getMonth() + 1, from.getDate()),
    };
    const next = step[e.key];
    if (!next) return;
    e.preventDefault();
    pick(next(), true);
  };

  return (
    <div ref={ref} className={cn(styles.calendar, className)} {...rest}>
      <div className={styles.header}>
        <h2 className={styles.title} aria-live="polite">
          {MONTH.format(new Date(view.year, view.month, 1))}, {view.year}
        </h2>
        <div className={styles.nav}>
          <IconButton size="sm" icon={<CaretLeft weight="bold" />} aria-label="Previous month" onClick={() => shift(-1)} />
          <IconButton size="sm" icon={<CaretRight weight="bold" />} aria-label="Next month" onClick={() => shift(1)} />
        </div>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {days.slice(0, 7).map((d) => (
          <span key={d.getDay()} className={styles.weekday} data-today={(todayInView && d.getDay() === todayDay.getDay()) || undefined}>
            {WEEKDAY.format(d)}
          </span>
        ))}
      </div>

      <div
        ref={gridRef}
        className={styles.grid}
        role="grid"
        onKeyDown={onKeyDown}
        style={index >= 0 ? ({ '--_row': Math.floor(index / 7), '--_col': index % 7 } as CSSProperties) : undefined}
      >
        {index >= 0 && (
          <>
            <span className={styles.pill} aria-hidden="true" />
            <span className={styles.disc} aria-hidden="true" />
          </>
        )}
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} role="row" className={styles.row}>
            {days.slice(row * 7, row * 7 + 7).map((d, col) => {
              const iso = toIso(d);
              const i = row * 7 + col;
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  className={styles.day}
                  data-iso={iso}
                  data-outside={d.getMonth() !== view.month || undefined}
                  data-today={iso === today || undefined}
                  data-week={(index >= 0 && Math.floor(index / 7) === row) || undefined}
                  data-active={i === index || undefined}
                  aria-selected={iso === value}
                  aria-current={iso === today ? 'date' : undefined}
                  aria-label={DAY_LABEL.format(d)}
                  tabIndex={i === index || (index < 0 && i === 0) ? 0 : -1}
                  onClick={() => pick(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
