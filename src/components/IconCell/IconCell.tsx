import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './IconCell.module.css';

export type IconCellSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconCellTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

type Base = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** `sm` (28px, default) · `md` (32px) · `lg` (36px) · `xl` (40px) · `2xl`
   * (44px). Same box/radius grading as `IconButton`'s primary variant. */
  size?: IconCellSize;
  /** `neutral` (default) · `brand` · `success` · `warning` · `danger` — a
   * flat tint off the semantic `background.<tone>-subtle` / `text.<tone>`
   * pair (not `Badge`'s own tokens — `Badge` moved to a glass glow/shadow
   * recipe on 2026-09-16 that IconCell deliberately doesn't follow). */
  tone?: IconCellTone;
};

export type IconCellProps =
  | (Base & { icon: ReactNode; children?: never })
  | (Base & { icon?: never; children: ReactNode });

/**
 * A static badge-shaped cell — same size/radius grading as `IconButton`'s
 * primary variant, but non-interactive (no hover/active states) and holds
 * either a single icon or short text (usually a number, e.g. a queue
 * position like "#5"). See `docs/components/IconCell.md`.
 */
export const IconCell = forwardRef<HTMLSpanElement, IconCellProps>(function IconCell(
  { size = 'sm', tone = 'neutral', icon, children, className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn(styles.cell, className)} data-size={size} data-tone={tone} {...rest}>
      {icon != null ? <span className={styles.icon}>{icon}</span> : children}
    </span>
  );
});
