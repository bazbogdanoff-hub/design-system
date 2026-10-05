import { forwardRef, useCallback, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { List, X } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { useSlidingHighlight } from '../../lib/slidingHighlight';
import { SidebarNavItem } from '../SidebarNavItem';
import styles from './TabBar.module.css';

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Whether the menu (`NavSheet`) is showing - flips the button to a close. */
  menuOpen: boolean;
  onMenuToggle: () => void;
  /** The module's most-used pages: up to 4 `SidebarNavItem`s, each with an
   * `aria-label`; icon only, except the `active` one, which also takes its
   * `label` and widens to show it. Every page is also in the menu. */
  children: ReactNode;
}

/**
 * The phone tier's navigation (owner, 2026-10-05), in `AppShell`'s
 * `bottomBar` slot: a menu button on its own panel, then the module's tabs
 * sharing one panel, fill width. Both are the sidebar's dark panel; the
 * items are the sidebar's own rows, so a tab is 48 tall and as wide as its
 * share of the bar - the touch target is the whole cell.
 */
export const TabBar = forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { menuOpen, onMenuToggle, children, className, ...rest },
  ref,
) {
  // The current tab's glass travels between tabs, as in SidebarSection.
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  useSlidingHighlight(tabsRef, highlightRef, '[data-highlight]');
  const setTabsRef = useCallback((node: HTMLDivElement | null) => {
    tabsRef.current = node;
  }, []);

  return (
    <nav ref={ref} className={cn(styles.bar, className)} data-mode="collapsed" aria-label="Main" {...rest}>
      <div className={cn(styles.panel, styles.menu)}>
        <SidebarNavItem
          icon={menuOpen ? <X weight="bold" /> : <List weight="bold" />}
          aria-label={menuOpen ? 'Close menu' : 'Menu'}
          aria-expanded={menuOpen}
          tone="brand"
          onClick={onMenuToggle}
        />
      </div>
      <div ref={setTabsRef} className={cn(styles.panel, styles.tabs)} data-sliding="" data-menu-open={menuOpen || undefined}>
        <span ref={highlightRef} aria-hidden="true" className={styles.highlight} />
        {children}
      </div>
    </nav>
  );
});
