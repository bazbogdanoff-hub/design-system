import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Input, type InputProps, type InputSize } from '../Input';
import { HelperText, type HelperTextTone } from '../HelperText';
import styles from './FormField.module.css';

export type FormFieldState = 'default' | HelperTextTone;
export type FormFieldSize = InputSize;

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The headline above the control. */
  label: ReactNode;
  /** `sm` · `md` (default) · `lg` — cascades to a bare `<Input>` child and to the headline/`HelperText` sizing. The headline itself renders one `text/label/*` step down from this (`sm`→`xs`, `md`→`sm`, `lg`→`md`), same downshift `LabelGroup`/`Row` use for their description text. */
  size?: FormFieldSize;
  /** `default` (headline at rest, no helper) · `primary` (headline + helper in brand color) · `error` (headline + helper in danger color). */
  state?: FormFieldState;
  /** Shown as a `HelperText` below the control — only when `state` isn't `default`. */
  helperText?: ReactNode;
  /** Associates the headline with the control via a real `<label htmlFor>`. */
  htmlFor?: string;
  /** The control — usually an `Input`. A bare `<Input>` (no explicit `size`) inherits this field's `size`. */
  children: ReactNode;
}

/**
 * Label + control + conditional helper text — the standard wrapper for a
 * single form field. `default` is just a headline above the control;
 * `primary`/`error` additionally color the headline and add a `HelperText`
 * row below, in the matching tone. Not `Input`-specific — any control can be
 * `children`, though only a bare `Input` gets its `size` auto-filled.
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, size = 'md', state = 'default', helperText, htmlFor, children, className, ...rest },
  ref,
) {
  const tone: HelperTextTone | null = state === 'default' ? null : state;

  const resolvedChildren =
    isValidElement(children) && children.type === Input
      ? cloneElement(children as ReactElement<InputProps>, {
          size: (children.props as InputProps).size ?? size,
        })
      : children;

  return (
    <div ref={ref} className={cn(styles.field, className)} data-size={size} data-state={state} {...rest}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {resolvedChildren}
      {tone != null && helperText != null && (
        <HelperText tone={tone} size={size}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
});
