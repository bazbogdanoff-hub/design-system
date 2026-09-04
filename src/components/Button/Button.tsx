import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` (brand) · `secondary` (neutral glass, default) · `tertiary` (text). */
  variant?: ButtonVariant;
  /** `sm` · `md` (default) · `lg` · `xl`. Pixel height differs per variant. */
  size?: ButtonSize;
  /** Icon before the label. Replaced by the spinner while `loading`. */
  leadingIcon?: ReactNode;
  /** Icon after the label. Hidden while `loading`. */
  trailingIcon?: ReactNode;
  /** Show the loading spinner (in the leading slot); disables interaction, label stays. */
  loading?: boolean;
  /** Render as the child element (e.g. an `<a>` or a router `<Link>`). */
  asChild?: boolean;
}

/**
 * The button. One component, three emphases (`variant`). States are CSS —
 * `:hover`, `:focus-visible` / `:active` (identical), `:disabled`. `loading`
 * swaps the leading icon for a spinner and blocks interaction.
 * For an icon-only square button use `IconButton`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    loading = false,
    asChild = false,
    className,
    children,
    type = 'button',
    disabled,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  const lead = loading ? (
    <span data-btn-icon>
      <Spinner />
    </span>
  ) : leadingIcon != null ? (
    <span data-btn-icon>{leadingIcon}</span>
  ) : null;
  const trail = !loading && trailingIcon != null ? <span data-btn-icon>{trailingIcon}</span> : null;

  return (
    <Comp
      ref={ref}
      className={cn(styles.surface, styles.button, className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      {...(asChild
        ? { 'aria-disabled': disabled || loading || undefined }
        : { type, disabled: disabled || loading })}
      {...rest}
    >
      {lead}
      <Slottable>{children}</Slottable>
      {trail}
    </Comp>
  );
});
