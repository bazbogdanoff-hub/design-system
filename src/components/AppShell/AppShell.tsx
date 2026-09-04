import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './AppShell.module.css';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Content for the fixed 64px sidebar rail — the consumer's nav. Empty by
   * default (just the dark bar). This shell is deliberately generic: the CRM's
   * actual nav lives in the app.
   */
  sidebar?: ReactNode;
  /** The screen. Fills the padded, rounded, scrolling main area. */
  children?: ReactNode;
}

/**
 * The application shell — a fixed 64px sidebar rail plus a padded main area
 * whose rounded content surface scrolls. Fluid: fills the viewport, and only
 * the content region scrolls (never the body).
 *
 * Screens are **not** components — a screen is a page that renders
 * `<AppShell sidebar={<CrmSidebar/>}>…page content…</AppShell>`.
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { sidebar, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.shell, className)} {...rest}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
});
