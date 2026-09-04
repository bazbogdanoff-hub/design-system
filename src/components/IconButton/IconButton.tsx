import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import { Spinner } from '../Button/Spinner';
import type { ButtonVariant, ButtonSize } from '../Button';
import buttonStyles from '../Button/Button.module.css';
import styles from './IconButton.module.css';

type Base = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** `primary` · `secondary` (default) · `tertiary`. */
  variant?: ButtonVariant;
  /** `sm` · `md` (default) · `lg` · `xl`. Square, = the matching Button height. */
  size?: ButtonSize;
  /** The single icon. Replaced by the spinner while `loading`. */
  icon: ReactNode;
  /** Show the loading spinner; disables interaction. */
  loading?: boolean;
  /** Render as the child element (e.g. an `<a>`). */
  asChild?: boolean;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. */
export type IconButtonProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A square icon-only button. Same glass skin, variants, sizes and states as
 * `Button` — just one centred icon (or the spinner) and no label. An accessible
 * name is mandatory.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'secondary', size = 'md', icon, loading = false, asChild = false, className, type = 'button', disabled, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(buttonStyles.surface, styles.iconButton, className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      {...(asChild
        ? { 'aria-disabled': disabled || loading || undefined }
        : { type, disabled: disabled || loading })}
      {...rest}
    >
      <span data-btn-icon>{loading ? <Spinner /> : icon}</span>
    </Comp>
  );
});
