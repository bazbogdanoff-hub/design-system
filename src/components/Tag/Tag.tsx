import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Tag.module.css';

export type TagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TagColor =
  | 'brand'
  | 'teal'
  | 'rose'
  | 'lime'
  | 'fuchsia'
  | 'cyan'
  | 'pink'
  | 'violet'
  | 'emerald'
  | 'blue';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** `xs` (12px, default) · `sm` (13px) · `md` (14px) · `lg` (15px) · `xl` (16px) — mirrors `text/label/*`'s scale. */
  size?: TagSize;
  /** One of the 10 validated `color.category.*` hues. Order matters if you're
   * ever auto-assigning colors round-robin — see `docs/components/Tag.md`. */
  color?: TagColor;
}

/**
 * A plain colored, uppercase, bold label — no background, no padding. The
 * "category eyebrow" pattern (a module/type tag sitting above a title,
 * e.g. `MAINTENANCE`), not a filled chip — `color.category.*` is text-only
 * for now (a `.background` pairing for filled use, e.g. settings cells, is
 * planned separately). Distinct from `Badge`, which stays non-uppercase and
 * is reserved for the fixed status vocabulary (neutral/brand/success/
 * warning/danger). See `docs/components/Tag.md`.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { size = 'xs', color = 'brand', className, ...rest },
  ref,
) {
  return <span ref={ref} className={cn(styles.tag, className)} data-size={size} data-color={color} {...rest} />;
});
