import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type MutableRefObject,
} from 'react';
import { cn } from '../../lib/cn';
import { CheckIcon } from './CheckIcon';
import { MinusIcon } from './MinusIcon';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as MutableRefObject<T | null>).current = node;
    }
  };
}

type Base = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked' | 'defaultChecked'> & {
  /** `sm` (16px) · `md` (20px, default) · `lg` (24px). */
  size?: CheckboxSize;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** A visual third state layered on top of `checked` — shows a dash instead
   * of a checkmark (e.g. a "select all" box when only some rows are
   * selected). Not a real DOM attribute: `indeterminate` isn't settable via
   * JSX on a native `<input>`, only imperatively via a ref — this component
   * owns that plumbing so consumers never touch a ref for it. Figma has no
   * `checked=true, indeterminate=true` variant (a real fact can't be both at
   * once); this component doesn't render one either — `indeterminate` wins
   * when both are passed. */
  indeterminate?: boolean;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. Same
 * mandatory-name pattern as `IconButton`/`ProgressBar`/`Slider`: the box has
 * no visible text of its own for a screen reader to announce (pair it with a
 * real `<label>` in your own markup and pass that text again here, or point
 * `aria-labelledby` at it). */
export type CheckboxProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A rounded-square box wrapping a real `<input type="checkbox">` — native
 * keyboard/click/focus/label-association behavior for free, same reason
 * `Radio` wraps `<input type="radio">` instead of a hand-rolled
 * `role="checkbox"` div. The input is visually hidden (not `display:none` —
 * still focusable/clickable, just transparent and stretched over the whole
 * box) and a decorative `<span>` underneath renders the visible chrome,
 * reacting to the real input's `:hover`/`:focus-visible`/`:disabled` via the
 * sibling combinator — the same "input drives it, a plain span shows it"
 * split `Slider`'s track/fill uses.
 *
 * Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`) —
 * same split `Slider` uses for `value`/`defaultValue`: internally always
 * rendered from one `currentChecked`, seeded once from `defaultChecked` when
 * the consumer isn't driving `checked`.
 *
 * `checked` and `indeterminate` share the same filled brand box (no border)
 * — only the glyph differs (check vs. dash). Disabled uses a muted gray
 * glyph (`color.text.disabled`), never the white checked-glyph color, so a
 * disabled+checked box doesn't render an unreadable near-invisible mark on
 * its own pale gray fill — see `Checkbox.md`.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = 'md',
    checked,
    defaultChecked = false,
    indeterminate = false,
    disabled,
    className,
    onChange,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!isControlled) setInternalChecked(event.target.checked);
    onChange?.(event);
  };

  const filled = currentChecked || indeterminate;

  return (
    <span
      className={cn(styles.wrapper, className)}
      data-size={size}
      data-checked={filled || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        ref={mergeRefs(innerRef, ref)}
        type="checkbox"
        className={styles.input}
        checked={currentChecked}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true">
        {indeterminate ? (
          <MinusIcon className={styles.icon} />
        ) : currentChecked ? (
          <CheckIcon className={styles.icon} />
        ) : null}
      </span>
    </span>
  );
});
