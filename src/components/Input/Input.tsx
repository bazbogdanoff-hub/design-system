import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** `sm` (36px) · `md` (40px, default) · `lg` (44px) — Input's own scale, no longer tied to `Button`'s heights (owner resized it a full step up in Figma). */
  size?: InputSize;
  /** Icon at the start of the field, inside the border. Decorative — not focusable. */
  leadingIcon?: ReactNode;
  /** Icon at the end of the field, inside the border. Decorative — not focusable. */
  trailingIcon?: ReactNode;
  /** Fixed, non-editable text before the value (e.g. `https://`) — subtle color, shares the field's border. */
  prependText?: ReactNode;
  /** Fixed, non-editable text after the value (e.g. `kg`, `.com`) — subtle color, shares the field's border. */
  appendText?: ReactNode;
  /** Error state — reddens the border and sets `aria-invalid`. */
  error?: boolean;
  /** Class on the outer field box (the bordered element). `className` targets the `<input>` itself. */
  wrapperClassName?: string;
}

/**
 * A single-line text field. The border/background/radius live on a wrapper
 * around the native `<input>` — not the input itself — so `leadingIcon`,
 * `trailingIcon`, `prependText`, and `appendText` can sit inside the same
 * bordered field and the whole box reacts to focus, not just the input.
 *
 * `prependText`/`appendText` are fixed annotations (a unit, a protocol
 * prefix) — always `color/input/affix` (subtle), never part of the value and
 * never editable themselves. Icons are decorative (`aria-hidden`) and always
 * `color/input/icon` (also subtle) regardless of field state.
 *
 * Figma is at full parity (30 variants — `size` × `state` × `filled` — plus
 * these 4 accessories as boolean component properties); see docs/components/Input.md.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    leadingIcon,
    trailingIcon,
    prependText,
    appendText,
    error,
    disabled,
    className,
    wrapperClassName,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  return (
    <span
      className={cn(styles.field, wrapperClassName)}
      data-size={size}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
    >
      {prependText != null && (
        <span className={styles.affix} data-side="prepend">
          {prependText}
        </span>
      )}
      {leadingIcon != null && (
        <span className={styles.icon} data-side="leading" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(styles.input, className)}
        disabled={disabled}
        aria-invalid={ariaInvalid ?? error ?? undefined}
        {...rest}
      />
      {trailingIcon != null && (
        <span className={styles.icon} data-side="trailing" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
      {appendText != null && (
        <span className={styles.affix} data-side="append">
          {appendText}
        </span>
      )}
    </span>
  );
});
