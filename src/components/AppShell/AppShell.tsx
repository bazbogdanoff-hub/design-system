import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './AppShell.module.css';

export type AppShellSidebarMode = 'collapsed' | 'expanded';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Content for the sidebar rail - the consumer's nav. Empty by default (just
   * the dark bar). This shell is deliberately generic: the CRM's actual nav
   * lives in the app.
   */
  sidebar?: ReactNode;
  /** `collapsed` (64px icon rail, default) · `expanded` (180px) - matches
   * Figma's own `sidebar=collapsed`/`sidebar=expanded` variants, and the
   * real `Sidebar` component's own built width at each. Controls the rail's
   * width only; the `sidebar` content itself is unaffected. */
  sidebarMode?: AppShellSidebarMode;
  /** The screen. Fills the padded, rounded, scrolling main area. */
  children?: ReactNode;
  /** Phone tier only: the bar under the page card (a `TabBar`). The sidebar
   * is hidden there, so this is the phone's navigation. */
  bottomBar?: ReactNode;
  /** Phone tier only: drawn over the page card, the same size, while it is
   * set (a `NavSheet`, the open menu). The bar stays put under it. */
  overlay?: ReactNode;
}

/**
 * The application shell - a sidebar rail (64px `collapsed` or 240px
 * `expanded`) plus a padded main area whose rounded content surface scrolls.
 * Fluid: fills the viewport, and only the content region scrolls (never the
 * body).
 *
 * Screens are **not** components - a screen is a page that renders
 * `<AppShell sidebar={<CrmSidebar/>}>…page content…</AppShell>`.
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { sidebar, sidebarMode = 'collapsed', children, bottomBar, overlay, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.shell, className)} data-sidebar={sidebarMode} {...rest}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
        {overlay != null && <div className={styles.overlay}>{overlay}</div>}
      </div>
      {bottomBar != null && <div className={styles.bottomBar}>{bottomBar}</div>}
    </div>
  );
});
