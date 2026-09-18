import { forwardRef, useState, type ButtonHTMLAttributes, type MouseEventHandler } from 'react';
import { cn } from '../../lib/cn';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

type Base = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> & {
  /** `sm` (32×18) · `md` (40×22, default) · `lg` (48×26) — matches the Figma
   * reference's own track/thumb geometry exactly. */
  size?: SwitchSize;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Fires with the next checked value on toggle. A switch has no native
   * HTML element or `change` event to mirror (unlike `Checkbox`/`Radio`,
   * which wrap real `<input>`s) — this is the closest equivalent, same name
   * Radix's own `Switch` uses. */
  onCheckedChange?: (checked: boolean) => void;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. Same
 * mandatory-name pattern as `IconButton`/`ProgressBar`/`Slider`: the track
 * has no visible text of its own for a screen reader to announce. */
export type SwitchProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A boolean on/off toggle — a real `<button role="switch" aria-checked>`,
 * since HTML has no native switch element (unlike `Checkbox`/`Radio`, which
 * wrap real `<input>`s and get their semantics for free). Pill track +
 * circular thumb; `checked` slides the thumb from the track's start to its
 * end and swaps the track color — the thumb itself stays a plain white
 * circle in every state, the track color alone carries on/off/disabled
 * (mirrors the Figma reference's own `primaryAxisAlignItems` MIN/MAX flip).
 *
 * Controlled (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`)
 * — same controlled/uncontrolled split `Slider` uses for `value`/`defaultValue`:
 * internally always rendered from one `currentChecked`, seeded once from
 * `defaultChecked` when the consumer isn't driving `checked`.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    size = 'md',
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    className,
    type = 'button',
    onClick,
    ...rest
  },
  ref,
) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    const next = !currentChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      role="switch"
      aria-checked={currentChecked}
      disabled={disabled}
      className={cn(styles.switch, className)}
      data-size={size}
      data-checked={currentChecked || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className={styles.thumb} />
    </button>
  );
});
