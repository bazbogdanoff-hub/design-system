import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { BreadcrumbItem } from '../BreadcrumbItem';
import { CaretRightIcon } from './CaretRightIcon';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbEntry {
  label: ReactNode;
  href?: string;
  /** Highlight this segment independent of whether it's current. */
  primary?: boolean;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 2–4 entries — matches the Figma reference's own configurable range.
   * The last entry always renders as the current page (non-clickable),
   * regardless of whether it has an `href`. */
  items: BreadcrumbEntry[];
}

/**
 * A real multi-level trail — `nav` + `ol` of `BreadcrumbItem`s separated by
 * a caret. Distinct from `Headercard`'s own ad hoc "Back" button, which is a
 * single return-to-previous action, not a trail.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, className, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn(styles.breadcrumb, className)} {...rest}>
      <ol className={styles.list}>
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <li className={styles.separator} aria-hidden="true">
                <CaretRightIcon className={styles.separatorIcon} />
              </li>
            )}
            <li className={styles.crumb}>
              <BreadcrumbItem href={item.href} primary={item.primary} current={i === items.length - 1}>
                {item.label}
              </BreadcrumbItem>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
});
