import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Label.module.css';

export type LabelSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LabelColor =
  | 'default'
  | 'subtle'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  /** `2xs` (10px) · `xs` (12px) · `sm` (13px) · `md` (14px, default) · `lg` (15px) · `xl` (16px) — mirrors `text/body/*`. */
  size?: LabelSize;
  /** Per-instance text color — `color.label.*`, plain aliases of the semantic text ramp. */
  color?: LabelColor;
}

/**
 * A plain, colorable inline text bit — sentence-case, body weight. The atomic
 * piece `LabelGroup` composes (e.g. `TK-4021` in `TK-4021 | TL-88 | Dumont`).
 *
 * Distinct from `Tag` (uppercase, semibold, category eyebrow) and `Badge`
 * (filled chip, fixed status vocabulary). See `docs/components/Label.md`.
 */
export const Label = forwardRef<HTMLSpanElement, LabelProps>(function Label(
  { size = 'md', color = 'default', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.label, className)}
      data-size={size}
      data-color={color}
      {...rest}
    />
  );
});
