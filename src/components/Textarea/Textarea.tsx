import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** `sm` (72px) · `md` (80px, default) · `lg` (88px) — exactly 2x `Input`'s own scale at each step; a default starting height for a notes-style field, not a hard cap (still grows with `rows`/manual resize). */
  size?: TextareaSize;
  /** Error state — reddens the border and sets `aria-invalid`. */
  error?: boolean;
}

/**
 * A multi-line text field — a real native `<textarea>`, styled directly with
 * `Input`'s own tokens (`color.input.*`, `radius.input`) rather than
 * `Input`'s wrapper-owns-chrome pattern. No icon/affix slots: unlike a
 * single-line `Input`, a notes-style field doesn't gain anything from a
 * leading/trailing icon, and skipping the wrapper span keeps this the
 * simpler of the two — no abstraction beyond what a plain styled `<textarea>`
 * already needs. Vertically resizable by default, matching the native
 * element's own convention.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', error, disabled, className, 'aria-invalid': ariaInvalid, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(styles.textarea, className)}
      data-size={size}
      data-error={error || undefined}
      disabled={disabled}
      aria-invalid={ariaInvalid ?? error ?? undefined}
      {...rest}
    />
  );
});
