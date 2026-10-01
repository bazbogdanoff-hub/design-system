import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type InputEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** `sm` (72px) · `md` (80px, default) · `lg` (88px) — exactly 2x `Input`'s own scale at each step; a default starting height for a notes-style field, not a hard cap (still grows with `rows`/manual resize). With `autoGrow`, the size instead picks `Input`'s height for one line (36 · 40 · 44). */
  size?: TextareaSize;
  /** Error state — reddens the border and sets `aria-invalid`. */
  error?: boolean;
  /** A message field (2026-10-01): starts one line tall — `Input`'s own
   * height — and grows with what's typed, up to `maxRows`, then scrolls.
   * No manual resize. */
  autoGrow?: boolean;
  /** With `autoGrow`, the most lines shown before the text scrolls.
   * Default 8. */
  maxRows?: number;
  /** An interactive element at the end, inside the border — a send button.
   * It stays on the last line as the field grows, as in a messenger. Use an
   * `IconButton` a step shorter than the field (`md` in an `md` field), as
   * `Input`'s `trailingAction`. */
  trailingAction?: ReactNode;
  /** Class on the outer field box when there is one (`autoGrow` or
   * `trailingAction`); `className` targets the `<textarea>` itself. */
  wrapperClassName?: string;
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
 *
 * The message-field mode (`autoGrow`, `trailingAction`; 2026-10-01) does
 * take `Input`'s wrapper: the border moves to a box around the textarea so a
 * send button can sit inside it, pinned to the last line. Growth is measured
 * (`scrollHeight`, capped at `maxRows`) rather than `field-sizing: content`,
 * which Firefox and Safari don't support yet.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    error,
    disabled,
    autoGrow,
    maxRows = 8,
    trailingAction,
    wrapperClassName,
    className,
    onInput,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const localRef = useRef<HTMLTextAreaElement | null>(null);
  const setRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Height follows content: reset, measure, cap. Runs on every value change
  // too — a controlled value cleared after sending must shrink back.
  const fit = useCallback(() => {
    const el = localRef.current;
    if (!el || !autoGrow) return;
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    const chrome = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const max = line * maxRows + chrome;
    el.style.height = 'auto';
    const wanted = el.scrollHeight;
    el.style.height = `${Math.min(wanted, max)}px`;
    el.style.overflowY = wanted > max ? 'auto' : 'hidden';
  }, [autoGrow, maxRows]);
  useLayoutEffect(fit, [fit, rest.value]);
  // …and whenever the field's width or the root font changes (the UI
  // scales with the viewport): a measured px height from the old size keeps
  // the old box while the padding and line grow, and the text drops out of
  // it (seen at 1920 after resizing from 1440).
  useLayoutEffect(() => {
    const el = localRef.current;
    if (!el || !autoGrow) return;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return; // our own height change
      width = el.clientWidth;
      fit();
    });
    observer.observe(el);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [autoGrow, fit]);

  const handleInput = (e: InputEvent<HTMLTextAreaElement>) => {
    fit();
    onInput?.(e);
  };

  const textarea = (
    <textarea
      {...rest}
      ref={setRef}
      className={cn(styles.textarea, className)}
      data-size={size}
      data-error={error || undefined}
      data-autogrow={autoGrow || undefined}
      data-in-field={autoGrow || trailingAction != null || undefined}
      rows={autoGrow ? 1 : rest.rows}
      disabled={disabled}
      aria-invalid={ariaInvalid ?? error ?? undefined}
      onInput={handleInput}
    />
  );

  if (!autoGrow && trailingAction == null) return textarea;

  return (
    <span
      className={cn(styles.field, wrapperClassName)}
      data-size={size}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      data-has-action={trailingAction != null || undefined}
    >
      {textarea}
      {trailingAction != null && <span className={styles.action}>{trailingAction}</span>}
    </span>
  );
});
