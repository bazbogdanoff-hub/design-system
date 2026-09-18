import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './BreadcrumbItem.module.css';

export interface BreadcrumbItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  children: ReactNode;
  /** Highlight this segment (e.g. the entity type) independent of whether
   * it's the current crumb. */
  primary?: boolean;
  /** The last crumb — the current page. Renders as plain, non-clickable text
   * with `aria-current="page"` instead of a link, regardless of `href`. */
  current?: boolean;
}

/**
 * One crumb in a `Breadcrumb` trail. `hover` isn't a prop — a real `<a>`
 * gets `:hover` for free. `current` and `primary` are real, independent
 * facts about this segment (Figma models them as one flat `state` enum;
 * either can combine here even though no such reference variant exists).
 */
export const BreadcrumbItem = forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, primary, current, className, href, ...rest },
  ref,
) {
  if (current) {
    return (
      <span
        className={cn(styles.item, styles.current, primary && styles.primary, className)}
        aria-current="page"
      >
        {children}
      </span>
    );
  }
  return (
    <a
      ref={ref}
      href={href}
      className={cn(styles.item, primary && styles.primary, className)}
      {...(rest as HTMLAttributes<HTMLAnchorElement>)}
    >
      {children}
    </a>
  );
});
