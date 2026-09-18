import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { CheckIcon } from './CheckIcon';
import styles from './MenuRow.module.css';

export interface MenuRowProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Decorative — not focusable. */
  icon?: ReactNode;
  children: ReactNode;
  /** Shows a right-aligned brand-colored checkmark. */
  selected?: boolean;
}

/**
 * One row inside a `Menu` — a real `<button role="menuitemradio">`, not a
 * styled `<li>`, so it's natively focusable/clickable/keyboard-operable
 * (Tab between rows, Enter/Space to pick) without a hand-rolled
 * roving-tabindex system. `menuitemradio` (not `option`/listbox) because
 * picking one row is a single-choice action inside a menu, which is exactly
 * what that role models — `aria-checked` carries `selected`.
 *
 * Sized by its nearest `Menu` ancestor's `data-size`, the same
 * ancestor-context cascade `TableRow` uses for header-vs-body — no `size`
 * prop here, no cloning needed.
 */
export const MenuRow = forwardRef<HTMLButtonElement, MenuRowProps>(function MenuRow(
  { icon, children, selected, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role="menuitemradio"
      aria-checked={selected || false}
      className={cn(styles.row, className)}
      {...rest}
    >
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {selected && (
        <span className={styles.check} aria-hidden="true">
          <CheckIcon />
        </span>
      )}
    </button>
  );
});
