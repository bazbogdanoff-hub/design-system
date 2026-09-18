import { forwardRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Slider.module.css';

export type SliderSize = 'sm' | 'md' | 'lg';

type Base = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  /** `sm` (8px track) · `md` (12px, default) · `lg` (16px) — same track scale as `ProgressBar`, since a slider is a progress bar you can drag. */
  size?: SliderSize;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. Same
 * mandatory-name pattern as `ProgressBar`/`IconButton`: a bare range input
 * has no visible text of its own for a screen reader to announce. */
export type SliderProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A single-thumb range control — a real native `<input type="range">`
 * underneath (not a div built from scratch), so keyboard (arrow keys,
 * Home/End, Page Up/Down), dragging, and the `slider` a11y role all come
 * from the browser for free. The input itself is fully transparent except
 * for its thumb; the visible track + fill are a plain decorative `<span>`
 * pair underneath it — the same track+fill shape `ProgressBar` already
 * uses (a track div holding a `width: {percent}%` fill div), not the
 * input's own `::-webkit-slider-runnable-track`/`::-moz-range-progress`.
 * Deliberate, not incidental: a vendor-prefixed pseudo-element background
 * is one more fragile, engine-specific surface than a plain div with a
 * percentage width, for no visual benefit once the thumb still needs its
 * own `::-webkit-slider-thumb`/`::-moz-range-thumb` styling either way.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`)
 * — either way it renders the native input as controlled internally
 * (state seeded from `defaultValue` when the consumer isn't driving
 * `value`), so the decorative fill width always has a real current value.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { size = 'md', value, defaultValue, min = 0, max = 100, onChange, disabled, className, ...rest },
  ref,
) {
  const [internalValue, setInternalValue] = useState<number>(() => Number(defaultValue ?? min ?? 0));
  const isControlled = value !== undefined;
  const currentValue = isControlled ? Number(value) : internalValue;
  const numMin = Number(min ?? 0);
  const numMax = Number(max ?? 100);
  const percent = numMax > numMin ? ((currentValue - numMin) / (numMax - numMin)) * 100 : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(Number(event.target.value));
    onChange?.(event);
  };

  return (
    <span className={styles.wrapper} data-size={size} data-disabled={disabled || undefined}>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.fill} style={{ width: `${percent}%` }} />
      </span>
      <input
        ref={ref}
        type="range"
        className={cn(styles.slider, className)}
        data-size={size}
        value={currentValue}
        min={min}
        max={max}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
    </span>
  );
});
