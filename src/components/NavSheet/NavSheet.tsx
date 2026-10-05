import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../Logo';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem, type SegmentedControlItemPosition } from '../SegmentedControlItem';
import type { SidebarModule } from '../Sidebar';
import type { SidebarNavItemTone } from '../SidebarNavItem';
import styles from './NavSheet.module.css';

export interface NavSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The wordmark next to the brand mark. */
  name: ReactNode;
  /** The module switcher, as the sidebar's but labelled: there is room.
   * The tone recipe is the sidebar's bare pills and hides a label, so the
   * picked module wears the dark surface's own selection here. */
  modules: SidebarModule[];
  activeModule: string;
  onModuleChange: (id: string) => void;
  /** Every page of the active module: `NavTile`s. */
  children: ReactNode;
  /** App-wide places under the module's pages - Messages, the assistant,
   * Profile, Settings: `NavTile`s. */
  places?: ReactNode;
}

/**
 * The phone tier's open menu (owner, 2026-10-05), in `AppShell`'s `overlay`
 * slot: covers the page card, the bar stays under it. The logo, the module
 * switcher, all of the module's pages as tiles with their names, then the
 * app-wide places. Scrolls if a module ever outgrows it.
 */
export const NavSheet = forwardRef<HTMLDivElement, NavSheetProps>(function NavSheet(
  { name, modules, activeModule, onModuleChange, children, places, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.sheet, className)} role="dialog" aria-label="Menu" {...rest}>
      <div className={styles.header}>
        <Logo name={name} />
      </div>
      <SegmentedControl size="md" surface="dark" aria-label="Modules" className={styles.switcher}>
        {modules.map((mod, index) => {
          const position: SegmentedControlItemPosition =
            index === 0 ? 'start' : index === modules.length - 1 ? 'end' : 'middle';
          return (
            <SegmentedControlItem
              key={mod.id}
              position={position}
              selected={mod.id === activeModule}
              onClick={() => onModuleChange(mod.id)}
            >
              {mod.label}
            </SegmentedControlItem>
          );
        })}
      </SegmentedControl>
      <div className={styles.tiles}>{children}</div>
      {places != null && (
        <>
          <div className={styles.divider} />
          <div className={styles.tiles}>{places}</div>
        </>
      )}
    </div>
  );
});

export interface NavTileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
  icon: ReactNode;
  label: ReactNode;
  /** The current page. */
  active?: boolean;
  /** Accent of the active tile - the module's tone. */
  tone?: SidebarNavItemTone;
  /** Unread or waiting items: a dot on the icon, the figure for screen readers. */
  count?: number;
}

/** One place in `NavSheet`: the icon on the sidebar's glass when current,
 * the name under it. The whole tile is the target. */
export const NavTile = forwardRef<HTMLButtonElement, NavTileProps>(function NavTile(
  { icon, label, active = false, tone = 'brand', count, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.tile, className)}
      data-active={active || undefined}
      data-tone={tone}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      <span className={styles.frame}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        {count != null && count > 0 && <span className={styles.dot} aria-hidden="true" />}
      </span>
      <span className={styles.label}>{label}</span>
      {count != null && count > 0 && <span className={styles.srOnly}>, {count} unread</span>}
    </button>
  );
});
