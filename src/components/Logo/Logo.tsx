import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Logo.module.css';

export interface LogoProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Mark only (sidebar rail collapsed) vs mark + wordmark (expanded). */
  collapsed?: boolean;
  /** The wordmark text next to the mark. Ignored when `collapsed`. */
  name?: ReactNode;
}

/**
 * The brand mark — a 4-quadrant pinwheel, always pure white regardless of
 * theme (see `color.sidebar.logo.*`, a deliberate exception to the semantic
 * ramp). `collapsed` mirrors the Figma component 1:1: the mark never
 * changes, only whether the wordmark renders next to it.
 */
export const Logo = forwardRef<HTMLSpanElement, LogoProps>(function Logo(
  { collapsed = false, name, className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn(styles.logo, className)} {...rest}>
      <svg className={styles.mark} viewBox="0 0 30 30" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M14.2387 1.42825C14.2387 0.63945 14.8762 0 15.6626 0H27.1495C29.156 0 30.5332 2.02569 29.8007 3.89938L27.3633 10.1338C26.7218 11.7748 25.1438 12.8543 23.3866 12.8543H17.0865C15.5137 12.8543 14.2387 11.5754 14.2387 9.99776V1.42825Z" />
        <path d="M1.05685e-06 11.426C1.05685e-06 5.1156 5.09991 0 11.391 0C12.1774 0 12.8148 0.63945 12.8148 1.42825V9.99776C12.8148 11.5754 11.5399 12.8543 9.9671 12.8543H1.42387C0.63749 12.8543 1.05685e-06 12.2148 1.05685e-06 11.426Z" />
        <path d="M11.391 27.1368C5.09991 27.1368 2.74318e-07 22.0212 0 15.7108C-3.42897e-08 14.922 0.637489 14.2825 1.42387 14.2825H9.9671C11.5399 14.2825 12.8148 15.5614 12.8148 17.139V25.7085C12.8148 26.4973 12.1774 27.1368 11.391 27.1368Z" />
        <path d="M25.6571 14.0766C26.5005 13.5102 27.6474 13.9852 27.846 14.9834L29.6373 24.0083C29.7855 24.7549 29.3242 25.4871 28.5882 25.6726L28.4389 25.7089L25.565 19.5258C25.3308 19.0217 24.8249 18.6986 24.269 18.6986H22.3047C21.6168 18.6986 21.0589 19.2565 21.0589 19.9444C21.0589 20.6322 21.6168 21.1902 22.3047 21.1902H23.3887C23.973 21.1903 24.4987 21.5459 24.7154 22.0886L27.0536 27.9466L27.0759 27.9117L27.1526 28.1949C27.4489 29.2894 26.4162 30.2777 25.3404 29.929L19.8633 28.1545C19.4391 28.017 18.9963 27.9466 18.5505 27.9466H15.6641C14.8777 27.9466 14.2397 27.3068 14.2397 26.518V16.2083C14.2397 15.2911 14.9812 14.5468 15.8956 14.5468H24.9568L25.6571 14.0766Z" />
      </svg>
      {!collapsed && name != null && <span className={styles.wordmark}>{name}</span>}
    </span>
  );
});
