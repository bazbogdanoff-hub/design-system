import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Page.module.css';

export type PageLayout = 'scroll' | 'fixed';

export interface PageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `scroll` (default) — the whole page scrolls, padded. Simple screens.
   * `fixed` — grid `[Header | Body | Footer]`, only `Page.Body` scrolls.
   *   Header and Footer stay pinned. Table / master-detail screens.
   */
  layout?: PageLayout;
  /** `scroll` layout only — pad the page. Off for a page that manages its own padding. */
  padded?: boolean;
  children?: ReactNode;
}

interface RegionProps extends HTMLAttributes<HTMLElement> {
  /** Drop the horizontal padding — this region goes flush to the content-card edge (tables, maps). */
  bleed?: boolean;
  children?: ReactNode;
}

export interface PageHeaderProps extends Omit<RegionProps, 'title'> {
  /** Page title — rendered as `<h1>`. */
  title?: ReactNode;
  /** Right-aligned actions (buttons). */
  actions?: ReactNode;
}

const PageRoot = forwardRef<HTMLDivElement, PageProps>(function Page(
  { layout = 'scroll', padded = true, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.page, className)}
      data-layout={layout}
      data-padded={layout === 'scroll' && padded ? '' : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});

const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { title, actions, bleed = false, className, children, ...rest },
  ref,
) {
  return (
    <header
      ref={ref as never}
      className={cn(styles.header, className)}
      data-bleed={bleed || undefined}
      {...rest}
    >
      {(title != null || actions != null) && (
        <div className={styles.headerRow}>
          {title != null && <h1 className={styles.title}>{title}</h1>}
          {actions != null && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {children}
    </header>
  );
});

const PageBody = forwardRef<HTMLElement, RegionProps>(function PageBody(
  { bleed = false, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref as never} className={cn(styles.body, className)} data-bleed={bleed || undefined} {...rest}>
      {children}
    </div>
  );
});

const PageFooter = forwardRef<HTMLElement, RegionProps>(function PageFooter(
  { bleed = false, className, children, ...rest },
  ref,
) {
  return (
    <footer ref={ref as never} className={cn(styles.footer, className)} data-bleed={bleed || undefined} {...rest}>
      {children}
    </footer>
  );
});

/**
 * The per-screen layout contract. Lives inside the AppShell content slot and
 * owns all scrolling + padding + sticky regions (the AppShell itself never
 * scrolls). See docs/components/Page.md.
 */
export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Body: PageBody,
  Footer: PageFooter,
});
