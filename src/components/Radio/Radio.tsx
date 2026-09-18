import {
  forwardRef,
  useState,
  type ChangeEventHandler,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './Radio.module.css';

export type RadioSize = 'sm' | 'md' | 'lg';

type Base = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked' | 'defaultChecked'> & {
  /** `sm` (16px) · `md` (20px, default) · `lg` (24px) — same box scale as
   * `Checkbox`. */
  size?: RadioSize;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. Same
 * mandatory-name pattern as `Checkbox`/`IconButton`/`ProgressBar`/`Slider`. */
export type RadioProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A circle wrapping a real `<input type="radio">` — same "native input under
 * a decorative styled span" split `Checkbox` uses, and for the same reason:
 * native keyboard/click/focus/label-association, plus (for radio
 * specifically) the browser's own same-`name`-group single-selection
 * behavior, for free. Grouping is a plain HTML `name` attribute — there's no
 * separate `RadioGroup` component here, same as this system has no
 * `CheckboxGroup`.
 *
 * **Never solid-fills, in any state** — deliberately unlike `Checkbox`.
 * `background` is one flat token (`color.radio.background`, plain white)
 * used at rest, hover, checked, and disabled alike; only the border color
 * and an inner dot (checked only) signal state. This is a real, deliberate
 * restraint from the component's Figma reference, not an oversight — don't
 * "fix" it to fill solid the way `Checkbox` does.
 *
 * Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`) —
 * same split `Slider`/`Checkbox` use.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = 'md', checked, defaultChecked = false, disabled, className, onChange, ...rest },
  ref,
) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!isControlled) setInternalChecked(event.target.checked);
    onChange?.(event);
  };

  return (
    <span
      className={cn(styles.wrapper, className)}
      data-size={size}
      data-checked={currentChecked || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        ref={ref}
        type="radio"
        className={styles.input}
        checked={currentChecked}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <span className={styles.circle} aria-hidden="true">
        {currentChecked && <span className={styles.dot} />}
      </span>
    </span>
  );
});
