import { forwardRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Menu } from '../Menu';
import { MenuRow } from '../MenuRow';
import type { InputSize } from '../Input';
import inputStyles from '../Input/Input.module.css';
import { CaretDownIcon } from './CaretDownIcon';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Decorative — not focusable. */
  icon?: ReactNode;
}

export interface SelectProps {
  /** `sm` · `md` (default) · `lg` — the same scale (and the same visual chrome) as `Input`. */
  size?: InputSize;
  options: SelectOption[];
  /** The selected option's `value`. Omit for no selection. */
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * "An input with a caret that opens options to choose" — not a modified
 * `Input` (a native `<input>` can't drive a real dropdown of choices) but a
 * real, functional trigger + `Menu` composition, so it's a genuinely usable
 * control and not just an `Input` that looks clickable. The trigger reuses
 * `Input`'s own CSS classes directly (`.field`/`.icon`, cross-imported —
 * same reuse `IconButton` already does with `Button.module.css`) rather
 * than re-declaring the border/radius/height/hover states, so it's pixel-
 * identical to a real `Input` at rest. `:focus` is added locally since the
 * trigger *is* the focusable element here, unlike `Input` where `.field`
 * reacts to a focused **child** via `:focus-within`.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { size = 'md', options, value, onChange, placeholder = 'Select…', disabled, className, ...rest },
  ref,
) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <span className={styles.wrapper}>
      <button
        ref={ref}
        type="button"
        className={cn(inputStyles.field, styles.trigger, className)}
        data-size={size}
        data-disabled={disabled || undefined}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        {...rest}
      >
        <span className={inputStyles.input} data-placeholder={!selected || undefined}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={inputStyles.icon} data-side="trailing" aria-hidden="true">
          <CaretDownIcon />
        </span>
      </button>
      <Menu open={open} onClose={() => setOpen(false)} size={size}>
        {options.map((option) => (
          <MenuRow
            key={option.value}
            icon={option.icon}
            selected={option.value === value}
            onClick={() => {
              onChange?.(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </MenuRow>
        ))}
      </Menu>
    </span>
  );
});
